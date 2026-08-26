const express = require('express');

function router(prisma) {
  const r = express.Router();

  // List with pagination
  r.get('/', async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const q = (req.query.q || '').trim();

    const where = {};
    if (q) {
      where.OR = [
        { fullName: { contains: q, mode: 'insensitive' } },
        { jobTitle: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.employee.findMany({ where, skip, take: limit, orderBy: { fullName: 'asc' } }),
      prisma.employee.count({ where }),
    ]);

    res.json({ page, limit, total, items });
  });

  r.get('/:id', async (req, res) => {
    const { id } = req.params;
    const item = await prisma.employee.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ error: 'not found' });
    res.json(item);
  });

  r.post('/', async (req, res) => {
    const data = req.body;
    try {
      const created = await prisma.employee.create({ data });
      res.status(201).json(created);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  r.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const updated = await prisma.employee.update({ where: { id }, data: req.body });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  r.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.employee.delete({ where: { id } });
      res.status(204).end();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return r;
}

module.exports = router;
