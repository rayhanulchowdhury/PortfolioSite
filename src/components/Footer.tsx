import { Logo } from './Logo'
import { navLinks, site, socials } from '@/content/site'

/**
 * Footer. Every detail here comes from `src/content/site.ts` — anything left
 * blank there is simply not rendered, so no contact details or social
 * accounts are ever invented.
 */
export function Footer() {
  const year = new Date().getFullYear()
  const activeSocials = socials.filter((social) => social.url.trim() !== '')
  // With no contact details filled in there is nothing honest to show, so the
  // column is dropped entirely rather than left as an empty heading.
  const hasContactDetails =
    Boolean(site.email || site.phone || site.location) || activeSocials.length > 0

  return (
    <footer className="border-t border-line bg-surface/30">
      <div className="shell py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <a href="#home" className="inline-flex" aria-label="The Editing Plug — back to top">
              <Logo height={56} />
            </a>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              {site.brandStatement}
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="eyebrow">Navigate</h2>
            <ul className="mt-5 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {(hasContactDetails || import.meta.env.DEV) && (
          <div>
            <h2 className="eyebrow">Get in touch</h2>
            <ul className="mt-5 space-y-2.5">
              {site.email && (
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {site.email}
                  </a>
                </li>
              )}
              {site.phone && <li className="text-sm text-muted">{site.phone}</li>}
              {site.location && <li className="text-sm text-muted">{site.location}</li>}

              {activeSocials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>

            {import.meta.env.DEV && !hasContactDetails && (
              <p className="mt-5 text-xs leading-relaxed text-muted/70">
                Add your email and social links in{' '}
                <code className="text-muted">src/content/site.ts</code>.
              </p>
            )}
          </div>
          )}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            Founded by <span className="text-ink">{site.founder}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
