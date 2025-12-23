import { notFound } from "next/navigation";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import { getCanonicalUrl } from "@/lib/seo";
import { getLocalizedSettingsMetadata } from "@/lib/seo";

import {
	HeroIntro,
	HeroIntroContent,
	HeroIntroCtaButtons,
	HeroIntroSocialLinks,
} from "@/components/hero-intro";

const ContactForm = dynamic(
	() =>
		import("@/components/contact-form").then((mod) => ({
			default: mod.ContactForm,
		})),
	{
		ssr: true,
	},
);
import { HighlightBadge } from "@/components/ui/highlight-badge";
import { Button } from "@/components/ui/button";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { HeroSpline } from "@/components/hero-spline";
import { Link } from "@/i18n/navigation";
import SkillsSection from "@/components/skills-section";
import homeOpengraphEn from "@/assets/images/home-opengraph-en.png";
import homeOpengraphEs from "@/assets/images/home-opengraph-es.png";
import homeOpengraphRo from "@/assets/images/home-opengraph-ro.png";

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

	const [localizedSettings, t] = await Promise.all([
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

	const [t, profileT] = await Promise.all([
		getTranslations({ locale, namespace: "home" }),
		getTranslations({ locale, namespace: "profile" }),
	]);

	const ctaButtons = t.raw("ctaButtons") as Array<{
		text: string;
		href: string;
		variant: string;
	}>;
	const socialLinks = profileT.raw("socialLinks") as Array<{
		name: string;
		url: string;
	}>;

	return (
		<>
			<div className="flex min-h-[calc(100vh-4rem)] flex-col px-4 pt-12 pb-12 md:pt-24">
				<HeroSpline />
				<HeroIntro>
					<div className="flex flex-col gap-8">
						<HeroIntroContent>
							<HighlightBadge>
								<span>{t("renovationLabelPrimary")}</span>
								<span className="ml-1.5 font-bold">
									{t("renovationLabelSecondary")}
								</span>
							</HighlightBadge>
							<h1 className="text-foreground group relative text-balance text-3xl leading-normal font-semibold md:text-5xl md:leading-tight">
								{t.rich("headline", {
									strong: (chunks) => <strong>{chunks}</strong>,
								})}
							</h1>
							<p className="prose prose-sm max-w-none">{t("tagline")}</p>
						</HeroIntroContent>
						<HeroIntroCtaButtons>
							{ctaButtons.map((button, index) => (
								<Button
									key={index}
									asChild
									variant={button.variant as "default" | "outline"}
								>
									<Link href={button.href}>{button.text}</Link>
								</Button>
							))}
						</HeroIntroCtaButtons>
					</div>

					<div className="flex flex-col gap-4">
						<AnimatedContainer>
							<h2 className="text-foreground text-lg font-semibold">
								{t("findMeOnLabel")}
							</h2>
						</AnimatedContainer>
						<HeroIntroSocialLinks>
							{socialLinks.map(({ url, name }) => (
								<Button key={url} asChild variant="outline">
									<a href={url} target="_blank" rel="noopener noreferrer">
										{name}
									</a>
								</Button>
							))}
						</HeroIntroSocialLinks>
					</div>
				</HeroIntro>
			</div>
			<SkillsSection />
			{profileT("email") && (
				<section
					id="contact"
					className="bg-background mt-16 px-4 py-24 md:mt-24"
				>
					<div className="mx-auto flex w-full max-w-6xl justify-center">
						<div className="w-full max-w-lg">
							<ContactForm recipientEmail={profileT("email")} />
						</div>
					</div>
				</section>
			)}
		</>
	);
}
