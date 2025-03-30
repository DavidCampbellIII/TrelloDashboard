/**
 * Dashboard components - main exports
 */

import { TrelloCard, TrelloBoardData } from '../../utils/typeAdapter';
import { populateFilters } from './filters';
import { updateOverallProgress } from './overallProgress';
import { updateDepartmentHours, updateDepartmentProgress } from './departmentSection';
import { updateSystemHours, updateSystemProgress } from './systemSection';
import { updateDetailedBreakdown } from './detailedBreakdown';
import { showLoading, showError, setupErrorModalClose, updateTimestamp } from './ui';

// Re-export all public functions to maintain API compatibility
export {
  populateFilters,
  updateOverallProgress,
  updateDepartmentHours,
  updateSystemHours,
  updateDepartmentProgress,
  updateSystemProgress,
  updateDetailedBreakdown,
  showLoading,
  showError,
  setupErrorModalClose,
  updateTimestamp
};

/**
 * Update all dashboard sections at once
 */
export function updateDashboard(cards: TrelloCard[], boardData: TrelloBoardData) {
  // Update overall progress
  updateOverallProgress(cards, boardData);
  
  // Update department sections
  updateDepartmentHours(cards, boardData);
  updateDepartmentProgress(cards, boardData);
  
  // Update system sections
  updateSystemHours(cards, boardData);
  updateSystemProgress(cards, boardData);
  
  // Update detailed breakdown
  updateDetailedBreakdown(cards, boardData);
  
  // Update timestamp
  updateTimestamp();
}
