import "server-only";
import type { NextRequest } from "next/server";
import type { AvatarUploadResponse } from "@/shared/types";
import { AuthError } from "@/server/auth/service";
import { authJson } from "@/server/auth/http";
import { adminHandler } from "./http";

export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const PNG_MAGIC = [137, 80, 78, 71, 13, 10, 26, 10] as const;

function hasValidMagicBytes(type: string, header: Uint8Array): boolean {
  if (type === "image/jpeg") {
    return header.length >= 3 && header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  }
  if (type === "image/png") {
    return header.length >= 8 && PNG_MAGIC.every((byte, idx) => header[idx] === byte);
  }
  if (type === "image/webp") {
    return (
      header.length >= 12 &&
      header[0] === 0x52 && // R
      header[1] === 0x49 && // I
      header[2] === 0x46 && // F
      header[3] === 0x46 && // F
      header[8] === 0x57 && // W
      header[9] === 0x45 && // E
      header[10] === 0x42 && // B
      header[11] === 0x50 // P
    );
  }
  return false;
}

// Đối chiếu cả MIME lẫn chữ ký file; không nhận SVG/HTML đổi đuôi thành ảnh.
export function validateAvatar(type: string, bytes: Uint8Array) {
  if (!bytes.length) throw new AuthError("File ảnh đang trống.", 400);
  if (bytes.length > MAX_AVATAR_BYTES) throw new AuthError("Ảnh tối đa 2 MB.", 413);
  if (!ALLOWED_AVATAR_TYPES.has(type) || !hasValidMagicBytes(type, bytes.subarray(0, 12))) {
    throw new AuthError("Chỉ nhận ảnh JPG, PNG hoặc WebP hợp lệ.", 415);
  }
}

export async function validateAvatarFile(file: File) {
  if (file.size === 0) throw new AuthError("File ảnh đang trống.", 400);
  if (file.size > MAX_AVATAR_BYTES) throw new AuthError("Ảnh tối đa 2 MB.", 413);
  if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
    throw new AuthError("Chỉ nhận ảnh JPG, PNG hoặc WebP hợp lệ.", 415);
  }
  // Chỉ đọc 12 byte đầu để kiểm tra magic signature thay vì nạp toàn bộ file 2 MB vào RAM.
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (!hasValidMagicBytes(file.type, header)) {
    throw new AuthError("Chỉ nhận ảnh JPG, PNG hoặc WebP hợp lệ.", 415);
  }
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
// Parse multipart một lần trực tiếp qua request.formData() và chỉ đọc 12 byte magic header
// thay vì đọc toàn bộ body vào Uint8Array rồi tạo lại Request/FormData trong RAM.
// (Nếu về sau bổ sung CLOUDINARY_API_SECRET, có thể cấp chữ ký để client upload thẳng lên Cloudinary).
export const uploadAvatar = (request: NextRequest) => adminHandler(request, async () => {
  const type = request.headers.get("content-type") ?? "";
  if (!type.startsWith("multipart/form-data;")) throw new AuthError("Yêu cầu phải là multipart/form-data.", 415);
  if (Number(request.headers.get("content-length")) > MAX_AVATAR_BYTES + 64 * 1024) {
    throw new AuthError("Ảnh tối đa 2 MB.", 413);
  }
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    throw new AuthError("Dữ liệu upload không hợp lệ.", 400);
  }
  const files = form.getAll("file");
  if (files.length !== 1 || !(files[0] instanceof File) || [...form.keys()].some((key) => key !== "file")) {
    throw new AuthError("Vui lòng gửi một ảnh trong trường file.", 400);
  }
  const file = files[0];
  await validateAvatarFile(file);
  return authJson({ url: await avatarStorage.upload(file) } satisfies AvatarUploadResponse, 201);
});
