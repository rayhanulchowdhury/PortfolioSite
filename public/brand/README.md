# Brand assets

Put your logo files in this folder. The site picks them up automatically —
no code changes needed.

| File | Used for | Recommended |
| --- | --- | --- |
| `logo.png` | Navigation bar and footer | Transparent PNG or SVG, ~600 px wide, trimmed of surrounding black |
| `logo-mark.png` | Apple touch icon / small spaces | Square, 512 x 512 px, just the plug mark |

## Important

The site renders the logo on a `#08090D` background, so **export the logo with
a transparent background** (or crop the black out). A version with its own
black rectangle will show a visible box against the page.

`logo.svg` works too — if you prefer SVG, save it as `logo.png`'s replacement
and change the `LOGO_SRC` constant at the top of
`src/components/Logo.tsx` to `/brand/logo.svg`.

Until a file exists here, the header falls back to a plain typographic
wordmark. That fallback is deliberately **not** a copy of your logo — it does
not reproduce the plug mark.
