import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { LanguageId } from "@/lib/i18n";
import { ConstructionIcon, ExternalLinkIcon } from "lucide-react";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function WebsiteLayout(props: Props) {
  const params = await props.params;
  const locale = params.locale as LanguageId;
  return (
    <>
      <div className="bg-secondary text-secondary-foreground relative w-full px-4 py-2">
        <div className="mx-auto flex max-w-6xl flex-row items-center gap-4 pt-2 md:flex-row md:gap-4">
          <ConstructionIcon className="size-12" />
          <div className="flex flex-row items-center text-xl uppercase">
            <span className="font-bold tracking-widest uppercase">Under</span>
            <span className="bg-primary mx-1 inline-block h-[1.3em] w-0.5" />
            <span className="ml-0.5 tracking-tight">Renovation</span>
          </div>
        </div>
      </div>
      <Header locale={locale} />
      <main className="relative isolate min-h-screen">
        <div className="absolute inset-0 -z-10 bg-[url(/images/tile-grid-black.png)] bg-repeat opacity-5" />
        {props.children}
      </main>
      <Footer />
    </>
  );
}
