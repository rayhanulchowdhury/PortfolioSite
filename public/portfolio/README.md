# Portfolio media

Drop your files into the matching folder, then reference them in
`src/content/portfolio.ts`.

```
public/portfolio/video-editing/   thumbnails for the Video Editing section
public/portfolio/photography/     your photographs
public/portfolio/videography/     thumbnails for the Videography section
```

Paths in the content file start with `/portfolio/...` — the `public/` part is
never included.

| File on disk | Path you write in portfolio.ts |
| --- | --- |
| `public/portfolio/photography/portrait-01.jpg` | `/portfolio/photography/portrait-01.jpg` |
| `public/portfolio/videography/brand-film.jpg` | `/portfolio/videography/brand-film.jpg` |

## Recommended sizes

- **Video thumbnails** — 16:9, 1280 x 720 px, JPG or WebP
- **Photographs** — displayed in a 4:5 frame, so 1200 x 1500 px works well.
  Any aspect ratio is fine; the grid crops to a consistent shape and the
  lightbox shows the full uncropped image.

Keep files under ~400 KB each. WebP gives the best quality-to-size ratio.

## Video files

Do **not** put large video files in here. Use a YouTube or Vimeo URL instead —
see the notes at the top of `src/content/portfolio.ts`. Only use a local file
for short clips well under ~10 MB.
