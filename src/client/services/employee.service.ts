import { useEmployeeStore } from "@/client/store/employee.store";
import { mockEmployees } from "@/data/mock/employees";
import type { Employee } from "@/shared/types/employee";
import { uniqueSlug } from "@/shared/utils/slugify";
export type EmployeeInput = Omit<
  Employee,
  "id" | "slug" | "createdAt" | "updatedAt"
>;
const all = () => useEmployeeStore.getState().employees;
const commit = (employees: Employee[]) => {
  const previous = all();
  try {
    useEmployeeStore.getState().setEmployees(employees);
  } catch {
    try {
      useEmployeeStore.getState().setEmployees(previous);
    } catch {
      /* Keep the previous in-memory state if storage is full. */
    }
    throw new Error(
      "Không thể lưu dữ liệu. Bộ nhớ trình duyệt có thể đã đầy; hãy thử ảnh nhỏ hơn.",
    );
  }
};
export const employeeService = {
  async getAll() {
    return all();
  },
  async getBySlug(slug: string) {
    return all().find((e) => e.slug === slug);
  },
  async getById(id: string) {
    return all().find((e) => e.id === id);
  },
  async create(input: EmployeeInput) {
    const now = new Date().toISOString();
    const employee: Employee = {
      ...input,
      id: crypto.randomUUID(),
      slug: uniqueSlug(
        input.fullName,
        all().map((e) => e.slug),
      ),
      createdAt: now,
      updatedAt: now,
    };
    commit([...all(), employee]);
    return employee;
  },
  async update(id: string, input: EmployeeInput) {
    const current = all().find((e) => e.id === id);
    if (!current) throw new Error("Không tìm thấy nhân viên");
    const employee = {
      ...input,
      id: current.id,
      slug: current.slug,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    };
    commit(all().map((e) => (e.id === id ? employee : e)));
    return employee;
  },
  async remove(id: string) {
    commit(all().filter((e) => e.id !== id));
  },
  async toggleActive(id: string) {
    const current = all().find((e) => e.id === id);
    if (!current) throw new Error("Không tìm thấy nhân viên");
    return employeeService.update(id, {
      ...current,
      isActive: !current.isActive,
    });
  },
  async reset() {
    commit(structuredClone(mockEmployees));
  },
};
