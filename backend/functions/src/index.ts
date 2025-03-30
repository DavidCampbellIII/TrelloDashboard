import * as functions from "firebase-functions";
import admin from "firebase-admin";
import axios from "axios";
import dotenv from "dotenv";

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
  customFields?: TrelloCustomField[];
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

interface TrelloCustomField {
  id: string;
  name?: string;
  value?: {
    text?: string;
    number?: number;
  };
}

interface TrelloCustomFieldDefinition {
  id: string;
  name: string;
  type: string;
}

interface SanitizedBoardData {
  cards: {
    id: string;
    name: string;
    listId: string;
    labels: string[];
    labelColors: string[];
    estimatedHours?: number;
    system?: string;
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
      const [cardsResponse, listsResponse, customFieldsResponse] =
        await Promise.all([
          axios.get(`https://api.trello.com/1/boards/${boardId}/cards`, {
            params: {
              key: apiKey,
              token: token,
              customFieldItems: true,
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
      // Process API responses

      const cards: TrelloCard[] = cardsResponse.data;
      const lists: TrelloList[] = listsResponse.data;
      const customFieldDefinitions: TrelloCustomFieldDefinition[] =
        customFieldsResponse.data;

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
      cards.forEach((card) => {
        // Skip archived/closed cards
        if (card.closed) return;

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
          const listNameLower = list.name.toLowerCase();
          if (listNameLower.includes("done") ||
              listNameLower.includes("complete")) {
            status = "complete";
          } else if (
            listNameLower.includes("progress") || 
            listNameLower.includes("doing") || 
            listNameLower.includes("review")
          ) {
            status = "in-progress";
          }
        }

        // Extract custom field values
        let estimatedHours: number | undefined;
        let system: string | undefined;

        if (card.customFields) {
          card.customFields.forEach((field) => {
            const fieldName = customFieldMap.get(field.id);
            
            if (fieldName && field.value) {
              if (fieldName.toLowerCase().includes("est") ||
                  fieldName.toLowerCase().includes("hour")) {
                if (field.value.number !== undefined) {
                  estimatedHours = field.value.number;
                } else if (field.value.text !== undefined) {
                  const parsed = parseFloat(field.value.text);
                  if (!isNaN(parsed)) {
                    estimatedHours = parsed;
                  }
                }
              }
              
              if (fieldName.toLowerCase().includes("system") ||
                  fieldName.toLowerCase().includes("module")) {
                system = field.value.text;
              }
            }
          });
        }

        // Add sanitized card data
        sanitizedData.cards.push({
          id: card.id,
          name: card.name,
          listId: card.idList,
          labels: card.labels.map((label) => label.name),
          labelColors: card.labels.map((label) => label.color),
          estimatedHours,
          system,
          status,
        });
      });

      // Return the sanitized data
      
      return sanitizedData;
    } catch (error: unknown) {
      console.error("Error making Trello API calls:", error);
      
      // Check for authentication errors
      const axiosError = error as { response?: { status: number; data?: any } };
      const isAuthError = axiosError.response && axiosError.response.status === 401;
      
      throw new functions.https.HttpsError(
        isAuthError ? 'unauthenticated' : 'internal',
        isAuthError ? 'Trello API authentication failed' : 'Failed to fetch Trello data',
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  } catch (error: unknown) {
    console.error("Error in callable function:", error instanceof Error ? error.message : "Unknown error");
    
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
