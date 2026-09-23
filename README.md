# rodrigopintoaguilera.github.io

Personal portfolio — React + Tailwind, built with Vite and deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

```bash
npm install
npm run dev      # local dev server with hot reload
npm run build    # production build into dist/
```

- Page code: `src/main.jsx` · styles: `src/index.css` · images: `public/assets/`
- Project pages have direct links: `#/churn`, `#/clustering`, `#/aws-game-store`, `#/football-scraper`, `#/subte-router`
- For sharing (LinkedIn, WhatsApp…) use `/churn/`, `/clustering/`, … instead: link previews ignore the `#` part, so `scripts/share-pages.mjs` generates one small page per project with its own preview image (`public/assets/og-<slug>.jpg`) that forwards to the `#/` route.
