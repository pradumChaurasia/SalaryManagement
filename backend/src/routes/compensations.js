const express = require('express');

function router(prisma) {
  const r = express.Router();

  // List compensations with optional employeeId filter
  r.get('/', async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const where = {};
    if (req.query.employeeId) where.employeeId = req.query.employeeId;

    const [items, total] = await Promise.all([
      prisma.compensationRecord.findMany({ where, skip, take: limit, orderBy: { effectiveFrom: 'desc' } }),
      prisma.compensationRecord.count({ where }),
    ]);
    res.json({ page, limit, total, items });
  });

  r.post('/', async (req, res) => {
    const data = req.body;
    try {
      const normalized = { ...data };
      if (normalized.effectiveFrom && typeof normalized.effectiveFrom === 'string' && normalized.effectiveFrom.length === 10) {
        normalized.effectiveFrom = new Date(`${normalized.effectiveFrom}T12:00:00Z`).toISOString();
      }

      const created = await prisma.compensationRecord.create({ data: normalized });
      res.status(201).json(created);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  r.get('/:id', async (req, res) => {
    const { id } = req.params;
    const item = await prisma.compensationRecord.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ error: 'not found' });
    res.json(item);
  });

  r.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const updated = await prisma.compensationRecord.update({ where: { id }, data: req.body });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  r.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.compensationRecord.delete({ where: { id } });
      res.status(204).end();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return r;
}

module.exports = router;
