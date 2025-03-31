/**
 * Shared constants for determining card status
 * This ensures consistency between frontend and backend logic
 */

// Patterns to identify list names that indicate completed status
export const COMPLETED_LIST_PATTERNS = [
  'done',
  'complete',
  'finished'
];

// Patterns to identify list names that indicate in-progress status
export const IN_PROGRESS_LIST_PATTERNS = [
  'progress',
  'doing',
  'review'
];

// Status types
export type CardStatus = 'complete' | 'in-progress' | 'not-started';

/**
 * Determines card status based on list name
 * @param listName The name of the list containing the card
 * @returns The status of the card
 */
export function determineCardStatus(listName: string): CardStatus {
  const nameLower = listName.toLowerCase();
  
  if (COMPLETED_LIST_PATTERNS.some(pattern => nameLower.includes(pattern))) {
    return 'complete';
  } else if (IN_PROGRESS_LIST_PATTERNS.some(pattern => nameLower.includes(pattern))) {
    return 'in-progress';
  }
  
  return 'not-started';
}
