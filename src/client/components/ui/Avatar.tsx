"use client";
import Image from "next/image";
import { useState } from "react";
import { contrastText } from "@/shared/utils/color";
import { cn } from "@/shared/utils/cn";

const CLOUDINARY_UPLOAD_SEGMENT = "/image/upload/";

export function transformCloudinaryAvatar(src: string, size: number): {
  url: string;
  isTransformedCloudinary: boolean;
} {
  if (!src) return { url: "", isTransformedCloudinary: false };
  try {
    const parsed = new URL(src);
    if (
      parsed.protocol === "https:" &&
      parsed.hostname === "res.cloudinary.com" &&
      parsed.pathname.includes(CLOUDINARY_UPLOAD_SEGMENT)
    ) {
      const idx = parsed.pathname.indexOf(CLOUDINARY_UPLOAD_SEGMENT);
      const prefix = parsed.pathname.slice(0, idx + CLOUDINARY_UPLOAD_SEGMENT.length);
      const rest = parsed.pathname.slice(idx + CLOUDINARY_UPLOAD_SEGMENT.length);
      const firstSegment = rest.split("/")[0] ?? "";
      // Nếu URL đã có sẵn tham số transform (w_, h_, c_, f_, q_...) thì giữ nguyên
      if (/^(?:[a-z]{1,3}_[^/]+,?)+$/i.test(firstSegment)) {
        return { url: src, isTransformedCloudinary: true };
      }
      const targetPx = Math.max(32, Math.round(size * 2));
      const transform = `w_${targetPx},h_${targetPx},c_fill,g_face,q_auto,f_auto`;
      parsed.pathname = `${prefix}${transform}/${rest}`;
      return { url: parsed.toString(), isTransformedCloudinary: true };
    }
  } catch {
    // Đường dẫn nội bộ (/images/...) hoặc URL không hợp lệ: giữ nguyên
  }
  return { url: src, isTransformedCloudinary: false };
}

export function Avatar({
  name,
  src,
  color = "#0F4C75",
  size = 64,
  rounded = false,
  priority,
}: {
  name: string;
  src: string;
  color?: string;
  size?: number;
  rounded?: boolean;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState("");
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((n) => n[0])
    .join("")
    .toLocaleUpperCase("vi");
  const { url: resolvedSrc, isTransformedCloudinary } = transformCloudinaryAvatar(src, size);
  const pixelSize = Math.max(32, Math.round(size * 2));
  const isPriority = priority ?? size >= 120;
  return (
    <span
      className={cn("avatar", rounded && "avatar-rounded")}
      style={{
        width: size,
        height: size,
        background: color,
        color: contrastText(color),
        fontSize: size * 0.29,
      }}
    >
      {resolvedSrc && failed !== src ? (
        <Image
          src={resolvedSrc}
          alt={name}
          width={pixelSize}
          height={pixelSize}
          sizes={size >= 120 ? "(min-width: 960px) 240px, 160px" : `${size}px`}
          priority={isPriority}
          unoptimized={isTransformedCloudinary}
          onError={() => setFailed(src)}
          className="h-full w-full object-cover"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <span>{initials || "QT"}</span>
      )}
    </span>
  );
}
