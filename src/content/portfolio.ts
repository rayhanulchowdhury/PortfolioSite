/**
 * ============================================================================
 *  PORTFOLIO CONTENT
 * ============================================================================
 *  This is the only file you need to edit to add your work.
 *
 *  Every `projects` array below starts EMPTY on purpose. While an array is
 *  empty (or a category has no projects yet), the site renders clean, clearly
 *  labelled empty frames instead of inventing work.
 *
 *  ---------------------------------------------------------------------------
 *  WHERE TO PUT YOUR FILES
 *  ---------------------------------------------------------------------------
 *  Images and thumbnails go in the `public/` folder. Reference them with a
 *  leading slash — the `public/` part is NOT included in the path:
 *
 *    file on disk:  public/portfolio/photography/portrait-01.jpg
 *    path you use:  '/portfolio/photography/portrait-01.jpg'
 *
 *  Suggested folders (already created for you):
 *    public/portfolio/video-editing/
 *    public/portfolio/photography/
 *    public/portfolio/videography/
 *
 *  ---------------------------------------------------------------------------
 *  VIDEO
 *  ---------------------------------------------------------------------------
 *  Do NOT commit large video files into this project. Use either:
 *
 *   1. An external embed (recommended) — paste the normal watch/share URL:
 *        videoUrl: 'https://www.youtube.com/watch?v=XXXXXXXXXXX'
 *        videoUrl: 'https://youtu.be/XXXXXXXXXXX'
 *        videoUrl: 'https://vimeo.com/123456789'
 *      These are converted to a privacy-friendly embed automatically.
 *
 *   2. A self-hosted file for short clips only (keep well under ~10 MB):
 *        videoUrl: '/portfolio/video-editing/reel.mp4'
 *      Anything ending in .mp4 / .webm / .mov plays in a native player.
 *
 *  A project with no `videoUrl` still renders — it just won't open a player.
 *
 *  ---------------------------------------------------------------------------
 *  ORDERING, ADDING AND REMOVING
 *  ---------------------------------------------------------------------------
 *  - `order` sorts projects within a category, lowest first. Ties fall back to
 *    the order they appear in the array.
 *  - `category` must exactly match one of the strings in that section's
 *    `categories` array, otherwise the project will not be displayed.
 *  - To remove a project, delete its object. To reorder categories, reorder
 *    the `categories` array.
 *  - To add a category, add a string to `categories`. It will immediately show
 *    empty placeholder frames until you add projects to it.
 * ============================================================================
 */

/** A video entry, used by both the Video Editing and Videography sections. */
export interface VideoProject {
  /** Unique, stable id. Any short string, e.g. 'brand-film-aurora'. */
  id: string
  /** Project title shown under the thumbnail. */
  title: string
  /** Must match a string in the section's `categories` array. */
  category: string
  /** Path to a 16:9 thumbnail image, e.g. '/portfolio/videography/x.jpg'. */
  thumbnail?: string
  /** YouTube / Vimeo URL, or a path to a small self-hosted file. */
  videoUrl?: string
  /** Optional one-line description shown under the title. */
  description?: string
  /** Sort order within the category. Lower numbers appear first. */
  order?: number
}

/** A photograph in the photography gallery. */
export interface PhotoProject {
  id: string
  title: string
  category: string
  /** Path to the image, e.g. '/portfolio/photography/portrait-01.jpg'. */
  image: string
  /** Describes the image for screen readers. Falls back to the title. */
  alt?: string
  description?: string
  order?: number
}

export interface VideoSection {
  id: string
  heading: string
  supporting: string
  categories: string[]
  /**
   * How many empty frames the grid keeps on screen while you have fewer
   * projects than this. Set to 0 once the section is full of real work.
   */
  emptySlots: number
  projects: VideoProject[]
}

/* -------------------------------------------------------------------------- */
/*  A. VIDEO EDITING                                                          */
/* -------------------------------------------------------------------------- */

export const videoEditing: VideoSection = {
  id: 'video-editing',
  heading: 'Video Editing',
  supporting: 'A selection of edits showcasing different styles, techniques and formats.',
  categories: [
    'Cinematic Editing',
    'Commercials & Advertisements',
    'Social Media & Reels',
    'YouTube Editing',
    'Travel & Lifestyle',
    'Event Highlights',
    'Colour Grading',
    'Documentary & Storytelling',
  ],
  emptySlots: 6,

  // Add your video editing projects here. Example:
  //
  // {
  //   id: 'cinematic-01',
  //   title: 'Short Film Edit',
  //   category: 'Cinematic Editing',
  //   thumbnail: '/portfolio/video-editing/cinematic-01.jpg',
  //   videoUrl: 'https://www.youtube.com/watch?v=XXXXXXXXXXX',
  //   description: 'Narrative edit with a graded, filmic finish.',
  //   order: 1,
  // },
  projects: [],
}

/* -------------------------------------------------------------------------- */
/*  B. PHOTOGRAPHY                                                            */
/* -------------------------------------------------------------------------- */

export const photography = {
  id: 'photography',
  heading: 'Photography',
  supporting: 'Selected photographs capturing brands, products, people and places.',
  categories: [
    'Portraits',
    'Products',
    'Events',
    'Lifestyle',
    'Brand Photography',
    'Commercial Photography',
  ],
  /** Empty frames kept on screen until you add this many real images. */
  emptySlots: 8,

  // Add your photographs here. Example:
  //
  // {
  //   id: 'portrait-01',
  //   title: 'Studio Portrait',
  //   category: 'Portraits',
  //   image: '/portfolio/photography/portrait-01.jpg',
  //   alt: 'Studio portrait lit with a single softbox.',
  //   order: 1,
  // },
  projects: [] as PhotoProject[],
}

/* -------------------------------------------------------------------------- */
/*  C. VIDEOGRAPHY                                                            */
/* -------------------------------------------------------------------------- */

export const videography: VideoSection = {
  id: 'videography',
  heading: 'Videography',
  supporting:
    'Visual stories captured through the camera, from concepts to finished productions.',
  categories: [
    'Brand Films',
    'Commercial Production',
    'Event Videography',
    'Promotional Videos',
    'Interviews',
    'Travel & Lifestyle Films',
  ],
  emptySlots: 6,
  projects: [],
}
