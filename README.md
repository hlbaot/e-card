# E-card — Nền tảng Danh thiếp Điện tử MediaTech

Nền tảng quản trị và chia sẻ danh thiếp số (E-Card) dành cho đội ngũ **CÔNG TY CỔ PHẦN CÔNG NGHỆ TRUYỀN THÔNG QTM (QTM MediaTech)**, xây dựng trên **Next.js App Router**, **TypeScript** và **Tailwind CSS**.

---

## 1. Tính năng chính

- **Danh bạ & Trang chủ công khai (`/`)**: Giao diện dark-tech đồng bộ nhận diện `qtmmedia.vn`, tìm kiếm & lọc thành viên theo chức vụ.
- **Hồ sơ Danh thiếp số (`/card/[slug]`)**:
  - Thiết kế 1 khung hình (100dvh, không cuộn) thích ứng cả Mobile và Desktop.
  - 8 phong cách thiết kế chủ đạo (*Kết nối, Sang trọng, Tinh giản, Công nghệ, Biên tập, Cực quang, Thiên nhiên, Sáng tạo*) với hệ thống họa tiết 3 lớp (`CardDecorations`).
  - Thao tác nhanh 1 chạm: Gọi điện, Gửi thư, Nhắn Zalo, Lưu danh bạ (`.vcf` vCard 3.0), Mở Website, Chỉ đường Google Maps, Chia sẻ & Tải mã QR PNG độ phân giải cao.
- **Không gian Quản trị (`/admin`)**:
  - Bảng điều khiển Tổng quan (`/admin`), Quản lý nhân viên (`/admin/employees`), Quản lý danh thiếp số (`/admin/cards`).
  - Form Thêm/Sửa nhân viên có khung **Xem trước trực tiếp** tự động co giãn theo tỉ lệ màn hình (`ResizeObserver`) và Modal xem trước toàn màn hình (chuyển đổi chế độ Điện thoại / Máy tính).
- **Quyền riêng tư & SEO chuyên sâu**:
  - Mặc định bảo vệ thông tin cá nhân (`noindex`) cho mọi danh thiếp.
  - Quản trị viên chủ động bật/tắt lập chỉ mục Google (`allowIndexing`) và bật/tắt hiển thị từng trường nhạy cảm (`phone`, `email`, `zalo`, `website`, `offices`) đồng bộ trên giao diện, file `.vcf`, nút thao tác nhanh và dữ liệu có cấu trúc JSON-LD.

---

## 2. Cài đặt & Khởi chạy

### Database

Schema PostgreSQL mới gồm `admin_users`, `employees`, `card_themes` tại `prisma/schema.prisma`, kèm migration SQL và seed Argon2id. Xem [hướng dẫn database](prisma/README.md) để cấu hình và khởi tạo. Đăng nhập và trang public dùng API/database. CRUD quản trị và thống kê dùng `/api/admin/*`, dữ liệu lưu trong DB; upload avatar qua Cloudinary.

Yêu cầu hệ thống: **Node.js >= 20** và **pnpm**.

```bash
# 1. Cài đặt dependencies
pnpm install

# 2. Tạo file biến môi trường từ mẫu
cp .env.example .env

# 3. Chạy máy chủ phát triển (http://localhost:3000)
pnpm dev

# 4. Kiểm tra lỗi lint & build production
pnpm lint
pnpm build
pnpm start
```

### Đăng nhập quản trị

Vào `/login`, dùng email và mật khẩu được tạo bởi `pnpm db:seed` (`SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`). Không còn tài khoản đăng nhập giả lập hoặc mật khẩu cố định. Xem [API xác thực](docs/auth.md) để biết các endpoint và cấu hình token.

---

## 3. Biến môi trường (`.env.example` / `.env.local`)

| Biến môi trường | Mô tả | Giá trị mẫu |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | URL gốc của website (**không** có dấu `/` ở cuối). Dùng để sinh canonical URL, Open Graph, QR Code và `sitemap.xml`. | Dev: `http://localhost:3000`<br/>Prod: `https://connect.qtmmedia.vn` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Mã xác minh quyền sở hữu tên miền trên Google Search Console (thẻ meta `google-site-verification`). Để trống nếu chưa có. | `""` |

Mọi cấu hình chung của website và hàm tạo URL tuyệt đối `absoluteUrl(path)` được đặt tập trung tại [`src/config/site.ts`](file:///Users/baotoan/Documents/e-card/src/config/site.ts).

---

## 4. SEO & Search Console

### 4.1. Nguyên tắc bảo vệ thông tin cá nhân (Privacy-First SEO)

Danh thiếp điện tử chứa dữ liệu cá nhân nhạy cảm (SĐT, Email, Zalo, ảnh đại diện). Một khi được Google lập chỉ mục, dữ liệu có thể bị lưu cache công khai. Do đó hệ thống áp dụng cơ chế bảo vệ đa tầng:

1. **Mặc định `noindex` cho mọi danh thiếp**:
   - Trường `allowIndexing` của nhân viên mặc định là `false`.
   - Khi `allowIndexing = false`, trang `/card/[slug]` vẫn truy cập bình thường qua đường dẫn hoặc mã QR nhưng trả về `<meta name="robots" content="noindex, nofollow, nocache">`, không xuất hiện trong `/sitemap.xml`, không gắn JSON-LD và không dùng ảnh đại diện cá nhân làm ảnh Open Graph.
2. **Kiểm soát từng trường thông tin công khai (`publicFields`)**:
   - Trong mục **"Quyền riêng tư & SEO"** của form nhân viên (`EmployeeForm.tsx`), quản trị viên có thể bật/tắt riêng từng trường:
     - `phone` (Hiện số điện thoại)
     - `email` (Hiện Email)
     - `zalo` (Hiện Zalo)
     - `website` (Hiện Website)
     - `offices` (Hiện Địa chỉ)
   - Khi tắt một trường, dữ liệu đó sẽ **biến mất hoàn toàn** khỏi:
     - Giao diện trang `/card/[slug]` (`ContactList`, `ProfileView`) và khung xem trước (`ECard`)
     - Các nút hành động tương ứng (`ActionGrid`, `CardActions`)
     - File danh bạ tải về `.vcf` (`src/shared/utils/vcard.ts`)
     - Dữ liệu có cấu trúc JSON-LD (`Person` schema)
3. **Không đưa SĐT/Email vào Meta Description**:
   - Kể cả khi bật `allowIndexing = true`, thẻ `description` và `og:description` chỉ sử dụng **Họ tên, Chức vụ và Tên công ty**, tuyệt đối không chèn SĐT hay Email vào đoạn mô tả tìm kiếm.
4. **Danh thiếp ngừng hoạt động (`isActive = false`)**:
   - Trả về HTTP `404 Not Found` (`notFound()`) và tự động loại khỏi `sitemap.xml`.
5. **Kiểm soát hiển thị trên trang chủ (`/`)**:
   - File [`src/config/site.ts`](file:///Users/baotoan/Documents/e-card/src/config/site.ts) cung cấp 2 cờ `siteConfig.indexHomepage` (cho phép index trang chủ) và `siteConfig.listCardsOnHome` (bật/tắt danh sách thẻ nhân viên trên trang chủ). Danh sách thẻ trên trang chủ chỉ hiển thị Họ tên, Chức vụ và Công ty, không hiển thị SĐT/Email.

### 4.2. Cơ chế `robots.txt` và `sitemap.xml` động

- **`src/app/robots.ts`**:
  - Trên môi trường `development` hoặc `staging/preview` (`NODE_ENV !== "production"` hoặc `VERCEL_ENV !== "production"`), hệ thống trả về `Disallow: /` để ngăn bot lập chỉ mục nhầm bản thử nghiệm.
  - Trên môi trường `production`, cho phép `Allow: /` và chặn `/admin`, `/login`, `/api/`, `/_next/` (kèm HTTP Header `X-Robots-Tag: noindex, nofollow, noarchive` trong `next.config.ts`).
  - **Lưu ý quan trọng**: Không chặn `/card/` trong `robots.txt` vì Googlebot cần truy cập được URL `/card/[slug]` để đọc thẻ `<meta name="robots" content="noindex">` của từng danh thiếp.
- **`src/app/sitemap.ts`**:
  - Tự động làm mới mỗi giờ (`revalidate = 3600`).
  - Chỉ đưa vào trang chủ `/` và các đường dẫn `/card/[slug]` thỏa mãn **đồng thời** `isActive === true` và `allowIndexing === true` thông qua hàm server `getIndexableEmployees()` tại [`src/server/employees.ts`](file:///Users/baotoan/Documents/e-card/src/server/employees.ts).

### 4.3. Hướng dẫn thiết lập Google Search Console (sau khi deploy domain thật)

> **Lưu ý**: Google Search Console không thể xác minh hoặc thu thập dữ liệu từ `localhost`. Hãy thực hiện các bước sau khi đã triển khai lên tên miền chính thức (ví dụ `https://connect.qtmmedia.vn`).

1. **Thêm tài sản (Add Property)**:
   - Truy cập [Google Search Console](https://search.google.com/search-console).
   - Chọn một trong hai hình thức:
     - **Tên miền (Domain)**: Xác minh bằng bản ghi `TXT` trên DNS của tên miền.
     - **Tiền tố URL (URL Prefix)**: Nhập `https://<domain-cua-ban>` (khuyên dùng nếu muốn xác minh nhanh bằng thẻ meta HTML).
2. **Xác minh bằng thẻ Meta (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`)**:
   - Nếu chọn **Tiền tố URL** $\rightarrow$ phương thức **Thẻ HTML (HTML tag)**, sao chép chuỗi mã trong thuộc tính `content="..."`.
   - Dán mã vào biến môi trường `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` trên hosting (Vercel / VPS) và 설정 `NEXT_PUBLIC_SITE_URL=https://<domain-cua-ban>`.
   - Deploy lại ứng dụng để thẻ `<meta name="google-site-verification" content="..." />` xuất hiện trong `<head>`, sau đó bấm **Xác minh (Verify)** trên Search Console.
3. **Gửi sơ đồ trang web (Submit Sitemap)**:
   - Vào mục **Sơ đồ trang web (Sitemaps)** ở thanh bên trái.
   - Nhập `sitemap.xml` và bấm **Gửi (Submit)**.
4. **Kiểm tra URL & Yêu cầu lập chỉ mục**:
   - Trong trang quản trị `/admin/employees/[id]`, bật công tắc **"Cho phép hiện trên Google"** cho nhân viên cần công khai trên bộ máy tìm kiếm.
   - Dán đường dẫn `https://<domain>/card/<slug>` vào ô **Kiểm tra URL (URL Inspection)** trên Search Console và bấm **Yêu cầu lập chỉ mục (Request Indexing)**, đồng thời có thể kiểm tra dữ liệu `Person` + `Organization` bằng công cụ [Google Rich Results Test](https://search.google.com/test/rich-results).
5. **Quy trình gỡ nhanh một danh thiếp khỏi kết quả Google**:
   - Bước 1: Vào `/admin/employees/[id]`, tắt công tắc **"Cho phép hiện trên Google"** (`allowIndexing = false`) hoặc tắt **"Hiển thị danh thiếp công khai"** (`isActive = false`). Trang sẽ lập tức trả về `noindex` (hoặc `404`) và rút khỏi `sitemap.xml`.
   - Bước 2: Vào mục **Xóa URL (Removals)** trong Google Search Console $\rightarrow$ **Yêu cầu mới (New Request)** $\rightarrow$ nhập URL `/card/<slug>` để ẩn kết quả khỏi Google Tìm kiếm ngay lập tức trong khi chờ bot cập nhật lại.

---

## 5. Cấu trúc thư mục & Ghi chú kỹ thuật

```text
src/
├── app/
│   ├── (public)/              # Trang chủ danh bạ (/) và trang hồ sơ (/card/[slug])
│   ├── (auth)/login/          # Trang đăng nhập quản trị (/login - noindex)
│   ├── (admin)/admin/         # Không gian quản trị (/admin/* - noindex)
│   ├── layout.tsx             # Root metadata, OpenGraph, Google Verification
│   ├── opengraph-image.tsx    # Ảnh OG mặc định tạo động (1200x630)
│   ├── robots.ts              # Cấu hình robots.txt động theo môi trường
│   └── sitemap.ts             # Sitemap động chỉ gồm các thẻ cho phép index
├── config/
│   ├── site.ts                # Cấu hình siteConfig & helper absoluteUrl()
│   └── card-themes.ts         # Định nghĩa 8 mẫu thiết kế & họa tiết 3 lớp
├── server/
│   └── employees.ts           # Tầng dữ liệu phía server (getIndexableEmployees, getPublicEmployeeBySlug)
├── client/                    # Components, Hooks, Zustand Store & Services phía client
├── shared/                    # Types (Employee, PublicFields), Utils (vcard, qr, color)
└── config/theme-options.ts    # Cấu hình giao diện, không chứa dữ liệu nhân viên
```

### Ghi chú kỹ thuật
- **Nguồn dữ liệu**: Trang public đọc DB qua `src/server/cards`; CRUD quản trị dùng `src/server/admin`. Xem `docs/admin-api.md`.
- **Lưu ý về file cấu hình theme**: Dự án hiện có 2 file cấu hình theme là [`src/config/card-themes.ts`](file:///Users/baotoan/Documents/e-card/src/config/card-themes.ts) và [`src/shared/constants/card-themes.ts`](file:///Users/baotoan/Documents/e-card/src/shared/constants/card-themes.ts) đang được giữ nguyên để tương thích với các module hiện hữu.
