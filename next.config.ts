import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cho phép dev assets từ đúng hostname được cấu hình để thử QR trên điện thoại cùng Wi-Fi.
  allowedDevOrigins: process.env.NEXT_PUBLIC_SITE_URL
    ? [new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname]
    : [],
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
      {
        source: "/login",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
