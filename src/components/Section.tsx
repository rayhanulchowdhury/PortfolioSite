import type { ReactNode } from 'react'

/**
 * Shared section wrapper. Keeps vertical rhythm, the content width and the
 * heading hierarchy identical across the whole page.
 */

interface SectionProps {
  id: string
  eyebrow?: string
  title?: string
  /** Short supporting line shown under the title. */
  lead?: string
  children: ReactNode
  /** Adds the lifted charcoal background used to separate adjacent sections. */
  tinted?: boolean
  className?: string
}

export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  tinted = false,
  className = '',
}: SectionProps) {
  const labelId = title ? `${id}-title` : undefined

  return (
    <section
      id={id}
      aria-labelledby={labelId}
      className={`scroll-mt-24 border-t border-line py-20 sm:py-24 lg:py-28 ${
        tinted ? 'bg-surface/40' : ''
      } ${className}`}
    >
      <div className="shell">
        {(eyebrow || title || lead) && (
          <header className="max-w-2xl">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && (
              <h2
                id={labelId}
                className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]"
              >
                {title}
              </h2>
            )}
            {lead && <p className="mt-4 text-base leading-relaxed text-muted">{lead}</p>}
          </header>
        )}
        <div className={eyebrow || title || lead ? 'mt-12 sm:mt-14' : ''}>{children}</div>
      </div>
    </section>
  )
}
