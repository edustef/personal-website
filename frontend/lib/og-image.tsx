import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = {
  width: 1200,
  height: 630,
};

export const OG_CONTENT_TYPE = "image/png";

async function loadAssets() {
  // Load background image as base64
  const bgImageData = await readFile(
    join(process.cwd(), "assets/images/opengraph-bg.png")
  );
  const bgImageSrc = `data:image/png;base64,${bgImageData.toString("base64")}`;

  // Load Cardo font from Google Fonts
  const cardoBold = await fetch(
    "https://fonts.gstatic.com/s/cardo/v19/wlpygwjKBV1pqhND-aQR82JHaTBX.ttf"
  ).then((res) => res.arrayBuffer());

  const cardoRegular = await fetch(
    "https://fonts.gstatic.com/s/cardo/v19/wlp_gwjKBV1pqiv_1oAZ2H5O.ttf"
  ).then((res) => res.arrayBuffer());

  return { bgImageSrc, cardoBold, cardoRegular };
}

export async function generateOgImage(title: string, siteName = "eduardbme.com") {
  const { bgImageSrc, cardoBold, cardoRegular } = await loadAssets();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Background Image */}
        <img
          src={bgImageSrc}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 80px",
            textAlign: "center",
            position: "relative",
            height: "100%",
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: 60,
              fontFamily: "Cardo",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.2,
              maxWidth: "1000px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {title}
          </div>

          {/* Site Name */}
          <div
            style={{
              position: "absolute",
              bottom: 60,
              fontSize: 24,
              fontFamily: "Cardo",
              fontWeight: 400,
              color: "#a1a1aa",
            }}
          >
            {siteName}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        {
          name: "Cardo",
          data: cardoBold,
          style: "normal",
          weight: 700,
        },
        {
          name: "Cardo",
          data: cardoRegular,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
