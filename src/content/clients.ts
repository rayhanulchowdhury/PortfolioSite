/**
 * Clients & collaborators.
 *
 * This list is EMPTY on purpose. Only add companies you have genuinely worked
 * with. While the list is empty the section shows neutral, clearly-labelled
 * placeholder tiles that do not imply any real relationship.
 *
 * To add a client:
 *   1. Put the logo in `public/clients/` (SVG or transparent PNG is best).
 *   2. Add an entry below.
 *
 *   { name: 'Client Name', logo: '/clients/client-name.svg', url: 'https://…' }
 *
 * `url` is optional — with it, the logo becomes a link.
 */

export interface Client {
  name: string
  logo: string
  url?: string
}

export const clients: Client[] = []

/** Number of neutral placeholder tiles shown while `clients` is empty. */
export const clientPlaceholderCount = 6
