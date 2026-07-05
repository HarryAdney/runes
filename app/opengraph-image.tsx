import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = `${SITE_NAME} rune reading preview`;

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
          padding: "56px 64px",
          background:
            "radial-gradient(circle at top, rgba(217, 164, 65, 0.22), transparent 35%), linear-gradient(180deg, #15122b 0%, #0d0b1a 100%)",
          color: "#ece6d6",
        }}
      >
        <div style={{ display: "flex", fontSize: 44, letterSpacing: "0.32em" }}>
          ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 700,
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 820,
              fontSize: 34,
              lineHeight: 1.3,
              color: "#d7ceb9",
            }}
          >
            {SITE_TAGLINE}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "#d9a441",
          }}
        >
          <div style={{ display: "flex" }}>Past • Present • Future</div>
          <div style={{ display: "flex" }}>Grounded meanings, reflective guidance</div>
        </div>
      </div>
    ),
    size,
  );
}