import { Section } from './Section'
import { PlusIcon } from './Icons'
import { clients, clientPlaceholderCount, type Client } from '@/content/clients'

/**
 * Clients & collaborators.
 *
 * While `clients` is empty this renders neutral, explicitly-labelled tiles.
 * No company name or logo is ever shown unless it has been added by hand to
 * `src/content/clients.ts`.
 */
export function Clients() {
  const isEmpty = clients.length === 0

  return (
    <Section
      id="clients"
      eyebrow="Clients"
      title="Clients & Collaborators"
      lead="Building creative partnerships with brands, businesses and individuals."
      tinted
    >
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
        {isEmpty
          ? Array.from({ length: clientPlaceholderCount }).map((_, index) => (
              <EmptyClientSlot key={index} />
            ))
          : clients.map((client) => <ClientTile key={client.name} client={client} />)}
      </div>

      {isEmpty && (
        <p className="mt-5 text-xs leading-relaxed text-muted">
          These are empty placeholders, not clients. Logos will appear here as partnerships are
          added.
        </p>
      )}
    </Section>
  )
}

function ClientTile({ client }: { client: Client }) {
  const logo = (
    <img
      src={client.logo}
      alt={client.name}
      loading="lazy"
      decoding="async"
      className="max-h-10 w-auto max-w-[70%] object-contain opacity-70 transition-opacity duration-300 group-hover:opacity-100"
    />
  )

  return (
    <div className="group flex aspect-[3/2] items-center justify-center bg-surface p-5">
      {client.url ? (
        <a
          href={client.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-full w-full items-center justify-center"
          aria-label={`${client.name} (opens in a new tab)`}
        >
          {logo}
        </a>
      ) : (
        logo
      )}
    </div>
  )
}

function EmptyClientSlot() {
  return (
    <div
      aria-hidden
      className="flex aspect-[3/2] select-none flex-col items-center justify-center gap-2 bg-surface/60 p-4"
    >
      <PlusIcon className="h-4 w-4 text-line-strong" />
      <span className="text-center text-[11px] font-medium text-muted/70">Add client logo</span>
    </div>
  )
}
