import { format } from "date-fns";
import { PortableText } from "@portabletext/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Award } from "lucide-react";
import { localizeBlockContent } from "@/sanity/lib/localization";
type Certificate = any;

type CertificatesSectionProps = {
  certificates: Certificate[];
  locale: string;
};

export default function CertificatesSection({
  certificates,
  locale,
}: CertificatesSectionProps) {
  if (!certificates || certificates.length === 0) {
    return null;
  }

  return (
    <section className="bg-muted/50 py-24">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-foreground mb-4 text-4xl font-bold md:text-5xl">
              Certificates
            </h2>
            <p className="text-muted-foreground text-xl">
              Professional certifications and achievements
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((certificate) => {
              const description = localizeBlockContent(
                certificate.description,
                locale,
              );
              const formattedDate = certificate.issueDate
                ? format(new Date(certificate.issueDate), "MMM yyyy")
                : null;

              return (
                <Card key={certificate._id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <Award className="text-primary mt-1 h-6 w-6 shrink-0" />
                      <CardTitle className="text-xl">
                        {certificate.title}
                      </CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    {description && description.length > 0 && (
                      <div className="text-muted-foreground prose prose-sm max-w-none text-sm">
                        <PortableText value={description} />
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
      </div>
    </section>
  );
}
