import Link from 'next/link'
import {homeQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import {Button} from '@/components/ui/button'
import {FileText} from 'lucide-react'
import {localizeField, type LanguageId} from '@/lib/i18n'
import {ModeToggle} from '@/components/theme-toggle'

type HeaderProps = {
  locale: LanguageId
}

export default async function Header({locale}: HeaderProps) {
  const {data: home} = await sanityFetch({
    query: homeQuery,
  })

  const title = localizeField(home?.title, locale) || 'Portfolio'

  return (
    <header className="fixed z-50 h-24 inset-0 bg-background/80 flex items-center backdrop-blur-lg border-b border-border">
      <div className="container py-6">
        <div className="flex items-center justify-between gap-5">
          <Link className="flex items-center gap-2 group" href={`/${locale}`}>
            <span className="text-xl sm:text-2xl font-bold text-foreground hover:text-primary transition-colors">
              {title}
            </span>
          </Link>

          <nav>
            <ul
              role="list"
              className="flex items-center gap-4 md:gap-6 text-sm sm:text-base font-medium"
            >
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href={`/${locale}/posts`}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>

              <li>
                <Button size="sm" asChild>
                  <Link href={`/${locale}/resume`}>
                    <FileText className="mr-2 h-4 w-4" />
                    Resume
                  </Link>
                </Button>
              </li>
              <li>
                <ModeToggle />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
