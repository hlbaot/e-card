import { create } from "zustand";

// Chỉ thông báo các view đọc lại API, không lưu dữ liệu nhân viên vào localStorage.
export const useEmployeeStore = create<{ revision: number; invalidate: () => void }>((set) => ({
  revision: 0,
  invalidate: () => set((state) => ({ revision: state.revision + 1 })),
}));
