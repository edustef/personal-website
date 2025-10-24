import Image from 'next/image'
import Link from 'next/link'
import {urlForImage} from '@/sanity/lib/utils'
import {Button} from '@/components/ui/button'
import {ExternalLink} from 'lucide-react'
import {localizeField, type LanguageId} from '@/lib/i18n'
import type {InternationalizedArrayString} from '@/sanity.types'

type HeroSectionProps = {
  headline: InternationalizedArrayString | null
  tagline: InternationalizedArrayString | null
  profile: any
  ctaButtons: any
  locale: LanguageId
}

export default function HeroSection({
  headline,
  tagline,
  profile,
  ctaButtons,
  locale,
}: HeroSectionProps) {
  const localizedHeadline = localizeField(headline, locale)
  const localizedTagline = localizeField(tagline, locale)
  const localizedMotto = localizeField(profile?.motto, locale)

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-background">
      <div className="container py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground">
                  {localizedHeadline || 'Welcome'}
                </h1>
                {localizedTagline && (
                  <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                    {localizedTagline}
                  </p>
                )}
              </div>

              {ctaButtons && ctaButtons.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {ctaButtons.map((button: any, index: number) => {
                    const isExternal = button.link?.external
                    const isPrimary = index === 0
                    const buttonText = localizeField(button.text, locale)

                    if (!button.link?.href) return null

                    if (isExternal) {
                      return (
                        <Button
                          key={index}
                          variant={isPrimary ? 'default' : 'outline'}
                          size="lg"
                          asChild
                        >
                          <a href={button.link.href} target="_blank" rel="noopener noreferrer">
                            {buttonText}
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      )
                    }

                    return (
                      <Button
                        key={index}
                        variant={isPrimary ? 'default' : 'outline'}
                        size="lg"
                        asChild
                      >
                        <Link href={button.link.href}>{buttonText}</Link>
                      </Button>
                    )
                  })}
                </div>
              )}
            </div>

            {profile?.picture && (
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="relative rounded-full border-4 border-border overflow-hidden">
                    <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                      <Image
                        src={urlForImage(profile.picture)?.width(500).height(500).url() || ''}
                        alt={profile.name || 'Profile'}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {localizedMotto && (
            <div className="mt-16 text-center">
              <p className="text-2xl md:text-3xl font-light text-muted-foreground italic">
                "{localizedMotto}"
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
