import { useEffect, useRef, useState } from 'react'
import { Logo } from './Logo'
import { MenuIcon, CloseIcon } from './Icons'
import { navLinks } from '@/content/site'
import { BookCallButton } from './BookCallButton'

/**
 * Fixed header. Compact by design: logo left, links right, one accent button.
 * Highlights whichever section is currently in view and collapses to a
 * dropdown panel on small screens.
 */
export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Solidify the header background once the page scrolls away from the top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy: mark the link whose section occupies the upper viewport.
  useEffect(() => {
    const ids = navLinks.map((link) => link.href.slice(1))
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActive(visible.target.id)
      },
      // Top band of the viewport, just below the fixed header.
      { rootMargin: '-88px 0px -65% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  // Close the mobile panel on Escape or on a click outside it.
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!panelRef.current?.contains(target) && !toggleRef.current?.contains(target)) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? 'border-b border-line bg-bg/90 backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      <div className="shell flex h-[72px] items-center justify-between gap-6">
        <a
          href="#home"
          className="flex shrink-0 items-center"
          aria-label="The Editing Plug — back to top"
        >
          <Logo height={44} />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = active === link.href.slice(1)
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'true' : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'text-ink' : 'text-muted hover:text-ink'
                }`}
              >
                {link.label}
              </a>
            )
          })}
          <BookCallButton className="ml-3 !px-5 !py-2.5 text-[13px]" variant="outline" />
        </nav>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink transition-colors hover:border-line-strong lg:hidden"
        >
          {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="border-t border-line bg-bg lg:hidden"
      >
        <nav aria-label="Mobile" className="shell flex flex-col gap-1 py-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                active === link.href.slice(1)
                  ? 'bg-surface text-ink'
                  : 'text-muted hover:bg-surface hover:text-ink'
              }`}
            >
              {link.label}
            </a>
          ))}
          <BookCallButton className="mt-3 w-full" onNavigate={() => setOpen(false)} />
        </nav>
      </div>
    </header>
  )
}
