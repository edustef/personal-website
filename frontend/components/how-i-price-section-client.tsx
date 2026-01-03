"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, ChevronUp, Clock, Euro } from "lucide-react";
import { useTranslations } from "next-intl";
import { createContext, useContext, useState } from "react";

type ExpandContextType = {
  isExpanded: boolean;
  toggleExpanded: () => void;
};

const ExpandContext = createContext<ExpandContextType | undefined>(undefined);

export function PackageCardsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ExpandContext.Provider
      value={{
        isExpanded,
        toggleExpanded: () => setIsExpanded(!isExpanded),
      }}
    >
      {children}
    </ExpandContext.Provider>
  );
}

function useExpand() {
  const context = useContext(ExpandContext);
  if (!context) {
    throw new Error("useExpand must be used within PackageCardsProvider");
  }
  return context;
}

type PackageCardProps = {
  pkg: string;
  isPopular: boolean;
  title: string;
  bestFor: string;
  description: string;
  features: string[];
  timeline: string;
  investment: string;
};

export function PackageCard({
  pkg,
  isPopular,
  title,
  bestFor,
  description,
  features,
  timeline,
  investment,
}: PackageCardProps) {
  const t = useTranslations("howIPrice");
  const { isExpanded, toggleExpanded } = useExpand();
  const INITIAL_FEATURES_COUNT = 3;
  const visibleFeatures = isExpanded
    ? features
    : features.slice(0, INITIAL_FEATURES_COUNT);
  const hasMoreFeatures = features.length > INITIAL_FEATURES_COUNT;

  return (
    <Card
      className={cn(
        "relative flex h-full flex-col rounded-2xl",
        isPopular && "border-primary/50"
      )}
    >
      {isPopular && (
        <div className="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-sm font-medium">
          {t("packages.mostPopular")}
        </div>
      )}
      <CardContent className="p-6">
        <div className="mb-4">
          <h4 className="text-foreground mb-2 text-xl font-semibold">
            {title}
          </h4>
          <p className="text-muted-foreground mb-3 text-sm">{bestFor}</p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mb-6 space-y-3">
          <p className="text-foreground text-sm font-medium">
            {t("packages.whatYouGet")}:
          </p>
          <ul className="space-y-2">
            {visibleFeatures.map((feature) => (
              <li
                key={`${pkg}-${feature}`}
                className="text-muted-foreground flex items-start gap-2 text-sm"
              >
                <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {hasMoreFeatures && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            className="w-full"
          >
            {isExpanded ? (
              <>
                {t("packages.showLess")}
                <ChevronUp className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                {t("packages.showMore")}
                <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </CardContent>

      <CardFooter className="mt-auto border-t pt-6">
        <div className="grid w-full grid-cols-1 gap-4">
          <div className="flex items-center gap-3">
            <div className="text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                {t("packages.timeline")}
              </p>
              <p className="text-foreground text-sm font-semibold">
                {timeline}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
              <Euro className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                {t("packages.investment")}
              </p>
              <p className="text-foreground text-lg font-bold">
                {investment}
              </p>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

