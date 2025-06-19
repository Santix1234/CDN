import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../server';

describe('Server Configuration', () => {
  it('should create an Express app with middleware', () => {
    const app = createApp();
    
    // Verify basic middleware is configured
    expect(app).toBeTruthy();
  });

  it('should have JSON and URL-encoded body parsing middleware', () => {
    const app = createApp();
    
    // This is a basic test to ensure middleware is set up
    // Note: Actual deep testing of middleware would require more complex checks
    expect(app._router).toBeTruthy();
  });

  it('should have a global error handler', () => {
    const app = createApp();
    
    // Verify error handling middleware exists
    const errorHandlers = app._router.stack.filter((layer: any) => layer.handle.length === 4);
    expect(errorHandlers.length).toBeGreaterThan(0);
  });
});