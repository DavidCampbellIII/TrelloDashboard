import * as functions from "firebase-functions";
import admin from "firebase-admin";
import axios from "axios";
import dotenv from "dotenv";

// Constants for determining card status
const COMPLETED_LIST_PATTERNS = [
  'done',
  'complete',
  'finished'
];

const IN_PROGRESS_LIST_PATTERNS = [
  'progress',
  'doing',
  'review'
];

/**
 * Determines card status based on list name
 * @param listName The name of the list containing the card
 * @returns The status of the card
 */
function determineCardStatus(listName: string): "complete" | "in-progress" | "not-started" {
  const nameLower = listName.toLowerCase();
  
  if (COMPLETED_LIST_PATTERNS.some(pattern => nameLower.includes(pattern))) {
    return 'complete';
  } else if (IN_PROGRESS_LIST_PATTERNS.some(pattern => nameLower.includes(pattern))) {
    return 'in-progress';
  }
  
  return 'not-started';
}

// Load environment variables from .env file
dotenv.config();

// Initialize Firebase Admin
admin.initializeApp();

// Define interfaces for Trello data
interface TrelloCard {
  id: string;
  name: string;
  idList: string;
  labels: TrelloLabel[];
  customFieldItems?: TrelloCustomFieldItem[];
  closed: boolean;
}

interface TrelloLabel {
  id: string;
  name: string;
  color: string;
}

interface TrelloList {
  id: string;
  name: string;
}

interface TrelloCustomFieldItem {
  id: string;
  idCustomField: string;
  idValue?: string;
  idModel?: string;
  modelType?: string;
  value?: {
    text?: string;
    number?: number;
    checked?: string;
  };
}

interface TrelloCustomFieldDefinition {
  id: string;
  name: string;
  type: string;
  options?: TrelloCustomFieldOption[];
}

interface TrelloCustomFieldOption {
  id: string;
  idCustomField?: string;
  value: {
    text: string;
  };
  color?: string;
  pos?: number;
}

interface SanitizedBoardData {
  cards: {
    id: string;
    listId: string;
    labels: string[];
    labelColors: string[];
    estimatedHours?: number;
    system?: string;
    priority?: string;
    status: "complete" | "in-progress" | "not-started";
  }[];
  lists: {
    id: string;
    name: string;
  }[];
  labels: {
    id: string;
    name: string;
    color: string;
  }[];
}

// Callable version of the Firebase Function
export const fetchTrelloBoard = functions.https.onCall(async (data, context) => {
  try {
  // For callable functions, data should be an object with properties
  // Extract boardId from the data parameter
  let boardId: string | undefined = data.data.boardId;
  
  if (!boardId) {
  throw new functions.https.HttpsError('invalid-argument', 'Board ID is required');
  }

  const apiKey = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_TOKEN;

  if (!apiKey || !token) {
  console.error("Trello API credentials not configured");
  throw new functions.https.HttpsError('internal', 'Server configuration error: Missing API credentials');
  }

    try {
      // Fetch board data from Trello
      // Fetch board data from Trello
      const [cardsResponse, listsResponse, customFieldsResponse] =
        await Promise.all([
          axios.get(`https://api.trello.com/1/boards/${boardId}/cards`, {
            params: {
              key: apiKey,
              token: token,
              customFieldItems: "true",
            },
          }),
          axios.get(`https://api.trello.com/1/boards/${boardId}/lists`, {
            params: {
              key: apiKey,
              token: token,
            },
          }),
          axios.get(`https://api.trello.com/1/boards/${boardId}/customFields`, {
            params: {
              key: apiKey,
              token: token,
            },
          }),
        ]);
      
      // Process the custom field definitions to fetch options for dropdown fields
      const customFieldDefinitions: TrelloCustomFieldDefinition[] = customFieldsResponse.data;
      
      // For any 'list' type custom fields, fetch their options
      for (const field of customFieldDefinitions) {
        if (field.type === 'list') {
          try {
            const optionsResponse = await axios.get(`https://api.trello.com/1/customFields/${field.id}/options`, {
              params: {
                key: apiKey,
                token: token,
              },
            });
            field.options = optionsResponse.data;
          } catch (error) {
            // Silently handle error - options will remain undefined
          }
        }
      }
      // Process API responses
      const cards: TrelloCard[] = cardsResponse.data;
      const lists: TrelloList[] = listsResponse.data;
      
      // Process and sanitize data
      const sanitizedData: SanitizedBoardData = {
        cards: [],
        lists: lists.map((list) => ({
          id: list.id,
          name: list.name,
        })),
        labels: [],
      };

      // Extract unique labels from cards
      const uniqueLabels = new Map<string, TrelloLabel>();
      
      // Map custom field IDs to their names for easier reference
      const customFieldMap = new Map<string, string>();
      customFieldDefinitions.forEach((field) => {
        customFieldMap.set(field.id, field.name);
      });

      // Process each card
      const processCards = async () => {
        // Process the cards sequentially to ensure we don't overwhelm the Trello API with requests
        for (const card of cards) {
          // Skip archived/closed cards
          if (card.closed) continue;
          
          // Skip cards with "Pipedream" priority
          let isPipedream = false;
          if (card.customFieldItems) {
            for (const field of card.customFieldItems) {
              const fieldName = customFieldMap.get(field.idCustomField);
              
              // Check if this is a priority field
              if (fieldName && fieldName.toLowerCase().includes("priority")) {
                // Handle different types of custom fields
                const customFieldDef = customFieldDefinitions.find(def => def.id === field.idCustomField);
                
                if (customFieldDef) {
                  // Text field type
                  if (customFieldDef.type === 'text' && field.value?.text) {
                    if (field.value.text.toLowerCase() === "pipedream") {
                      isPipedream = true;
                      break;
                    }
                  } 
                  // Dropdown/list field type
                  else if ((customFieldDef.type === 'list' || customFieldDef.type === 'dropdown') && field.idValue) {
                    if (customFieldDef.options && customFieldDef.options.length > 0) {
                      const option = customFieldDef.options.find(opt => opt.id === field.idValue);
                      if (option && option.value && option.value.text && 
                          option.value.text.toLowerCase() === "pipedream") {
                        isPipedream = true;
                        break;
                      }
                    } else {
                      // If options weren't fetched, try to fetch this specific option
                      try {
                        const optionResponse = await axios.get(`https://api.trello.com/1/customFields/${field.idCustomField}/options/${field.idValue}`, {
                          params: {
                            key: apiKey,
                            token: token,
                          }
                        });
                        
                        if (optionResponse.data && optionResponse.data.value && 
                            optionResponse.data.value.text && 
                            optionResponse.data.value.text.toLowerCase() === "pipedream") {
                          isPipedream = true;
                          break;
                        }
                        
                        // Store this option for future reference
                        if (!customFieldDef.options) customFieldDef.options = [];
                        customFieldDef.options.push(optionResponse.data);
                      } catch (error) {
                        // Silently handle error
                      }
                    }
                  }
                }
              }
            }
          }
          
          // Skip Pipedream cards entirely
          if (isPipedream) continue;

          // Collect unique labels
          card.labels.forEach((label) => {
            if (!uniqueLabels.has(label.id)) {
              uniqueLabels.set(label.id, label);
              sanitizedData.labels.push({
                id: label.id,
                name: label.name,
                color: label.color,
              });
            }
          });

          // Determine card status based on list position
          let status: "complete" | "in-progress" | "not-started" = "not-started";
          const list = lists.find((l) => l.id === card.idList);
          
          if (list) {
            status = determineCardStatus(list.name);
          }

          // Extract custom field values
          let estimatedHours: number | undefined;
          let system: string | undefined;
          let priority: string | undefined;

          if (card.customFieldItems) {
            for (const field of card.customFieldItems) {
              const fieldName = customFieldMap.get(field.idCustomField);
              const customFieldDef = customFieldDefinitions.find(def => def.id === field.idCustomField);
              
              // Check if this is a field about estimated hours
              if (fieldName && (fieldName.toLowerCase().includes("est") || fieldName.toLowerCase().includes("hour"))) {
                if (field.value) {
                  if (field.value.number !== undefined) {
                    // Cap and sanitize the value to prevent extreme numbers
                    const numValue = field.value.number;
                    if (isFinite(numValue) && numValue >= 0 && numValue <= 10000) {
                      estimatedHours = numValue;
                    } else {
                      estimatedHours = 0; // Use 0 as a fallback for invalid values
                    }
                  } else if (field.value.text !== undefined) {
                    const parsed = parseFloat(field.value.text);
                    if (!isNaN(parsed) && isFinite(parsed) && parsed >= 0 && parsed <= 10000) {
                      estimatedHours = parsed;
                    }
                  }
                }
              }
              
              // Check if this is a priority field
              if (fieldName && fieldName.toLowerCase().includes("priority")) {
                // Handle different types of custom fields
                if (customFieldDef) {
                  if (customFieldDef.type === 'text' && field.value?.text) {
                    // For text fields, use the text value directly
                    priority = field.value.text;
                  } else if ((customFieldDef.type === 'list' || customFieldDef.type === 'dropdown') && field.idValue) {
                    // For dropdown fields, look up the option text using the idValue
                    if (customFieldDef.options && customFieldDef.options.length > 0) {
                      const option = customFieldDef.options.find(opt => opt.id === field.idValue);
                      if (option && option.value && option.value.text) {
                        priority = option.value.text;
                      } else {
                        // If we can't find the option, try to fetch it directly
                        try {
                          const optionResponse = await axios.get(`https://api.trello.com/1/customFields/${field.idCustomField}/options/${field.idValue}`, {
                            params: {
                              key: apiKey,
                              token: token,
                            }
                          });
                          
                          if (optionResponse.data && optionResponse.data.value && optionResponse.data.value.text) {
                            priority = optionResponse.data.value.text;
                            
                            // Store this option for future reference
                            if (!customFieldDef.options) customFieldDef.options = [];
                            customFieldDef.options.push(optionResponse.data);
                          }
                        } catch (error) {
                          // Silently handle error
                        }
                      }
                    } else {
                      // If no options were found earlier, try to fetch this specific option
                      try {
                        const optionResponse = await axios.get(`https://api.trello.com/1/customFields/${field.idCustomField}/options/${field.idValue}`, {
                          params: {
                            key: apiKey,
                            token: token,
                          }
                        });
                        
                        if (optionResponse.data && optionResponse.data.value && optionResponse.data.value.text) {
                          priority = optionResponse.data.value.text;
                          
                          // Initialize options array and store this option
                          if (!customFieldDef.options) customFieldDef.options = [];
                          customFieldDef.options.push(optionResponse.data);
                        }
                      } catch (error) {
                        // Silently handle error
                      }
                    }
                  }
                }
              }
              
              // Check if this is a system/module field
              if (fieldName && (fieldName.toLowerCase().includes("system") || fieldName.toLowerCase().includes("module"))) {
                // Handle different types of custom fields
                if (customFieldDef) {
                  if (customFieldDef.type === 'text' && field.value?.text) {
                    // For text fields, use the text value directly
                    system = field.value.text;
                  } else if ((customFieldDef.type === 'list' || customFieldDef.type === 'dropdown') && field.idValue) {
                    // For dropdown fields, look up the option text using the idValue
                    if (customFieldDef.options && customFieldDef.options.length > 0) {
                      const option = customFieldDef.options.find(opt => opt.id === field.idValue);
                      if (option && option.value && option.value.text) {
                        system = option.value.text;
                      } else {
                        // If we can't find the option, try to fetch it directly
                        try {
                          const optionResponse = await axios.get(`https://api.trello.com/1/customFields/${field.idCustomField}/options/${field.idValue}`, {
                            params: {
                              key: apiKey,
                              token: token,
                            }
                          });
                          
                          if (optionResponse.data && optionResponse.data.value && optionResponse.data.value.text) {
                            system = optionResponse.data.value.text;
                            
                            // Store this option for future reference
                            if (!customFieldDef.options) customFieldDef.options = [];
                            customFieldDef.options.push(optionResponse.data);
                          }
                        } catch (error) {
                        // Silently handle error
                        }
                      }
                    } else {
                      // If no options were found earlier, try to fetch this specific option
                      try {
                        const optionResponse = await axios.get(`https://api.trello.com/1/customFields/${field.idCustomField}/options/${field.idValue}`, {
                          params: {
                            key: apiKey,
                            token: token,
                          }
                        });
                        
                        if (optionResponse.data && optionResponse.data.value && optionResponse.data.value.text) {
                          system = optionResponse.data.value.text;
                          
                          // Initialize options array and store this option
                          if (!customFieldDef.options) customFieldDef.options = [];
                          customFieldDef.options.push(optionResponse.data);
                        }
                      } catch (error) {
                        // Silently handle error
                      }
                    }
                  }
                }
              }
            }
          }

          // Add sanitized card data (excluding names for privacy protection)
          sanitizedData.cards.push({
            id: card.id,
            // name field intentionally omitted for privacy
            listId: card.idList,
            labels: card.labels.map((label) => label.name),
            labelColors: card.labels.map((label) => label.color),
            estimatedHours,
            system,
            priority,
            status,
          });
        }
      };
      
      // Run the async card processing
      await processCards();
      
      // Return the sanitized data
      return sanitizedData;
    } catch (error: unknown) {
      // Check for authentication errors
      const axiosError = error as { response?: { status: number; data?: any } };
      const isAuthError = axiosError.response && axiosError.response.status === 401;
      
      // Re-throw the error with appropriate Firebase format
      throw new functions.https.HttpsError(
        isAuthError ? 'unauthenticated' : 'internal',
        isAuthError ? 'Trello API authentication failed' : 'Failed to fetch Trello data',
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  } catch (error: unknown) {
    // Determine the appropriate error code
    let errorCode: functions.https.FunctionsErrorCode = 'internal';
    let errorMessage = 'Failed to fetch board data';
    let errorDetails = error instanceof Error ? error.message : 'Unknown error';
    
    if (error instanceof Error) {
      // No boardId provided
      if (error.message.includes('Board ID is required')) {
        errorCode = 'invalid-argument';
        errorMessage = 'Board ID is required';
      }
      // API credentials missing
      else if (error.message.includes('credentials not configured') || 
               error.message.includes('Missing API credentials')) {
        errorCode = 'failed-precondition';
        errorMessage = 'Trello API credentials not properly configured';
      }
      // Trello API errors
      else if (error.message.includes('Trello API')) {
        errorCode = 'unavailable';
        errorMessage = 'Failed to fetch data from Trello API';
      }
    }
    
    throw new functions.https.HttpsError(errorCode, errorMessage, errorDetails);
  }
});
