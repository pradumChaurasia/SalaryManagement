# ACME Salary Management — Requirements

**Product:** Web software for the HR manager to maintain employee compensation and answer “how does the org pay people?”  
**Scale:** ~10,000 employees, multiple countries  
**Persona:** HR Manager (sole operator for this version)  
**Status:** MVP / assessment scope

## Goal

Replace Excel as the system of record for **current employee compensation**. HR should search and update salaries, keep a simple raise history, and see org-level pay breakdowns (country, department, job title, currency) without exporting to spreadsheets.

This is **compensation administration and insight**, not payroll.

## In scope

1. **Employee compensation directory**
   - Search and filter: name, employee code, country, department, job title, employment status
   - Paginated list (never load all 10,000 rows in the browser)
   - Employee detail: identity, current pay, salary history
   - Create employee with an initial salary
   - Update identity fields
   - Adjust salary (closes the previous current record, inserts a new one)
   - Soft-deactivate (`inactive`); no hard delete of people who were paid

2. **Pay insights**
   - Headcount, total / average / median annual base, in a **reporting currency (USD)**
   - Breakdowns by country, department, job title, currency
   - Conversion via **seeded FX rates** (not live market APIs)
   - Active employees only in payroll totals

3. **Seed**
   - Deterministic script: 10,000 employees across several countries, departments, and currencies

4. **Access**
   - Single HR login so the demo is not an open database. Not a full IAM product.

5. **Quality**
   - Unit/API tests for money rules, unique employee codes, salary effective dates, and insight aggregates

## Out of scope (deliberate)

| Left out | Reason |
|---|---|
| Payroll, tax, payslips, statutory deductions | Different product; compliance-heavy; not needed to manage salary *data* |
| Full bonus / equity / benefits models | Scope explosion; MVP stores **annual base** only |
| Employee or manager self-service | Persona is HR only |
| Multi-tenant, SSO, RBAC, approval workflows | One org, one role |
| Live FX APIs | Flaky, non-reproducible numbers; HR needs stable reports |
| Excel import/export | Seed + UI CRUD prove the model; import is a follow-up |
| Full audit log | Valuable in production HR; not required to prove the product |
| Real-time collaboration | Single user |
| MongoDB | Compensation is relational (invariants, history, `GROUP BY`); MySQL fits |

**Rule:** a feature ships only if it mutates compensation data or answers a pay question.

## Success criteria

- HR can find any employee via search + filters with server-side pagination
- Insights over all ~10k active employees run as SQL aggregates, not in the browser
- Seed is idempotent and deterministic
- Tests cover core domain rules and are fast/deterministic
- Incremental git history; this document committed before application code

## Non-goals for this assessment

Deploy is listed under **Readiness** in the brief (“fully functional deployed software” + video demo). Implementation order treats deploy as a **last** phase after a working local app. Local Docker (MySQL + API + UI) is the primary development target.

## Open decisions (frozen for MVP)

- Reporting currency: **USD**
- Inactive employees: **excluded** from insight totals; still visible in the directory
- Amounts: **annual base salary**, `DECIMAL` in MySQL, never binary floating point for persistence
