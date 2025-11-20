import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { LanguageId } from "@/lib/i18n";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function PrintLayout(props: Props) {
  const params = await props.params;
  const locale = params.locale as LanguageId;
  return (
    <>
      <Header className="print:hidden" locale={locale} />
      <main className="min-h-screen">{props.children}</main>
      <Footer className="print:hidden" locale={locale} />
    </>
  );
}
