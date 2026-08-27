const express = require('express');
const cors = require('cors');
const employeesRouter = require('./routes/employees');
const compensationsRouter = require('./routes/compensations');
const insightsRouter = require('./routes/insights');
const authRouter = require('./routes/auth');
const { requireAuth } = require('./middleware/auth');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
}));
app.options('*', cors());

app.use('/auth', authRouter);

// Apply auth middleware globally (it will be a no-op unless AUTH_ENABLED=true)
app.use(requireAuth);

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
