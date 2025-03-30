/**
 * Type adapter for converting between different data structures
 * This bridges the gap between the API's SanitizedBoardData and the frontend's TrelloBoardData structures
 */

import { SanitizedBoardData, SanitizedCard, SanitizedLabel } from '../api/trello';

// Legacy interfaces used by the frontend components
export interface TrelloLabel {
  id: string;
  name: string;
  color: string;
}

export interface TrelloCustomFields {
  estimatedHours?: number;
  system?: string;
}

export interface TrelloCard {
  id: string;
  listId: string;
  labels: TrelloLabel[];
  customFields: TrelloCustomFields;
}

export interface TrelloList {
  id: string;
  name: string;
}

export interface TrelloBoardData {
  cards: TrelloCard[];
  lists: TrelloList[];
  labels: TrelloLabel[];
}

export interface ProgressStats {
  totalCards: number;
  completedCards: number;
  totalHours: number;
  completedHours: number;
  completionPercentage: number;
}

export interface DepartmentStats extends ProgressStats {
  department: string;
  color: string;
}

export interface SystemStats extends ProgressStats {
  system: string;
}

/**
 * Converts SanitizedBoardData from the API to TrelloBoardData for the frontend
 */
export function convertToTrelloBoardData(data: SanitizedBoardData): TrelloBoardData {
  // Convert cards
  const cards: TrelloCard[] = data.cards.map(card => {
    // Find labels that match this card
    const cardLabels: TrelloLabel[] = card.labels.map((labelName, index) => {
      // Find the label object that matches this name
      const labelObj = data.labels.find(l => l.name === labelName) || {
        id: `unknown-${index}`,
        name: labelName,
        color: 'gray'
      };
      
      return {
        id: labelObj.id,
        name: labelObj.name,
        color: labelObj.color
      };
    });
    
    // Validate the estimated hours to ensure they're within a reasonable range
    const validatedHours = card.estimatedHours !== undefined 
      ? (isFinite(card.estimatedHours) && card.estimatedHours >= 0 && card.estimatedHours <= 10000
          ? card.estimatedHours
          : 0)
      : undefined;
      
    return {
      id: card.id,
      listId: card.listId,
      labels: cardLabels,
      customFields: {
        estimatedHours: validatedHours,
        system: card.system
      }
    };
  });
  
  return {
    cards,
    lists: data.lists,
    labels: data.labels
  };
}
