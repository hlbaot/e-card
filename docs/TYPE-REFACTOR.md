# Báo cáo refactor shared types

## Phạm vi

- `api.ts`: kiểu response JSON dùng tại API client và kiểm tra response server.
- `auth.ts`: AuthUser, LoginInput, ChangePasswordInput.
- `card.ts`: kiểu theme, template, decoration; không thay đổi các union hiện có.
- `employee.ts`: Employee, Office, PublicFields, EmployeeInput, EmployeeStats; giữ nguyên helper và hằng số có sẵn.
- `index.ts`: re-export kiểu bằng `export type`; export rõ hai giá trị runtime hiện có.
- Consumer dùng `@/shared/types`; import chỉ chứa kiểu dùng `import type`. Schema Zod vẫn ở server.
- Giữ nguyên `aos.d.ts`. Các type props, repository, Prisma record và `EmployeeCreate`/`EmployeePatch` chỉ dùng phía server vẫn ở module nội bộ. Kiểu DTO output Zod này có phạm vi khác `EmployeeInput` của form, không gộp chúng để tránh đổi hợp đồng kiểu.

## Dữ liệu thật

Đã tìm import `src/server/employees.ts` trước khi xóa: trang chủ, trang card theo slug và sitemap. File này vốn chỉ chuyển tiếp service, không còn chứa dữ liệu mock. Ba nơi gọi nay dùng trực tiếp `publicCards.list()` / `publicCards.bySlug()` tại `src/server/cards/runtime.ts`, qua `cardsRepository` và Prisma. Các điều kiện hiển thị và chuẩn hóa dữ liệu giữ nguyên.

Không tìm thấy bộ dữ liệu nhân viên giả trong mã production cần chuyển sang seed. Giữ fixture test, placeholder/form trống và `dummyHash` chống khác biệt thời gian xác thực; chúng không phải nguồn dữ liệu nhân viên. Không chạy seed, migration hay thay đổi DB.

Các thay đổi workspace có sẵn trước refactor được giữ nguyên, bao gồm cache/ISR trang chủ và các sửa giao diện trước đó; không coi chúng là thay đổi logic của refactor này.

## Kiểm tra đã chạy

| Lệnh | Kết quả |
| --- | --- |
| `pnpm tsc --noEmit` | Exit 0, không lỗi |
| `pnpm lint` | Exit 0, 0 lỗi, 1 warning có sẵn trước refactor |
| `pnpm test` | Smoke PASS; auth 12/12, cards 2/2, admin 5/5; tổng 19 test đạt, không fail/skip |
| `git diff --check` | Không lỗi whitespace |

Warning giữ nguyên ngoài phạm vi: `src/shared/types/employee.ts:43`, `_employee` chưa dùng (`@typescript-eslint/no-unused-vars`). Trước refactor cùng warning ở dòng 66. Chưa chạy build hoặc kết nối DB thật vì không nằm trong các bước kiểm tra yêu cầu.

## File đã tạo

- `src/shared/types/card.ts`
- `src/shared/types/auth.ts`
- `src/shared/types/api.ts`
- `src/shared/types/index.ts`
- `docs/TYPE-REFACTOR.md`

## File đã xóa

- `src/server/employees.ts`

## File đã sửa import / re-export (50)

- `src/api/auth.api.ts`
- `src/api/card.api.ts`
- `src/api/client.ts`
- `src/api/employee.api.ts`
- `src/app/(public)/card/[slug]/page.tsx`
- `src/app/(public)/page.tsx`
- `src/app/sitemap.ts`
- `src/client/components/admin/AdminCardItem.tsx`
- `src/client/components/admin/EmployeeForm.tsx`
- `src/client/components/admin/EmployeeTable.tsx`
- `src/client/components/admin/LivePreviewPanel.tsx`
- `src/client/components/admin/PreviewModal.tsx`
- `src/client/components/admin/ThemeCustomizer.tsx`
- `src/client/components/admin/dashboard/TeamRowCard.tsx`
- `src/client/components/admin/dashboard/TeamTable.tsx`
- `src/client/components/card/ActionGrid.tsx`
- `src/client/components/card/CardActions.tsx`
- `src/client/components/card/CardBackground.tsx`
- `src/client/components/card/CardDecorations.tsx`
- `src/client/components/card/CardListItem.tsx`
- `src/client/components/card/ContactList.tsx`
- `src/client/components/card/DecorIllustration.tsx`
- `src/client/components/card/ECard.tsx`
- `src/client/components/card/ProfileDecorations.tsx`
- `src/client/components/card/ProfileInfo.tsx`
- `src/client/components/card/ProfilePage.tsx`
- `src/client/components/card/ProfileView.tsx`
- `src/client/hooks/useEmployeeStats.ts`
- `src/client/hooks/useEmployees.ts`
- `src/client/store/auth.store.ts`
- `src/config/card-themes.ts`
- `src/config/theme-options.ts`
- `src/server/admin/controller.ts`
- `src/server/admin/repository.ts`
- `src/server/admin/upload.ts`
- `src/server/auth/controller.ts`
- `src/server/auth/dto.ts`
- `src/server/auth/http.ts`
- `src/server/cards/controller.ts`
- `src/server/cards/service.ts`
- `src/shared/constants/card-themes.ts`
- `src/shared/types/employee.ts`
- `src/shared/utils/decor-layout.ts`
- `src/shared/utils/localize.ts`
- `src/shared/utils/migrate-theme.ts`
- `src/shared/utils/vcard.ts`
- `src/views/AdminEmployeeEditView.tsx`
- `src/views/CardView.tsx`
- `src/views/HomeView.tsx`
- `tests/admin-client.test.ts`

## Tài liệu đã sửa

- `README.md`: cập nhật đường dẫn service thay cho file đã xóa; không chỉnh chính sách indexability.
