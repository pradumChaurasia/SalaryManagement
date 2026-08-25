# AI usage (assessment artifact)

This project is built with agentic AI (Cursor) under human direction. AI accelerates boilerplate; humans own product cuts, money rules, and review.

## What I decided (not the model)

- Product is compensation directory + insights, **not** payroll
- MySQL over MongoDB
- Out of scope list (tax, SSO, live FX, Excel import, etc.)
- Inactive employees excluded from payroll totals
- Reporting currency USD with seeded FX
- Phase-by-phase commits so history shows evolution
- Deploy treated as a **final** readiness step, not a blocker for core features

## How AI is used

- Draft requirements and design from the assessment brief, then edited for judgment
- Later: scaffold Express/Prisma/React, seed script, first-pass tests
- Later: UI tables, forms, insight charts

## What AI must not invent

- Floating-point salary storage
- Loading 10k rows into the client
- Mongo collections “because JSON”
- Microservices, Redis, or Kafka for this scale
- Live FX or tax engines
- Scope creep (benefits, approvals, employee portal)

## Review bar before each commit

- Invariants still hold (one current salary, DECIMAL money)
- Tests still describe real rules
- UI still paginates and talks only to the API
- Commit message matches the phase (docs vs schema vs API vs UI)
