import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Initialize the Prisma Client
const prisma = new PrismaClient();

const roundsOfHashing = 10;

async function main() {
  // Create a user (if not already created)
  const passwordUser1 = await bcrypt.hash('Senha@132', roundsOfHashing);

  const user = await prisma.usuario.upsert({
    where: { email: 'sala_ais@gmail.com' },
    update: {},
    create: {
      nome: 'Sala Ais',
      username: 'sala_ais',
      email: 'canalsalaais@gmail.com',
      senha: passwordUser1,
      id_tipo_login: 2,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the Prisma Client at the end
    await prisma.$disconnect();
  });
