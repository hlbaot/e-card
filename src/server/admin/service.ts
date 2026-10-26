import { randomBytes } from "node:crypto";
import { z } from "zod";
import { AuthError } from "@/server/auth/service";
import { toPublicCard } from "@/server/cards/service";
import { slugify } from "@/shared/utils/slugify";
import type { AdminEmployeesRepository } from "./repository";
import type { EmployeeCreate, EmployeePatch } from "./dto";

const code = (error: unknown) => typeof error === "object" && error !== null && "code" in error ? error.code : null;
const missing = () => new AuthError("Không tìm thấy nhân viên.", 404);
export function employeeId(value: string) {
  if (!z.string().uuid().safeParse(value).success) throw new AuthError("ID nhân viên không hợp lệ.", 400);
  return value;
}
export function createAdminEmployeesService(repository: AdminEmployeesRepository) {
  return {
    async list() { return (await repository.list()).map(toPublicCard); },
    async listVersion() {
      if (repository.listVersion) {
        const v = await repository.listVersion();
        return {
          count: v.count,
          maxUpdatedAt: v.maxUpdatedAt ? v.maxUpdatedAt.toISOString() : null,
        };
      }
      const items = await repository.list();
      let maxMs = -1;
      for (const item of items) {
        const ms = item.updatedAt.getTime();
        if (ms > maxMs) maxMs = ms;
      }
      return {
        count: items.length,
        maxUpdatedAt: maxMs >= 0 ? new Date(maxMs).toISOString() : null,
      };
    },
    async byId(id: string) {
      const record = await repository.byId(employeeId(id));
      if (!record) throw missing();
      return toPublicCard(record);
    },
    async byIdVersion(id: string) {
      const validId = employeeId(id);
      if (repository.byIdVersion) {
        const v = await repository.byIdVersion(validId);
        if (!v) throw missing();
        return {
          id: v.id,
          updatedAt: v.updatedAt.toISOString(),
          isActive: v.isActive,
        };
      }
      const record = await repository.byId(validId);
      if (!record) throw missing();
      return {
        id: record.id,
        updatedAt: record.updatedAt.toISOString(),
        isActive: record.isActive,
      };
    },
    async create(input: EmployeeCreate) {
      const base = slugify(input.fullName).slice(0, 110) || "nhan-vien";
      // Unique constraint của DB xử lý cả trường hợp tạo trùng tên cùng lúc.
      for (let attempt = 0; attempt < 5; attempt++) {
        const slug = attempt === 0 ? base : `${base}-${randomBytes(4).toString("hex")}`;
        try { return toPublicCard(await repository.create(input, slug)); }
        catch (error) { if (code(error) !== "P2002") throw error; }
      }
      throw new AuthError("Không thể tạo slug duy nhất. Vui lòng thử lại.", 409);
    },
    async update(id: string, input: EmployeePatch) {
      try { return toPublicCard(await repository.update(employeeId(id), input)); }
      catch (error) { if (code(error) === "P2025") throw missing(); throw error; }
    },
    async toggle(id: string) {
      const record = await repository.toggle(employeeId(id));
      if (!record) throw missing();
      return toPublicCard(record);
    },
    async remove(id: string) {
      if (!await repository.remove(employeeId(id))) throw missing();
      return { success: true };
    },
    stats: () => repository.stats(),
  };
}
