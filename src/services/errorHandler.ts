

// #quantumReady #billionDollarProof

import { InterviewError, ServiceError } from './errors';

export const handleError = (error: InterviewError | ServiceError): void => {
  // Log error with proper context
  console.error(`[${error.name}] ${error.message}`);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('app:error', {
        detail: {
          message: `${error.name}: ${error.message}`,
        },
      }),
    );
  }
  
  // In production, this would send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Implement error tracking service integration
    // sendToErrorTracking(error);
  }
  
  // For development, provide more detailed error information
  if (process.env.NODE_ENV === 'development') {
    console.error('Stack trace:', error.stack);
  }
}; 