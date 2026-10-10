import { Section } from './Section'
import { services } from '@/content/services'
import { CameraIcon, EditIcon, FilmIcon, ArrowIcon } from './Icons'

const icons = {
  edit: EditIcon,
  camera: CameraIcon,
  film: FilmIcon,
}

interface ServicesProps {
  /** Pre-selects the service in the enquiry form and scrolls to it. */
  onEnquire: (service: string) => void
}

export function Services({ onEnquire }: ServicesProps) {
  return (
    <Section
      id="services"
      eyebrow="Services"
      title="What we do"
      lead="Three disciplines, offered individually or together as a complete production."
      tinted
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = icons[service.icon]
          return (
            <article
              key={service.id}
              className="card group flex flex-col p-7 transition-colors duration-300 hover:border-line-strong"
            >
              <Icon className="h-6 w-6 text-purple" />

              <h3 className="mt-5 text-xl font-bold tracking-tight">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{service.description}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {service.categories.map((category) => (
                  <li
                    key={category}
                    className="rounded-full border border-line bg-surface-2 px-3 py-1.5 text-xs text-muted"
                  >
                    {category}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-7">
                <button
                  type="button"
                  onClick={() => onEnquire(service.enquiryValue)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-soft transition-colors hover:text-purple"
                >
                  Enquire About This Service
                  <ArrowIcon className="h-3.5 w-3.5" />
                </button>
                <a
                  href={service.portfolioHref}
                  className="text-sm font-medium text-muted transition-colors hover:text-ink"
                >
                  View work
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </Section>
  )
}
