"use client";
import Image from "next/image";
import { useState } from "react";
import { contrastText } from "@/shared/utils/color";
import { cn } from "@/shared/utils/cn";
export function Avatar({
  name,
  src,
  color = "#0F4C75",
  size = 64,
  rounded = false,
}: {
  name: string;
  src: string;
  color?: string;
  size?: number;
  rounded?: boolean;
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
      {src && failed !== src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes={`${size}px`}
          unoptimized
          onError={() => setFailed(src)}
          style={{ objectFit: "cover" }}
        />
      ) : (
        <span>{initials || "QT"}</span>
      )}
    </span>
  );
}
