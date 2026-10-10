import { Section } from './Section'
import { about } from '@/content/about'

/**
 * Two-column story section: narrative on the left, a restrained factual
 * panel on the right. All copy lives in `src/content/about.ts`.
 */
export function About() {
  return (
    <Section id="about" eyebrow={about.eyebrow} title={about.heading}>
      <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
        <div className="space-y-5">
          {about.story.map((paragraph, index) => (
            <p
              key={index}
              className={`leading-relaxed ${
                index === 0 ? 'text-lg text-ink' : 'text-base text-muted'
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <aside className="card h-fit p-7 lg:sticky lg:top-28">
          <p className="eyebrow">At a glance</p>
          <dl className="mt-6 space-y-5">
            {about.details.map((detail) => (
              <div key={detail.label} className="border-b border-line pb-5 last:border-0 last:pb-0">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted">
                  {detail.label}
                </dt>
                <dd className="mt-1.5 text-sm font-medium leading-relaxed text-ink">
                  {detail.value}
                </dd>
              </div>
            ))}
          </dl>

          {about.note && (
            <p className="mt-7 flex items-start gap-2.5 text-sm leading-relaxed text-muted">
              <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple" />
              {about.note}
            </p>
          )}
        </aside>
      </div>
    </Section>
  )
}
