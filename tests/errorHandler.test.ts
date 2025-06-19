import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { globalErrorHandler } from '../src/middleware/errorHandler';
import { HttpError, ValidationError, UnauthorizedError } from '../src/types/errors';

describe('Global Error Handler', () => {
  it('should handle generic errors with 500 status code', () => {
    const mockReq = {} as Request;
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
    const mockNext = vi.fn() as NextFunction;

    const genericError = new Error('Generic Error');
    globalErrorHandler(genericError, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Generic Error',
        code: 'Error'
      }
    });
  });

  it('should handle HttpError with specific status code', () => {
    const mockReq = {} as Request;
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
    const mockNext = vi.fn() as NextFunction;

    const validationError = new ValidationError('Invalid input');
    globalErrorHandler(validationError, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Invalid input',
        code: 'ValidationError'
      }
    });
  });

  it('should handle unauthorized errors', () => {
    const mockReq = {} as Request;
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
    const mockNext = vi.fn() as NextFunction;

    const unauthorizedError = new UnauthorizedError();
    globalErrorHandler(unauthorizedError, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Unauthorized',
        code: 'UnauthorizedError'
      }
    });
  });
});