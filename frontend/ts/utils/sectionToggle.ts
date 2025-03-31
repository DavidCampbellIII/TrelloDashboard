/**
 * Section Toggle Utility
 * Provides functionality to collapse and expand dashboard sections
 */

export interface SectionState {
  sectionId: string;
  isExpanded: boolean;
}

// Key for local storage
const SECTION_STATE_KEY = 'trello_dashboard_section_states';

/**
 * Initialize section toggle functionality
 * Sets up event listeners and restores previous state
 */
export function initSectionToggles(): void {
  const toggleButtons = document.querySelectorAll<HTMLButtonElement>('.section-toggle');
  
  // Load saved states from local storage
  const savedStates = loadSectionStates();
  
  // Set up each toggle button
  toggleButtons.forEach(button => {
    const targetId = button.getAttribute('aria-controls');
    if (!targetId) return;
    
    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;
    
    // Apply saved state if available
    const savedState = savedStates.find(state => state.sectionId === targetId);
    if (savedState) {
      if (!savedState.isExpanded) {
        // Collapse section based on saved state
        targetSection.classList.add('hidden');
        button.setAttribute('aria-expanded', 'false');
        button.querySelector('.chevron-up')?.classList.add('hidden');
        button.querySelector('.chevron-down')?.classList.remove('hidden');
      }
    }
    
    // Add click event listener
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      
      // Toggle visibility
      if (isExpanded) {
        // Collapse section
        targetSection.classList.add('hidden');
        button.setAttribute('aria-expanded', 'false');
        button.querySelector('.chevron-up')?.classList.add('hidden');
        button.querySelector('.chevron-down')?.classList.remove('hidden');
      } else {
        // Expand section
        targetSection.classList.remove('hidden');
        button.setAttribute('aria-expanded', 'true');
        button.querySelector('.chevron-up')?.classList.remove('hidden');
        button.querySelector('.chevron-down')?.classList.add('hidden');
      }
      
      // Save state to local storage
      saveSectionState(targetId, !isExpanded);
    });
  });
}

/**
 * Save the expanded/collapsed state of a section to local storage
 */
function saveSectionState(sectionId: string, isExpanded: boolean): void {
  try {
    const currentStates = loadSectionStates();
    
    // Find existing entry or add new one
    const existingIndex = currentStates.findIndex(state => state.sectionId === sectionId);
    
    if (existingIndex >= 0) {
      currentStates[existingIndex].isExpanded = isExpanded;
    } else {
      currentStates.push({ sectionId, isExpanded });
    }
    
    // Save to local storage
    localStorage.setItem(SECTION_STATE_KEY, JSON.stringify(currentStates));
  } catch (error) {
    console.error('Failed to save section state:', error);
  }
}

/**
 * Load section states from local storage
 */
function loadSectionStates(): SectionState[] {
  try {
    const savedData = localStorage.getItem(SECTION_STATE_KEY);
    if (!savedData) return [];
    
    const parsedData = JSON.parse(savedData);
    if (!Array.isArray(parsedData)) return [];
    
    return parsedData;
  } catch (error) {
    console.error('Failed to load section states:', error);
    return [];
  }
}
