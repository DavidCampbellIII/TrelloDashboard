/**
 * Reusable stat card component
 */

import { createProgressBar, ProgressBarOptions } from './progressBar';

export interface StatCardOptions {
  title: string;
  subtitle: string;
  progressBar: ProgressBarOptions;
  details?: {
    leftText: string;
    rightText: string;
  };
  classes?: string;
  titleTooltip?: string;
}

/**
 * Creates a stat card with title, progress bar, and optional details
 */
export function createStatCard(options: StatCardOptions): HTMLElement {
  const { title, subtitle, progressBar, details, classes = 'mb-3', titleTooltip } = options;
  
  const cardElement = document.createElement('div');
  cardElement.className = classes;
  
  // Create header with title and subtitle
  const header = document.createElement('div');
  header.className = 'flex justify-between mb-1';
  
  const titleElem = document.createElement('span');
  titleElem.className = 'font-medium text-gray-100';
  titleElem.textContent = title;
  
  const subtitleElem = document.createElement('span');
  subtitleElem.className = 'text-sm font-medium text-gray-100';
  subtitleElem.textContent = subtitle;
  
  // Add tooltip if provided
  if (titleTooltip) {
    subtitleElem.setAttribute('title', titleTooltip);
  }
  
  header.appendChild(titleElem);
  header.appendChild(subtitleElem);
  
  // Create progress bar
  const progressBarElem = createProgressBar(progressBar);
  
  // Add elements to card
  cardElement.appendChild(header);
  cardElement.appendChild(progressBarElem);
  
  // Add details if provided
  if (details) {
    const detailsElem = document.createElement('div');
    detailsElem.className = 'flex justify-between text-xs text-gray-500 mt-1';
    
    const leftText = document.createElement('span');
    leftText.textContent = details.leftText;
    
    const rightText = document.createElement('span');
    rightText.textContent = details.rightText;
    
    detailsElem.appendChild(leftText);
    detailsElem.appendChild(rightText);
    
    cardElement.appendChild(detailsElem);
  }
  
  return cardElement;
}
