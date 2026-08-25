const express = require('express');
const cors = require('cors');
const employeesRouter = require('./routes/employees');
const compensationsRouter = require('./routes/compensations');
const insightsRouter = require('./routes/insights');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Enable CORS for all origins
app.use(cors());

app.use('/employees', employeesRouter(prisma));
app.use('/compensations', compensationsRouter(prisma));
app.use('/insights', insightsRouter(prisma));

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected', phase: 2 });
  } catch (err) {
    res.status(503).json({ status: 'degraded', db: 'disconnected', message: err.message });
  }
});

module.exports = { app, prisma };
