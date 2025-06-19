import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './server';

describe('Server Configuration', () => {
    it('should have health check endpoint', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'healthy' });
    });
});