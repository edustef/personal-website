import Link from 'next/link'
import {profileQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'

export default async function Footer() {
  const {data: profile} = await sanityFetch({
    query: profileQuery,
  })

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url(/images/tile-grid-black.png)] opacity-5" />
      <div className="container relative py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 gradient-text-animated">
                {profile?.name || 'Portfolio'}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {Array.isArray(profile?.about)
                  ? profile.about[0]?.value
                  : profile?.about || 'Web Developer'}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-primary-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/posts"
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resume"
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    Resume
                  </Link>
                </li>
              </ul>
            </div>

            {profile?.socialLinks && profile.socialLinks.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-4">Connect</h4>
                <ul className="space-y-2">
                  {profile.socialLinks.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2"
                      >
                        {link.platform}
                        <svg
                          className="w-4 h-4"
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
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} {profile?.name || 'Portfolio'}. Built with Next.js & Sanity.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
