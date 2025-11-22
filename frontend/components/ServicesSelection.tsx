"use client";

import { motion } from "motion/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CodeXml, Rocket } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ServicesSelectionProps = {
  title: string | null;
  description: string | null;
  technicalLabel: string | null;
  technicalDescription: string | null;
  solutionLabel: string | null;
  solutionDescription: string | null;
};

export function ServicesSelection({
  title,
  description,
  technicalLabel,
  technicalDescription,
  solutionLabel,
  solutionDescription,
}: ServicesSelectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSelect = (audience: "technical" | "solution") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("audience", audience);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          {title || "Choose Your Path"}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          {description || "Select the option that best describes you."}
        </p>
      </div>

      <div className="grid w-full max-w-4xl gap-8 md:grid-cols-2">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer"
          onClick={() => handleSelect("technical")}
        >
          <Card className="bg-card hover:border-primary h-full border-2 transition-colors">
            <CardHeader>
              <div className="bg-primary/10 text-primary mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <CodeXml className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">
                {technicalLabel || "I know Tech"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {technicalDescription ||
                  "For developers, technical founders, and teams looking for specific stack expertise."}
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer"
          onClick={() => handleSelect("solution")}
        >
          <Card className="bg-card hover:border-primary h-full border-2 transition-colors">
            <CardHeader>
              <div className="bg-primary/10 text-primary mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Rocket className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">
                {solutionLabel || "I need a Solution"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {solutionDescription ||
                  "For business owners and individuals who want a complete, high-performance website."}
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

