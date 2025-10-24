import {format} from 'date-fns'
import {PortableText} from '@portabletext/react'
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {ExternalLink, Award} from 'lucide-react'
import {localizeBlockContent, type LanguageId} from '@/lib/i18n'

type Certificate = any

type CertificatesSectionProps = {
  certificates: Certificate[]
  locale: LanguageId
}

export default function CertificatesSection({certificates, locale}: CertificatesSectionProps) {
  if (!certificates || certificates.length === 0) {
    return null
  }

  return (
    <section className="py-24 bg-muted/50">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Certificates</h2>
            <p className="text-xl text-muted-foreground">
              Professional certifications and achievements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => {
              const description = localizeBlockContent(certificate.description, locale)
              const formattedDate = certificate.issueDate
                ? format(new Date(certificate.issueDate), 'MMM yyyy')
                : null

              return (
                <Card key={certificate._id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <Award className="h-6 w-6 text-primary mt-1 shrink-0" />
                      <CardTitle className="text-xl">{certificate.title}</CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    {description && description.length > 0 && (
                      <div className="text-sm text-muted-foreground prose prose-sm max-w-none">
                        <PortableText value={description} />
                      </div>
                    )}
                    {formattedDate && (
                      <p className="text-sm text-muted-foreground">Issued: {formattedDate}</p>
                    )}
                  </CardContent>

                  {certificate.link && (
                    <CardFooter>
                      <Button size="sm" variant="outline" className="w-full" asChild>
                        <a href={certificate.link} target="_blank" rel="noopener noreferrer">
                          View Certificate
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
