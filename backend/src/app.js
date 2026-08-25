const express = require('express');
const employeesRouter = require('./routes/employees');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.use('/employees', employeesRouter(prisma));

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected', phase: 2 });
  } catch (err) {
    res.status(503).json({ status: 'degraded', db: 'disconnected', message: err.message });
  }
});

module.exports = { app, prisma };
