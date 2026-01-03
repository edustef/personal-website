import {
  BookOpen,
  Calendar,
  CheckCircle,
  ClipboardList,
  Code,
  Eye,
  FileText,
  Gauge,
  GitBranch,
  Globe,
  Headphones,
  MessageSquare,
  Rocket,
  Server,
  Settings,
  Target,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { HowIWorkSectionClient } from "./how-i-work-section-client";

const steps = [
  {
    key: "planning",
    icon: ClipboardList,
    bulletIcons: [Target, Calendar, FileText],
  },
  {
    key: "development",
    icon: Code,
    bulletIcons: [Eye, MessageSquare, GitBranch],
  },
  {
    key: "deployment",
    icon: Rocket,
    bulletIcons: [Server, Globe, Gauge],
  },
  {
    key: "postDeployment",
    icon: CheckCircle,
    bulletIcons: [BookOpen, Headphones, Settings],
  },
];

export default async function HowIWorkSection() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "howIWork" });

  const timelineData = steps.map((step) => {
    const paragraphs = t.raw(`${step.key}.paragraphs`) as string[];
    const bulletPoints = t.raw(`${step.key}.bulletPoints`) as string[];

    return {
      id: step.key,
      title: t(`${step.key}.title`),
      content: (
        <div key={step.key} className="text-lg space-y-6">
          {paragraphs && paragraphs.length > 0 && (
            <div className="space-y-4">
              {paragraphs.map((paragraph, idx) => (
                <p
                  key={`${step.key}-paragraph-${idx}`}
                  className="text-foreground font-normal leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {bulletPoints && bulletPoints.length > 0 && (
            <ul className="space-y-3">
              {bulletPoints.map((point, idx) => {
                const BulletIcon =
                  step.bulletIcons[idx % step.bulletIcons.length];
                return (
                  <li
                    key={`${step.key}-bullet-${idx}`}
                    className="flex items-start gap-3 text-foreground"
                  >
                    <div className="text-primary mt-0.5 flex size-6 shrink-0 items-center justify-center rounded">
                      <BulletIcon className="size-5" />
                    </div>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ),
    };
  });

  return (
    <HowIWorkSectionClient
      label={t("label")}
      headline={t("headline")}
      subtitle={t("subtitle")}
      timelineData={timelineData}
    />
  );
}
