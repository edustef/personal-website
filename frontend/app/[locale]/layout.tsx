import "../globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Cardo, DM_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { notFound } from "next/navigation";

import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { getLocalizedSettingsMetadata, getCanonicalUrl } from "@/lib/seo";
import { NextIntlClientProvider } from "next-intl";
import { locales } from "@/i18n/routing";
import {
	createPersonSchema,
	createWebSiteSchema,
	sanitizeJsonLd,
} from "@/lib/structured-data";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Script from "next/script";

type MetadataProps = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata(
	props: MetadataProps,
): Promise<Metadata> {
	const { locale } = await props.params;
	const localized = await getLocalizedSettingsMetadata(locale);
	const alternateLocale = locales
		.map((lang) => lang.id)
		.filter((lang) => lang !== locale);

	const hreflangUrls = locales.map((loc) => {
		const url = getCanonicalUrl(loc.id, "");
		return [loc.id, url];
	});

	const canonicalUrl = getCanonicalUrl(locale, "");

	return {
		metadataBase: localized.metadataBase,
		title: {
			template: `%s | ${localized.title}`,
			default: localized.title,
		},
		description: localized.description,
		alternates: {
			canonical: canonicalUrl,
			languages: Object.fromEntries(hreflangUrls),
		},
		openGraph: {
			type: "website",
			locale,
			alternateLocale,
			title: localized.title,
			description: localized.description,
			images: localized.ogImage ? [localized.ogImage] : undefined,
		},
		twitter: {
			card: localized.ogImage ? "summary_large_image" : "summary",
			title: localized.title,
			description: localized.description,
			images: localized.ogImage ? [localized.ogImage.url] : undefined,
		},
	};
}

export async function generateStaticParams() {
	return locales.map((lang) => ({
		locale: lang.id,
	}));
}

const cardo = Cardo({
	weight: ["400", "700"],
	variable: "--font-cardo",
	subsets: ["latin"],
	display: "swap",
});
const dmMono = DM_Mono({
	weight: ["300", "400", "500"],
	variable: "--font-dm-mono",
	subsets: ["latin"],
	display: "swap",
});

type Props = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export default async function LocaleLayout(props: Props) {
	const params = await props.params;

	if (!locales.find((locale) => locale.id === params.locale)) {
		notFound();
	}

	setRequestLocale(params.locale);

	const [localizedSettings, profileT] = await Promise.all([
		getLocalizedSettingsMetadata(params.locale),
		getTranslations({ locale: params.locale, namespace: "profile" }),
	]);

	const socialLinks = profileT.raw("socialLinks") as Array<{
		name: string;
		url: string;
	}>;

	const personSchema = createPersonSchema(
		{
			name: profileT("name"),
			email: profileT("email"),
			phone: profileT("phone"),
			about: profileT("about"),
			picture: null,
			socialLinks: socialLinks.map((link) => ({ url: link.url })),
			workPreference: profileT("workPreference"),
		},
		params.locale,
	);

	const webSiteSchema = createWebSiteSchema(
		localizedSettings.title,
		localizedSettings.description,
		params.locale,
	);

	return (
		<html
			lang={params.locale}
			className={`${cardo.variable} ${dmMono.variable} dark font-light bg-background text-foreground min-h-screen transition-colors duration-300`}
			suppressHydrationWarning
		>
			<body className="isolate transition-colors duration-300 ease-in-out">
				{personSchema && (
					<Script
						type="application/ld+json"
						strategy="afterInteractive"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
						dangerouslySetInnerHTML={{
							__html: sanitizeJsonLd(personSchema),
						}}
					/>
				)}
				<Script
					type="application/ld+json"
					strategy="afterInteractive"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					dangerouslySetInnerHTML={{
						__html: sanitizeJsonLd(webSiteSchema),
					}}
				/>
				<NextIntlClientProvider>
					<ConvexClientProvider>
						<ThemeProvider
							attribute="class"
							defaultTheme="dark"
							enableSystem={false}
							disableTransitionOnChange
						>
							<Toaster />
							{props.children}
							<SpeedInsights />
						</ThemeProvider>
					</ConvexClientProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
