# UI_RONIN portfolio

Daniel Aigbe's portfolio site, built with [Astro](https://astro.build), with React for the interactive parts.

## Run it

```
npm install
npm run dev
```

Then open http://localhost:4321. `npm run build` makes the production site in `dist/`.

## Where things are

| What | Where |
|---|---|
| Colours, fonts, buttons | `src/styles/global.css` |
| Homepage | `src/pages/index.astro` |
| Case studies (one file each) | `src/content/work/*.md` |
| Case study page layout | `src/pages/work/[slug].astro` |
| About, Contact | `src/pages/about.astro`, `src/pages/contact.astro` |
| Nav and footer | `src/components/` |
| React components (contact form, Spline scene) | `src/components/*.jsx` |
| Animations (scramble, reveal, cursor) | `src/scripts/site.js` |
| Images | `public/images/` |

## Add or edit a project

Copy a file in `src/content/work/`, rename it, and change the details at the top.
`featured: true` puts it on the homepage. `draft: true` shows a card on the Work page with no case study behind it.

Cover types (`cover.kind`): `scroll` (tall page image that scrolls in a browser frame), `eflames` (the animated logo), `image`, or `placeholder`.

In the case study text, a line starting with `> [Image: ...]` shows a placeholder box. Replace it with `![description](/images/your-file.webp)` when the image is ready.

## Still to fill in

Search the project for `[` to find every placeholder: years, role, problem and outcome text, the portrait, and "why ronin".
Social links are in `src/components/Footer.astro`. Set your domain in `astro.config.mjs` before deploying.
