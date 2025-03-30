// Dashboard UI components

import { TrelloCard, TrelloBoardData, ProgressStats, DepartmentStats, SystemStats } from '../utils/typeAdapter';
import { isCardCompleted, calculateProgress } from '../utils/dataProcessing';

/**
 * Helper function to format hours display
 */
function formatHours(hours: number): number {
  // Validate hours and round to one decimal place
  if (!isFinite(hours) || hours < 0 || hours > 10000) {
    return 0;
  }
  return Math.round(hours * 10) / 10;
}

// DOM element references
const overallCompletionPercent = document.getElementById('overall-completion-percent');
const overallProgressBar = document.getElementById('overall-progress-bar');
const overallHours = document.getElementById('overall-hours');
const departmentHoursContainer = document.getElementById('department-hours-container');
const systemHoursContainer = document.getElementById('system-hours-container');
const departmentProgressContainer = document.getElementById('department-progress-container');
const systemProgressContainer = document.getElementById('system-progress-container');
const detailedBreakdownContainer = document.getElementById('detailed-breakdown-container');
const lastUpdated = document.getElementById('last-updated');
const errorModal = document.getElementById('error-modal');
const errorMessage = document.getElementById('error-message');
const closeError = document.getElementById('close-error');
const loadingSpinner = document.getElementById('loading-spinner');

/**
 * Populate filter dropdowns with options from board data
 */
export function populateFilters(
  boardData: TrelloBoardData,
  departmentFilter: HTMLSelectElement,
  systemFilter: HTMLSelectElement
) {
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

/**
 * Update overall progress section
 */
export function updateOverallProgress(cards: TrelloCard[], boardData: TrelloBoardData) {
  const progress = calculateProgress(cards, boardData);
  
  if (overallCompletionPercent) {
    overallCompletionPercent.textContent = `${Math.round(progress.completionPercentage)}%`;
  }
  
  if (overallProgressBar) {
    overallProgressBar.style.setProperty('--target-width', `${Math.round(progress.completionPercentage)}%`);
    overallProgressBar.style.width = '0%';
    overallProgressBar.classList.remove('progress-bar-animated');
    // Trigger reflow to restart animation
    void overallProgressBar.offsetWidth;
    overallProgressBar.classList.add('progress-bar-animated');
    overallProgressBar.style.width = `${Math.round(progress.completionPercentage)}%`;
  }
  
  if (overallHours) {
    overallHours.textContent = `${formatHours(progress.completedHours)}/${formatHours(progress.totalHours)} hrs`;
  }
  
  // Update department hours chart
  updateDepartmentHours(cards, boardData);
  
  // Update system hours chart
  updateSystemHours(cards, boardData);
}

/**
 * Update department hours section
 */
function updateDepartmentHours(cards: TrelloCard[], boardData: TrelloBoardData) {
  if (!departmentHoursContainer) return;
  
  // Clear existing content
  departmentHoursContainer.innerHTML = '';
  
  // Group cards by department (label)
  const departmentMap = new Map<string, {
    color: string;
    totalHours: number;
    completedHours: number;
  }>();
  
  // Initialize with all departments
  boardData.labels.forEach(label => {
    if (label.name) {
      departmentMap.set(label.name, {
        color: label.color,
        totalHours: 0,
        completedHours: 0
      });
    }
  });
  
  // Calculate hours for each department
  cards.forEach(card => {
    // Get hours and validate they're within a reasonable range
    const rawHours = card.customFields.estimatedHours || 0;
    // Explicitly convert to number and ensure valid range
    const hoursValue = typeof rawHours === 'string' ? Number(rawHours) : Number(rawHours);
    const hours = isFinite(hoursValue) && hoursValue >= 0 && hoursValue <= 10000 ? hoursValue : 0;
    const isComplete = isCardCompleted(card, boardData);
    
    card.labels.forEach(label => {
      if (label.name && departmentMap.has(label.name)) {
        const deptStats = departmentMap.get(label.name)!;
        deptStats.totalHours = Number(deptStats.totalHours) + Number(hours);
        
        if (isComplete) {
          deptStats.completedHours = Number(deptStats.completedHours) + Number(hours);
        }
      }
    });
  });
  
  // Only display departments with hours
  const departmentsWithHours = [...departmentMap.entries()]
    .filter(([_dept, stats]) => stats.totalHours > 0)
    .sort(([_deptA, statsA], [_deptB, statsB]) => statsB.totalHours - statsA.totalHours);
  
  if (departmentsWithHours.length === 0) {
    departmentHoursContainer.innerHTML = '<div class="text-sm text-gray-500 italic">No data available</div>';
    return;
  }
  
  // Create department hours display
  departmentsWithHours.forEach(([dept, stats]) => {
    const percentage = stats.totalHours > 0 
      ? Math.round((stats.completedHours / stats.totalHours) * 100) 
      : 0;
    
    const departmentElement = document.createElement('div');
    departmentElement.className = 'mb-3';
    departmentElement.innerHTML = `
      <div class="flex justify-between mb-1">
        <span class="text-sm font-medium text-gray-700">${dept}</span>
        <span class="text-sm font-medium text-gray-700">${formatHours(stats.completedHours)}/${formatHours(stats.totalHours)} hrs</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div class="label-${stats.color} h-2 rounded-full progress-bar-animated" 
             style="--target-width: ${Math.round(percentage)}%"></div>
      </div>
    `;
    
    departmentHoursContainer.appendChild(departmentElement);
  });
}

/**
 * Update system hours section
 */
function updateSystemHours(cards: TrelloCard[], boardData: TrelloBoardData) {
  if (!systemHoursContainer) return;
  
  // Clear existing content
  systemHoursContainer.innerHTML = '';
  
  // Group cards by system (custom field)
  const systemMap = new Map<string, {
    totalHours: number;
    completedHours: number;
  }>();
  
  // Calculate hours for each system
  cards.forEach(card => {
    const system = card.customFields.system;
    if (!system) return;
    
    // Get hours and validate they're within a reasonable range
    const rawHours = card.customFields.estimatedHours ?? 0;
    // Explicitly convert to number and ensure valid range
    const hoursValue = Number(rawHours);
    const hours = isFinite(hoursValue) && hoursValue >= 0 && hoursValue <= 10000 ? hoursValue : 0;
    const isComplete = isCardCompleted(card, boardData);
    
    if (!systemMap.has(system)) {
      systemMap.set(system, {
        totalHours: 0,
        completedHours: 0
      });
    }
    
    const systemStats = systemMap.get(system)!;
    systemStats.totalHours = Number(systemStats.totalHours) + Number(hours);
    
    if (isComplete) {
      systemStats.completedHours = Number(systemStats.completedHours) + Number(hours);
    }
  });
  
  // Only display systems with hours
  const systemsWithHours = [...systemMap.entries()]
    .filter(([_sys, stats]) => stats.totalHours > 0)
    .sort(([_sysA, statsA], [_sysB, statsB]) => statsB.totalHours - statsA.totalHours);
  
  if (systemsWithHours.length === 0) {
    systemHoursContainer.innerHTML = '<div class="text-sm text-gray-500 italic">No data available</div>';
    return;
  }
  
  // Create system hours display
  systemsWithHours.forEach(([system, stats]) => {
    const percentage = stats.totalHours > 0 
      ? Math.round((stats.completedHours / stats.totalHours) * 100) 
      : 0;
    
    const systemElement = document.createElement('div');
    systemElement.className = 'mb-3';
    systemElement.innerHTML = `
      <div class="flex justify-between mb-1">
        <span class="text-sm font-medium text-gray-700">${system}</span>
        <span class="text-sm font-medium text-gray-700">${formatHours(stats.completedHours)}/${formatHours(stats.totalHours)} hrs</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div class="bg-blue-600 h-2 rounded-full progress-bar-animated" 
             style="--target-width: ${Math.round(percentage)}%"></div>
      </div>
    `;
    
    systemHoursContainer.appendChild(systemElement);
  });
}

/**
 * Update department progress bars
 */
export function updateDepartmentProgress(cards: TrelloCard[], boardData: TrelloBoardData) {
  if (!departmentProgressContainer) return;
  
  // Clear existing content
  departmentProgressContainer.innerHTML = '';
  
  // Calculate stats for each department
  const departmentStats: DepartmentStats[] = [];
  
  boardData.labels.forEach(label => {
    if (!label.name) return;
    
    const departmentCards = cards.filter(card => 
      card.labels.some(cardLabel => cardLabel.id === label.id)
    );
    
    if (departmentCards.length === 0) return;
    
    const progress = calculateProgress(departmentCards, boardData);
    
    departmentStats.push({
      department: label.name,
      color: label.color,
      ...progress
    });
  });
  
  // Sort by total hours (descending)
  departmentStats.sort((a, b) => b.totalHours - a.totalHours);
  
  if (departmentStats.length === 0) {
    departmentProgressContainer.innerHTML = '<div class="text-sm text-gray-500 italic">No data available</div>';
    return;
  }
  
  // Create department progress bars
  departmentStats.forEach(stats => {
    const departmentElement = document.createElement('div');
    departmentElement.className = 'mb-4';
    departmentElement.innerHTML = `
      <div class="flex justify-between mb-1">
        <span class="font-medium">${stats.department}</span>
        <span class="text-sm font-medium">${Math.round(stats.completionPercentage)}% complete</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5 mb-1">
        <div class="label-${stats.color} h-2.5 rounded-full progress-bar-animated" 
             style="--target-width: ${Math.round(stats.completionPercentage)}%"></div>
      </div>
      <div class="flex justify-between text-xs text-gray-500">
        <span>${stats.completedCards}/${stats.totalCards} tasks</span>
        <span>${formatHours(stats.completedHours)}/${formatHours(stats.totalHours)} hours</span>
      </div>
    `;
    
    departmentProgressContainer.appendChild(departmentElement);
  });
}

/**
 * Update system progress section
 */
export function updateSystemProgress(cards: TrelloCard[], boardData: TrelloBoardData) {
  if (!systemProgressContainer) return;
  
  // Clear existing content
  systemProgressContainer.innerHTML = '';
  
  // Group cards by system (custom field)
  const systemMap = new Map<string, TrelloCard[]>();
  
  // Group cards by system
  cards.forEach(card => {
    const system = card.customFields.system;
    if (!system) return;
    
    if (!systemMap.has(system)) {
      systemMap.set(system, []);
    }
    
    systemMap.get(system)!.push(card);
  });
  
  // Calculate stats for each system
  const systemStats: SystemStats[] = [];
  
  systemMap.forEach((systemCards, systemName) => {
    const progress = calculateProgress(systemCards, boardData);
    
    systemStats.push({
      system: systemName,
      ...progress
    });
  });
  
  // Sort by total hours (descending)
  systemStats.sort((a, b) => b.totalHours - a.totalHours);
  
  if (systemStats.length === 0) {
    systemProgressContainer.innerHTML = '<div class="text-sm text-gray-500 italic">No data available</div>';
    return;
  }
  
  // Create system progress bars
  systemStats.forEach(stats => {
    const systemElement = document.createElement('div');
    systemElement.className = 'mb-4';
    systemElement.innerHTML = `
      <div class="flex justify-between mb-1">
        <span class="font-medium">${stats.system}</span>
        <span class="text-sm font-medium">${Math.round(stats.completionPercentage)}% complete</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5 mb-1">
        <div class="bg-blue-600 h-2.5 rounded-full progress-bar-animated" 
             style="--target-width: ${Math.round(stats.completionPercentage)}%"></div>
      </div>
      <div class="flex justify-between text-xs text-gray-500">
        <span>${stats.completedCards}/${stats.totalCards} tasks</span>
        <span>${formatHours(stats.completedHours)}/${formatHours(stats.totalHours)} hours</span>
      </div>
    `;
    
    systemProgressContainer.appendChild(systemElement);
  });
}

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
    detailedBreakdownContainer.innerHTML = '<div class="text-sm text-gray-500 italic">No data available</div>';
    return;
  }
  
  // Create a section for each department
  departments.forEach(department => {
    const departmentCards = cards.filter(card => 
      card.labels.some(label => label.name === department)
    );
    
    if (departmentCards.length === 0) return;
    
    // Get department color
    const departmentLabel = boardData.labels.find(label => label.name === department);
    const departmentColor = departmentLabel ? departmentLabel.color : 'gray';
    
    // Create department section
    const departmentSection = document.createElement('div');
    departmentSection.className = 'mb-6';
    departmentSection.innerHTML = `
      <h3 class="text-lg font-medium mb-3">${department}</h3>
    `;
    
    // Create a sub-section for each system
    systems.forEach(system => {
      const systemCards = departmentCards.filter(card => 
        card.customFields.system === system
      );
      
      if (systemCards.length === 0) return;
      
      const progress = calculateProgress(systemCards, boardData);
      
      // Create system progress within department
      const systemElement = document.createElement('div');
      systemElement.className = 'ml-4 mb-3';
      systemElement.innerHTML = `
        <div class="flex justify-between mb-1">
          <span class="font-medium">${system}</span>
          <span class="text-sm font-medium">${Math.round(progress.completionPercentage)}% complete</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
          <div class="label-${departmentColor} h-2 rounded-full progress-bar-animated" 
               style="--target-width: ${Math.round(progress.completionPercentage)}%"></div>
        </div>
        <div class="flex justify-between text-xs text-gray-500 mb-2">
          <span>${progress.completedCards}/${progress.totalCards} tasks</span>
          <span>${formatHours(progress.completedHours)}/${formatHours(progress.totalHours)} hours</span>
        </div>
      `;
      
      departmentSection.appendChild(systemElement);
    });
    
    detailedBreakdownContainer.appendChild(departmentSection);
  });
}

/**
 * Helper function to show/hide loading spinner
 */
export function showLoading(show: boolean) {
  if (loadingSpinner) {
    loadingSpinner.style.display = show ? 'flex' : 'none';
  }
}

/**
 * Helper function to show error modal
 */
export function showError(message: string) {
  if (errorModal && errorMessage) {
    errorMessage.textContent = message;
    errorModal.style.display = 'flex';
  } else {
    alert(message);
  }
}

/**
 * Add event listener to close error button
 */
export function setupErrorModalClose() {
  if (closeError && errorModal) {
    closeError.addEventListener('click', () => {
      errorModal.style.display = 'none';
    });
  }
}

/**
 * Update the last updated timestamp
 */
export function updateTimestamp() {
  if (lastUpdated) {
    const now = new Date();
    lastUpdated.textContent = now.toLocaleString();
  }
}
