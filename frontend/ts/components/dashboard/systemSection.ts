/**
 * System section components
 */

import { TrelloCard, TrelloBoardData, SystemStats } from '../../utils/typeAdapter';
import { calculateProgress } from '../../utils/dataProcessing';
import { createStatCard } from './statCard';
import { formatHours, formatHoursSubtitle, showEmptyState } from './utils';

// DOM element references
const systemHoursContainer = document.getElementById('system-hours-container');
const systemProgressContainer = document.getElementById('system-progress-container');

/**
 * Update system hours section
 */
export function updateSystemHours(cards: TrelloCard[], boardData: TrelloBoardData) {
  console.log('Updating system hours');

  if (!systemHoursContainer) return;
  
  // Clear existing content
  systemHoursContainer.innerHTML = '';
  
  // Get system stats
  const systemStats = getSystemStats(cards, boardData);
  
  if (systemStats.length === 0) {
    showEmptyState(systemHoursContainer);
    return;
  }
  
  // Create system hours display - limit to top 3
  systemStats.slice(0, 3).forEach(stats => {
    const statCard = createStatCard({
      title: stats.system,
      subtitle: formatHoursSubtitle(stats.completedHours, stats.inProgressHours, stats.totalHours),
      progressBar: {
        completedPercentage: stats.completionPercentage,
        inProgressPercentage: stats.inProgressPercentage,
        completedColorClass: 'bg-blue-600',
        inProgressColorClass: 'bg-blue-faded',
        height: '2'
      },
      titleTooltip: `${Math.round(stats.completionPercentage)}% complete, ${Math.round(stats.inProgressPercentage)}% in progress`
    });
    
    systemHoursContainer.appendChild(statCard);
  });
  
  // Add note if showing limited data
  if (systemStats.length > 3) {
    const noteElem = document.createElement('div');
    noteElem.className = 'text-xs text-gray-300 italic mt-2';
    noteElem.textContent = `Showing top 3 of ${systemStats.length} systems`;
    systemHoursContainer.appendChild(noteElem);
  }
}

/**
 * Update system progress section
 */
export function updateSystemProgress(cards: TrelloCard[], boardData: TrelloBoardData) {
  if (!systemProgressContainer) return;
  
  // Clear existing content
  systemProgressContainer.innerHTML = '';
  
  // Get system stats
  const systemStats = getSystemStats(cards, boardData);
  
  if (systemStats.length === 0) {
    showEmptyState(systemProgressContainer);
    return;
  }
  
  // Create system progress bars
  systemStats.forEach(stats => {
    const completedPercentage = Math.round(stats.completionPercentage);
    
    const statCard = createStatCard({
      title: stats.system,
      subtitle: `${completedPercentage}% complete`,
      progressBar: {
        completedPercentage: stats.completionPercentage,
        inProgressPercentage: stats.inProgressPercentage,
        completedColorClass: 'bg-blue-600',
        inProgressColorClass: 'bg-blue-faded',
        height: '2.5'
      },
      details: {
        leftText: `${stats.completedCards}/${stats.totalCards} tasks (${stats.inProgressCards} in progress)`,
        rightText: formatHoursSubtitle(stats.completedHours, stats.inProgressHours, stats.totalHours)
      },
      classes: 'mb-4',
      titleTooltip: `${Math.round(stats.completionPercentage)}% complete, ${Math.round(stats.inProgressPercentage)}% in progress`
    });
    
    systemProgressContainer.appendChild(statCard);
  });
}

/**
 * Calculate stats for each system
 */
function getSystemStats(cards: TrelloCard[], boardData: TrelloBoardData): SystemStats[] {
  // Group cards by system
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
  return systemStats.sort((a, b) => b.totalHours - a.totalHours);
}
