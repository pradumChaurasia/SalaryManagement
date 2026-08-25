const request = require('supertest');
const { app, prisma } = require('./src/app');

async function run() {
  const payload = {
    employeeCode: `T${Date.now()}`,
    fullName: 'Debug User',
    email: `debug${Date.now()}@example.com`,
    department: 'QA',
    jobTitle: 'Tester',
    country: 'US',
    hireDate: new Date().toISOString(),
  };

  const res = await request(app).post('/employees').send(payload);
  console.log('status', res.status);
  console.log('body', res.body);

  // clean up if created
  if (res.body && res.body.id) {
    await prisma.employee.delete({ where: { id: res.body.id } }).catch(() => {});
  }
  await prisma.$disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
