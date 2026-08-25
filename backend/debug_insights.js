const request = require('supertest');
const { app, prisma } = require('./src/app');

async function run() {
  const res = await request(app).get('/insights/compensation/by-department');
  console.log('status', res.status);
  console.log('body', res.body);
  await prisma.$disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
