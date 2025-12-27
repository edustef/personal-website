import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ScrollAwareHeader } from "@/components/scroll-aware-header";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

type Props = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export default async function WebsiteLayout(props: Props) {
	const params = await props.params;
	const { locale } = params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}
	setRequestLocale(locale);

	const [headerT, homeT] = await Promise.all([
		getTranslations({ locale, namespace: "settings.header" }),
		getTranslations({ locale, namespace: "home" }),
	]);

	const skipLinkText = headerT("skipLinkText");
	const navigationLabel = headerT("navLabel");
	const homeButtonLabel = headerT("homeButtonLabel");
	const contactMeText = homeT("contactMe");

	return (
		<>
			<div className="relative isolate flex min-h-screen flex-col">
				<ScrollAwareHeader />
				<Header
					locale={locale}
					contactMeText={contactMeText}
					skipLinkText={skipLinkText}
					navigationLabel={navigationLabel}
					homeButtonLabel={homeButtonLabel}
				/>
				<main
					id="main-content"
					className="mt-16 flex flex-1 flex-col justify-center"
				>
					{props.children}
				</main>
			</div>
			<Footer locale={locale} />
		</>
	);
}
