const request = require('supertest');
const { app, prisma } = require('../src/app');

describe('Insights API', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('GET /insights/compensation/by-department -> returns array', async () => {
    const res = await request(app).get('/insights/compensation/by-department').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('department');
      expect(res.body[0]).toHaveProperty('count');
      expect(res.body[0]).toHaveProperty('avgAnnual');
    }
  });
});
