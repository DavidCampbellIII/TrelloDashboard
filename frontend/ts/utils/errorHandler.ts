/**
 * Error handling utility functions
 * Provides standardized error handling across the application
 */

// Define error types for better classification
export enum ErrorType {
  API_FETCH = 'API_FETCH',
  DATA_PROCESSING = 'DATA_PROCESSING',
  UI_RENDERING = 'UI_RENDERING',
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  UNKNOWN = 'UNKNOWN'
}

// Interface for structured error messages
export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  originalError?: Error;
}

/**
 * Creates a standardized error object
 * @param type The type of error
 * @param message User-friendly error message
 * @param details Optional technical details
 * @param originalError Optional original error object
 * @returns Structured error object
 */
export function createError(
  type: ErrorType, 
  message: string, 
  details?: string, 
  originalError?: Error
): AppError {
  return {
    type,
    message,
    details,
    originalError
  };
}

/**
 * Handles errors from the Trello API
 * @param error The error from the API call
 * @returns Structured error object
 */
export function handleApiError(error: any): AppError {
  // Check if it's a Firebase function error
  if (error?.code?.startsWith('functions/')) {
    const code = error.code.replace('functions/', '');
    
    switch (code) {
      case 'unauthenticated':
        return createError(
          ErrorType.AUTHENTICATION,
          'Authentication with Trello failed',
          'Please check your Trello API key and token',
          error
        );
      case 'invalid-argument':
        return createError(
          ErrorType.API_FETCH,
          'Invalid data provided to Trello API',
          error.message || 'Check board ID and parameters',
          error
        );
      case 'permission-denied':
        return createError(
          ErrorType.AUTHORIZATION,
          'You don\'t have permission to access this Trello board',
          'Make sure you have the right permissions on Trello',
          error
        );
      case 'resource-exhausted':
        return createError(
          ErrorType.API_FETCH,
          'Too many requests to Trello API',
          'Please try again later',
          error
        );
      case 'unavailable':
        return createError(
          ErrorType.NETWORK,
          'Trello service is currently unavailable',
          'Please try again later or check Trello status',
          error
        );
      default:
        return createError(
          ErrorType.API_FETCH,
          'Failed to fetch data from Trello',
          error.message || 'Unknown Firebase function error',
          error
        );
    }
  }
  
  // Handle network errors
  if (error?.message?.includes('network') || error?.name === 'NetworkError') {
    return createError(
      ErrorType.NETWORK,
      'Network connection issue',
      'Please check your internet connection and try again',
      error
    );
  }
  
  // Generic error handling
  return createError(
    ErrorType.UNKNOWN,
    'An unexpected error occurred',
    error?.message || 'No additional details available',
    error instanceof Error ? error : new Error(String(error))
  );
}

/**
 * Formats an error for display in the UI
 * @param error The error object
 * @returns User-friendly error message
 */
export function formatErrorForDisplay(error: AppError | Error | any): string {
  if ((error as AppError).type) {
    const appError = error as AppError;
    return `${appError.message}${appError.details ? `\n\nDetails: ${appError.details}` : ''}`;
  }
  
  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }
  
  return `Error: ${String(error)}`;
}
