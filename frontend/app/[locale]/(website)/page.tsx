import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import homeOpengraphEn from "@/assets/images/home-opengraph-en.png";
import homeOpengraphEs from "@/assets/images/home-opengraph-es.png";
import homeOpengraphRo from "@/assets/images/home-opengraph-ro.png";
import AboutMeSection from "@/components/about-me-section";
import CaseStudiesSection from "@/components/case-studies-section";
import { FloatingContactButton } from "@/components/contact-button-observer";
import ContactSection from "@/components/contact-section";
import HeroSection from "@/components/hero-section";
import HowIPriceSection from "@/components/how-i-price-section";
import HowIWorkSection from "@/components/how-i-work-section";
import ServicesSection from "@/components/services-section";
import TestimonialsSection from "@/components/testimonials-section";
import { BackgroundPaperShaders } from "@/components/ui/background-paper-shaders";
import WorkedWithSection from "@/components/worked-with-section";
import { locales, routing } from "@/i18n/routing";
import { getCanonicalUrl, getLocalizedSettingsMetadata } from "@/lib/seo";

type Props = {
	params: Promise<{ locale: string }>;
};

const ogImages = {
	en: homeOpengraphEn,
	es: homeOpengraphEs,
	ro: homeOpengraphRo,
};

export async function generateMetadata(props: Props): Promise<Metadata> {
	const params = await props.params;
	const { locale } = params;

	const [, t] = await Promise.all([
		getLocalizedSettingsMetadata(locale),
		getTranslations({ locale, namespace: "home.seo" }),
	]);

	const pageTitle = t("title");
	const pageDescription = t("description");
	const canonicalUrl = getCanonicalUrl(locale, "/");
	const ogImage = ogImages[locale as keyof typeof ogImages] || ogImages.en;

	const hreflangUrls = locales.map((loc) => {
		const url = getCanonicalUrl(loc.id, "/");
		return [loc.id, url];
	});

	return {
		title: pageTitle,
		description: pageDescription,
		alternates: {
			canonical: canonicalUrl,
			languages: Object.fromEntries(hreflangUrls),
		},
		openGraph: {
			type: "website",
			locale,
			title: pageTitle,
			description: pageDescription,
			images: [
				{
					url: ogImage.src,
					width: ogImage.width,
					height: ogImage.height,
					alt: pageDescription,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: pageTitle,
			description: pageDescription,
			images: [ogImage.src],
		},
	};
}

export default async function Page(props: Props) {
	const params = await props.params;
	const { locale } = params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}
	setRequestLocale(locale);

	const profileT = await getTranslations({ locale, namespace: "profile" });
	const t = await getTranslations({ locale, namespace: "home" });

	const phone = profileT("phone");
	const whatsappUrl = phone
		? `https://wa.me/${phone.replace(/[^0-9]/g, "")}`
		: undefined;

	const socialLinksRaw = profileT.raw("socialLinks") as
		| Array<{ name: string; url: string }>
		| undefined;

	return (
		<>
			{/* <Spotlight /> */}
			<BackgroundPaperShaders />
			<HeroSection />

			<WorkedWithSection />

			<ServicesSection />

			<HowIWorkSection />

			<HowIPriceSection />

			<AboutMeSection />

			{/* <CaseStudiesSection /> */}

			{/* <TestimonialsSection /> */}

			<ContactSection socialLinks={socialLinksRaw} whatsappUrl={whatsappUrl} />

			<FloatingContactButton
				contactMeText={t("contactMe")}
				contactUrl={whatsappUrl || "https://wa.me/40775378525"}
			/>
		</>
	);
}
