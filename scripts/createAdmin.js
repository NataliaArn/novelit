const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const prisma = new PrismaClient();

async function main() {
  const email = "nataliarnandis@gmail.com";
  const username = "admin";
  const plainPassword = process.env.ADMIN_PASSWORD;

  if (!plainPassword) {
    throw new Error("ADMIN_PASSWORD no está definida en el archivo .env");
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      isAdmin: true,
    },
    create: {
      username,
      email,
      password: hashedPassword,
      isAdmin: true,
    },
  });

  console.log("Usuario admin creado:", user);
}

main()
  .catch((e) => {
    console.error("Error al crear admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
