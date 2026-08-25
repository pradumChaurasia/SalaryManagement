const request = require('supertest');
const { app, prisma } = require('../src/app');

describe('Compensation API', () => {
  let employee;
  let createdComp;

  beforeAll(async () => {
    employee = await prisma.employee.create({ data: {
      employeeCode: `C${Date.now()}`,
      fullName: 'Comp Test',
      email: `comp${Date.now()}@example.com`,
      department: 'Finance',
      jobTitle: 'Analyst',
      country: 'US',
      hireDate: new Date().toISOString(),
    }});
  });

  afterAll(async () => {
    if (createdComp && createdComp.id) {
      try { await prisma.compensationRecord.delete({ where: { id: createdComp.id } }); } catch (e) {}
    }
    if (employee && employee.id) {
      try { await prisma.employee.delete({ where: { id: employee.id } }); } catch (e) {}
    }
    await prisma.$disconnect();
  });

  test('POST /compensations -> create', async () => {
    const payload = {
      employeeId: employee.id,
      annualBase: 50000.00,
      currency: 'USD',
      effectiveFrom: new Date().toISOString(),
    };

    const res = await request(app).post('/compensations').send(payload).expect(201);
    createdComp = res.body;
    expect(createdComp).toHaveProperty('id');
    expect(createdComp.employeeId).toBe(employee.id);
  });

  test('GET /compensations?employeeId= -> list', async () => {
    const res = await request(app).get(`/compensations?employeeId=${employee.id}&limit=1`).expect(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  test('GET /compensations/:id -> fetch', async () => {
    const res = await request(app).get(`/compensations/${createdComp.id}`).expect(200);
    expect(res.body.id).toBe(createdComp.id);
  });
});
