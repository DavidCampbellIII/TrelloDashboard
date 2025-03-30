// Data processing utilities for Trello Dashboard Visualizer

import { TrelloCard, TrelloBoardData, ProgressStats } from './typeAdapter';

// List of names indicating a completed status
const completedListNames = ['Done', 'Completed', 'Finished'];

/**
 * Checks if a card is considered completed based on its list
 */
export function isCardCompleted(card: TrelloCard, boardData: TrelloBoardData): boolean {
  const cardList = boardData.lists.find(list => list.id === card.listId);
  if (!cardList) return false;
  
  const listNameLower = cardList.name.toLowerCase();
  return listNameLower.includes('done') || 
         listNameLower.includes('complete') || 
         listNameLower.includes('finished');
}

/**
 * Calculate progress statistics for a set of cards
 */
export function calculateProgress(cards: TrelloCard[], boardData: TrelloBoardData): ProgressStats {
  const totalCards = cards.length;
  const completedCards = cards.filter(card => isCardCompleted(card, boardData)).length;
  
  let totalHours: number = 0;
  let completedHours: number = 0;
  
  cards.forEach(card => {
    // Explicitly parse and convert hours to number
    const hoursValue = card.customFields.estimatedHours ?? 0;
    const hours: number = Number(hoursValue);
    
    // Ensure hours are valid and within reasonable range
    if (isFinite(hours) && hours >= 0 && hours <= 10000) {
      // Explicitly add as numbers
      totalHours = Number(totalHours) + Number(hours);
      
      if (isCardCompleted(card, boardData)) {
        completedHours = Number(completedHours) + Number(hours);
      }
    }
  });
  
  const completionPercentage = totalCards > 0 
    ? Math.round((completedCards / totalCards) * 100) 
    : 0;
  
  return {
    totalCards,
    completedCards,
    totalHours,
    completedHours,
    completionPercentage
  };
}

/**
 * Filter cards based on selected department and system
 */
export function filterCards(
  cards: TrelloCard[], 
  selectedDepartment: string, 
  selectedSystem: string
): TrelloCard[] {
  return cards.filter(card => {
    // Filter by department (label)
    const matchesDepartment = selectedDepartment === 'all' || 
      card.labels.some(label => label.name === selectedDepartment);
    
    // Filter by system (custom field)
    const matchesSystem = selectedSystem === 'all' || 
      card.customFields.system === selectedSystem;
    
    return matchesDepartment && matchesSystem;
  });
}

/**
 * Helper to clear dropdown options except 'All'
 */
export function clearOptionsKeepingAll(selectElement: HTMLSelectElement): void {
  while (selectElement.options.length > 1) {
    selectElement.remove(1);
  }
}
