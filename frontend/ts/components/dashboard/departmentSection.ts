/**
 * Department section components
 */

import { TrelloCard, TrelloBoardData, DepartmentStats } from '../../utils/typeAdapter';
import { isCardCompleted, isCardInProgress, calculateProgress } from '../../utils/dataProcessing';
import { createStatCard } from './statCard';
import { formatHours, formatHoursSubtitle, getFadedColorClass, showEmptyState } from './utils';

// DOM element references
const departmentHoursContainer = document.getElementById('department-hours-container');
const departmentProgressContainer = document.getElementById('department-progress-container');

/**
 * Update department hours section
 */
export function updateDepartmentHours(cards: TrelloCard[], boardData: TrelloBoardData) {
  console.log('Updating department hours');

  if (!departmentHoursContainer) return;
  
  // Clear existing content
  departmentHoursContainer.innerHTML = '';
  
  // Get department stats
  const departmentStats = getDepartmentStats(cards, boardData);
  
  if (departmentStats.length === 0) {
    showEmptyState(departmentHoursContainer);
    return;
  }
  
  // Create department hours display - limit to top 3
  departmentStats.slice(0, 3).forEach(stats => {
    const statCard = createStatCard({
      title: stats.department,
      subtitle: formatHoursSubtitle(stats.completedHours, stats.inProgressHours, stats.totalHours),
      progressBar: {
        completedPercentage: stats.completionPercentage,
        inProgressPercentage: stats.inProgressPercentage,
        completedColorClass: `label-${stats.color}`,
        inProgressColorClass: `label-${getFadedColorClass(stats.color)}`,
        height: '2'
      },
      titleTooltip: `${Math.round(stats.completionPercentage)}% complete, ${Math.round(stats.inProgressPercentage)}% in progress`
    });
    
    departmentHoursContainer.appendChild(statCard);
  });
  
  // Add note if showing limited data
  if (departmentStats.length > 3) {
    const noteElem = document.createElement('div');
    noteElem.className = 'text-xs text-gray-300 italic mt-2';
    noteElem.textContent = `Showing top 3 of ${departmentStats.length} departments`;
    departmentHoursContainer.appendChild(noteElem);
  }
}

/**
 * Update department progress bars
 */
export function updateDepartmentProgress(cards: TrelloCard[], boardData: TrelloBoardData) {
  if (!departmentProgressContainer) return;
  
  // Clear existing content
  departmentProgressContainer.innerHTML = '';
  
  // Get department stats
  const departmentStats = getDepartmentStats(cards, boardData);
  
  if (departmentStats.length === 0) {
    showEmptyState(departmentProgressContainer);
    return;
  }
  
  // Create department progress bars
  departmentStats.forEach(stats => {
    const completedPercentage = Math.round(stats.completionPercentage);
    
    const statCard = createStatCard({
      title: stats.department,
      subtitle: `${completedPercentage}% complete`,
      progressBar: {
        completedPercentage: stats.completionPercentage,
        inProgressPercentage: stats.inProgressPercentage,
        completedColorClass: `label-${stats.color}`,
        inProgressColorClass: `label-${getFadedColorClass(stats.color)}`,
        height: '2.5'
      },
      details: {
        leftText: `${stats.completedCards}/${stats.totalCards} tasks (${stats.inProgressCards} in progress)`,
        rightText: formatHoursSubtitle(stats.completedHours, stats.inProgressHours, stats.totalHours)
      },
      classes: 'mb-4',
      titleTooltip: `${Math.round(stats.completionPercentage)}% complete, ${Math.round(stats.inProgressPercentage)}% in progress`
    });
    
    departmentProgressContainer.appendChild(statCard);
  });
}

/**
 * Calculate stats for each department
 */
function getDepartmentStats(cards: TrelloCard[], boardData: TrelloBoardData): DepartmentStats[] {
  // Group cards by department (label)
  const departmentMap = new Map<string, {
    color: string;
    totalHours: number;
    completedHours: number;
    inProgressHours: number;
    cards: TrelloCard[];
  }>();
  
  // Initialize with all departments
  boardData.labels.forEach(label => {
    if (label.name) {
      departmentMap.set(label.name, {
        color: label.color,
        totalHours: 0,
        completedHours: 0,
        inProgressHours: 0,
        cards: []
      });
    }
  });
  
  // Assign cards to departments and calculate basic stats
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
        deptStats.cards.push(card);
        
        if (isComplete) {
          deptStats.completedHours = Number(deptStats.completedHours) + Number(hours);
        } else if (isInProgress) {
          deptStats.inProgressHours = Number(deptStats.inProgressHours) + Number(hours);
        }
      }
    });
  });
  
  // Convert to DepartmentStats array with calculated percentages
  const departmentStats: DepartmentStats[] = [];
  
  departmentMap.forEach((stats, department) => {
    if (stats.cards.length === 0) return;
    
    const progress = calculateProgress(stats.cards, boardData);
    
    departmentStats.push({
      department,
      color: stats.color,
      ...progress
    });
  });
  
  // Sort by total hours (descending)
  return departmentStats.sort((a, b) => b.totalHours - a.totalHours);
}
