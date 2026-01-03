"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

function DisplayCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="display-card"
      className={cn(
        "relative flex h-36 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 bg-muted/70 backdrop-blur-sm px-4 py-3 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-background after:to-transparent after:content-[''] hover:border-white/20 hover:bg-muted",
        className
      )}
      {...props}
    />
  );
}

function DisplayCardIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="display-card-icon"
      className={cn(
        "relative inline-block rounded-full bg-blue-800 p-1",
        className
      )}
      {...props}
    />
  );
}

function DisplayCardTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="display-card-title"
      className={cn("text-lg font-medium text-blue-500", className)}
      {...props}
    />
  );
}

function DisplayCardDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="display-card-description"
      className={cn("whitespace-nowrap text-lg", className)}
      {...props}
    />
  );
}

function DisplayCardDate({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="display-card-date"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

function DisplayCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="display-card-content"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

function DisplayCards({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const childrenArray = React.Children.toArray(children);
  const cards = childrenArray.slice(0, 3);

  const defaultClasses = [
    "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
  ];

  return (
    <div
      className={cn(
        "grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700",
        className
      )}
      {...props}
    >
      {cards.map((card, index) => {
        if (React.isValidElement(card)) {
          const element = card as React.ReactElement<{
            className?: string;
            key?: string | number;
          }>;
          const key = element.key ?? `display-card-${index}`;
          return React.cloneElement(element, {
            key,
            className: cn(element.props.className, defaultClasses[index]),
          });
        }
        return card;
      })}
    </div>
  );
}

export {
  DisplayCard,
  DisplayCardIcon,
  DisplayCardTitle,
  DisplayCardDescription,
  DisplayCardDate,
  DisplayCardContent,
  DisplayCards,
};
