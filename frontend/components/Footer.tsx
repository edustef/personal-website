import Link from "next/link";
import { profileQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { cn } from "@/lib/utils";

export async function Footer({ className }: { className?: string }) {
  const { data: profile } = await sanityFetch({
    query: profileQuery,
  });

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "bg-secondary text-secondary-foreground relative overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[url(/images/tile-grid-black.png)] opacity-5" />
      <div className="relative container py-16">
        <div className="mx-auto max-w-6xl">
          {/* <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-3">
            <div>
              <h3 className="gradient-text-animated mb-4 text-2xl font-bold">
                {profile?.name || "Portfolio"}
              </h3>
              <p className="leading-relaxed">
                {Array.isArray(profile?.about)
                  ? profile.about[0]?.value
                  : profile?.about || "Web Developer"}
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="hover:text-primary-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/posts"
                    className="hover:text-primary-400 transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resume"
                    className="hover:text-primary-400 transition-colors"
                  >
                    Resume
                  </Link>
                </li>
              </ul>
            </div>

            {profile?.socialLinks && profile.socialLinks.length > 0 && (
              <div>
                <h4 className="mb-4 text-lg font-semibold">Connect</h4>
                <ul className="space-y-2">
                  {profile.socialLinks.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary-400 inline-flex items-center gap-2 transition-colors"
                      >
                        {link.platform}
                        <svg
                          className="h-4 w-4"
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
          </div> */}

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-sm">
              © {currentYear} {profile?.name || "Portfolio"}. Built with
              Next.js & Sanity.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
