import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = siteConfig.title;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background:
            "linear-gradient(135deg, #050B1A 0%, #0B1938 55%, #1A1445 100%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                padding: "10px 22px",
                borderRadius: "999px",
                border: "1px solid rgba(34, 211, 238, 0.45)",
                background: "rgba(34, 211, 238, 0.12)",
                color: "#22D3EE",
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "0.14em",
              }}
            >
              QTM MEDIATECH PLATFORM
            </div>
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#7A8AA8",
              letterSpacing: "0.12em",
            }}
          >
            QUALITY • TECHNOLOGY • MINDSET
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "960px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
            }}
          >
            E-card
          </div>
          <div
            style={{
              fontSize: "38px",
              fontWeight: 600,
              lineHeight: 1.3,
              color: "#67E8F9",
            }}
          >
            Kết nối con người. Lan tỏa giá trị.
          </div>
          <div
            style={{
              fontSize: "24px",
              lineHeight: 1.5,
              color: "#B6C2D9",
              maxWidth: "820px",
            }}
          >
            Nền tảng danh thiếp điện tử thông minh dành cho đội ngũ CÔNG TY CỔ
            PHẦN CÔNG NGHỆ TRUYỀN THÔNG QTM.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "28px",
            borderTop: "1px solid rgba(120, 200, 255, 0.2)",
            fontSize: "20px",
            color: "#B6C2D9",
          }}
        >
          <span>CÔNG TY CỔ PHẦN CÔNG NGHỆ TRUYỀN THÔNG QTM</span>
          <span style={{ color: "#22D3EE", fontWeight: 700 }}>qtmmedia.vn</span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
