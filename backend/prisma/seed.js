const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const DEPARTMENTS = ['Engineering', 'HR', 'Sales', 'Finance', 'Operations', 'Legal'];
const TITLES = ['Engineer', 'Senior Engineer', 'Manager', 'Director', 'Analyst', 'Coordinator'];
const COUNTRIES = ['US', 'GB', 'IN', 'CA', 'AU'];

function randFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function buildEmployeeRow(index) {
  const employeeCode = `E${String(index).padStart(6, '0')}`;
  const fullName = `Employee ${index}`;
  const email = `employee${index}@example.com`;
  const department = randFrom(DEPARTMENTS);
  const jobTitle = randFrom(TITLES);
  const country = randFrom(COUNTRIES);
  const hireDate = randDate(new Date(2015, 0, 1), new Date());

  return {
    employeeCode,
    fullName,
    email,
    department,
    jobTitle,
    country,
    hireDate,
  };
}

function buildCompensationRows(employeeRows) {
  return employeeRows.map((employee) => ({
    employeeId: employee.id,
    annualBase: (30000 + Math.random() * 120000).toFixed(2),
    currency: 'USD',
    effectiveFrom: randDate(new Date(2018, 0, 1), new Date()),
  }));
}

async function seedEmployees({
  count = Number(process.env.SEED_COUNT) || 10000,
  batchSize = Number(process.env.SEED_BATCH) || 500,
} = {}) {
  console.log(`Seeding ${count} employees...`);

  await prisma.compensationRecord.deleteMany();
  await prisma.employee.deleteMany();

  const employeeRows = [];
  for (let i = 1; i <= count; i += 1) {
    employeeRows.push(buildEmployeeRow(i));
  }

  for (let start = 0; start < employeeRows.length; start += batchSize) {
    const batch = employeeRows.slice(start, start + batchSize);
    const end = start + batch.length;

    await prisma.employee.createMany({
      data: batch,
    });

    const createdEmployees = await prisma.employee.findMany({
      where: {
        employeeCode: {
          in: batch.map((employee) => employee.employeeCode),
        },
      },
      select: {
        id: true,
        employeeCode: true,
      },
    });

    const employeeIdMap = new Map(createdEmployees.map((employee) => [employee.employeeCode, employee.id]));
    const compensationRows = batch.map((employee) => ({
      employeeId: employeeIdMap.get(employee.employeeCode),
      annualBase: (30000 + Math.random() * 120000).toFixed(2),
      currency: 'USD',
      effectiveFrom: randDate(new Date(2018, 0, 1), new Date()),
    }));

    await prisma.compensationRecord.createMany({
      data: compensationRows,
    });

    console.log(`Created employees ${start + 1}..${end}`);
  }

  console.log('Seeding complete');
}

async function main() {
  await seedEmployees();
}

if (require.main === module) {
  main()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = {
  buildEmployeeRow,
  buildCompensationRows,
  seedEmployees,
  prisma,
};
