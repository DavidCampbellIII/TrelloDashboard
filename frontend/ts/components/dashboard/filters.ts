/**
 * Filter component for dashboard
 */

import { TrelloBoardData } from '../../utils/typeAdapter';

/**
 * Populate filter dropdowns with options from board data
 */
export function populateFilters(
  boardData: TrelloBoardData,
  departmentFilter: HTMLSelectElement,
  systemFilter: HTMLSelectElement
) {
  // Clear existing options, keeping only 'All' options
  while (departmentFilter.options.length > 1) {
    departmentFilter.remove(1);
  }
  
  while (systemFilter.options.length > 1) {
    systemFilter.remove(1);
  }
  
  // Extract unique department names from labels
  const departments = new Set<string>();
  boardData.labels.forEach(label => {
    if (label.name) {
      departments.add(label.name);
    }
  });
  
  // Add department options
  departments.forEach(dept => {
    const option = document.createElement('option');
    option.value = dept;
    option.textContent = dept;
    departmentFilter.appendChild(option);
  });
  
  // Extract unique system names from custom fields
  const systems = new Set<string>();
  boardData.cards.forEach(card => {
    if (card.customFields && card.customFields.system) {
      systems.add(card.customFields.system);
    }
  });
  
  // Add system options
  systems.forEach(system => {
    const option = document.createElement('option');
    option.value = system;
    option.textContent = system;
    systemFilter.appendChild(option);
  });
  
  // If no systems were found, add a message
  if (systems.size === 0) {
    console.warn('No systems found in board data');
    const option = document.createElement('option');
    option.value = 'no-systems';
    option.textContent = 'No systems found';
    option.disabled = true;
    systemFilter.appendChild(option);
  }
}