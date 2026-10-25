import "server-only";
import { prisma } from "@/server/db/prisma";
import type { AuthRepository } from "./service";

export const authRepository: AuthRepository = {
  byEmail: (email) => prisma.adminUser.findUnique({ where: { email } }),
  byId: (id) => prisma.adminUser.findUnique({ where: { id } }),
  byRefreshHash: (refreshTokenHash) => prisma.adminUser.findFirst({ where: { refreshTokenHash } }),
  async startSession(id, refreshTokenHash, refreshExpiresAt) {
    await prisma.adminUser.update({ where: { id }, data: { refreshTokenHash, refreshExpiresAt } });
  },
  async rotateSession(id, previousHash, refreshTokenHash, refreshExpiresAt) {
    // Kiểm tra và cập nhật trong cùng một câu SQL để tránh hai request dùng lại token cũ.
    const result = await prisma.adminUser.updateMany({
      where: { id, refreshTokenHash: previousHash, refreshExpiresAt: { gt: new Date() } },
      data: { refreshTokenHash, refreshExpiresAt },
    });
    return result.count === 1;
  },
  async endSession(refreshTokenHash) {
    await prisma.adminUser.updateMany({ where: { refreshTokenHash }, data: { refreshTokenHash: null, refreshExpiresAt: null } });
  },
  async updatePassword(id, previousHash, sessionHash, passwordHash) {
    // Lưu Argon2 và thu hồi phiên trong cùng câu SQL; không lưu mật khẩu thô.
    const result = await prisma.adminUser.updateMany({
      where: { id, passwordHash: previousHash, refreshTokenHash: sessionHash, refreshExpiresAt: { gt: new Date() } },
      data: { passwordHash, refreshTokenHash: null, refreshExpiresAt: null },
    });
    return result.count === 1;
  },
};
