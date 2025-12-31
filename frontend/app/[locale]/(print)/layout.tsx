import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export default async function PrintLayout(props: Props) {
	const params = await props.params;
	const { locale } = params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}
	setRequestLocale(locale);

	return (
		<>
			<Header className="print:hidden" />
			<main className="min-h-screen">{props.children}</main>
			<Footer className="print:hidden" locale={locale} />
		</>
	);
}
