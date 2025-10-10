import Image from 'next/image'
import Link from 'next/link'
import {urlForImage} from '@/sanity/lib/utils'

type HeroSectionProps = {
  headline: string
  tagline?: string
  profile?: {
    name: string
    picture?: any
    motto?: any
  }
  ctaButtons?: Array<{
    text: string
    link: {
      href: string
      external?: boolean
    }
  }>
}

export default function HeroSection({headline, tagline, profile, ctaButtons}: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 opacity-60" />
      <div className="absolute inset-0 bg-[url(/images/tile-grid-black.png)] opacity-[0.02]" />

      <div className="container relative z-10 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8" style={{animation: 'var(--animate-slide-in-left)'}}>
              <div className="space-y-4">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                  <span className="gradient-text-animated block">{headline}</span>
                </h1>
                {tagline && (
                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                    {tagline}
                  </p>
                )}
              </div>

              {ctaButtons && ctaButtons.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {ctaButtons.map((button, index) => {
                    const isExternal = button.link.external
                    const isPrimary = index === 0

                    const buttonClasses = isPrimary
                      ? 'inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-full font-semibold text-lg shadow-elevation-medium hover:shadow-elevation-high hover:scale-105 transition-all duration-300'
                      : 'inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg shadow-elevation-medium hover:shadow-elevation-high hover:scale-105 transition-all duration-300 border border-gray-200'

                    if (isExternal) {
                      return (
                        <a
                          key={index}
                          href={button.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={buttonClasses}
                        >
                          {button.text}
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      )
                    }

                    return (
                      <Link key={index} href={button.link.href} className={buttonClasses}>
                        {button.text}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {profile?.picture && (
              <div
                className="flex justify-center lg:justify-end"
                style={{
                  animation: 'var(--animate-fade-in)',
                  animationDelay: '0.2s',
                  animationFillMode: 'both',
                }}
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full opacity-75 blur-2xl" />
                  <div className="relative glass-card rounded-full p-2 shadow-elevation-high">
                    <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden">
                      <Image
                        src={urlForImage(profile.picture)?.width(500).height(500).url() || ''}
                        alt={profile.name}
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

          {profile?.motto && (
            <div
              className="mt-16 text-center"
              style={{
                animation: 'var(--animate-slide-up)',
                animationDelay: '0.4s',
                animationFillMode: 'both',
              }}
            >
              <p className="text-2xl md:text-3xl font-light text-gray-700 italic">
                "{Array.isArray(profile.motto) ? profile.motto[0]?.value : profile.motto}"
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
