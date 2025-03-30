/**
 * Reusable progress bar component
 */

export interface ProgressBarOptions {
  completedPercentage: number;
  inProgressPercentage: number;
  completedColorClass: string;
  inProgressColorClass: string;
  height?: '2' | '2.5'; // Can be expanded if more sizes are needed
}

/**
 * Creates a progress bar with completed and in-progress sections
 */
export function createProgressBar(options: ProgressBarOptions): HTMLElement {
  const {
    completedPercentage,
    inProgressPercentage,
    completedColorClass,
    inProgressColorClass,
    height = '2'
  } = options;
  
  // Create container
  const container = document.createElement('div');
  container.className = `w-full bg-gray-200 rounded-full h-${height} overflow-hidden`;
  
  // Create completed part
  const completedPart = document.createElement('div');
  completedPart.className = `${completedColorClass} h-${height}`;
  completedPart.style.width = `${Math.round(completedPercentage)}%`;
  completedPart.style.float = 'left';
  
  // Create in-progress part
  const inProgressPart = document.createElement('div');
  inProgressPart.className = `${inProgressColorClass} h-${height}`;
  inProgressPart.style.width = `${Math.round(inProgressPercentage)}%`;
  inProgressPart.style.float = 'left';
  
  // Apply rounded corners
  if (completedPercentage > 0) {
    completedPart.classList.add('rounded-l-full');
  }
  
  if (inProgressPercentage > 0) {
    inProgressPart.classList.add('rounded-r-full');
  } else if (completedPercentage > 0) {
    completedPart.classList.add('rounded-r-full');
  }
  
  // Add parts to container
  container.appendChild(completedPart);
  container.appendChild(inProgressPart);
  
  return container;
}
