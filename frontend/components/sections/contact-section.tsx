import contactPrecisionTools from "@/assets/images/contact-precision-tools.webp";
import { Link } from "@/i18n/navigation";
import { getWhatsAppUrl } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function ContactSection() {
  const locale = await getLocale();
  const [t, profileT] = await Promise.all([
    getTranslations({ locale, namespace: "home.contact.close" }),
    getTranslations({ locale, namespace: "profile" }),
  ]);
  const whatsappUrl = getWhatsAppUrl(profileT("phone"));
  const headlineLines = t.raw("headlineLines") as string[];

  return (
    <section
      id="contact"
      className="relative z-[60] isolate scroll-mt-16 overflow-hidden bg-[#11110f] text-[#f2ece2]"
    >
      <Image
        src={contactPrecisionTools}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="-z-20 object-cover object-center opacity-90"
      />
      <div className="absolute inset-0 -z-10 bg-[rgba(9,9,8,0.42)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,10,9,0.32)_0%,rgba(10,10,9,0.46)_48%,#11110f_100%)]" />

      <div className="editorial-shell flex min-h-[48rem] items-center justify-center py-20 sm:min-h-[50rem] sm:py-24 lg:min-h-[47rem] lg:py-28">
        <div className="flex w-full max-w-[70rem] flex-col items-center text-center">
          <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[#eee7dc]/62">
            {t("label")}
          </p>

          <h2 className="mt-7 max-w-[12ch] pb-1 text-balance font-sans text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.98] font-normal tracking-[-0.06em] text-[#f5f0e7] sm:mt-8 sm:pb-0 sm:leading-[0.92]">
            {headlineLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          <p className="mt-7 max-w-[46rem] text-pretty font-sans text-base leading-[1.6] text-[#eee7dc]/76 sm:mt-8 sm:text-lg">
            {t("subtitle")}
          </p>

          <div className="mt-9 flex w-full max-w-[37rem] flex-col items-center gap-5 sm:mt-10">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="signal-button group inline-flex min-h-16 w-full items-center justify-center gap-2 px-6 py-4 text-base whitespace-nowrap transition-[opacity,transform] duration-200 motion-safe:active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none sm:text-lg"
            >
              <span>{t("primaryCta")}</span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none sm:size-5"
              />
            </a>

            <Link
              href="/schedule"
              className="editorial-text-link text-base [--primary-text:var(--primary)] [--section-action-rule:rgb(242_236_226_/_0.55)] [--section-foreground:#f2ece2] motion-reduce:transition-none"
            >
              {t("secondaryCta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
