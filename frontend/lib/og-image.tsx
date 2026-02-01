import { ImageResponse } from "next/og";

export const OG_SIZE = {
  width: 1200,
  height: 630,
};

export const OG_CONTENT_TYPE = "image/png";

function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

async function loadAssets() {
  const baseUrl = getBaseUrl();

  // Load background image from public folder
  const bgImageData = await fetch(`${baseUrl}/opengraph-bg.png`).then((res) =>
    res.arrayBuffer()
  );
  const bgImageSrc = `data:image/png;base64,${Buffer.from(bgImageData).toString("base64")}`;

  // Load Cardo font from Google Fonts
  const cardoBold = await fetch(
    "https://fonts.gstatic.com/s/cardo/v19/wlpygwjKBV1pqhND-aQR82JHaTBX.ttf"
  ).then((res) => res.arrayBuffer());

  const cardoRegular = await fetch(
    "https://fonts.gstatic.com/s/cardo/v19/wlp_gwjKBV1pqiv_1oAZ2H5O.ttf"
  ).then((res) => res.arrayBuffer());

  return { bgImageSrc, cardoBold, cardoRegular };
}

export async function generateOgImage(
  title: string,
  cta = "Learn More",
  siteName = "eduardstefan.dev"
) {
  const { bgImageSrc, cardoBold, cardoRegular } = await loadAssets();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
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
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "80px",
            position: "relative",
            height: "100%",
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: 64,
              fontFamily: "Cardo",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.2,
              maxWidth: "900px",
              marginBottom: 40,
            }}
          >
            {title}
          </div>

          {/* CTA Button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px 32px",
              backgroundColor: "#ffffff",
              borderRadius: 8,
              fontSize: 20,
              fontFamily: "Cardo",
              fontWeight: 700,
              color: "#0a0a0a",
            }}
          >
            {cta}
          </div>

          {/* Site Name - Bottom Right */}
          <div
            style={{
              position: "absolute",
              bottom: 80,
              right: 80,
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
