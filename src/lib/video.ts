/**
 * Turns the video URLs written in `src/content/portfolio.ts` into something
 * the player can actually use, so the content file can just hold normal
 * share links.
 */

export type PlayableVideo =
  | { kind: 'embed'; src: string; title: string }
  | { kind: 'file'; src: string; title: string }

const YOUTUBE_HOSTS = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be']
const VIMEO_HOSTS = ['vimeo.com', 'www.vimeo.com', 'player.vimeo.com']
const FILE_EXTENSIONS = /\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i

/**
 * Resolves a content URL to an embeddable iframe source or a direct file.
 * Returns null when the URL is missing or cannot be understood, so callers
 * can fall back to a non-playable card rather than rendering a broken player.
 */
export function resolveVideo(url: string | undefined, title: string): PlayableVideo | null {
  if (!url) return null
  const trimmed = url.trim()
  if (!trimmed) return null

  // Relative path to a self-hosted file in `public/`.
  if (trimmed.startsWith('/')) {
    return FILE_EXTENSIONS.test(trimmed) ? { kind: 'file', src: trimmed, title } : null
  }

  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    return null
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null

  const host = parsed.hostname.toLowerCase()

  if (YOUTUBE_HOSTS.includes(host)) {
    const id = youTubeId(parsed)
    if (!id) return null
    // youtube-nocookie avoids setting tracking cookies until playback starts.
    return {
      kind: 'embed',
      src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`,
      title,
    }
  }

  if (VIMEO_HOSTS.includes(host)) {
    const id = parsed.pathname.split('/').filter(Boolean).pop()
    if (!id || !/^\d+$/.test(id)) return null
    return { kind: 'embed', src: `https://player.vimeo.com/video/${id}?autoplay=1`, title }
  }

  // Any other absolute URL pointing straight at a video file.
  if (FILE_EXTENSIONS.test(parsed.pathname)) {
    return { kind: 'file', src: trimmed, title }
  }

  return null
}

function youTubeId(parsed: URL): string | null {
  // https://youtu.be/<id>
  if (parsed.hostname.toLowerCase() === 'youtu.be') {
    return parsed.pathname.slice(1).split('/')[0] || null
  }
  // https://youtube.com/watch?v=<id>
  const v = parsed.searchParams.get('v')
  if (v) return v
  // https://youtube.com/embed/<id> and /shorts/<id>
  const parts = parsed.pathname.split('/').filter(Boolean)
  if (parts[0] === 'embed' || parts[0] === 'shorts') return parts[1] ?? null
  return null
}
