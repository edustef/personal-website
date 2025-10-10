import Link from 'next/link'
import {homeQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'

export default async function Header() {
  const {data: home} = await sanityFetch({
    query: homeQuery,
  })

  return (
    <header className="fixed z-50 h-24 inset-0 bg-white/80 flex items-center backdrop-blur-lg border-b border-gray-100/50">
      <div className="container py-6">
        <div className="flex items-center justify-between gap-5">
          <Link className="flex items-center gap-2 group" href="/">
            <span className="text-xl sm:text-2xl font-bold gradient-text group-hover:gradient-text-animated">
              {home?.title || 'Portfolio'}
            </span>
          </Link>

          <nav>
            <ul
              role="list"
              className="flex items-center gap-6 md:gap-8 text-sm sm:text-base font-medium"
            >
              <li>
                <Link
                  href="/"
                  className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/posts"
                  className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
                >
                  Blog
                </Link>
              </li>

              <li>
                <Link
                  href="/resume"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 py-2 px-4 sm:py-2.5 sm:px-6 text-white transition-all duration-200 hover:shadow-glow-primary"
                >
                  <span className="whitespace-nowrap">Resume</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
