import "server-only";
import { adminEmployeesRepository } from "./repository";
import { createAdminEmployeesService } from "./service";
export const adminEmployees = createAdminEmployeesService(adminEmployeesRepository);
