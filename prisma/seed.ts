import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/argon2";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@qtmmedia.vn").trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password) throw new Error("Set SEED_ADMIN_PASSWORD before running the seed.");

  // The library defaults to Argon2id.
  const passwordHash = await hash(password);
  await prisma.$transaction(async (tx) => {
    // Reruns preserve the existing password and session.
    await tx.adminUser.upsert({
      where: { email },
      update: {},
      create: { email, passwordHash },
    });

  }, { timeout: 30000 });
  console.log(`Seed completed: admin only (existing records preserved).`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
