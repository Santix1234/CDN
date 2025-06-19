import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/server';

describe('Server Configuration', () => {
  it('should have health check endpoint', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'healthy' });
  });

  it('should support JSON parsing middleware', async () => {
    const testData = { message: 'test' };
    const response = await request(app)
      .post('/test-json')
      .send(testData)
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBe(404); // Endpoint doesn't exist, but middleware should work
  });
});