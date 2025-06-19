import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../types/errors';

interface ErrorResponse {
  success: boolean;
  error: {
    message: string;
    code?: string;
  };
}

export const globalErrorHandler = (
  err: Error | HttpError, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  // Default error properties if not an HttpError
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const errorMessage = err.message || 'Internal Server Error';

  // Construct standardized error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: errorMessage,
      code: err.name
    }
  };

  // Log the error for server-side tracking (you would replace this with proper logging)
  console.error(`[ERROR] ${err.name}: ${err.message}`);
  
  // Send error response
  res.status(statusCode).json(errorResponse);
};

export default globalErrorHandler;