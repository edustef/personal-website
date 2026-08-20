import { AnimatedContainer } from "@/components/ui/animated-container";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

export default async function SanitySpotlightSection() {
  const locale = await getLocale();
  const t = await getTranslations({
    locale,
    namespace: "home.sanitySpotlight",
  });
  const systemItems = t.raw("systemItems") as string[];

  return (
    <section className="bg-[#a96f52] py-24 text-[#171714] md:py-36">
      <div className="editorial-shell grid gap-14 lg:grid-cols-12 lg:items-center">
        <AnimatedContainer
          trigger="scroll"
          fadeDirection="left"
          className="relative min-h-[32rem] lg:col-span-7"
        >
          <div className="absolute inset-x-6 top-0 h-[76%] border border-black/35 bg-[#ded5c7] p-6 shadow-[0_18px_40px_rgba(30,20,12,.16)] md:inset-x-20">
            <p className="editorial-label">Content model / 02</p>
            <div className="mt-12 grid grid-cols-3 gap-4 font-mono text-[0.65rem]">
              {["Document", "Author", "Category"].map((item, index) => (
                <div
                  key={item}
                  className={`border border-black/35 p-4 ${index === 1 ? "mt-16" : ""}`}
                >
                  <p className="font-medium">{item}</p>
                  <div className="mt-3 space-y-2 text-black/55">
                    <p>title</p>
                    <p>slug</p>
                    <p>reference →</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute right-0 bottom-0 left-0 border border-black/35 bg-[#eeeae0] p-6 shadow-[0_18px_45px_rgba(30,20,12,.24)] md:right-14 md:left-0 md:p-8">
            <div className="flex items-center justify-between border-black/25 border-b pb-4 font-mono text-[0.65rem] uppercase tracking-wider">
              <span>Sanity Studio</span>
              <span>Editorial workspace</span>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-[9rem_1fr]">
              <div className="space-y-3 text-xs text-black/55">
                <p className="text-black">Content</p>
                <p>Documents</p>
                <p>Authors</p>
                <p>Categories</p>
              </div>
              <div className="space-y-3">
                <div className="h-9 border border-black/25 bg-white/30" />
                <div className="h-9 border border-black/25 bg-white/30" />
                <div className="h-24 border border-black/25 bg-white/30" />
              </div>
            </div>
          </div>
        </AnimatedContainer>

        <AnimatedContainer
          trigger="scroll"
          fadeDirection="right"
          className="lg:col-span-5 lg:pl-8"
        >
          <p className="editorial-label">02 / {t("label")}</p>
          <p className="mt-4 text-sm text-black/60">{t("eyebrow")}</p>
          <h2 className="editorial-display mt-5 text-5xl sm:text-6xl lg:text-7xl">
            {t("headline")}
          </h2>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-black/72">
            {t("description")}
          </p>
          <div className="mt-9 border-black/35 border-t">
            {systemItems.map((item, index) => (
              <div
                key={item}
                className="flex gap-5 border-black/25 border-b py-4"
              >
                <span className="font-mono text-xs text-black/55">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <Link
            href="/services/sanity"
            className="mt-8 inline-flex items-center gap-2 rounded-[2px] bg-primary px-6 py-3.5 font-semibold"
          >
            {t("cta")}
            <ArrowUpRight className="size-4" />
          </Link>
        </AnimatedContainer>
      </div>
    </section>
  );
}
