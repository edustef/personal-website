import { notFound } from "next/navigation";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getCanonicalUrl } from "@/lib/seo";
import { getLocalizedSettingsMetadata } from "@/lib/seo";

const ContactForm = dynamic(
	() =>
		import("@/components/contact-form").then((mod) => ({
			default: mod.ContactForm,
		})),
	{
		ssr: true,
	},
);
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Spotlight } from "@/components/ui/spotlight-new";
import ServicesSection from "@/components/services-section";
import CaseStudiesSection from "@/components/case-studies-section";
import TestimonialsSection from "@/components/testimonials-section";
import HeroSection from "@/components/hero-section";
import homeOpengraphEn from "@/assets/images/home-opengraph-en.png";
import homeOpengraphEs from "@/assets/images/home-opengraph-es.png";
import homeOpengraphRo from "@/assets/images/home-opengraph-ro.png";
import { FloatingContactButton } from "@/components/contact-button-observer";

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

	return {
		title: pageTitle,
		description: pageDescription,
		alternates: {
			canonical: canonicalUrl,
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

	return (
		<>
			<Spotlight />
			<HeroSection />

			{/* <AboutMeSection /> */}

			<ServicesSection />

			<CaseStudiesSection />

			<TestimonialsSection />

			{profileT("email") && (
				<section id="contact" className="bg-muted/30 py-24 md:py-32">
					<div className="mx-auto max-w-6xl px-4">
						<div className="mb-16 text-center">
							<p className="text-primary mb-3 text-sm font-medium uppercase tracking-wider">
								{t("contact.label")}
							</p>
							<h2 className="text-foreground mb-4 text-3xl tracking-tight md:text-4xl">
								{t("contact.headline")}
							</h2>
							<p className="text-muted-foreground mx-auto max-w-2xl text-lg">
								{t("contact.subtitle")}
							</p>
						</div>
						<div className="flex w-full justify-center">
							<div className="w-full max-w-lg">
								<ContactForm recipientEmail={profileT("email")} />
							</div>
						</div>
					</div>
				</section>
			)}
			<FloatingContactButton
				contactMeText={t("contactMe")}
				contactUrl="https://wa.me/40775378525"
			/>
		</>
	);
}
