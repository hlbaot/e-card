# API xác thực quản trị

API chạy Node.js, truy cập `admin_users` bằng Prisma và kiểm tra mật khẩu Argon2id. Không có đăng ký hoặc tài khoản nhân viên.

## Cấu hình

- Chạy migration và seed theo `prisma/README.md` trước khi đăng nhập.
- `DATABASE_URL`: kết nối PostgreSQL của ứng dụng.
- `JWT_SECRET`: chuỗi bí mật ngẫu nhiên ít nhất 32 byte; tạo bằng `openssl rand -hex 32`. Không dùng giá trị mẫu trên production.
- `NEXT_PUBLIC_SITE_URL`: origin thực tế của website, ví dụ `http://localhost:3000` khi dev hoặc `https://connect.example.com` khi deploy. POST xác thực yêu cầu header `Origin` khớp giá trị này để chống CSRF. Riêng development cho phép origin loopback (`localhost`, `127.0.0.1`, `[::1]`) khớp chính xác URL request, kể cả khi Next dev chuyển sang cổng 3001. Production vẫn chỉ chấp nhận origin cấu hình.
- Next.js ưu tiên `.env.local` hơn `.env`; bảo đảm không có giá trị cũ ghi đè. Prisma CLI đọc `.env`.

Không cần migration mới cho API này; dùng các cột refresh token đã có. Nếu vừa seed, mật khẩu đăng nhập là `SEED_ADMIN_PASSWORD`; biến này chỉ phục vụ seed, không dùng để xác thực runtime.

## Endpoints

| Method | URL | Dữ liệu | Kết quả |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | JSON `{ "email": "...", "password": "..." }` | `{ "user": { "id": "...", "email": "..." } }` và cookie |
| GET | `/api/auth/me` | Cookie access | Thông tin admin hiện tại |
| POST | `/api/auth/refresh` | Cookie refresh | Thay mới cả hai token và trả thông tin admin |
| POST | `/api/auth/logout` | Cookie refresh | Thu hồi phiên, xóa cookie, trả `{ "success": true }` |
| POST | `/api/auth/password` | Cookie access và JSON `{ "currentPassword": "...", "newPassword": "..." }` | Đổi mật khẩu, thu hồi phiên, xóa cookie và yêu cầu đăng nhập lại |

Đổi mật khẩu yêu cầu Origin hợp lệ, mật khẩu hiện tại đúng và mật khẩu mới có 8–1024 ký tự, khác mật khẩu hiện tại. FE kiểm tra thêm ô xác nhận khớp mật khẩu mới. Server lưu hash Argon2, cập nhật có điều kiện theo mật khẩu/phiên cũ để chỉ một yêu cầu đồng thời thành công. Không có migration mới. Giới hạn 10 lần thử đổi/tài khoản/15 phút trong từng process, reset khi đổi thành công. Lỗi input/mật khẩu cũ trả 400, phiên không hợp lệ trả 401, sai Origin trả 403, vượt giới hạn trả 429 và lỗi DB trả 503. FE giữ phiên khi đổi thất bại; thành công thì AuthGuard chuyển về login.

Token chỉ gửi qua `Set-Cookie`, không trả token/hash trong JSON hoặc lưu vào localStorage. Khi dùng Postman/curl, giữ cookie jar và gửi header `Origin` đúng domain cho POST.

- Access JWT HS256: 15 phút, kiểm tra chữ ký, issuer, audience và thời hạn. Cookie `ecard_access`: HttpOnly, SameSite=Lax, Path=/.
- Refresh token: 32 byte ngẫu nhiên, 7 ngày; database chỉ lưu SHA-256 hex. Cookie `ecard_refresh`: HttpOnly, SameSite=Lax, Path=/api/auth.
- Cả hai cookie có Secure khi `NODE_ENV=production`, do đó production cần HTTPS.
- Mỗi refresh thay token bằng `updateMany` có điều kiện theo hash cũ và thời hạn. Hai request cùng token chỉ có một request thành công. Token cũ bị từ chối; không có lịch sử token/family reuse detection trong schema một phiên hiện tại.
- JWT chứa hash định danh phiên. Mỗi lần xác thực server kiểm tra hash còn khớp database, nên đăng xuất, rotation và đăng nhập mới vô hiệu hóa access token cũ ngay. JWT không được lưu DB; việc kiểm tra phiên có truy vấn DB.
- Đăng nhập mới thay thế phiên cũ. Logout từ token cũ không thu hồi phiên mới.
- Response dùng `Cache-Control: no-store`. Lỗi xác thực trả 401, input sai 400, sai Origin 403, quá giới hạn 429, dịch vụ/database lỗi 503; không gửi lỗi database ra client.

Client khôi phục phiên qua `/me`, thử refresh khi nhận 401 và thử lại request một lần. `src/client/api/http.ts` cung cấp `apiFetch` cho các API cần đăng nhập. Refresh được gom thành một request trong cùng tab; Web Locks điều phối login/refresh/logout giữa các tab nếu trình duyệt hỗ trợ.

`/admin/*` kiểm tra phiên ở server layout và chuyển về `/login` nếu access hết hạn. Trang login tự khôi phục phiên bằng refresh cookie rồi chuyển lại admin. Không dựa vào localStorage để cấp quyền.

Các API quản trị mới phải gọi `serverAuth.currentUser()` với access cookie trước khi đọc/ghi dữ liệu; POST dùng cookie cần kiểm tra Origin. Bảo vệ layout không thay thế xác thực API.

Giới hạn login hiện là 10 lần/email/15 phút trong bộ nhớ từng process. Khi chạy nhiều instance/serverless, cấu hình thêm rate limit dùng chung ở hạ tầng để có giới hạn nhất quán.

## Kiểm tra

Response đăng nhập thành công có header `Server-Timing`: `db_lookup`, `password`, `tokens`, `db_session`, `total` (ms). Mở DevTools → Network → request `login` → Timing/Response Headers để xem. `total` chỉ đo service trên server; thời gian request còn gồm network và phần xử lý framework/biên dịch lần đầu khi chạy dev. Header không chứa thông tin đăng nhập hoặc token.

```sh
pnpm test:auth
pnpm test
pnpm build
```

Test dùng repository cô lập trong bộ nhớ, kiểm tra service, route handlers và client; không kết nối hay thay đổi database Supabase.

## Phân tầng mã nguồn

Frontend: component → `client/hooks/useAuth.ts` (điều phối phiên và store) → `client/api/auth.api.ts` (gọi HTTP). HTTP client và retry refresh ở `client/api/http.ts`; khóa phiên ở `client/auth/session-lock.ts`.

Backend: `app/api/auth/*/route.ts` (router của Next.js) → `server/auth/controller.ts` (nhận request, validate DTO, cookie, response) → `server/auth/service.ts` (nghiệp vụ mật khẩu và token) → `server/auth/repository.ts` (Prisma/database). `runtime.ts` khởi tạo service với repository và cấu hình.
