// Dark Mode Theme Manager - Simplified

/**
 * Initialize theme manager (Dark mode only)
 */
export function initThemeManager(): void {
  // Apply dark mode styling to meta elements
  const metaThemeColor = document.getElementById('theme-color-meta') as HTMLMetaElement;
  if (metaThemeColor) {
    metaThemeColor.content = '#1a202c'; // dark bg-primary
  }
}
