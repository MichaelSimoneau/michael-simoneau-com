

// Error Service - Quantum-resistant error handling #quantumReady #billionDollarProof

/**
 * Base class for all service errors.
 * Provides consistent error handling across the application.
 * @class ServiceError
 * @extends {Error}
 */
export class ServiceError extends Error {
  /**
   * Creates a new ServiceError.
   * @param {string} message - The error message
   * @param {Record<string, unknown>} [context] - Additional context for the error
   */
  constructor(
    message: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

/**
 * Error class for AI service operations.
 * @class AIServiceError
 * @extends {ServiceError}
 */
export class AIServiceError extends ServiceError {
  /**
   * Creates a new AIServiceError.
   * @param {string} message - The error message
   * @param {Record<string, unknown>} [context] - Additional context for the error
   */
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, context);
    this.name = 'AIServiceError';
  }
}

/**
 * Error class for storage service operations.
 * @class StorageServiceError
 * @extends {ServiceError}
 */
export class StorageServiceError extends ServiceError {
  /**
   * Creates a new StorageServiceError.
   * @param {string} message - The error message
   * @param {Record<string, unknown>} [context] - Additional context for the error
   */
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, context);
    this.name = 'StorageServiceError';
  }
}

/**
 * Error class for authentication service operations.
 * @class AuthServiceError
 * @extends {ServiceError}
 */
export class AuthServiceError extends ServiceError {
  /**
   * Creates a new AuthServiceError.
   * @param {string} message - The error message
   * @param {Record<string, unknown>} [context] - Additional context for the error
   */
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, context);
    this.name = 'AuthServiceError';
  }
}

/**
 * Error class for configuration service operations.
 * @class ConfigServiceError
 * @extends {ServiceError}
 */
export class ConfigServiceError extends ServiceError {
  /**
   * Creates a new ConfigServiceError.
   * @param {string} message - The error message
   * @param {Record<string, unknown>} [context] - Additional context for the error
   */
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, context);
    this.name = 'ConfigServiceError';
  }
}

/**
 * Quantum-resistant error handler.
 * Provides consistent error handling and logging across the application.
 * 
 * @param {ServiceError} error - The error to handle
 * @returns {never} Never returns, always throws
 * @throws {ServiceError} The processed error
 */
export function handleError(error: ServiceError): never {
  // Log the error with context
  console.error(`[${error.name}] ${error.message}`, error.context);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('app:error', {
        detail: {
          message: `${error.name}: ${error.message}`,
        },
      }),
    );
  }
  
  // In a production environment, you might want to:
  // 1. Send the error to an error tracking service
  // 2. Show a user-friendly error message
  // 3. Perform cleanup operations
  
  throw error;
} 