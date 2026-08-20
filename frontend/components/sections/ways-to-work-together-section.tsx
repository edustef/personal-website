import { getWhatsAppUrl } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

export default async function WaysToWorkTogetherSection() {
  const locale = await getLocale();
  const [t, headerT] = await Promise.all([
    getTranslations({ locale, namespace: "waysToWorkTogether" }),
    getTranslations({ locale, namespace: "settings.header" }),
  ]);
  const sectionSlug = headerT("nav.pricingSlug");
  const includedItems = t.raw("includedItems") as string[];
  const whatsappUrl = getWhatsAppUrl(undefined);

  return (
    <section id={sectionSlug} className="scroll-mt-16 py-24 md:py-36">
      <div className="editorial-shell grid gap-14 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-7 lg:pt-8">
          <p className="editorial-label">04 / {t("label")}</p>
          <h2 className="editorial-display mt-5 max-w-4xl text-5xl sm:text-6xl lg:text-8xl">
            {t("headline")}
          </h2>
          <p className="text-muted-foreground mt-7 max-w-xl text-lg leading-relaxed">
            {t("subtitle")}
          </p>
          <h3 className="mt-12 max-w-2xl text-2xl font-normal leading-tight tracking-tight md:text-3xl">
            {t("engagementTitle")}
          </h3>
          <p className="text-muted-foreground mt-5 max-w-2xl leading-relaxed md:text-lg">
            {t("description")}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="signal-button mt-9 inline-flex items-center gap-2"
          >
            {t("cta")}
            <ArrowUpRight className="size-4" />
          </a>
        </div>

        <div className="relative lg:col-span-5">
          <div className="absolute -inset-3 rotate-2 bg-[#a96f52]/20" />
          <div className="relative -rotate-1 border border-border bg-[#e4d9c9] p-6 shadow-[0_28px_60px_rgba(45,32,22,.16)] md:p-9">
            <div className="flex items-center justify-between border-black/25 border-b pb-5">
              <span className="editorial-label">
                Engagement / specification
              </span>
              <span className="font-mono text-xs">ES—04</span>
            </div>
            <dl className="mt-4">
              <div className="grid gap-2 border-black/20 border-b py-6 sm:grid-cols-2">
                <dt className="editorial-label text-black/55">
                  {t("scopeLabel")}
                </dt>
                <dd className="font-medium">{t("scopeValue")}</dd>
              </div>
              <div className="grid gap-2 border-black/20 border-b py-6 sm:grid-cols-2">
                <dt className="editorial-label text-black/55">
                  {t("timelineLabel")}
                </dt>
                <dd className="text-2xl tracking-tight">
                  {t("timelineValue")}
                </dd>
              </div>
            </dl>
            <p className="editorial-label mt-7 text-black/55">
              {t("includesTitle")}
            </p>
            <ul className="mt-4 divide-y divide-black/20">
              {includedItems.map((item, index) => (
                <li key={item} className="flex gap-4 py-3">
                  <span className="font-mono text-xs text-black/45">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-black/55">
              {t("timelineNote")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
