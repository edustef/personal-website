import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { certificates } from "@/lib/data/certificates";
import { format } from "date-fns";
import { Award, ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";

type CertificatesSectionProps = {
  certificates?: typeof certificates;
  locale: string;
};

export default async function CertificatesSection({
  certificates: certificatesProp,
  locale,
}: CertificatesSectionProps) {
  const certificatesToDisplay = certificatesProp || certificates;

  if (!certificatesToDisplay || certificatesToDisplay.length === 0) {
    return null;
  }

  const t = await getTranslations({ locale, namespace: "certificates" });

  return (
    <section className="bg-muted/50 py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-16 text-center">
          <h2 className="text-foreground mb-4 text-4xl font-bold md:text-5xl">
            Certificates
          </h2>
          <p className="text-muted-foreground text-xl">
            Professional certifications and achievements
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificatesToDisplay.map((certificate) => {
            const formattedDate = certificate.dateIssued
              ? format(new Date(certificate.dateIssued), "MMM yyyy")
              : null;

            return (
              <Card key={certificate._id} className="flex flex-col border-muted bg-background/50 backdrop-blur-sm overflow-hidden shadow-lg">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Award className="text-primary mt-1 h-6 w-6 shrink-0" />
                    <CardTitle className="text-xl">
                      {certificate.title}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  {t(certificate.descriptionKey) &&
                    t(certificate.descriptionKey).length > 0 && (
                      <div className="text-muted-foreground prose prose-sm max-w-none text-sm whitespace-pre-line">
                        {t(certificate.descriptionKey)}
                      </div>
                    )}
                  {formattedDate && (
                    <p className="text-muted-foreground text-sm">
                      Issued: {formattedDate}
                    </p>
                  )}
                </CardContent>

                {certificate.link && (
                  <CardFooter>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <a
                        href={certificate.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Certificate
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardFooter>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
