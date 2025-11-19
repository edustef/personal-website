import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { LanguageId } from "@/lib/i18n";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: LanguageId }>;
};

export default async function WebsiteLayout(props: Props) {
  const params = await props.params;
  return (
    <>
      <Header locale={params.locale} />
      <div className="absolute inset-0 -z-10 bg-[url(/images/tile-grid-black.png)] opacity-5" />
      <main className="min-h-screen">{props.children}</main>
      <Footer />
    </>
  );
}
