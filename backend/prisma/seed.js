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

async function main() {
  const COUNT = Number(process.env.SEED_COUNT) || 10000;
  console.log(`Seeding ${COUNT} employees...`);

  // Clear existing data
  await prisma.compensationRecord.deleteMany();
  await prisma.employee.deleteMany();

  const BATCH = Number(process.env.SEED_BATCH) || 25;
  for (let start = 1; start <= COUNT; start += BATCH) {
    const end = Math.min(start + BATCH - 1, COUNT);

    for (let i = start; i <= end; i++) {
      const employeeCode = `E${String(i).padStart(6, '0')}`;
      const fullName = `Employee ${i}`;
      const email = `employee${i}@example.com`;
      const department = randFrom(DEPARTMENTS);
      const jobTitle = randFrom(TITLES);
      const country = randFrom(COUNTRIES);
      const hireDate = randDate(new Date(2015, 0, 1), new Date());

      const emp = await prisma.employee.create({
        data: {
          employeeCode,
          fullName,
          email,
          department,
          jobTitle,
          country,
          hireDate,
        },
      });

      const annual = (30000 + Math.random() * 120000).toFixed(2);
      await prisma.compensationRecord.create({
        data: {
          employeeId: emp.id,
          annualBase: annual,
          currency: 'USD',
          effectiveFrom: randDate(new Date(2018, 0, 1), new Date()),
        },
      });
    }

    console.log(`Created employees ${start}..${end}`);
  }

  console.log('Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
