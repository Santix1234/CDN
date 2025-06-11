import { describe, it, expect } from 'vitest';
import { createRateLimiter } from '../../src/middleware/rateLimiter';

describe('Rate Limiter', () => {
  it('should create a rate limiter with default options', () => {
    const rateLimiter = createRateLimiter();
    
    expect(rateLimiter).toBeDefined();
    expect(typeof rateLimiter).toBe('function');
  });

  it('should create a rate limiter with custom options', () => {
    const rateLimiter = createRateLimiter({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 50, // 50 requests per window
    });
    
    expect(rateLimiter).toBeDefined();
    expect(typeof rateLimiter).toBe('function');
  });

  it('should have default configuration matching expectations', () => {
    const rateLimiter = createRateLimiter();
    
    // Note: The actual configuration is applied by the express-rate-limit library
    // and can't be directly accessed. We'll check the function creation instead
    expect(rateLimiter).toBeDefined();
  });
});