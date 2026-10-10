import { useCallback, useEffect, useMemo, useState } from 'react'
import { Modal } from './Modal'
import { CategoryFilter } from './CategoryFilter'
import { ImageIcon, PlusIcon } from './Icons'
import { photography } from '@/content/portfolio'

/**
 * Photography gallery.
 *
 * Fixed 4:5 frames keep the grid even whatever the source dimensions.
 * Images open in a lightbox with arrow-key navigation. Empty categories show
 * clearly-labelled frames rather than stock photography.
 */
export function PhotoPortfolio() {
  const [filter, setFilter] = useState('All')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const { counts, visible } = useMemo(() => {
    const counts = new Map<string, number>()
    for (const category of photography.categories) counts.set(category, 0)

    for (const photo of photography.projects) {
      if (counts.has(photo.category)) {
        counts.set(photo.category, (counts.get(photo.category) ?? 0) + 1)
      }
    }

    const matching =
      filter === 'All'
        ? photography.projects.filter((p) => photography.categories.includes(p.category))
        : photography.projects.filter((p) => p.category === filter)

    const visible = [...matching].sort(
      (a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER),
    )

    return { counts, visible }
  }, [filter])

  const placeholders = Math.max(0, photography.emptySlots - visible.length)
  const active = lightboxIndex !== null ? visible[lightboxIndex] : undefined

  const step = useCallback(
    (delta: number) => {
      setLightboxIndex((current) => {
        if (current === null || visible.length === 0) return current
        return (current + delta + visible.length) % visible.length
      })
    },
    [visible.length],
  )

  // Left/right arrows move between images while the lightbox is open.
  useEffect(() => {
    if (lightboxIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxIndex, step])

  return (
    <div>
      <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">{photography.heading}</h3>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{photography.supporting}</p>

      <CategoryFilter
        categories={photography.categories}
        value={filter}
        onChange={(category) => {
          setFilter(category)
          setLightboxIndex(null)
        }}
        label="Photography categories"
        counts={counts}
      />

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setLightboxIndex(index)}
            className="group block w-full text-left"
            aria-label={`View ${photo.title}`}
          >
            <div className="aspect-[4/5] w-full overflow-hidden rounded-card border border-line bg-surface">
              <img
                src={photo.image}
                alt={photo.alt ?? photo.title}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <p className="mt-2.5 text-xs font-medium text-muted transition-colors group-hover:text-ink">
              {photo.title}
            </p>
          </button>
        ))}

        {Array.from({ length: placeholders }).map((_, index) => (
          <EmptyPhotoSlot key={`empty-${filter}-${index}`} />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-5 text-xs text-muted/70">
          {filter === 'All'
            ? 'No photographs added yet — the frames above are empty placeholders.'
            : `No photographs in “${filter}” yet.`}
        </p>
      )}

      <Modal
        open={active !== undefined}
        onClose={() => setLightboxIndex(null)}
        label={active ? `${active.title} — photograph` : 'Photograph'}
        footer={
          visible.length > 1 ? (
            <div className="mt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => step(-1)}
                className="btn-ghost !px-4 !py-2 text-xs"
              >
                Previous
              </button>
              <span className="text-xs text-muted">
                {(lightboxIndex ?? 0) + 1} of {visible.length}
              </span>
              <button type="button" onClick={() => step(1)} className="btn-ghost !px-4 !py-2 text-xs">
                Next
              </button>
            </div>
          ) : undefined
        }
      >
        {active && (
          <figure className="overflow-hidden rounded-card border border-line bg-black">
            <img
              src={active.image}
              alt={active.alt ?? active.title}
              className="max-h-[72vh] w-full object-contain"
            />
            <figcaption className="border-t border-line bg-surface px-5 py-4">
              <p className="text-sm font-semibold text-ink">{active.title}</p>
              <p className="mt-0.5 text-xs uppercase tracking-wider text-muted">{active.category}</p>
              {active.description && (
                <p className="mt-2 text-sm leading-relaxed text-muted">{active.description}</p>
              )}
            </figcaption>
          </figure>
        )}
      </Modal>
    </div>
  )
}

/** Intentionally empty image frame, hidden from assistive technology. */
function EmptyPhotoSlot() {
  return (
    <div aria-hidden className="select-none">
      <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2.5 rounded-card border border-dashed border-line bg-surface/40">
        <ImageIcon className="h-6 w-6 text-line-strong" />
        <span className="flex items-center gap-1.5 px-2 text-center text-[11px] font-medium text-muted/70">
          <PlusIcon className="h-3 w-3 shrink-0" />
          Add photograph
        </span>
      </div>
      <div className="mt-2.5 h-2 w-1/2 rounded-full bg-line" />
    </div>
  )
}
