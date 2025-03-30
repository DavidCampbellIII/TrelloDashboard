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

/**
 * Maps status strings to numerical progress values
 * @param status The status string
 * @returns A number representing completion progress (0-1)
 */
export function statusToProgress(status: 'complete' | 'in-progress' | 'not-started'): number {
  switch (status) {
    case 'complete':
      return 1;
    case 'in-progress':
      return 0.5;
    case 'not-started':
    default:
      return 0;
  }
}

/**
 * Calculates overall project completion percentage
 * @param cards Array of sanitized cards
 * @returns Percentage of completion (0-100)
 */
export function calculateOverallProgress(cards: SanitizedCard[]): number {
  if (cards.length === 0) return 0;
  
  const totalTasks = cards.length;
  const completedValue = cards.reduce((sum, card) => 
    sum + statusToProgress(card.status), 0);
  
  return (completedValue / totalTasks) * 100;
}

/**
 * Calculates department-specific progress based on labels
 * @param cards Array of sanitized cards
 * @returns Object mapping department names to completion percentages
 */
export function calculateDepartmentProgress(cards: SanitizedCard[]): Record<string, number> {
  const departments: Record<string, { total: number; completed: number }> = {};
  
  // Process each card
  cards.forEach(card => {
    // Each label represents a department
    card.labels.forEach(label => {
      if (!departments[label]) {
        departments[label] = { total: 0, completed: 0 };
      }
      
      departments[label].total++;
      departments[label].completed += statusToProgress(card.status);
    });
  });
  
  // Calculate percentages
  const result: Record<string, number> = {};
  
  Object.entries(departments).forEach(([dept, stats]) => {
    result[dept] = (stats.completed / stats.total) * 100;
  });
  
  return result;
}

/**
 * Calculates system/module specific progress
 * @param cards Array of sanitized cards
 * @returns Object mapping system names to completion percentages
 */
export function calculateSystemProgress(cards: SanitizedCard[]): Record<string, number> {
  const systems: Record<string, { total: number; completed: number }> = {};
  
  // Process each card with a system field
  cards.forEach(card => {
    if (card.system) {
      if (!systems[card.system]) {
        systems[card.system] = { total: 0, completed: 0 };
      }
      
      systems[card.system].total++;
      systems[card.system].completed += statusToProgress(card.status);
    }
  });
  
  // Calculate percentages
  const result: Record<string, number> = {};
  
  Object.entries(systems).forEach(([system, stats]) => {
    result[system] = (stats.completed / stats.total) * 100;
  });
  
  return result;
}

/**
 * Calculates remaining vs. estimated hours
 * @param cards Array of sanitized cards
 * @returns Object with total and remaining hours
 */
export function calculateHours(cards: SanitizedCard[]): { total: number; remaining: number } {
  let totalHours = 0;
  let remainingHours = 0;
  
  cards.forEach(card => {
    if (card.estimatedHours !== undefined) {
      totalHours += card.estimatedHours;
      
      //add hours if not complete
      if (card.status !== 'complete') {
        remainingHours += card.estimatedHours;
      }
    }
  });
  
  return {
    total: totalHours,
    remaining: remainingHours
  };
}
