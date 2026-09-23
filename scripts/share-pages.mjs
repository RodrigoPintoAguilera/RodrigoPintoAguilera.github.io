// Generates dist/<slug>/index.html for every project: a tiny page with its own
// Open Graph tags that forwards visitors to the SPA route (/#/<slug>).
// Link previews (LinkedIn, WhatsApp…) ignore everything after "#", so without
// these pages every project link would show the home page preview.
import { mkdirSync, writeFileSync } from 'node:fs';

const SITE = 'https://rodrigopintoaguilera.github.io';

const PROJECTS = [
  {
    slug: 'churn',
    title: 'Telco Customer Churn',
    description: 'Churn classifier on 7,032 telecom customers, tuned for F2-score: catches ~80% of real churners. KNN, SMOTE, scikit-learn.',
  },
  {
    slug: 'clustering',
    title: 'Socioeconomic Clustering',
    description: 'Comparing K-Means, Hierarchical, DBSCAN and GMM on ~22,700 Census-style records, and choosing k = 5 despite weak separation.',
  },
  {
    slug: 'aws-game-store',
    title: 'Game Store · AWS',
    description: 'Flask REST API deployed on AWS: multi-AZ VPC, load balancer, auto scaling, private RDS PostgreSQL, CloudWatch + SNS alerts.',
  },
  {
    slug: 'football-scraper',
    title: 'Top-5 Leagues Scraper',
    description: "Selenium pipeline scraping 1,636 players from Europe's top-5 leagues with 5 years of market values, cleaned and analyzed in Jupyter.",
  },
  {
    slug: 'subte-router',
    title: 'BA Subte Router',
    description: 'Route planner for the Buenos Aires subway: A* search with time-aware weights from GTFS frequencies, PyQt5 + Folium map.',
  },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

for (const p of PROJECTS) {
  const url = `${SITE}/${p.slug}/`;
  const title = esc(`${p.title} — Rodrigo Pinto Aguilera`);
  const description = esc(p.description);
  const image = `${SITE}/assets/og-${p.slug}.jpg`;
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${description}" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${image}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${image}" />
<style>html,body{background:#0a0a0a;color:#f5f5f5;font-family:system-ui,sans-serif}</style>
<script>location.replace('/#/${p.slug}');</script>
</head>
<body>
<noscript><p style="padding:2rem"><a href="/#/${p.slug}" style="color:#89AACC">${esc(p.title)}</a></p></noscript>
</body>
</html>
`;
  mkdirSync(`dist/${p.slug}`, { recursive: true });
  writeFileSync(`dist/${p.slug}/index.html`, html);
}

console.log(`share pages: ${PROJECTS.map((p) => '/' + p.slug + '/').join(' ')}`);
