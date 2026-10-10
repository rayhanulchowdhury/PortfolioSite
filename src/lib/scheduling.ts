/**
 * Book-a-call integration point.
 *
 * Set VITE_CALENDLY_URL in `.env` to switch this on. Until then every
 * "Book a Call" button simply scrolls to the enquiry form — the site never
 * shows availability it cannot confirm.
 */

const RAW_URL = (import.meta.env.VITE_CALENDLY_URL ?? '').trim()

/** The configured scheduling URL, or null when booking is not set up. */
export const calendlyUrl: string | null = isValidHttpUrl(RAW_URL) ? RAW_URL : null

export const schedulingEnabled = calendlyUrl !== null

const WIDGET_CSS = 'https://assets.calendly.com/assets/external/widget.css'
const WIDGET_JS = 'https://assets.calendly.com/assets/external/widget.js'

interface CalendlyWidget {
  initPopupWidget: (options: { url: string }) => void
}

let widgetPromise: Promise<CalendlyWidget | null> | null = null

/**
 * Loads the Calendly widget on demand. Nothing is requested from Calendly
 * until a visitor actually clicks "Book a Call", so the page stays fast and
 * no third-party script runs for visitors who never use it.
 */
function loadWidget(): Promise<CalendlyWidget | null> {
  if (widgetPromise) return widgetPromise

  widgetPromise = new Promise((resolve) => {
    if (typeof document === 'undefined') return resolve(null)

    if (!document.querySelector(`link[href="${WIDGET_CSS}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = WIDGET_CSS
      document.head.appendChild(link)
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${WIDGET_JS}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(readWidget()))
      existing.addEventListener('error', () => resolve(null))
      // Already finished loading before we attached the listener.
      if (readWidget()) resolve(readWidget())
      return
    }

    const script = document.createElement('script')
    script.src = WIDGET_JS
    script.async = true
    script.onload = () => resolve(readWidget())
    script.onerror = () => resolve(null)
    document.head.appendChild(script)
  })

  return widgetPromise
}

function readWidget(): CalendlyWidget | null {
  const widget = (window as unknown as { Calendly?: CalendlyWidget }).Calendly
  return widget && typeof widget.initPopupWidget === 'function' ? widget : null
}

/**
 * Opens the booking popup. Returns false when booking is not configured or
 * the widget could not load, letting the caller fall back to the form.
 */
export async function openScheduling(): Promise<boolean> {
  if (!calendlyUrl) return false

  const widget = await loadWidget()
  if (!widget) {
    // Widget blocked or offline — open the real page rather than failing silently.
    window.open(calendlyUrl, '_blank', 'noopener,noreferrer')
    return true
  }

  widget.initPopupWidget({ url: calendlyUrl })
  return true
}

function isValidHttpUrl(value: string): boolean {
  if (!value) return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}
