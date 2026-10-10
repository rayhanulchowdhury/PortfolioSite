/**
 * Small, consistent line icons. All are 24x24, inherit `currentColor` and are
 * decorative — labels are always supplied by surrounding text.
 */

type IconProps = { className?: string }

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

export function EditIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M2.5 9h19M7 5v4M17 5v4M7 15h4" />
    </svg>
  )
}

export function CameraIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2a1.5 1.5 0 0 0 1.25-.67l.8-1.2A1.5 1.5 0 0 1 10 4.5h4a1.5 1.5 0 0 1 1.25.63l.8 1.2A1.5 1.5 0 0 0 17.3 7h2.2A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" />
      <circle cx="12" cy="13" r="3.4" />
    </svg>
  )
}

export function FilmIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2.5" y="5.5" width="13" height="13" rx="2" />
      <path d="m15.5 10.5 6-3v9l-6-3z" />
    </svg>
  )
}

export function PlayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" className={className}>
      <path d="M9 7.2a.9.9 0 0 1 1.37-.77l7.1 4.3a.9.9 0 0 1 0 1.54l-7.1 4.3A.9.9 0 0 1 9 15.8z" />
    </svg>
  )
}

export function ImageIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <circle cx="8.5" cy="10" r="1.6" />
      <path d="m4 17 4.8-4.3a1.6 1.6 0 0 1 2.2.05L15 16.5m0 0 1.9-1.7a1.6 1.6 0 0 1 2.1 0L20 15.7" />
    </svg>
  )
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 5.5v13M5.5 12h13" />
    </svg>
  )
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...base} strokeWidth={1.8} className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg {...base} strokeWidth={1.8} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
    </svg>
  )
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
