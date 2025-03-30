/**
 * Overall progress section component
 */

import { TrelloCard, TrelloBoardData } from '../../utils/typeAdapter';
import { calculateProgress } from '../../utils/dataProcessing';
import { formatHours } from './utils';
import { createProgressBar } from './progressBar';
import { updateDepartmentHours } from './departmentSection';
import { updateSystemHours } from './systemSection';

// DOM element references
const overallCompletionPercent = document.getElementById('overall-completion-percent');
const overallProgressBar = document.getElementById('overall-progress-bar');
const overallHours = document.getElementById('overall-hours');

/**
 * Update overall progress section
 */
export function updateOverallProgress(cards: TrelloCard[], boardData: TrelloBoardData) {
  const progress = calculateProgress(cards, boardData);
  
  if (overallCompletionPercent) {
    // Only show completed percentage, not combined percentage
    const completeText = Math.round(progress.completionPercentage);
    overallCompletionPercent.textContent = `${completeText}%`;
    overallCompletionPercent.className = 'text-gray-100';
    
    // Add a note to indicate how much is in progress
    const inProgressText = Math.round(progress.inProgressPercentage);
    overallCompletionPercent.setAttribute('title', `${completeText}% complete, ${inProgressText}% in progress`);
  }
  
  if (overallProgressBar) {
    // Clear the existing progress bar
    overallProgressBar.innerHTML = '';
    
    // Create the progress bar
    const progressBarElement = createProgressBar({
      completedPercentage: progress.completionPercentage,
      inProgressPercentage: progress.inProgressPercentage,
      completedColorClass: 'bg-blue-500',
      inProgressColorClass: 'bg-blue-faded',
      height: '2.5'
    });
    
    // Append the new progress bar
    overallProgressBar.appendChild(progressBarElement);
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
