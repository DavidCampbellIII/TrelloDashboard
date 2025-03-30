/**
 * Trello API integration module
 * Handles fetching and processing Trello board data via Firebase Functions
 */
import { getFunctions, httpsCallable } from "firebase/functions";
import { getApp } from "firebase/app";

// Define interfaces for the sanitized Trello board data that we receive from Firebase Functions
export interface SanitizedCard {
  id: string;
  name: string;
  listId: string;
  labels: string[];
  labelColors: string[];
  estimatedHours?: number;
  system?: string;
  status: 'complete' | 'in-progress' | 'not-started';
}

export interface SanitizedList {
  id: string;
  name: string;
}

export interface SanitizedLabel {
  id: string;
  name: string;
  color: string;
}

export interface SanitizedBoardData {
  cards: SanitizedCard[];
  lists: SanitizedList[];
  labels: SanitizedLabel[];
}

// Default Trello board ID to use if none is provided
const DEFAULT_BOARD_ID = '***REMOVED***';

/**
 * Fetches sanitized board data from Firebase Functions backend
 * @param boardId The Trello board ID to fetch (optional, uses default if not provided)
 * @returns Promise resolving to the sanitized board data
 */
export async function fetchBoardData(boardId: string = DEFAULT_BOARD_ID): Promise<SanitizedBoardData> {
  try {
    const functions = getFunctions(getApp());
    const fetchTrelloBoardFunction = httpsCallable(functions, 'fetchTrelloBoard');
    
    // Passing boardId as an object parameter (Firebase functions convention)
    const result = await fetchTrelloBoardFunction({ boardId });
    
    return result.data as SanitizedBoardData;
  } catch (error) {
    throw error;
  }
}
