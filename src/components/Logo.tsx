import { useState } from 'react'

/**
 * The Editing Plug logo.
 *
 * Renders the supplied brand file from `public/brand/`. The artwork is used
 * as-is — never redrawn, recoloured or stretched (`object-contain` preserves
 * its proportions).
 *
 *   public/brand/logo.png       full wordmark, used in the header and footer
 *   public/brand/logo-mark.png  optional square plug mark, used as a fallback
 *
 * Until a file is present the component renders a plain typographic wordmark
 * so the header never shows a broken image. Drop the real file in and it is
 * picked up automatically — no code changes needed.
 */

const LOGO_SRC = '/brand/logo.png'

/**
 * The supplied artwork is a two-line stacked lockup ("the editing" above
 * "plug") at roughly 1.78:1. It therefore needs more height than a single-
 * line wordmark before the smaller "the" becomes hard to read.
 */

interface LogoProps {
  /** Rendered height in pixels. Width follows the logo's own aspect ratio. */
  height?: number
  className?: string
}

export function Logo({ height = 44, className = '' }: LogoProps) {
  const [unavailable, setUnavailable] = useState(false)

  if (unavailable) return <LogoFallback height={height} className={className} />

  return (
    <img
      src={LOGO_SRC}
      alt="The Editing Plug"
      style={{ height }}
      className={`w-auto object-contain ${className}`}
      onError={() => setUnavailable(true)}
      decoding="async"
    />
  )
}

/**
 * Typographic stand-in shown only when no logo file has been added yet.
 * This is NOT the brand logo — it deliberately avoids imitating the plug mark.
 */
function LogoFallback({ height, className }: { height: number; className: string }) {
  return (
    <span
      className={`inline-flex select-none items-baseline gap-1.5 font-extrabold leading-none tracking-tight ${className}`}
      style={{ fontSize: height * 0.55 }}
    >
      <span className="text-ink">the editing</span>
      <span className="text-purple">plug</span>
    </span>
  )
}
