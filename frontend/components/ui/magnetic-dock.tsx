"use client";

import { Link } from "@/components/ui/link";
import { cn } from "@/lib/utils";
import {
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { useRef } from "react";

export type MagneticDockItem = {
  id: string;
  label: string;
  href?: string;
  icon: ReactNode;
  active?: boolean;
  onSelect?: () => void;
};

type MagneticDockProps = {
  items: MagneticDockItem[];
  ariaLabel: string;
  className?: string;
  magnification?: number;
  influenceDistance?: number;
};

type DockProperties = CSSProperties & {
  "--dock-influence-distance": string;
  "--dock-magnification": number;
};

const RESTING_POINTER_POSITION = Number.POSITIVE_INFINITY;
const SPRING = { damping: 24, mass: 0.12, stiffness: 280 } as const;

function DockItem({
  item,
  pointerX,
  magnification,
  influenceDistance,
  reduceMotion,
}: {
  item: MagneticDockItem;
  pointerX: MotionValue<number>;
  magnification: number;
  influenceDistance: number;
  reduceMotion: boolean;
}) {
  const itemRef = useRef<HTMLLIElement>(null);
  const distance = useTransform(pointerX, (latestPointerX) => {
    const itemElement = itemRef.current;

    if (!itemElement || !Number.isFinite(latestPointerX)) {
      return influenceDistance;
    }

    const bounds = itemElement.getBoundingClientRect();
    return latestPointerX - (bounds.left + bounds.width / 2);
  });
  const scaleTarget = useTransform(
    distance,
    [-influenceDistance, 0, influenceDistance],
    [1, magnification, 1]
  );
  const scale = useSpring(scaleTarget, SPRING);
  const interactiveClassName = cn(
    "relative grid size-[var(--dock-item-size)] touch-manipulation place-items-center rounded-full p-0",
    "text-muted-foreground no-underline transition-[background-color,color,box-shadow] duration-200",
    "hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
    "active:bg-accent/80 motion-reduce:transition-none",
    item.active &&
      "bg-foreground text-background shadow-sm hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background"
  );
  const contents = (
    <>
      <span className="grid size-5 place-items-center" aria-hidden="true">
        {item.icon}
      </span>
      <span
        className={cn(
          "absolute -bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-current transition-opacity duration-200 motion-reduce:transition-none",
          item.active ? "opacity-100" : "opacity-0"
        )}
        aria-hidden="true"
      />
    </>
  );

  return (
    <motion.li
      ref={itemRef}
      className="group/dock-item relative grid shrink-0 place-items-center"
      style={{ scale: reduceMotion ? 1 : scale }}
    >
      {item.href ? (
        <Link
          aria-current={item.active ? "location" : undefined}
          aria-label={item.label}
          className={interactiveClassName}
          href={item.href}
          onClick={item.onSelect}
          variant="ghost"
        >
          {contents}
        </Link>
      ) : (
        <button
          aria-label={item.label}
          aria-pressed={item.active}
          className={interactiveClassName}
          onClick={item.onSelect}
          type="button"
        >
          {contents}
        </button>
      )}

      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-[calc(100%+0.75rem)] left-1/2 z-50 -translate-x-1/2 translate-y-1 whitespace-nowrap",
          "rounded-md border border-border bg-popover px-2 py-1 font-sans text-xs font-medium text-popover-foreground shadow-md",
          "opacity-0 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
          "group-hover/dock-item:translate-y-0 group-hover/dock-item:opacity-100",
          "group-focus-within/dock-item:translate-y-0 group-focus-within/dock-item:opacity-100"
        )}
        role="tooltip"
      >
        {item.label}
      </span>
    </motion.li>
  );
}

export function MagneticDock({
  items,
  ariaLabel,
  className,
  magnification = 1.34,
  influenceDistance = 112,
}: MagneticDockProps) {
  const pointerX = useMotionValue(RESTING_POINTER_POSITION);
  const reduceMotion = useReducedMotion() ?? false;

  const resetPointer = () => pointerX.set(RESTING_POINTER_POSITION);
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      pointerX.set(event.clientX);
    }
  };

  const dockProperties: DockProperties = {
    "--dock-influence-distance": `${influenceDistance}px`,
    "--dock-magnification": magnification,
  };

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul
        className={cn(
          "flex items-center gap-[var(--dock-gap)] rounded-[var(--dock-radius)] border border-border/70",
          "bg-background/90 p-1.5 shadow-sm backdrop-blur-md",
          "[--dock-gap:0.25rem] [--dock-item-size:2.75rem] [--dock-radius:9999px]",
          "lg:[--dock-gap:0.375rem] lg:[--dock-item-size:3rem]",
          "motion-reduce:transition-none"
        )}
        onPointerCancel={resetPointer}
        onPointerLeave={resetPointer}
        onPointerMove={handlePointerMove}
        style={dockProperties}
      >
        {items.map((item) => (
          <DockItem
            key={item.id}
            item={item}
            pointerX={pointerX}
            magnification={magnification}
            influenceDistance={influenceDistance}
            reduceMotion={reduceMotion}
          />
        ))}
      </ul>
    </nav>
  );
}
