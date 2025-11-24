import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

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
        <Header locale={locale} />
        <main id="main-content" className="flex flex-1 flex-col justify-center">
          {props.children}
        </main>
      </div>
      <Footer locale={locale} />
    </>
  );
}
