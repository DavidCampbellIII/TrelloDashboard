// Dashboard UI components

import { TrelloCard, TrelloBoardData, ProgressStats, DepartmentStats, SystemStats } from '../utils/typeAdapter';
import { isCardCompleted, isCardInProgress, calculateProgress } from '../utils/dataProcessing';

// When a color variant (light/dark) is used, add -faded to get faded version
function getFadedColorClass(colorClass: string): string {
  // Check if it's a variant (contains underscore)
  if (colorClass.includes('_')) {
    // For variants like 'red_light' or 'blue_dark'
    return `${colorClass}-faded`;
  } else {
    // For regular colors like 'red' or 'blue'
    return `${colorClass}-faded`;
  }
}

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
    // Only show completed percentage, not combined percentage
    const completeText = Math.round(progress.completionPercentage);
    overallCompletionPercent.textContent = `${completeText}%`;
    
    // Add a note to indicate how much is in progress
    const inProgressText = Math.round(progress.inProgressPercentage);
    overallCompletionPercent.setAttribute('title', `${completeText}% complete, ${inProgressText}% in progress`);
  }
  
  if (overallProgressBar) {
    // Clear the existing progress bar
    overallProgressBar.innerHTML = '';
    
    // Create the completed portion
    const completedPart = document.createElement('div');
    completedPart.className = 'bg-blue-500 h-2.5 rounded-l-full progress-bar-animated';
    completedPart.style.width = `${Math.round(progress.completionPercentage)}%`;
    completedPart.style.setProperty('--target-width', `${Math.round(progress.completionPercentage)}%`);
    completedPart.style.float = 'left';
    
    // Create the in-progress portion
    const inProgressPart = document.createElement('div');
    inProgressPart.className = 'bg-blue-faded h-2.5 progress-bar-animated';
    inProgressPart.style.width = `${Math.round(progress.inProgressPercentage)}%`;
    inProgressPart.style.setProperty('--target-width', `${Math.round(progress.inProgressPercentage)}%`);
    inProgressPart.style.float = 'left';
    
    // Add rounded right edge to the in-progress part only if it's the end of the bar
    if (progress.inProgressPercentage > 0) {
      inProgressPart.classList.add('rounded-r-full');
    } else {
      completedPart.classList.add('rounded-r-full');
    }
    
    // Append both parts to the progress bar
    overallProgressBar.appendChild(completedPart);
    overallProgressBar.appendChild(inProgressPart);
  }
  
  if (overallHours) {
    // Show completed hours + in-progress hours out of total hours
    const combinedHours = formatHours(progress.completedHours + progress.inProgressHours);
    overallHours.textContent = `${formatHours(progress.completedHours)}/${combinedHours}/${formatHours(progress.totalHours)} hrs`;
    overallHours.setAttribute('title', `${formatHours(progress.completedHours)} completed, ${formatHours(progress.inProgressHours)} in progress, ${formatHours(progress.totalHours)} total`);
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
    inProgressHours: number;
  }>();
  
  // Initialize with all departments
  boardData.labels.forEach(label => {
    if (label.name) {
      departmentMap.set(label.name, {
        color: label.color,
        totalHours: 0,
        completedHours: 0,
        inProgressHours: 0
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
    const isInProgress = !isComplete && isCardInProgress(card, boardData);
    
    card.labels.forEach(label => {
      if (label.name && departmentMap.has(label.name)) {
        const deptStats = departmentMap.get(label.name)!;
        deptStats.totalHours = Number(deptStats.totalHours) + Number(hours);
        
        if (isComplete) {
          deptStats.completedHours = Number(deptStats.completedHours) + Number(hours);
        } else if (isInProgress) {
          deptStats.inProgressHours = Number(deptStats.inProgressHours) + Number(hours);
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
    // Calculate percentage for completed and in-progress
    const completedPercentage = stats.totalHours > 0 
      ? Math.round((stats.completedHours / stats.totalHours) * 100) 
      : 0;
    
    const inProgressPercentage = stats.totalHours > 0 
      ? Math.round((stats.inProgressHours / stats.totalHours) * 100) 
      : 0;
    
    // Calculate total percentage
    const totalPercentage = completedPercentage + inProgressPercentage;
    
    const departmentElement = document.createElement('div');
    departmentElement.className = 'mb-3';
    
    // Create HTML structure
    departmentElement.innerHTML = `
      <div class="flex justify-between mb-1">
        <span class="text-sm font-medium text-gray-700">${dept}</span>
        <span class="text-sm font-medium text-gray-700" title="${completedPercentage}% complete, ${inProgressPercentage}% in progress">
          ${formatHours(stats.completedHours)}/${formatHours(stats.completedHours + stats.inProgressHours)}/${formatHours(stats.totalHours)} hrs
        </span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden"></div>
    `;
    
    // Get the progress bar container
    const progressBarContainer = departmentElement.querySelector('.bg-gray-200');
    
    // Create completed part
    const completedPart = document.createElement('div');
    completedPart.className = `label-${stats.color} h-2 progress-bar-animated`;
    completedPart.style.width = `${completedPercentage}%`;
    completedPart.style.setProperty('--target-width', `${completedPercentage}%`);
    completedPart.style.float = 'left';
    
    // Create in-progress part
    const inProgressPart = document.createElement('div');
    inProgressPart.className = `label-${getFadedColorClass(stats.color)} h-2 progress-bar-animated`;
    inProgressPart.style.width = `${inProgressPercentage}%`;
    inProgressPart.style.setProperty('--target-width', `${inProgressPercentage}%`);
    inProgressPart.style.float = 'left';
    
    // Apply rounded corners
    if (completedPercentage > 0) {
      completedPart.classList.add('rounded-l-full');
    }
    
    if (inProgressPercentage > 0) {
      inProgressPart.classList.add('rounded-r-full');
    } else if (completedPercentage > 0) {
      completedPart.classList.add('rounded-r-full');
    }
    
    // Add parts to container
    progressBarContainer?.appendChild(completedPart);
    progressBarContainer?.appendChild(inProgressPart);
    
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
    inProgressHours: number;
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
    const isInProgress = !isComplete && isCardInProgress(card, boardData);
    
    if (!systemMap.has(system)) {
      systemMap.set(system, {
        totalHours: 0,
        completedHours: 0,
        inProgressHours: 0
      });
    }
    
    const systemStats = systemMap.get(system)!;
    systemStats.totalHours = Number(systemStats.totalHours) + Number(hours);
    
    if (isComplete) {
      systemStats.completedHours = Number(systemStats.completedHours) + Number(hours);
    } else if (isInProgress) {
      systemStats.inProgressHours = Number(systemStats.inProgressHours) + Number(hours);
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
    // Calculate percentage for completed and in-progress
    const completedPercentage = stats.totalHours > 0 
      ? Math.round((stats.completedHours / stats.totalHours) * 100) 
      : 0;
    
    const inProgressPercentage = stats.totalHours > 0 
      ? Math.round((stats.inProgressHours / stats.totalHours) * 100) 
      : 0;
    
    // Calculate total percentage
    const totalPercentage = completedPercentage + inProgressPercentage;
    
    const systemElement = document.createElement('div');
    systemElement.className = 'mb-3';
    
    // Create HTML structure
    systemElement.innerHTML = `
      <div class="flex justify-between mb-1">
        <span class="text-sm font-medium text-gray-700">${system}</span>
        <span class="text-sm font-medium text-gray-700" title="${completedPercentage}% complete, ${inProgressPercentage}% in progress">
          ${formatHours(stats.completedHours)}/${formatHours(stats.completedHours + stats.inProgressHours)}/${formatHours(stats.totalHours)} hrs
        </span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden"></div>
    `;
    
    // Get the progress bar container
    const progressBarContainer = systemElement.querySelector('.bg-gray-200');
    
    // Create completed part
    const completedPart = document.createElement('div');
    completedPart.className = `bg-blue-600 h-2 progress-bar-animated`;
    completedPart.style.width = `${completedPercentage}%`;
    completedPart.style.setProperty('--target-width', `${completedPercentage}%`);
    completedPart.style.float = 'left';
    
    // Create in-progress part
    const inProgressPart = document.createElement('div');
    inProgressPart.className = `bg-blue-faded h-2 progress-bar-animated`;
    inProgressPart.style.width = `${inProgressPercentage}%`;
    inProgressPart.style.setProperty('--target-width', `${inProgressPercentage}%`);
    inProgressPart.style.float = 'left';
    
    // Apply rounded corners
    if (completedPercentage > 0) {
      completedPart.classList.add('rounded-l-full');
    }
    
    if (inProgressPercentage > 0) {
      inProgressPart.classList.add('rounded-r-full');
    } else if (completedPercentage > 0) {
      completedPart.classList.add('rounded-r-full');
    }
    
    // Add parts to container
    progressBarContainer?.appendChild(completedPart);
    progressBarContainer?.appendChild(inProgressPart);
    
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
    console.log(`Department ${stats.department} with color ${stats.color} and completion percentage ${stats.completionPercentage}`);
    
    // Calculate total progress (only completed percentage shown)
    const completedPercentage = Math.round(stats.completionPercentage);
    
    const departmentElement = document.createElement('div');
    departmentElement.className = 'mb-4';
    
    // Create basic HTML structure
    departmentElement.innerHTML = `
      <div class="flex justify-between mb-1">
        <span class="font-medium">${stats.department}</span>
        <span class="text-sm font-medium" title="${Math.round(stats.completionPercentage)}% complete, ${Math.round(stats.inProgressPercentage)}% in progress">
          ${completedPercentage}% complete
        </span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5 mb-1 overflow-hidden"></div>
      <div class="flex justify-between text-xs text-gray-500">
        <span>${stats.completedCards}/${stats.totalCards} tasks (${stats.inProgressCards} in progress)</span>
        <span>${formatHours(stats.completedHours)}/${formatHours(stats.completedHours + stats.inProgressHours)}/${formatHours(stats.totalHours)} hrs</span>
      </div>
    `;
    
    // Get the progress bar container
    const progressBarContainer = departmentElement.querySelector('.bg-gray-200');
    
    // Create completed part
    const completedPart = document.createElement('div');
    completedPart.className = `label-${stats.color} h-2.5 progress-bar-animated`;
    completedPart.style.width = `${Math.round(stats.completionPercentage)}%`;
    completedPart.style.setProperty('--target-width', `${Math.round(stats.completionPercentage)}%`);
    completedPart.style.float = 'left';
    
    // Create in-progress part
    const inProgressPart = document.createElement('div');
    inProgressPart.className = `label-${getFadedColorClass(stats.color)} h-2.5 progress-bar-animated`;
    inProgressPart.style.width = `${Math.round(stats.inProgressPercentage)}%`;
    inProgressPart.style.setProperty('--target-width', `${Math.round(stats.inProgressPercentage)}%`);
    inProgressPart.style.float = 'left';
    
    // Apply rounded corners
    if (stats.completionPercentage > 0) {
      completedPart.classList.add('rounded-l-full');
    }
    
    if (stats.inProgressPercentage > 0) {
      inProgressPart.classList.add('rounded-r-full');
    } else if (stats.completionPercentage > 0) {
      completedPart.classList.add('rounded-r-full');
    }
    
    // Add parts to container
    progressBarContainer?.appendChild(completedPart);
    progressBarContainer?.appendChild(inProgressPart);
    
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
    // Calculate progress (only completed percentage shown)
    const completedPercentage = Math.round(stats.completionPercentage);
    
    const systemElement = document.createElement('div');
    systemElement.className = 'mb-4';
    
    // Create basic HTML structure
    systemElement.innerHTML = `
      <div class="flex justify-between mb-1">
        <span class="font-medium">${stats.system}</span>
        <span class="text-sm font-medium" title="${Math.round(stats.completionPercentage)}% complete, ${Math.round(stats.inProgressPercentage)}% in progress">
          ${completedPercentage}% complete
        </span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5 mb-1 overflow-hidden"></div>
      <div class="flex justify-between text-xs text-gray-500">
        <span>${stats.completedCards}/${stats.totalCards} tasks (${stats.inProgressCards} in progress)</span>
        <span>${formatHours(stats.completedHours)}/${formatHours(stats.completedHours + stats.inProgressHours)}/${formatHours(stats.totalHours)} hrs</span>
      </div>
    `;
    
    // Get the progress bar container
    const progressBarContainer = systemElement.querySelector('.bg-gray-200');
    
    // Create completed part
    const completedPart = document.createElement('div');
    completedPart.className = `bg-blue-600 h-2.5 progress-bar-animated`;
    completedPart.style.width = `${Math.round(stats.completionPercentage)}%`;
    completedPart.style.setProperty('--target-width', `${Math.round(stats.completionPercentage)}%`);
    completedPart.style.float = 'left';
    
    // Create in-progress part
    const inProgressPart = document.createElement('div');
    inProgressPart.className = `bg-blue-faded h-2.5 progress-bar-animated`;
    inProgressPart.style.width = `${Math.round(stats.inProgressPercentage)}%`;
    inProgressPart.style.setProperty('--target-width', `${Math.round(stats.inProgressPercentage)}%`);
    inProgressPart.style.float = 'left';
    
    // Apply rounded corners
    if (stats.completionPercentage > 0) {
      completedPart.classList.add('rounded-l-full');
    }
    
    if (stats.inProgressPercentage > 0) {
      inProgressPart.classList.add('rounded-r-full');
    } else if (stats.completionPercentage > 0) {
      completedPart.classList.add('rounded-r-full');
    }
    
    // Add parts to container
    progressBarContainer?.appendChild(completedPart);
    progressBarContainer?.appendChild(inProgressPart);
    
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
      
      // Calculate completed percentage (not total progress)
      const completedPercentage = Math.round(progress.completionPercentage);
      
      // Create system progress within department
      const systemElement = document.createElement('div');
      systemElement.className = 'ml-4 mb-3';
      
      // Create HTML structure
      systemElement.innerHTML = `
        <div class="flex justify-between mb-1">
          <span class="font-medium">${system}</span>
          <span class="text-sm font-medium" title="${Math.round(progress.completionPercentage)}% complete, ${Math.round(progress.inProgressPercentage)}% in progress">
            ${completedPercentage}% complete
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 mb-1 overflow-hidden"></div>
        <div class="flex justify-between text-xs text-gray-500 mb-2">
          <span>${progress.completedCards}/${progress.totalCards} tasks (${progress.inProgressCards} in progress)</span>
          <span>${formatHours(progress.completedHours)}/${formatHours(progress.completedHours + progress.inProgressHours)}/${formatHours(progress.totalHours)} hrs</span>
        </div>
      `;
      
      // Get the progress bar container
      const progressBarContainer = systemElement.querySelector('.bg-gray-200');
      
      // Create completed part
      const completedPart = document.createElement('div');
      completedPart.className = `label-${departmentColor} h-2 progress-bar-animated`;
      completedPart.style.width = `${Math.round(progress.completionPercentage)}%`;
      completedPart.style.setProperty('--target-width', `${Math.round(progress.completionPercentage)}%`);
      completedPart.style.float = 'left';
      
      // Create in-progress part
      const inProgressPart = document.createElement('div');
      inProgressPart.className = `label-${getFadedColorClass(departmentColor)} h-2 progress-bar-animated`;
      inProgressPart.style.width = `${Math.round(progress.inProgressPercentage)}%`;
      inProgressPart.style.setProperty('--target-width', `${Math.round(progress.inProgressPercentage)}%`);
      inProgressPart.style.float = 'left';
      
      // Apply rounded corners
      if (progress.completionPercentage > 0) {
        completedPart.classList.add('rounded-l-full');
      }
      
      if (progress.inProgressPercentage > 0) {
        inProgressPart.classList.add('rounded-r-full');
      } else if (progress.completionPercentage > 0) {
        completedPart.classList.add('rounded-r-full');
      }
      
      // Add parts to container
      progressBarContainer?.appendChild(completedPart);
      progressBarContainer?.appendChild(inProgressPart);
      
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
