import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const nextConfig: NextConfig = {
	reactCompiler: true,
	turbopack: {
		root: path.join(__dirname, ".."),
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
		],
		formats: ["image/avif", "image/webp"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 60,
	},
	experimental: {
		optimizePackageImports: [
			"@splinetool/react-spline",
			"@rive-app/react-canvas",
			"motion",
		],
	},

	async rewrites() {
		return [
			{
				source: "/magical-app/static/:path*",
				destination: "https://eu-assets.i.posthog.com/static/:path*",
			},
			{
				source: "/magical-app/:path*",
				destination: "https://eu.i.posthog.com/:path*",
			},
		];
	},
	// This is required to support PostHog trailing slash API requests
	skipTrailingSlashRedirect: true,
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
