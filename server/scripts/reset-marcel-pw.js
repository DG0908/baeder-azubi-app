const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  const hash = await bcrypt.hash('Mw17111991!?!?', 10);
  console.log('Generated hash:', hash);

  const result = await prisma.user.update({
    where: { email: 'marcelweier@gmail.com' },
    data: { passwordHash: hash },
    select: { id: true, email: true }
  });

  console.log('Updated user:', result);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
