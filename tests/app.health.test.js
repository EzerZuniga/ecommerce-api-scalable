const request = require('supertest');
const app = require('../src/app');

describe('App health and fallback routes', () => {
  it('GET /health should return ok', async () => {
    const response = await request(app).get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.timestamp).toBeDefined();
  });

  it('Unknown route should return 404', async () => {
    const response = await request(app).get('/unknown-route');

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toContain('Route not found');
  });
});
