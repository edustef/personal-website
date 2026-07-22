"use client";

import { MagneticDock } from "@/components/ui/magnetic-dock";
import { House, Layers3, Search, Settings, Sparkles } from "lucide-react";
import { useState } from "react";

type DockLabels = {
  home: string;
  search: string;
  layers: string;
  ideas: string;
  settings: string;
};

type MagneticDockDemoProps = {
  activeLabel: string;
  ariaLabel: string;
  category: string;
  description: string;
  index: string;
  instruction: string;
  labels: DockLabels;
  title: string;
};

const dockItems = [
  { id: "home", icon: <House className="size-5" strokeWidth={1.8} /> },
  { id: "search", icon: <Search className="size-5" strokeWidth={1.8} /> },
  { id: "layers", icon: <Layers3 className="size-5" strokeWidth={1.8} /> },
  { id: "ideas", icon: <Sparkles className="size-5" strokeWidth={1.8} /> },
  { id: "settings", icon: <Settings className="size-5" strokeWidth={1.8} /> },
] as const;

export function MagneticDockDemo({
  activeLabel,
  ariaLabel,
  category,
  description,
  index,
  instruction,
  labels,
  title,
}: MagneticDockDemoProps) {
  const [activeItem, setActiveItem] =
    useState<(typeof dockItems)[number]["id"]>("ideas");

  return (
    <article className="border-y border-border">
      <div className="grid gap-6 py-8 md:grid-cols-[7rem_1fr_auto] md:items-start md:py-10">
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          {index}
        </p>
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
            {category}
          </p>
          <h2 className="text-3xl tracking-tight text-foreground md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:max-w-44 md:justify-end">
          {["React", "Framer Motion", "Pointer Events"].map((technology) => (
            <span
              key={technology}
              className="rounded-full border border-border px-3 py-1 font-mono text-[0.65rem] tracking-wide text-muted-foreground uppercase"
            >
              {technology}
            </span>
          ))}
        </div>
      </div>

      <div className="relative isolate min-h-[24rem] overflow-hidden border-t border-border bg-card md:min-h-[28rem]">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <p
          aria-hidden="true"
          className="pointer-events-none absolute right-4 bottom-4 -z-10 hidden text-[clamp(5rem,14vw,11rem)] leading-none tracking-[-0.08em] text-foreground/[0.035] select-none md:block"
        >
          MAGNETIC
        </p>

        <div className="flex min-h-[24rem] flex-col items-center justify-center gap-14 px-4 py-16 md:min-h-[28rem]">
          <MagneticDock
            ariaLabel={ariaLabel}
            items={dockItems.map((item) => ({
              ...item,
              label: labels[item.id],
              active: activeItem === item.id,
              onSelect: () => setActiveItem(item.id),
            }))}
          />

          <div className="flex max-w-xl flex-col items-center gap-3 text-center">
            <p className="text-sm text-muted-foreground">{instruction}</p>
            <p
              className="font-mono text-xs tracking-[0.14em] text-foreground uppercase"
              aria-live="polite"
            >
              {activeLabel}: {labels[activeItem]}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
