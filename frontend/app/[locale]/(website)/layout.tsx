import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { LanguageId } from "@/lib/i18n";
import { ConstructionIcon } from "lucide-react";

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
        <div className="mx-auto flex max-w-6xl flex-row items-center gap-4 md:flex-row md:gap-4">
          <ConstructionIcon className="size-5" />
          <div className="flex flex-row items-center text-sm uppercase">
            <span className="font-bold tracking-widest uppercase">Under</span>
            <span className="ml-0.5 tracking-tight">Renovation</span>
          </div>
        </div>
      </div>
      <Header locale={locale} />
      <main className="relative isolate min-h-screen">
        <div className="absolute inset-0 -z-10 bg-[url(/images/tile-grid-black.png)] bg-repeat opacity-5 invert" />
        {props.children}
      </main>
      <Footer />
    </>
  );
}
