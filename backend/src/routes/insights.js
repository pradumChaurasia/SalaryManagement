function router(prisma) {
  const express = require('express');
  const r = express.Router();

  // GET /insights/compensation/by-department
  r.get('/compensation/by-department', async (_req, res) => {
    try {
      const rows = await prisma.$queryRaw`
        SELECT e.department AS department,
               COUNT(*) AS count,
               AVG(cr.annual_base) AS avgAnnual
        FROM employees e
        JOIN compensation_records cr ON cr.employee_id = e.id
        GROUP BY e.department
      `;
      const out = rows.map(r => ({
        department: r.department,
        count: Number(r.count),
        avgAnnual: r.avgAnnual === null ? null : Number(r.avgAnnual),
      }));
      res.json(out);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return r;
}

module.exports = router;
