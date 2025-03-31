// Trello Dashboard Visualizer - Main TypeScript file

// Import Firebase configuration to initialize the app
import './config/firebase';
import { SanitizedBoardData, fetchBoardData } from './api/trello';

import { filterCards, clearOptionsKeepingAll } from './utils/dataProcessing';
import { convertToTrelloBoardData, TrelloBoardData } from './utils/typeAdapter';
import { handleApiError, formatErrorForDisplay, ErrorType } from './utils/errorHandler';
import { initSectionToggles } from './utils/sectionToggle';
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

// Type-safe element selector
function getElementSafe<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id) as T;
  if (!element) {
    throw new Error(`Element not found: ${id}`);
  }
  return element;
}

// DOM element references with type safety
const departmentFilter = getElementSafe<HTMLSelectElement>('department-filter');
const systemFilter = getElementSafe<HTMLSelectElement>('system-filter');
const refreshButton = getElementSafe<HTMLButtonElement>('refresh-data');

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
    // Handle error with enhanced error processing
    const appError = handleApiError(error);
    showError(formatErrorForDisplay(appError));
    console.error('Dashboard initialization error:', appError);
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
  departmentFilter.addEventListener('change', (e) => {
    selectedDepartment = (e.target as HTMLSelectElement).value;
    updateDashboard();
  });
  
  systemFilter.addEventListener('change', (e) => {
    selectedSystem = (e.target as HTMLSelectElement).value;
    updateDashboard();
  });
  
  // Add refresh button event listener
  refreshButton.addEventListener('click', async () => {
    try {
      // Show loading spinner during refresh
      showLoading(true);
      refreshButton.disabled = true;
      refreshButton.classList.add('opacity-50');
      
      // Fetch fresh data from the API
      boardData = await fetchBoardData();
      
      if (boardData) {
        // Convert the API data to the format expected by the frontend components
        adaptedBoardData = convertToTrelloBoardData(boardData);
        
        // Update filters with potentially new departments/systems
        populateFilters(adaptedBoardData, departmentFilter, systemFilter);
        
        // Update dashboard with new data
        updateDashboard();
        
        // Update timestamp
        updateTimestamp();
      }
      
      // Hide loading spinner
      showLoading(false);
      refreshButton.disabled = false;
      refreshButton.classList.remove('opacity-50');
    } catch (error) {
      // Handle error with enhanced error processing
      const appError = handleApiError(error);
      showError(formatErrorForDisplay(appError));
      console.error('Dashboard refresh error:', appError);
      showLoading(false);
      refreshButton.disabled = false;
      refreshButton.classList.remove('opacity-50');
    }
  });
  
  // Setup error modal close button
  setupErrorModalClose();

  // Initialize collapsible sections
  initSectionToggles();
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
