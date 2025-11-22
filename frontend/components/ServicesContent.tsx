"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Check, ChevronLeft, Clock, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ServiceView } from "@/sanity.types";
import { localizeBlockContent, localizeField } from "@/lib/i18n";
import CustomPortableText from "./PortableText";
import { useLocale } from "@/app/[locale]/locale-provider";

type ServicesContentProps = {
  viewData: ServiceView;
  onBack?: () => void;
};

export function ServicesContent({ viewData, onBack }: ServicesContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.delete("audience");
    router.push(`${pathname}?${params.toString()}`);
  };

  const {
    heroHeadline,
    heroDescription,
    packages,
    addOns,
    maintenancePlans,
    process,
  } = viewData;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to selection
        </Button>
        <div className="max-w-3xl">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {localizeField(heroHeadline, locale)}
          </h1>
          <p className="text-muted-foreground text-xl leading-relaxed">
            {localizeField(heroDescription, locale)}
          </p>
        </div>
      </div>

      {/* Packages */}
      {packages && packages.length > 0 && (
        <section className="mb-24">
          <h2 className="mb-12 text-3xl font-bold">Project Packages</h2>
          <div className="grid gap-8 lg:grid-cols-3">
            {packages.map((pkg, index) => (
              <Card
                key={index}
                className={`flex flex-col ${
                  pkg.isPopular
                    ? "border-primary ring-primary border-2 ring-1"
                    : ""
                }`}
              >
                <CardHeader>
                  {pkg.isPopular && (
                    <Badge className="mb-2 w-fit" variant="default">
                      Most Popular
                    </Badge>
                  )}
                  <CardTitle className="text-2xl">
                    {localizeField(pkg.name, locale)}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {pkg.bestFor && (
                      <span className="mb-2 block">
                        Best for: {localizeField(pkg.bestFor)}
                      </span>
                    )}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{pkg.price}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground mb-6">
                    <CustomPortableText
                      value={localizeBlockContent(pkg.description, locale)}
                    />
                  </p>
                  {pkg.timeline && (
                    <div className="mb-6 flex items-center gap-2 text-sm font-medium">
                      <Clock className="h-4 w-4" />
                      <span>{localizeField(pkg.timeline)}</span>
                    </div>
                  )}
                  <div className="space-y-3">
                    {pkg.deliverables?.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-green-500" />
                        <span className="text-sm">
                          {localizeField(item, locale)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={pkg.isPopular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Add-ons */}
      {addOns && addOns.length > 0 && (
        <section className="mb-24">
          <h2 className="mb-12 text-3xl font-bold">Strategic Add-Ons</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {addOns.map((addon, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {localizeField(addon.name)}
                  </CardTitle>
                  <div className="text-primary mt-2 text-xl font-bold">
                    {addon.price}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {localizeField(addon.description, locale)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Maintenance */}
      {maintenancePlans && maintenancePlans.length > 0 && (
        <section className="mb-24">
          <h2 className="mb-12 text-3xl font-bold">Maintenance & Care</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {maintenancePlans.map((plan, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {localizeField(plan.name, locale)}
                  </CardTitle>
                  <div className="mt-2 text-3xl font-bold">{plan.price}</div>
                  {plan.description && (
                    <CardDescription className="mt-2 text-base">
                      <CustomPortableText
                        value={localizeBlockContent(plan.description, locale)}
                      />
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    {plan.features?.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-green-500" />
                        <span>{localizeField(feature, locale)}</span>
                      </div>
                    ))}
                    {plan.notIncluded?.map((feature, i) => (
                      <div
                        key={i}
                        className="text-muted-foreground flex items-start gap-2"
                      >
                        <X className="mt-1 h-4 w-4 shrink-0" />
                        <span>{localizeField(feature, locale)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Choose Plan</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Process */}
      {process && process.length > 0 && (
        <section>
          <h2 className="mb-12 text-3xl font-bold">The Process</h2>
          <div className="border-muted relative ml-4 space-y-12 border-l md:ml-12">
            {process.map((step, index) => (
              <div key={index} className="relative pl-8 md:pl-12">
                <div className="bg-primary text-primary-foreground absolute top-2 -left-3 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold md:-left-4 md:h-8 md:w-8 md:text-sm">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  {localizeField(step.title, locale)}
                </h3>
                <p className="text-muted-foreground max-w-2xl">
                  <CustomPortableText
                    value={localizeBlockContent(step.description, locale)}
                  />
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
