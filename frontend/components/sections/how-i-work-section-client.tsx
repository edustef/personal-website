"use client";

import { AnimatedContainer } from "@/components/ui/animated-container";
import { ArrowUpRight } from "lucide-react";

interface TimelineData {
  id: string;
  title: string;
  artifactLabel: string;
  paragraphs: string[];
  bulletPoints: string[];
}

interface Props {
  label: string;
  headline: string;
  subtitle: string;
  timelineData: TimelineData[];
  cta?: string;
  ctaUrl?: string;
}

function CheckMark() {
  return (
    <span
      aria-hidden="true"
      className="relative mt-px size-3 shrink-0 border border-current/60 before:absolute before:top-[1px] before:left-[3px] before:h-[6px] before:w-[3px] before:rotate-45 before:border-current before:border-r before:border-b"
    />
  );
}

function EvidenceArtifact({
  item,
  index,
}: {
  item: TimelineData;
  index: number;
}) {
  const paperClass =
    "relative w-full border border-[#dad1c3]/70 bg-[#d8d0c3] text-[#191916] shadow-[0_12px_30px_rgb(0_0_0/0.2)] before:pointer-events-none before:absolute before:inset-0 before:bg-white/[0.035] motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:rotate-0";

  if (index === 1) {
    return (
      <figure className="w-full border border-white/20 bg-[#10110f] text-[#ddd5ca] shadow-[0_14px_34px_rgb(0_0_0/0.28)] transition-colors duration-300 md:group-hover:border-white/32">
        <figcaption className="border-white/15 border-b px-4 py-3 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-white/54">
          {item.artifactLabel}
        </figcaption>
        <ol className="py-2 font-mono text-[0.64rem] leading-[1.55] sm:text-[0.68rem]">
          {item.bulletPoints.map((point, itemIndex) => (
            <li
              key={point}
              className="grid grid-cols-[2.4rem_1fr] border-white/8 border-b px-3 py-2 last:border-b-0"
            >
              <span className="text-white/30">
                {String(itemIndex + 1).padStart(2, "0")}
              </span>
              <span>
                <span aria-hidden="true" className="mr-2 text-white/32">
                  +
                </span>
                {point}
              </span>
            </li>
          ))}
        </ol>
      </figure>
    );
  }

  if (index === 3) {
    return (
      <figure className={`${paperClass} rotate-[0.45deg]`}>
        <figcaption className="relative border-black/25 border-b px-4 py-3 font-mono text-[0.62rem] uppercase tracking-[0.12em]">
          {item.artifactLabel}
        </figcaption>
        <div className="relative grid grid-cols-[2rem_1fr] font-mono text-[0.6rem] leading-[1.35] sm:text-[0.65rem]">
          {item.bulletPoints.map((point, itemIndex) => (
            <div key={point} className="contents">
              <span className="border-black/18 border-r border-b px-2 py-2 text-black/48">
                {String(itemIndex + 1).padStart(2, "0")}
              </span>
              <span className="border-black/18 border-b px-3 py-2">
                {point}
              </span>
            </div>
          ))}
        </div>
      </figure>
    );
  }

  return (
    <figure
      className={`${paperClass} ${index === 0 ? "-rotate-[0.7deg]" : "rotate-[0.55deg]"}`}
    >
      <figcaption
        className={`relative border-black/25 border-b py-3 pr-4 font-mono text-[0.62rem] uppercase tracking-[0.12em] ${index === 0 ? "pl-9" : "pl-4"}`}
      >
        {item.artifactLabel}
      </figcaption>
      <ul className="relative space-y-3 px-4 py-4 text-[0.7rem] leading-[1.35] sm:text-xs">
        {item.bulletPoints.map((point) => (
          <li key={point} className="flex items-start gap-2.5">
            <CheckMark />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      {index === 0 ? (
        <span
          aria-hidden="true"
          className="absolute -top-3 left-5 h-9 w-3 rounded-full border border-[#5d5a55] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.2)]"
        />
      ) : null}
      {index === 2 ? (
        <span
          aria-hidden="true"
          className="absolute top-1/2 -left-2.5 h-9 w-5 -translate-y-1/2 border border-[#2e2c29] bg-[#191815] shadow-[3px_2px_0_rgb(0_0_0/0.24)]"
        />
      ) : null}
    </figure>
  );
}

function MeasurementScale() {
  return (
    <div aria-hidden="true" className="mt-14 text-[#d7cec1]/62 md:mt-16">
      <div className="flex h-5 items-end border-[#bdb3a5]/58 border-b">
        {Array.from({ length: 41 }, (_, index) => (
          <span
            key={index}
            className={`w-full border-[#bdb3a5]/70 border-l ${
              index % 10 === 0 ? "h-5" : index % 5 === 0 ? "h-3.5" : "h-2"
            }`}
          />
        ))}
        <span className="h-5 border-[#bdb3a5]/70 border-r" />
      </div>
      <div className="mt-2 flex justify-between font-mono text-[0.58rem] sm:text-[0.64rem]">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </div>
  );
}

export function HowIWorkSectionClient({
  label,
  headline,
  subtitle,
  timelineData,
  cta,
  ctaUrl,
}: Props) {
  return (
    <section
      id="how-i-work"
      className="dark-instrument scroll-mt-16 py-20 md:py-24"
    >
      <div className="editorial-shell">
        <header className="flex flex-col gap-5 border-white/14 border-b pb-5 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
          <p className="editorial-label shrink-0 text-[#eee7dc]/74">{label}</p>
          <h2 className="sr-only">{headline}</h2>
          <p className="max-w-[31rem] text-sm leading-relaxed text-[#eee7dc]/66 sm:text-right md:text-[0.95rem]">
            {subtitle}
          </p>
        </header>

        <AnimatedContainer
          trigger="scroll"
          fadeDirection="up"
          offset={12}
          duration={0.5}
          className="mt-10 grid gap-14 pl-[7px] md:mt-12 md:grid-cols-4 md:gap-0 md:pl-0"
        >
          {timelineData.map((item, index) => (
            <article
              key={item.id}
              className="group relative border-[#bdb3a5]/42 border-l pl-6 md:border-l-0 md:pl-0"
            >
              <div className="flex min-h-0 items-center motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:-translate-y-1 md:h-[15.5rem] md:px-4 lg:px-6 xl:px-8">
                <EvidenceArtifact item={item} index={index} />
              </div>

              <div className="relative mt-8 md:mt-0 md:border-[#bdb3a5]/58 md:border-t">
                <span
                  aria-hidden="true"
                  className={`absolute -left-[31px] -top-[7px] size-3.5 rounded-full border bg-[var(--dark-background)] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-110 md:left-[11%] ${
                    index === 1
                      ? "border-primary bg-primary shadow-[0_0_0_4px_var(--dark-background),0_0_0_5px_var(--primary)]"
                      : "border-[#bdb3a5] shadow-[0_0_0_4px_var(--dark-background),0_0_0_5px_rgb(189_179_165/0.7)]"
                  }`}
                />

                <div className="pt-7 md:px-4 lg:px-6 xl:px-8">
                  <p
                    className={`font-mono text-xs ${index === 1 ? "text-primary" : "text-[#eee7dc]/68"}`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 max-w-[19ch] text-[1.35rem] leading-[1.08] font-normal tracking-[-0.035em] text-[#f2ece2] md:text-[1.25rem] lg:text-[1.45rem]">
                    {item.title}
                  </h3>
                  <div className="mt-4 text-sm leading-[1.55] text-[#e6ddd1]/66">
                    {item.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </AnimatedContainer>

        <MeasurementScale />

        {cta && ctaUrl ? (
          <div className="mt-7 flex justify-end">
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-11 items-center gap-2 border-white/48 border-b pt-0.5 text-sm font-medium text-[#f2ece2] transition-colors hover:border-primary hover:text-primary motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <span>{cta}</span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
              />
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
