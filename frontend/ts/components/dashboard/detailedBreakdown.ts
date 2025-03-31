/**
 * Detailed breakdown section component
 */

import { TrelloCard, TrelloBoardData } from '../../utils/typeAdapter';
import { calculateProgress } from '../../utils/dataProcessing';
import { createProgressBar } from './progressBar';
import { formatHours, getFadedColorClass, showEmptyState } from './utils';

// DOM element reference
const detailedBreakdownContainer = document.getElementById('detailed-breakdown-container');

/**
 * Update detailed breakdown section - shows the intersection of departments and systems
 */
export function updateDetailedBreakdown(cards: TrelloCard[], boardData: TrelloBoardData) {
  if (!detailedBreakdownContainer) return;
  
  // Clear existing content
  detailedBreakdownContainer.innerHTML = '';
  
  // Get unique departments
  const departments = new Set<string>();
  boardData.labels.forEach(label => {
    if (label.name) {
      departments.add(label.name);
    }
  });
  
  // Get unique systems
  const systems = new Set<string>();
  cards.forEach(card => {
    if (card.customFields.system) {
      systems.add(card.customFields.system);
    }
  });
  
  if (departments.size === 0 || systems.size === 0) {
    showEmptyState(detailedBreakdownContainer);
    return;
  }
  
  // Create a section for each department
  departments.forEach(department => {
    const departmentCards = cards.filter(card => 
      card.labels.some(label => label.name === department)
    );
    
    if (departmentCards.length === 0) return;
    
    // Calculate department-level progress statistics
    const departmentProgress = calculateProgress(departmentCards, boardData);
    
    // Get department color
    const departmentLabel = boardData.labels.find(label => label.name === department);
    const departmentColor = departmentLabel ? departmentLabel.color : 'gray';
    
    // Create department section
    const departmentSection = document.createElement('div');
    departmentSection.className = 'mb-6';
    
    // Create department heading with task counts
    const completedTasks = departmentProgress.completedCards;
    const inProgressTasks = departmentProgress.inProgressCards;
    const notStartedTasks = departmentProgress.totalCards - completedTasks - inProgressTasks;
    
    departmentSection.innerHTML = `
      <div class="flex flex-wrap justify-between items-center mb-3">
        <h3 class="text-lg font-medium">${department}</h3>
        <div class="text-sm text-gray-400 flex flex-wrap gap-1 mt-1 sm:mt-0">
          <span class="px-2 py-1 bg-green-900 bg-opacity-30 rounded-md" title="Completed tasks">
            ${completedTasks} done
          </span>
          <span class="px-2 py-1 bg-yellow-700 bg-opacity-30 rounded-md" title="Tasks in progress">
            ${inProgressTasks} in progress
          </span>
          <span class="px-2 py-1 bg-gray-700 bg-opacity-30 rounded-md" title="Tasks not started">
            ${notStartedTasks} not started
          </span>
        </div>
      </div>
    `;
    
    // Add department-level progress bar
    const departmentProgressBar = createProgressBar({
      completedPercentage: departmentProgress.completionPercentage,
      inProgressPercentage: departmentProgress.inProgressPercentage,
      completedColorClass: `label-${departmentColor}`,
      inProgressColorClass: `label-${getFadedColorClass(departmentColor)}`,
      height: '3'
    });
    
    // Create department summary with hours information
    const departmentSummary = document.createElement('div');
    departmentSummary.className = 'flex justify-between text-xs text-gray-400 mb-4';
    departmentSummary.innerHTML = `
      <span>${formatHours(departmentProgress.completedHours)}/${formatHours(departmentProgress.totalHours)} hrs (${Math.round(departmentProgress.completionPercentage)}% complete)</span>
    `;
    
    // Add the progress bar and summary to the department section
    departmentSection.appendChild(departmentProgressBar);
    departmentSection.appendChild(departmentSummary);
    
    // Create a sub-section for each system
    const filteredSystems = Array.from(systems).filter(system => {
      const systemCards = departmentCards.filter(card => 
        card.customFields.system === system
      );
      return systemCards.length > 0;
    });
    
    // Process each system
    filteredSystems.forEach((system, index) => {
      const systemCards = departmentCards.filter(card => 
        card.customFields.system === system
      );
      
      const progress = calculateProgress(systemCards, boardData);
      
      // Create system element - remove border for the last system in each department
      const isLastSystem = index === filteredSystems.length - 1;
      const systemElement = createSystemElementForDepartment(
        system, 
        progress, 
        departmentColor,
        isLastSystem
      );
      
      departmentSection.appendChild(systemElement);
    });
    
    detailedBreakdownContainer.appendChild(departmentSection);
  });
}

/**
 * Create a system element within a department section
 */
function createSystemElementForDepartment(
  system: string, 
  progress: {
    completionPercentage: number;
    inProgressPercentage: number;
    completedCards: number;
    inProgressCards: number;
    totalCards: number;
    completedHours: number;
    inProgressHours: number;
    totalHours: number;
  }, 
  departmentColor: string,
  isLastSystem: boolean = false
): HTMLElement {
  const systemElement = document.createElement('div');
  systemElement.className = isLastSystem 
    ? 'ml-4 mb-2' 
    : 'ml-4 mb-4 pb-2 border-b border-gray-800';
  
  // Calculate completed percentage
  const completedPercentage = Math.round(progress.completionPercentage);
  
  // Create HTML structure
  systemElement.innerHTML = `
    <div class="flex justify-between mb-1">
      <span class="font-medium text-gray-100">${system}</span>
      <span class="text-sm font-medium text-gray-100" title="${Math.round(progress.completionPercentage)}% complete, ${Math.round(progress.inProgressPercentage)}% in progress">
        ${completedPercentage}% complete
      </span>
    </div>
  `;
  
  // Create progress bar
  const progressBar = createProgressBar({
    completedPercentage: progress.completionPercentage,
    inProgressPercentage: progress.inProgressPercentage,
    completedColorClass: `label-${departmentColor}`,
    inProgressColorClass: `label-${getFadedColorClass(departmentColor)}`,
    height: '2'
  });
  
  // Create details section
  const detailsElement = document.createElement('div');
  detailsElement.className = 'flex justify-between text-xs text-gray-500 mb-2';
  detailsElement.innerHTML = `
    <span>${progress.completedCards}/${progress.totalCards} tasks (${progress.inProgressCards} in progress)</span>
    <span>${formatHours(progress.completedHours)}/${formatHours(progress.completedHours + progress.inProgressHours)}/${formatHours(progress.totalHours)} hrs</span>
  `;
  
  // Add progress bar and details to system element
  systemElement.appendChild(progressBar);
  systemElement.appendChild(detailsElement);
  
  return systemElement;
}
