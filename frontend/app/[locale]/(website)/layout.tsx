import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ScrollAwareHeader } from "@/components/scroll-aware-header";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

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

  return (
    <>
      <div className="relative isolate flex min-h-screen flex-col">
        <ScrollAwareHeader />
        <Header />
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
