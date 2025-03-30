/**
 * Dashboard utility functions
 */

/**
 * Helper function to format hours display
 */
export function formatHours(hours: number): number {
  // Validate hours and round to one decimal place
  if (!isFinite(hours) || hours < 0 || hours > 10000) {
    return 0;
  }
  return Math.round(hours * 10) / 10;
}

/**
 * When a color variant (light/dark) is used, add -faded to get faded version
 */
export function getFadedColorClass(colorClass: string): string {
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
 * Format subtitle text with hours
 */
export function formatHoursSubtitle(completed: number, inProgress: number, total: number): string {
  return `${formatHours(completed)}/${formatHours(completed + inProgress)}/${formatHours(total)} hrs`;
}

/**
 * Create an empty dashboard state message
 */
export function showEmptyState(container: HTMLElement, message: string = 'No data available') {
  container.innerHTML = `<div class="text-sm text-gray-500 italic">${message}</div>`;
}
