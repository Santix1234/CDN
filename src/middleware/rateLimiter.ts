import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

/**
 * Creates a rate limiting middleware to prevent abuse
 * @param {Object} options - Configuration options for rate limiting
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Maximum number of requests allowed per IP
 * @returns {Function} Express middleware for rate limiting
 */
export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000, // 15 minutes
  max = 100, // limit each IP to 100 requests per windowMs
}: {
  windowMs?: number;
  max?: number;
} = {}) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
      status: 'error',
      message: 'Too many requests, please try again later.',
    },
    handler: (req: Request, res: Response, next: NextFunction, options) => {
      res.status(options.statusCode).json(options.message);
    },
  });
};

// Export a default configuration for CDN file serving
export const cdnRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // More generous for CDN, as file serving might need more requests
});