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
    <section
      id={sectionSlug}
      className="dark-instrument dark-instrument-smooth editorial-section scroll-mt-16 overflow-hidden border-[var(--section-rule)] border-t"
    >
      <div className="editorial-shell grid gap-16 lg:grid-cols-12 lg:items-center lg:gap-8 xl:gap-12">
        <div className="lg:col-span-7 lg:pr-4 xl:pr-10">
          <p className="editorial-label editorial-section-label">
            {headerT("nav.pricing")}
          </p>

          <h2 className="editorial-section-title mt-6 max-w-[12ch]">
            {t("headline")}
          </h2>

          <div className="mt-10 max-w-[34rem] border-[var(--section-rule)] border-t pt-7 md:mt-12">
            <p className="editorial-section-copy">{t("subtitle")}</p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-9 inline-flex min-h-11 items-center gap-3 rounded-[2px] bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-[transform,opacity] duration-200 hover:-translate-y-0.5 hover:opacity-90 active:translate-y-px motion-reduce:transform-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <span>{t("cta")}</span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
            />
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-[39rem] lg:col-span-5 lg:mx-0 lg:pl-3">
          <div
            aria-hidden="true"
            className="absolute inset-x-5 top-7 bottom-[-0.8rem] hidden rotate-[2.6deg] border border-[#795844]/35 bg-[#795844]/18 shadow-[0_2rem_4rem_rgb(0_0_0/0.28)] sm:block"
          />

          <article className="noise-overlay relative isolate border border-[#aaa094] bg-[#d8d0c3] px-5 pt-9 pb-5 text-[#1b1a17] shadow-[0_1.75rem_4rem_rgb(0_0_0/0.32)] sm:rotate-[1.5deg] sm:px-8 sm:pt-12 sm:pb-8 lg:px-7 xl:px-9">
            <div
              aria-hidden="true"
              className="absolute -top-3 left-8 z-20 h-14 w-[1.1rem] rounded-full border-[2px] border-[#55524d] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.45),2px_3px_4px_rgb(0_0_0/0.24)] sm:left-11 sm:h-16"
            >
              <span className="absolute inset-[3px] rounded-full border border-[#77736c]" />
            </div>

            <header className="relative border-black/25 border-b pb-6 pl-10 sm:pb-8 sm:pl-12">
              <p className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.13em] text-black/55">
                {headerT("nav.pricing")}
              </p>
              <p className="mt-4 max-w-[19ch] text-[clamp(1.65rem,4vw,2.35rem)] leading-[1.02] font-medium tracking-[-0.045em]">
                {t("engagementTitle")}
              </p>
            </header>

            <dl className="relative mt-6 border border-black/25 sm:mt-8">
              <div className="grid grid-cols-[minmax(6.5rem,0.78fr)_minmax(0,1.22fr)] border-black/25 border-b">
                <dt className="border-black/25 border-r px-3 py-4 font-mono text-[0.6rem] uppercase leading-snug tracking-[0.12em] text-black/58 sm:px-5 sm:py-5">
                  {t("scopeLabel")}
                </dt>
                <dd className="px-3 py-4 text-sm leading-[1.45] font-medium sm:px-5 sm:py-5 sm:text-base">
                  {t("scopeValue")}
                </dd>
              </div>

              <div className="grid grid-cols-[minmax(6.5rem,0.78fr)_minmax(0,1.22fr)] border-black/25 border-b">
                <dt className="border-black/25 border-r px-3 py-4 font-mono text-[0.6rem] uppercase leading-snug tracking-[0.12em] text-black/58 sm:px-5 sm:py-5">
                  {t("timelineLabel")}
                </dt>
                <dd className="px-3 py-4 text-xl leading-none font-medium tracking-[-0.035em] sm:px-5 sm:py-5 sm:text-2xl">
                  {t("timelineValue")}
                </dd>
              </div>

              <div className="grid grid-cols-[minmax(6.5rem,0.78fr)_minmax(0,1.22fr)]">
                <dt className="border-black/25 border-r px-3 py-4 font-mono text-[0.6rem] uppercase leading-snug tracking-[0.12em] text-black/58 sm:px-5 sm:py-5">
                  {t("includesTitle")}
                </dt>
                <dd>
                  <ol className="px-3 py-2 sm:px-5 sm:py-3">
                    {includedItems.map((item, index) => (
                      <li
                        key={item}
                        className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-2 border-black/18 border-b py-2.5 text-[0.78rem] leading-[1.35] last:border-b-0 sm:text-sm"
                      >
                        <span className="font-mono text-[0.58rem] text-black/42">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </dd>
              </div>
            </dl>

            <footer className="relative mt-5 border-black/25 border-t pt-4 sm:pt-5">
              <p className="max-w-[31rem] text-xs leading-[1.55] text-black/62 sm:text-sm">
                {t("timelineNote")}
              </p>
            </footer>
          </article>
        </div>
      </div>
    </section>
  );
}
