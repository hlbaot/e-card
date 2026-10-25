import "server-only";
import type { NextRequest } from "next/server";
import { AuthError } from "@/server/auth/service";
import { authJson } from "@/server/auth/http";
import { adminHandler, readBody } from "./http";

export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
// Đối chiếu cả MIME lẫn chữ ký file; không nhận SVG/HTML đổi đuôi thành ảnh.
export function validateAvatar(type: string, bytes: Uint8Array) {
  if (!bytes.length) throw new AuthError("File ảnh đang trống.", 400);
  if (bytes.length > MAX_AVATAR_BYTES) throw new AuthError("Ảnh tối đa 2 MB.", 413);
  const buffer = Buffer.from(bytes);
  const valid = type === "image/jpeg" ? buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
    : type === "image/png" ? buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    : type === "image/webp" ? buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP"
    : false;
  if (!valid) throw new AuthError("Chỉ nhận ảnh JPG, PNG hoặc WebP hợp lệ.", 415);
}
export const avatarStorage = {
  async upload(file: File): Promise<string> {
    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();
    if (!cloud || !/^[a-zA-Z0-9_-]+$/.test(cloud) || !preset) throw new AuthError("Chưa cấu hình dịch vụ lưu ảnh.", 503);
    const data = new FormData();
    data.set("file", file);
    data.set("upload_preset", preset);
    // Preset Cloudinary hiện có cần bật unsigned và giới hạn định dạng/dung lượng tương ứng.
    let response: Response;
    try {
      response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
        method: "POST", body: data, signal: AbortSignal.timeout(20000),
      });
    } catch {
      throw new AuthError("Không thể kết nối dịch vụ ảnh. Vui lòng thử lại.", 503);
    }
    if (!response.ok) {
      // Chỉ ánh xạ các lỗi đã biết; không trả nguyên thông báo/cấu hình từ provider.
      const failure = await response.json().catch(() => null) as { error?: { message?: unknown } } | null;
      const message = typeof failure?.error?.message === "string" ? failure.error.message : "";
      if (/upload preset not found/i.test(message)) {
        throw new AuthError("Upload preset Cloudinary không tồn tại. Vui lòng kiểm tra NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET và cloud đang sử dụng.", 503);
      }
      if (/unsigned.*(?:allowed|enabled)|(?:allowed|enabled).*unsigned|whitelisted.*unsigned/i.test(message)) {
        throw new AuthError("Upload preset Cloudinary chưa bật chế độ Unsigned.", 503);
      }
      if (/file size too large|maximum.*(?:file size|bytes)/i.test(message)) {
        throw new AuthError("Ảnh vượt giới hạn dung lượng của Cloudinary. Chọn ảnh nhỏ hơn hoặc kiểm tra giới hạn preset.", 413);
      }
      throw new AuthError("Không thể lưu ảnh. Vui lòng thử lại.", 503);
    }
    const result = await response.json() as { secure_url?: string; format?: string; resource_type?: string };
    if (!result.secure_url || result.resource_type !== "image" || !["jpg", "jpeg", "png", "webp"].includes(result.format ?? "")) throw new AuthError("Dịch vụ lưu ảnh trả phản hồi không hợp lệ.", 503);
    const url = new URL(result.secure_url);
    if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com") throw new AuthError("URL ảnh không hợp lệ.", 503);
    return result.secure_url;
  },
};
export const uploadAvatar = (request: NextRequest) => adminHandler(request, async () => {
  const type = request.headers.get("content-type") ?? "";
  if (!type.startsWith("multipart/form-data;")) throw new AuthError("Yêu cầu phải là multipart/form-data.", 415);
  // Giới hạn cả request trước khi parse multipart để không nạp file lớn vào bộ nhớ.
  const bytes = await readBody(request, MAX_AVATAR_BYTES + 64 * 1024);
  let form: FormData;
  try { form = await new Request("http://localhost/upload", { method: "POST", headers: { "content-type": type }, body: bytes }).formData(); }
  catch { throw new AuthError("Dữ liệu upload không hợp lệ.", 400); }
  const files = form.getAll("file");
  if (files.length !== 1 || !(files[0] instanceof File) || [...form.keys()].some((key) => key !== "file")) throw new AuthError("Vui lòng gửi một ảnh trong trường file.", 400);
  const file = files[0];
  validateAvatar(file.type, new Uint8Array(await file.arrayBuffer()));
  return authJson({ url: await avatarStorage.upload(file) }, 201);
});
