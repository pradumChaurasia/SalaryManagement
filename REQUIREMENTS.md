# ACME Salary Management — Requirements

## Goal

Replace Excel as the system of record for current employee compensation. The product should let an HR manager search employees, review current pay and salary history, update compensation records, and understand pay patterns across the organization without exporting spreadsheets.

This is a compensation administration and analysis product, not payroll.

## Scope and core features

### 1. Employee directory
- Search and filter by employee name, code, country, department, job title, and status
- Server-side pagination so the UI does not load all 10,000 employees at once
- Employee detail view showing identity, current pay, and historical salary changes
- Create a new employee with an initial salary
- Update identity and employment status
- Adjust salary by closing the previous current record and inserting a new one
- Soft-deactivate employees instead of hard deleting them

### 2. Compensation management
- Store annual base salary as a decimal value in MySQL
- Maintain historical salary records with effective dates
- Enforce the business rule that only one current salary record may exist per employee
- Support salary changes without losing the audit trail

### 3. Pay insights
- Headcount, total, average, and median annual base salary
- Reporting in USD as the standard currency for this MVP
- Breakdown by country, department, job title, and currency
- Use seeded FX rates rather than live market APIs
- Exclude inactive employees from payroll totals while still keeping them visible in the directory

### 4. Data and quality
- Seed a database with ~10,000 employees across multiple countries, departments, and titles
- Run tests for money rules, unique employee codes, effective dates, and aggregate calculations
- Keep the app fast and reliable on a single MySQL-backed service model

## What we are deliberately leaving out

The following are intentionally out of scope for this MVP because they expand the product into a different class of system:

- Payroll, tax, payslips, and statutory deductions
- Bonus, equity, benefits, and other compensation components beyond annual base salary
- Employee self-service, manager access, and approval workflows
- Multi-tenant or enterprise IAM systems
- Live FX APIs and real-time market data
- Excel import/export tooling
- Full audit logs and compliance controls
- Distributed systems, microservices, and large-scale data platform requirements

## Reasoning

This assessment is designed to validate a focused HR compensation tool: manage salary data, preserve history, and summarize pay patterns. The product should solve the real problem with a clear data model and small number of user roles, rather than broadening into payroll operations or enterprise identity infrastructure.

The deliberate exclusions keep the project realistic, testable, and buildable within the assessment scope while preserving the core business value: reliable employee compensation records and actionable pay insight across a large workforce.

## Success criteria

- HR can find and update employees quickly using search, filters, and paginated results
- Salary history and current pay are preserved correctly
- Insights over ~10,000 active employees are computed in SQL, not in the browser
- Core business rules are enforced through tests and validation
- The product works locally and is ready for deployment as a final readiness phase
