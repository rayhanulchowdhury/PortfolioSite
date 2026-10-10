import { useMemo, useState } from 'react'
import { Modal } from './Modal'
import { CategoryFilter } from './CategoryFilter'
import { PlayIcon, PlusIcon } from './Icons'
import { resolveVideo } from '@/lib/video'
import type { VideoProject, VideoSection } from '@/content/portfolio'

/**
 * Renders a video portfolio section (Video Editing or Videography).
 *
 * One grid at a time, filtered by category — this keeps the page compact
 * instead of stacking every category down the page. Empty categories show
 * clean, clearly-labelled frames rather than invented work.
 */

interface VideoPortfolioProps {
  section: VideoSection
}

export function VideoPortfolio({ section }: VideoPortfolioProps) {
  const [playing, setPlaying] = useState<VideoProject | null>(null)
  const [filter, setFilter] = useState('All')

  const { counts, visible } = useMemo(() => {
    const counts = new Map<string, number>()
    for (const category of section.categories) counts.set(category, 0)

    for (const project of section.projects) {
      if (counts.has(project.category)) {
        counts.set(project.category, (counts.get(project.category) ?? 0) + 1)
      }
    }

    const matching =
      filter === 'All'
        ? section.projects.filter((p) => section.categories.includes(p.category))
        : section.projects.filter((p) => p.category === filter)

    const visible = [...matching].sort(
      (a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER),
    )

    return { counts, visible }
  }, [section, filter])

  // Keep the grid looking deliberate while work is still being added.
  const placeholders = Math.max(0, section.emptySlots - visible.length)
  const video = playing ? resolveVideo(playing.videoUrl, playing.title) : null

  return (
    <div>
      <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">{section.heading}</h3>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{section.supporting}</p>

      <CategoryFilter
        categories={section.categories}
        value={filter}
        onChange={setFilter}
        label={`${section.heading} categories`}
        counts={counts}
      />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <VideoCard key={project.id} project={project} onPlay={() => setPlaying(project)} />
        ))}

        {Array.from({ length: placeholders }).map((_, index) => (
          <EmptyVideoSlot key={`empty-${filter}-${index}`} />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-5 text-xs text-muted/70">
          {filter === 'All'
            ? 'No projects added yet — the frames above are empty placeholders.'
            : `No projects in “${filter}” yet.`}
        </p>
      )}

      <Modal
        open={playing !== null}
        onClose={() => setPlaying(null)}
        label={playing ? `${playing.title} — video` : 'Video'}
      >
        <div className="overflow-hidden rounded-card border border-line bg-black">
          <div className="aspect-video w-full">
            {video?.kind === 'embed' && (
              <iframe
                src={video.src}
                title={video.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            )}

            {video?.kind === 'file' && (
              <video src={video.src} controls autoPlay playsInline className="h-full w-full">
                Your browser does not support embedded video.
              </video>
            )}

            {!video && (
              <div className="flex h-full items-center justify-center p-8 text-center text-sm text-muted">
                No playable video URL has been added for this project yet.
              </div>
            )}
          </div>
        </div>

        {playing && (
          <div className="mt-4">
            <p className="text-base font-semibold text-ink">{playing.title}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted">{playing.category}</p>
            {playing.description && (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                {playing.description}
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

function VideoCard({ project, onPlay }: { project: VideoProject; onPlay: () => void }) {
  const playable = resolveVideo(project.videoUrl, project.title) !== null

  const frame = (
    <div className="relative aspect-video w-full overflow-hidden rounded-card border border-line bg-surface">
      {project.thumbnail ? (
        <img
          src={project.thumbnail}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-surface-2 text-xs text-muted">
          No thumbnail
        </div>
      )}

      {playable && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/55 backdrop-blur-sm">
            <PlayIcon className="ml-0.5 h-5 w-5 text-white" />
          </span>
        </span>
      )}
    </div>
  )

  const caption = (
    <div className="mt-3">
      <p className="text-sm font-semibold text-ink">{project.title}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted/70">
        {project.category}
      </p>
      {project.description && (
        <p className="mt-1.5 text-xs leading-relaxed text-muted">{project.description}</p>
      )}
    </div>
  )

  if (!playable) {
    return (
      <div className="group">
        {frame}
        {caption}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onPlay}
      className="group block w-full text-left"
      aria-label={`Play ${project.title}`}
    >
      {frame}
      {caption}
    </button>
  )
}

/**
 * An intentionally empty slot. Clearly a placeholder — never presented as
 * real work, and hidden from assistive technology.
 */
function EmptyVideoSlot() {
  return (
    <div aria-hidden className="select-none">
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-2.5 rounded-card border border-dashed border-line bg-surface/40">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong">
          <PlayIcon className="ml-0.5 h-4 w-4 text-line-strong" />
        </span>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted/70">
          <PlusIcon className="h-3 w-3" />
          Add video project
        </span>
      </div>
      <div className="mt-3 space-y-1.5">
        <div className="h-2 w-2/5 rounded-full bg-line" />
        <div className="h-2 w-1/4 rounded-full bg-line/60" />
      </div>
    </div>
  )
}
