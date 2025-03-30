// Trello Dashboard Visualizer - Main TypeScript file

// Import Firebase configuration to initialize the app
import './config/firebase';
import { SanitizedBoardData, fetchBoardData } from './api/trello';

import { filterCards, clearOptionsKeepingAll } from './utils/dataProcessing';
import { convertToTrelloBoardData, TrelloBoardData } from './utils/typeAdapter';
import {
  populateFilters,
  updateOverallProgress,
  updateDepartmentProgress,
  updateSystemProgress,
  updateDetailedBreakdown,
  showLoading,
  showError,
  setupErrorModalClose,
  updateTimestamp
} from './components/dashboard';

// Global state
let boardData: SanitizedBoardData | null = null;
let adaptedBoardData: TrelloBoardData | null = null;
let selectedDepartment = 'all';
let selectedSystem = 'all';

// DOM element references
const departmentFilter = document.getElementById('department-filter') as HTMLSelectElement;
const systemFilter = document.getElementById('system-filter') as HTMLSelectElement;

  /**
 * Initialize the dashboard
 */
async function initDashboard() {
  try {
    showLoading(true);
    
    // Fetch board data from the API (or mock data if in development)
    boardData = await fetchBoardData();
    
    if (boardData) {
      // Convert the API data to the format expected by the frontend components
      adaptedBoardData = convertToTrelloBoardData(boardData);
      
      // Populate filter dropdowns
      populateFilters(adaptedBoardData, departmentFilter, systemFilter);
      
      // Update dashboard with initial data
      updateDashboard();
      
      // Update timestamp
      updateTimestamp();
    }
    
    showLoading(false);
  } catch (error) {
    showError(`Failed to initialize dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`);
    showLoading(false);
  }
}

/**
 * Update the entire dashboard based on current filters
 */
function updateDashboard() {
  if (!boardData || !adaptedBoardData) return;
  
  // Filter cards based on selected department and system
  const filteredCards = filterCards(adaptedBoardData.cards, selectedDepartment, selectedSystem);
  
  // Update all dashboard sections
  updateOverallProgress(filteredCards, adaptedBoardData);
  updateDepartmentProgress(filteredCards, adaptedBoardData);
  updateSystemProgress(filteredCards, adaptedBoardData);
  updateDetailedBreakdown(filteredCards, adaptedBoardData);
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
  // Add filter change event listeners
  if (departmentFilter) {
    departmentFilter.addEventListener('change', (e) => {
      selectedDepartment = (e.target as HTMLSelectElement).value;
      updateDashboard();
    });
  }
  
  if (systemFilter) {
    systemFilter.addEventListener('change', (e) => {
      selectedSystem = (e.target as HTMLSelectElement).value;
      updateDashboard();
    });
  }
  
  // Setup error modal close button
  setupErrorModalClose();
  
  // No test buttons needed in production
}

/**
 * Main entry point - run when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Set up event listeners
  setupEventListeners();
  
  // Initialize dashboard
  initDashboard();
});
