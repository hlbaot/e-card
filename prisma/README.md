# Database E-card

PostgreSQL, quản lý bằng Prisma. Thiết kế gồm:

- `admin_users`: tài khoản admin và hash refresh token của một phiên đăng nhập.
- `employees`: hồ sơ, slug cố định, trạng thái công khai/indexing và soft delete.
- `card_themes`: giao diện riêng cho nhân viên, quan hệ một-một, xóa cascade khi xóa cứng nhân viên.

Thông tin công ty, website và văn phòng dùng cấu hình chung QTM, không có bảng riêng. Migration có CHECK cho màu HEX và độ đậm họa tiết, NOT NULL cho danh sách họa tiết và trigger cập nhật `updated_at`.

## Khởi tạo database mới

Prisma CLI đọc `.env` ở thư mục gốc. Khai báo `DATABASE_URL`, `DIRECT_URL`, `SEED_ADMIN_EMAIL` và `SEED_ADMIN_PASSWORD` theo `.env.example`.

```sh
pnpm db:validate
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

Migration ban đầu dành cho database/schema trống. Nếu database đã có bảng từ thiết kế cũ, cần lập migration chuyển dữ liệu riêng trước khi áp dụng; không dùng reset hoặc db push để thay thế.

Seed dùng Argon2id cho mật khẩu và chỉ tạo tài khoản admin. Không tạo nhân viên hoặc danh thiếp mẫu. Chạy lại seed giữ nguyên bản ghi đã tồn tại, kể cả mật khẩu và trạng thái soft delete. Chỉ dùng một địa chỉ `SEED_ADMIN_EMAIL` để duy trì một tài khoản admin.

Khi tạo hồ sơ trong ứng dụng, tạo `employees` và `card_themes` trong cùng transaction. Slug giữ nguyên khi cập nhật và không tái sử dụng sau soft delete. Truy vấn công khai cần `is_active = true AND deleted_at IS NULL`; sitemap cần thêm `allow_indexing = true`.

Đăng nhập đã kết nối `admin_users` qua Prisma. Refresh token được rotate bằng cập nhật có điều kiện theo hash hiện tại; đăng xuất xóa cả hash lẫn thời hạn. Xem `docs/auth.md`. Trang public đọc danh thiếp từ DB. CRUD quản trị, trạng thái active, xóa mềm và thống kê dùng API/DB; xem `docs/admin-api.md`.
