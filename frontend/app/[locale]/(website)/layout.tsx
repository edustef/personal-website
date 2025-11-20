import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { LanguageId } from "@/lib/i18n";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function WebsiteLayout(props: Props) {
  const params = await props.params;
  const locale = params.locale as LanguageId;
  return (
    <>
      <div className="relative isolate flex min-h-screen flex-col">
        <Header locale={locale} />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex flex-1 flex-col justify-center"
        >
          {props.children}
        </main>
      </div>
      <Footer locale={locale} />
    </>
  );
}
