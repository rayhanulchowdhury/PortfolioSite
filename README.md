# The Editing Plug

The official website for **The Editing Plug** — a creative studio offering
video editing, photography and videography, founded by Rayhanulc.

Built with Vite, React, TypeScript and Tailwind CSS.

---

## Running the site

```bash
npm install     # once
npm run dev     # start the dev server (http://localhost:5173)
npm run build   # produce the production site in dist/
npm run preview # preview the production build locally
```

> Requires Node 18.17+. This project is pinned to versions that work on
> Node 18.16, which is what is currently installed on this machine.

---

## Where everything lives

Almost everything you'll want to change is in **`src/content/`**. You should
rarely need to touch the components.

| File | What it controls |
| --- | --- |
| `src/content/site.ts` | Email, phone, location, social links, nav links |
| `src/content/about.ts` | The About section story and the "At a glance" panel |
| `src/content/services.ts` | The three service cards and the enquiry dropdown |
| `src/content/portfolio.ts` | **All your videos and photographs** |
| `src/content/clients.ts` | Client logos |

Media files go in `public/` — each folder has its own README with specifics.

---

## 1. Adding your logo

Put your logo file at **`public/brand/logo.png`**. It appears in the header
and the footer immediately — no code change needed.

Export it with a **transparent background** (not the black square), because
the site already sits on `#08090D`. A square plug-mark version at
`public/brand/logo-mark.png` is used as the Apple touch icon.

Until that file exists, the header shows a plain typographic wordmark as a
stand-in. It deliberately does not copy your plug mark.

Full details: [`public/brand/README.md`](public/brand/README.md)

---

## 2. Adding a video project

Works the same for **Video Editing** and **Videography**.

**Step 1** — save a 16:9 thumbnail (1280 x 720) into the right folder:

```
public/portfolio/video-editing/cinematic-01.jpg
```

**Step 2** — add an entry to the matching `projects` array in
`src/content/portfolio.ts`:

```ts
export const videoEditing: VideoSection = {
  // …
  projects: [
    {
      id: 'cinematic-01',                  // any unique string
      title: 'Short Film Edit',
      category: 'Cinematic Editing',       // must match a category exactly
      thumbnail: '/portfolio/video-editing/cinematic-01.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=XXXXXXXXXXX',
      description: 'Narrative edit with a graded, filmic finish.',
      order: 1,                            // lower numbers appear first
    },
  ],
}
```

The project appears in the grid straight away, and clicking it opens the
video in a player.

### Which video URLs work

| Type | Example | Notes |
| --- | --- | --- |
| YouTube | `https://www.youtube.com/watch?v=abc123` | Also accepts `youtu.be/…` and Shorts |
| Vimeo | `https://vimeo.com/123456789` | |
| Local file | `/portfolio/video-editing/reel.mp4` | **Short clips only** — keep under ~10 MB |

**Do not commit large video files into this project.** Host them on YouTube
or Vimeo and paste the normal share link. Everything is converted to a
privacy-friendly embed automatically, and nothing loads from YouTube until a
visitor actually clicks play.

A project with no `videoUrl` still displays — it just won't open a player.

---

## 3. Adding photographs

**Step 1** — save the image:

```
public/portfolio/photography/portrait-01.jpg
```

**Step 2** — add it to `photography.projects` in `src/content/portfolio.ts`:

```ts
{
  id: 'portrait-01',
  title: 'Studio Portrait',
  category: 'Portraits',
  image: '/portfolio/photography/portrait-01.jpg',
  alt: 'Studio portrait lit with a single softbox.',  // for screen readers
  order: 1,
}
```

Images are shown in a consistent 4:5 grid and open full-size in a lightbox
(arrow keys move between them).

---

## 4. Managing categories

Each portfolio section has a `categories` array. Add, remove or reorder the
strings and the filter chips update automatically.

```ts
categories: [
  'Cinematic Editing',
  'Commercials & Advertisements',
  'Your New Category',   // appears immediately
],
```

A project's `category` must match one of these strings **exactly**, or it
won't be displayed.

### Empty slots

`emptySlots` controls how many empty placeholder frames the grid keeps on
screen while you still have fewer projects than that number.

```ts
emptySlots: 6,   // set to 0 once the section is full of real work
```

---

## 5. Adding client logos

Save the logo to `public/clients/`, then add it to `src/content/clients.ts`:

```ts
export const clients: Client[] = [
  { name: 'Client Name', logo: '/clients/client-name.svg', url: 'https://…' },
]
```

`url` is optional. While the array is empty the section shows neutral
"Add client logo" tiles, with a line clarifying they are placeholders and not
real clients.

---

## 6. Contact details and socials

Open `src/content/site.ts`:

```ts
export const site = {
  email: 'hello@theeditingplug.com',   // currently empty
  phone: '',                            // optional
  location: '',                         // optional
}

export const socials = [
  { label: 'Instagram', url: 'https://instagram.com/yourhandle' },
  { label: 'YouTube',   url: '' },      // empty entries are hidden
]
```

Anything left blank is simply not rendered, so no placeholder contact details
are ever shown.

---

## 7. Integrations that still need configuring

Two things are wired up but **not yet connected**. Both fail honestly: the
site never claims a message was sent or a call was booked when it wasn't.

Copy `.env.example` to `.env` and fill in what you want:

```bash
cp .env.example .env
```

### A. Enquiry form — currently NOT connected

Right now, submitting the form validates the input and then tells the visitor
plainly that the form isn't connected, offering a pre-filled email instead
(once you've set `site.email`). Nothing is sent anywhere.

To make it work, pick a provider and set one variable:

**Formspree** (simplest — free tier available)

1. Sign up at <https://formspree.io> and create a form.
2. Copy the endpoint it gives you.
3. In `.env`:
   ```
   VITE_ENQUIRY_ENDPOINT=https://formspree.io/f/xxxxxxxx
   ```

**Web3Forms** (no account needed)

1. Get an access key at <https://web3forms.com>.
2. In `.env`:
   ```
   VITE_ENQUIRY_ENDPOINT=https://api.web3forms.com/submit
   VITE_ENQUIRY_ACCESS_KEY=your-access-key
   ```

**Your own backend** — any URL that accepts a JSON `POST` and returns a 2xx
status on success. The payload contains: `name`, `email`, `company`,
`service`, `projectType`, `budget`, `timeline`, `message`, `subject`.

Restart the dev server after editing `.env`.

### B. Book a Call — currently NOT connected

Every "Book a Call" button currently scrolls to the enquiry form. No
availability or appointment times are shown, because none are configured.

To enable real scheduling:

1. Create a Calendly event type at <https://calendly.com>.
2. In `.env`:
   ```
   VITE_CALENDLY_URL=https://calendly.com/your-name/30min
   ```

The buttons then open the real Calendly popup. The widget script is only
loaded when someone actually clicks, so it costs nothing on page load.

> **Security note:** every `VITE_*` variable is bundled into the public
> JavaScript and is visible to anyone viewing the site. Only put public
> values in `.env` — never a private API key, SMTP password or secret token.
> `.env` is git-ignored.

---

## 8. Deploying

The build output is a static site in `dist/` — it works on any static host.

**Netlify / Vercel / Cloudflare Pages**

- Build command: `npm run build`
- Publish directory: `dist`
- Add your `VITE_*` variables in the host's environment-variable settings
  (they are not read from a committed `.env`).

**GitHub Pages** — set `base: '/PortfolioSite/'` in `vite.config.ts` first if
you're serving from a subpath.

Before going live, update the `canonical` URL in `index.html` to your real
domain.

---

## Project structure

```
src/
├── content/        ← edit these: all site copy and portfolio data
├── components/     ← reusable UI pieces
│   ├── Nav.tsx             header, scroll-spy, mobile dropdown
│   ├── Hero.tsx            typography-only hero
│   ├── About.tsx           story + "at a glance" panel
│   ├── Services.tsx        three service cards
│   ├── Portfolio.tsx       wraps the three subsections
│   ├── VideoPortfolio.tsx  reused by Video Editing AND Videography
│   ├── PhotoPortfolio.tsx  photography grid + lightbox
│   ├── CategoryFilter.tsx  shared filter chips
│   ├── Clients.tsx         client logo grid
│   ├── Contact.tsx         enquiry form
│   ├── Modal.tsx           accessible dialog (player + lightbox)
│   ├── Logo.tsx            brand logo with graceful fallback
│   └── Footer.tsx
├── lib/
│   ├── enquiry.ts     validation + submission
│   ├── scheduling.ts  Calendly integration point
│   └── video.ts       turns share URLs into embeds
└── index.css       design tokens and shared classes

scripts/            dev-only browser checks (not part of the site)
public/             your media — see the README in each folder
```

## Design tokens

Defined in `tailwind.config.ts`:

| Token | Value | Use |
| --- | --- | --- |
| `bg` | `#08090D` | Page background |
| `surface` | `#101116` | Cards, raised areas |
| `purple` | `#7047FF` | Buttons, links, accents |
| `purple-soft` | `#9B7AFF` | Hover states, focus rings |
| `ink` | `#F5F5F7` | Main text |
| `muted` | `#A3A3AE` | Secondary text |
| `line` | `#20222B` | Borders |

Font: **Manrope**, loaded from Google Fonts in `index.html`.
