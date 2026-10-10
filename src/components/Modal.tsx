import { useEffect, useRef, type ReactNode } from 'react'
import { CloseIcon } from './Icons'

/**
 * Accessible dialog used by the video player and the photo lightbox.
 * Locks background scroll, traps Tab focus, closes on Escape or backdrop
 * click, and restores focus to the element that opened it.
 */

interface ModalProps {
  open: boolean
  onClose: () => void
  /** Accessible name for the dialog. */
  label: string
  children: ReactNode
  /** Extra controls rendered under the content, e.g. lightbox arrows. */
  footer?: ReactNode
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, iframe, video, [tabindex]:not([tabindex="-1"])'

export function Modal({ open, onClose, label, children, footer }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    restoreRef.current = document.activeElement as HTMLElement | null
    closeRef.current?.focus()

    // Prevent the page behind the dialog from scrolling.
    const { overflow, paddingRight } = document.body.style
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      ).filter((el) => el.offsetParent !== null || el.tagName === 'IFRAME')

      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const current = document.activeElement

      if (event.shiftKey && current === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && current === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)

    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
      restoreRef.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/85 p-4 animate-fade-in sm:p-8"
      onMouseDown={(event) => {
        // Only close when the backdrop itself is pressed, not the content.
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="relative w-full max-w-5xl"
      >
        <div className="mb-3 flex justify-end">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-surface text-ink transition-colors hover:border-purple hover:text-purple-soft"
            aria-label="Close"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {children}
        {footer}
      </div>
    </div>
  )
}
