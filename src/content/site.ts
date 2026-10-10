/**
 * Global site details.
 * Everything a visitor can read, click or email is defined here.
 *
 * Fields left as empty strings are intentionally blank and will simply not be
 * rendered. Nothing here is invented — fill it in with your real details.
 */

export const site = {
  name: 'The Editing Plug',
  founder: 'Rayhanulc',
  tagline: 'Creative visuals. Made to make an impact.',
  brandStatement:
    'A creative studio offering video editing, photography and videography for brands, businesses and creators.',

  /** Your real contact email. Leave empty to hide the email link entirely. */
  email: '',

  /** Optional. Shown next to the email in the footer when provided. */
  phone: '',

  /** Optional. e.g. 'Birmingham, UK'. Shown in the footer when provided. */
  location: '',
}

/**
 * Social links. Add your real profile URLs.
 * Any entry with an empty `url` is automatically hidden from the site.
 */
export const socials: { label: string; url: string }[] = [
  { label: 'Instagram', url: '' },
  { label: 'YouTube', url: '' },
  { label: 'TikTok', url: '' },
  { label: 'LinkedIn', url: '' },
]

/** Navigation links. The `href` must match a section `id` in the page. */
export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Clients', href: '#clients' },
  { label: 'Contact', href: '#contact' },
]
