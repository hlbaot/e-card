# API danh thiếp public

Không cần token. URL thực tế có tiền tố `/api`, giống các API auth.

| Method | URL | Kết quả |
| --- | --- | --- |
| GET | `/api/cards` | `{ "cards": [...] }`, chỉ card active và chưa xóa mềm |
| GET | `/api/cards/:slug` | `{ "card": {...} }`, kèm `offices`, `theme`, `company`, `companyShort`, `website` |

Card bị ẩn (`isActive = false`), xóa mềm (`deletedAt != null`) hoặc không tồn tại đều trả `404` với cùng thông báo. Lỗi database trả `503`, không trả chi tiết lỗi nội bộ. GET thành công dùng ETag và `Cache-Control: public, max-age=0, must-revalidate`; `If-None-Match` khớp trả 304 không body. Response 404/lỗi vẫn `no-store`. Trang card Server Component dùng Data Cache 60 giây với tag `public-cards`, vô hiệu hóa khi admin ghi dữ liệu. Xem [kiểm tra cache](CLIENT-SERVER-CACHE.md).

JSON dùng camelCase theo kiểu `Employee` của FE. Các trường liên hệ null được đổi thành chuỗi rỗng; card chưa có theme dùng theme mặc định. DTO không chứa `deletedAt` hoặc khóa ngoại theme.

Trang chủ, `/card/[slug]` và `sitemap.ts` gọi cùng service phía server để tránh tự gọi HTTP về chính ứng dụng. Các trang public đọc DB động để thay đổi active/xóa có hiệu lực ngay, không dùng localStorage hoặc mock. Trang quản trị dùng `/api/admin/*` để đọc/ghi cùng DB, xem `docs/admin-api.md`.

## Cơ sở dữ liệu

Migration `20261025093000_public_card_details` bổ sung company, company_short, website và offices (mảng JSON `{ label, address }`) vào employees. Chạy `pnpm db:migrate` trước khi dùng code mới. Seed chỉ tạo admin, không tạo card mẫu; dữ liệu card cần nhập riêng.

## Kiểm tra

`pnpm test:cards` kiểm tra service và route với repository cô lập, không truy cập DB ngoài. Bao gồm lọc active/xóa, chi tiết company/offices/theme, theme mặc định, HTTP 404 và lỗi 503 không lộ thông tin.
