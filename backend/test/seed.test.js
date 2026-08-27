const { buildEmployeeRow, buildCompensationRows } = require('../prisma/seed');

describe('seed helpers', () => {
  test('buildEmployeeRow creates a valid employee row', () => {
    const row = buildEmployeeRow(42);

    expect(row.employeeCode).toBe('E000042');
    expect(row.fullName).toBe('Employee 42');
    expect(row.email).toBe('employee42@example.com');
    expect(row.country).toHaveLength(2);
    expect(row.department).toBeTruthy();
    expect(row.jobTitle).toBeTruthy();
  });

  test('buildCompensationRows maps employee IDs to compensation rows', () => {
    const employees = [
      { id: 'emp_1', employeeCode: 'E000001' },
      { id: 'emp_2', employeeCode: 'E000002' },
    ];

    const rows = buildCompensationRows(employees);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      employeeId: 'emp_1',
      currency: 'USD',
    });
    expect(Number(rows[0].annualBase)).toBeGreaterThan(30000);
  });
});
