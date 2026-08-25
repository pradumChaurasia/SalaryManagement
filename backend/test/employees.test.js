const request = require('supertest');
const { app, prisma } = require('../src/app');

describe('Employee API', () => {
  let created;

  afterAll(async () => {
    if (created && created.id) {
      try { await prisma.employee.delete({ where: { id: created.id } }); } catch (e) {}
    }
    await prisma.$disconnect();
  });

  test('POST /employees -> create', async () => {
    const payload = {
      employeeCode: `T${Date.now()}`,
      fullName: 'Test User',
      email: `test${Date.now()}@example.com`,
      department: 'QA',
      jobTitle: 'Tester',
      country: 'US',
      hireDate: new Date().toISOString(),
    };

    const res = await request(app).post('/employees').send(payload).expect(201);
    created = res.body;
    expect(created).toHaveProperty('id');
    expect(created.fullName).toBe('Test User');
  });

  test('GET /employees -> list', async () => {
    const res = await request(app).get('/employees?limit=1').expect(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  test('GET /employees/:id -> fetch', async () => {
    const res = await request(app).get(`/employees/${created.id}`).expect(200);
    expect(res.body.id).toBe(created.id);
  });

  test('PUT /employees/:id -> update', async () => {
    const res = await request(app).put(`/employees/${created.id}`).send({ jobTitle: 'Senior Tester' }).expect(200);
    expect(res.body.jobTitle).toBe('Senior Tester');
  });
});
