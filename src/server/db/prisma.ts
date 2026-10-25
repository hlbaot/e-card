import "server-only";
import { Prisma, PrismaClient } from "@prisma/client";
import { env } from "@/server/config/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaSchema: string | undefined;
};

// Hot reload phải thay cả client nếu model thay đổi, không tái dùng instance từ schema cũ.
const schema = JSON.stringify(Prisma.dmmf.datamodel);
const cached = globalForPrisma.prismaSchema === schema ? globalForPrisma.prisma : undefined;
if (!cached && globalForPrisma.prisma) {
  void globalForPrisma.prisma.$disconnect().catch(() => {});
}

export const prisma =
  cached ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaSchema = schema;
}
