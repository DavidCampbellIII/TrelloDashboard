/**
 * UI utility functions for dashboard
 */

// DOM element references
const errorModal = document.getElementById('error-modal');
const errorMessage = document.getElementById('error-message');
const closeError = document.getElementById('close-error');
const loadingSpinner = document.getElementById('loading-spinner');
const lastUpdated = document.getElementById('last-updated');

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
