import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #EEF3FF 0%, #FFFFFF 45%, #E8FDF7 100%)",
          padding: "64px",
          fontFamily: "sans-serif"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            borderRadius: 36,
            padding: 56,
            background: "rgba(255,255,255,0.82)",
            border: "1px solid rgba(255,255,255,0.8)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#1A6BFF",
                color: "#fff",
                fontSize: 34,
                fontWeight: 800
              }}
            >
              KC
            </div>
            <div style={{ color: "#1A1D2E", fontSize: 34, fontWeight: 700 }}>SmartBasket</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 72, lineHeight: 1.05, fontWeight: 800, color: "#0F1120", maxWidth: "900px" }}>
              Compare instant delivery prices before hidden fees hit checkout.
            </div>
            <div style={{ fontSize: 28, color: "#465066", maxWidth: "860px" }}>
              Smart cart optimization, fee transparency, and personal savings insights across India&apos;s leading quick-commerce apps.
            </div>
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            {["8 platforms", "4-min cache", "₹847 avg savings"].map((label) => (
              <div
                key={label}
                style={{
                  padding: "14px 20px",
                  borderRadius: 999,
                  background: "#F1F3F9",
                  color: "#1A1D2E",
                  fontSize: 22,
                  fontWeight: 600
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
