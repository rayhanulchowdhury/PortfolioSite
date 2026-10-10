import { useState } from 'react'
import { CalendarIcon } from './Icons'
import { openScheduling, schedulingEnabled } from '@/lib/scheduling'

/**
 * "Book a Call" button.
 *
 * With VITE_CALENDLY_URL configured it opens the real scheduling popup.
 * Without it, the button scrolls to the enquiry form — it never implies that
 * a call has been booked or shows invented availability.
 */

interface BookCallButtonProps {
  className?: string
  variant?: 'solid' | 'outline'
  label?: string
  /** Called after the click is handled, e.g. to close the mobile menu. */
  onNavigate?: () => void
}

export function BookCallButton({
  className = '',
  variant = 'solid',
  label = 'Book a Call',
  onNavigate,
}: BookCallButtonProps) {
  const [busy, setBusy] = useState(false)

  const handleClick = async () => {
    onNavigate?.()

    if (!schedulingEnabled) {
      document.getElementById('contact')?.scrollIntoView({ block: 'start' })
      return
    }

    setBusy(true)
    const opened = await openScheduling()
    setBusy(false)

    if (!opened) {
      document.getElementById('contact')?.scrollIntoView({ block: 'start' })
    }
  }

  const styles = variant === 'outline' ? 'btn-ghost !border-purple/60 text-purple-soft hover:!border-purple hover:bg-purple/10' : 'btn-primary'

  return (
    <button type="button" onClick={handleClick} disabled={busy} className={`${styles} ${className}`}>
      <CalendarIcon className="h-4 w-4" />
      {busy ? 'Opening…' : label}
    </button>
  )
}
