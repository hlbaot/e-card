# API quản trị nhân viên

URL có tiền tố `/api`, thống nhất với các endpoint auth/public hiện có. Mọi route dùng `adminHandler` (vai trò JwtAuthGuard): kiểm tra access JWT, hạn token và phiên trong DB. Cookie `ecard_access` được trình duyệt gửi tự động. POST/PATCH/DELETE phải có Origin hợp lệ; không chỉ dựa vào AuthGuard phía FE.

| Method | Path | Response |
| --- | --- | --- |
| GET | `/api/admin/employees` | `{ employees: [...] }`, gồm active/inactive, loại bản đã xóa |
| GET | `/api/admin/employees/:id` | `{ employee: {...} }` cho form sửa |
| POST | `/api/admin/employees` | `201 { employee: {...} }` |
| PATCH | `/api/admin/employees/:id` | `{ employee: {...} }` |
| PATCH | `/api/admin/employees/:id/active` | `{ employee: {...} }`, đảo isActive, không cần body |
| DELETE | `/api/admin/employees/:id` | `{ success: true }`, đặt deletedAt và isActive=false |
| POST | `/api/admin/uploads/avatar` | `201 { url: "https://..." }` |
| GET | `/api/admin/stats` | `{ total, active, inactive }`, loại bản đã xóa |

## Tạo và sửa nhân viên

Body tạo mới theo kiểu `EmployeeInput` của FE:

```json
{
  "fullName": "Tên nhân viên",
  "position": "Chức vụ",
  "company": "Công ty",
  "companyShort": "Tên viết tắt",
  "email": "employee@example.com",
  "phone": "0900000000",
  "zalo": "",
  "website": "example.com",
  "avatarUrl": "",
  "slogan": "",
  "isActive": true,
  "allowIndexing": false,
  "offices": [{ "label": "Trụ sở", "address": "Địa chỉ" }],
  "theme": {
    "templateId": "bubble-blue",
    "backgroundId": "sky-soft",
    "primaryColor": "#0F4C75",
    "avatarSize": "lg",
    "avatarShape": "circle",
    "buttonStyle": "soft",
    "decor": [],
    "shapes": {},
    "showDecor": true,
    "decorOpacity": 65
  }
}
```

PATCH nhận một hoặc nhiều trường trên; trường không gửi được giữ nguyên. Nếu gửi offices thì thay toàn bộ mảng (tối đa 20 văn phòng). Nếu gửi theme thì gửi đủ cấu hình và thay toàn bộ theme trong cùng transaction với employee. offices được lưu dạng JSONB theo schema hiện có. Không cần migration mới.

Server tự sinh slug khi tạo mới, retry với hậu tố ngẫu nhiên nếu trùng unique constraint, kể cả khi có request đồng thời. Slug tối đa 120 ký tự và không tái sử dụng slug của bản đã xóa mềm. PATCH không nhận id, slug, createdAt, updatedAt hoặc deletedAt. Nên URL QR cũ vẫn giữ nguyên khi đổi tên.

Hệ thống hiện công khai toàn bộ trường liên hệ. publicFields có thể bỏ qua hoặc gửi tất cả true để tương thích form; không hỗ trợ ẩn từng trường. Email có thể là chuỗi rỗng, các trường liên hệ khác cũng cho phép chuỗi rỗng. avatarUrl chỉ nhận HTTPS hoặc đường dẫn /images/, không lưu base64/data URL.

Response dùng camelCase và `Cache-Control: no-store`. ID sai định dạng trả 400; không tồn tại/đã xóa trả 404. JWT thiếu/sai/hết hạn/revoke trả 401; sai Origin trả 403. JSON hoặc DTO sai trả 400, body lớn hơn 64 KiB trả 413, sai content-type trả 415. Lỗi DB trả 503 với thông báo chung, không lộ lỗi nội bộ.

## Upload avatar

Gửi multipart/form-data với đúng một trường `file`; chỉ nhận JPG, PNG, WebP từ 1 byte đến 2 MiB. Kiểm tra MIME và chữ ký file tại server trước khi chuyển Cloudinary; Cloudinary giải mã/kiểm tra ảnh. Giới hạn request multipart là 2 MiB + 64 KiB, kể cả request không gửi Content-Length. SVG không được hỗ trợ.

Ứng dụng dùng cấu hình Cloudinary đã có: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` và `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`. Preset cần bật unsigned, giới hạn allowed formats là jpg/png/webp và max file size 2097152; đây là cơ chế upload preset theo [Cloudinary Upload API](https://cloudinary.com/documentation/image_upload_api_reference#unsigned_upload_syntax). Khi cấu hình thiếu/sai hoặc Cloudinary lỗi thì API trả 503; không fallback về base64 hoặc file local. Timeout dịch vụ ảnh là 20 giây. Upload xong mới gán URL vào form; chỉ khi lưu form mới gắn ảnh với nhân viên.

## Frontend và kiểm tra

Danh sách, form sửa theo ID và dashboard đọc các API tương ứng. Store chỉ giữ revision để báo các view tải lại sau khi ghi, không persist dữ liệu nhân viên. localStorage cũ không được đọc hoặc tự nhập vào DB. Dữ liệu cũ chỉ có trong localStorage chưa được chuyển tự động. Các lỗi tải API được hiển thị ở view; tránh dùng danh sách rỗng để che lỗi kết nối.

`pnpm test:admin` kiểm tra DTO, service, route guard/CSRF, trùng slug, giữ slug khi sửa, ẩn/xóa và thống kê, multipart/MIME/size, lỗi Cloudinary và HTTP client. Test dùng repository/provider cô lập, không tạo dữ liệu mẫu trong DB hoặc upload asset thật. `pnpm test` chạy cùng các test auth/public và smoke giao diện.
