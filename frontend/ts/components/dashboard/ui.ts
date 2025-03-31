/**
 * UI utility functions for dashboard
 */
import { ErrorType, createError } from '../../utils/errorHandler';

/**
 * Type-safe element selector
 * @throws {Error} if element not found
 */
function getElement<T extends HTMLElement>(selector: string, errorMessage: string = `Element not found: ${selector}`): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw createError(ErrorType.UI_RENDERING, 'UI Element Missing', errorMessage);
  }
  return element;
}

// DOM element references using type-safe selectors
const errorModal = getElement<HTMLDivElement>('#error-modal');
const errorMessage = getElement<HTMLParagraphElement>('#error-message');
const closeError = getElement<HTMLButtonElement>('#close-error');
const loadingSpinner = getElement<HTMLDivElement>('#loading-spinner');
const lastUpdated = getElement<HTMLSpanElement>('#last-updated');

/**
 * Helper function to show/hide loading spinner
 */
export function showLoading(show: boolean) {
  loadingSpinner.style.display = show ? 'flex' : 'none';
}

/**
 * Helper function to show error modal
 */
export function showError(message: string) {
  errorMessage.textContent = message;
  errorModal.style.display = 'flex';
}

/**
 * Add event listener to close error button
 */
export function setupErrorModalClose() {
  closeError.addEventListener('click', () => {
    errorModal.style.display = 'none';
  });
}

/**
 * Update the last updated timestamp
 */
export function updateTimestamp() {
  const now = new Date();
  lastUpdated.textContent = now.toLocaleString();
}
