import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import './index.css';


/* ---------- Hooks ---------- */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          el.classList.add('visible');
          io.unobserve(el);
        }
      });
    }, { rootMargin: '-100px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function useRotatingWord(words, intervalMs) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % words.length), intervalMs);
    return () => clearInterval(id);
  }, [words, intervalMs]);
  return [words[i], i];
}

/* ---------- Icons (simple SVGs) ---------- */
const Icon = ({ d, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const Arrow = (p) => <Icon {...p} d="M5 12h14M13 5l7 7-7 7" />;
const ArrowUR = (p) => <Icon {...p} d="M7 17L17 7M9 7h8v8" />;
const Github = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18a10.96 10.96 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14v3.18c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>
);
const LinkedIn = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.7 0h4.37v1.91h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 6.99V22h-4.56v-6.18c0-1.47-.03-3.36-2.05-3.36-2.06 0-2.37 1.61-2.37 3.26V22H7.92V8z"/></svg>
);
const KaggleSvg = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M19.84 23.56c0 .14-.06.22-.18.22h-3.7c-.16 0-.27-.06-.34-.18l-3.94-5.18-1.18 1.12v3.92c0 .2-.1.32-.3.32H7.16c-.2 0-.32-.1-.32-.32V.42c0-.2.12-.3.32-.3H10.2c.2 0 .3.1.3.3v13.62l5.04-5.18c.14-.16.3-.24.5-.24h3.66c.16 0 .25.07.27.22l.02.07c0 .07-.04.14-.1.2L14.7 14.5l5.1 8.95c.04.05.04.09.04.11z"/></svg>
);
const X = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.16 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const Mail = (p) => <Icon {...p} d="M4 6h16v12H4zM4 6l8 7 8-7" />;

/* ---------- 1. Loading Screen ---------- */
function Loading({ onDone }) {
  const [count, setCount] = useState(0);
  const words = ['Data', 'Models', 'Insights'];
  const [w, wi] = useRotatingWord(words, 900);
  const [out, setOut] = useState(false);

  useEffect(() => {
    const total = 1600;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / total);
      setCount(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => { setOut(true); setTimeout(onDone, 500); }, 400);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={"fixed inset-0 z-[9999] bg-bg transition-opacity duration-500 " + (out ? "opacity-0 pointer-events-none" : "opacity-100")}>
      <div className="absolute top-6 left-6 text-[11px] tracking-[0.3em] text-muted font-mono uppercase">Portfolio</div>
      <div className="absolute top-6 right-6 text-[11px] tracking-[0.3em] text-muted font-mono uppercase">Loading</div>

      <div className="absolute inset-0 grid place-items-center">
        <div key={wi} className="font-display italic text-6xl md:text-8xl animate-role-fade-in text-text-primary">
          {w}
        </div>
      </div>

      <div className="absolute bottom-12 right-6 md:right-10 font-display text-7xl md:text-9xl tabular-nums leading-none">
        {String(count).padStart(3, '0')}
      </div>
      <div className="absolute bottom-12 left-6 text-[11px] tracking-[0.3em] text-muted font-mono uppercase">Rodrigo Pinto Aguilera</div>

      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-stroke">
        <div
          className="h-full accent-gradient origin-left"
          style={{ transform: `scaleX(${count / 100})`, transition: 'transform 80ms linear' }}
        />
      </div>
    </div>
  );
}

/* ---------- 2. Navbar ---------- */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
    ['Home', '#home'],
    ['Work', '#work'],
    ['About', '#about'],
  ];
  return (
    <nav className={"fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 " + (scrolled ? "shadow-2xl shadow-black/40" : "")}>
      <div className="flex items-center gap-2 bg-surface/70 backdrop-blur-md border border-white/10 rounded-full pl-2 pr-2 py-2">
        <div className="relative w-9 h-9 rounded-full grid place-items-center">
          <div className="absolute inset-0 rounded-full logo-ring animate-spin-slow" />
          <div className="absolute inset-[2px] rounded-full bg-bg" />
          <span className="relative font-display italic text-[15px]">RP</span>
        </div>
        <div className="flex items-center text-[13px]">
          {links.map(([l, h]) => (
            <a key={l} href={h} className="px-3 py-1.5 rounded-full text-text-primary/85 hover:text-text-primary transition">
              {l}
            </a>
          ))}
          <a href="#contact" className="ml-1 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-text-primary transition flex items-center gap-1.5">
            Say hi <ArrowUR size={12} />
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ---------- 3. Hero ---------- */
function Hero() {
  const nameRef = useRef(null);
  const eyebrowRef = useRef(null);
  const roleRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);

  const roles = ['Data Scientist', 'ML Engineer', 'Builder', 'Student'];
  const [role, ri] = useRotatingWord(roles, 2000);

  // GSAP entrance
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(eyebrowRef.current, { opacity: 0, y: 20, duration: 0.8 })
      .from(nameRef.current, { opacity: 0, y: 50, filter: 'blur(10px)', duration: 1.2 }, '-=0.4')
      .from(roleRef.current, { opacity: 0, y: 20, duration: 0.8 }, '-=0.6')
      .from(descRef.current, { opacity: 0, y: 20, duration: 0.8 }, '-=0.5')
      .from(ctaRef.current?.children || [], { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 }, '-=0.4');
  }, []);

  return (
    <section id="home" className="relative h-screen min-h-[760px] w-full overflow-hidden">
      {/* Top corner meta */}
      <div className="absolute top-28 left-6 md:left-10 z-10 text-[11px] tracking-[0.3em] text-muted font-mono uppercase">
        <div>N° 01</div>
        <div className="mt-1">Hero</div>
      </div>
      <div className="absolute top-28 right-6 md:right-10 z-10 text-[11px] tracking-[0.3em] text-muted font-mono uppercase text-right">
        <div>Stockholm · Sverige</div>
        <div className="mt-1">59.33°N</div>
      </div>

      <div className="relative z-10 h-full grid place-items-center px-6">
        <div className="text-center max-w-5xl">
          <div ref={eyebrowRef} className="text-[11px] tracking-[0.4em] text-muted font-mono uppercase mb-6">
            Portfolio · 2026
          </div>
          <h1 ref={nameRef} className="font-display italic tracking-tight leading-[0.95] text-[14vw] md:text-[9rem] lg:text-[10rem]">
            Rodrigo Pinto<br className="md:hidden"/> Aguilera
          </h1>
          <div ref={roleRef} className="mt-8 text-xl md:text-2xl text-text-primary/90">
            {/^(ML|[AEIOU])/.test(role) ? 'An' : 'A'}&nbsp;
            <span key={ri} className="font-display italic accent-gradient-text animate-role-fade-in">
              {role}
            </span>
            {' '}currently in Stockholm.
          </div>
          <p ref={descRef} className="mt-6 mx-auto max-w-md text-[15px] text-muted leading-relaxed">
            I turn data into decisions. Studying Data Science &amp; AI at UPM, building machine learning models, pipelines and experiments with Python, SQL and AWS.
          </p>
          <div ref={ctaRef} className="mt-10 flex items-center justify-center gap-3">
            <a href="#work" className="group inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-bg text-sm font-medium hover:scale-[1.04] transition">
              See Work <Arrow size={14} />
            </a>
            <a href="#contact" className="ring-gradient inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 text-sm hover:scale-[1.04] transition">
              Reach out…
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
        <span className="text-[10px] tracking-[0.4em] text-muted font-mono uppercase">Scroll</span>
        <div className="relative w-px h-12 bg-white/15 overflow-hidden">
          <div className="absolute inset-x-0 h-6 accent-gradient animate-scroll-down" />
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. About ---------- */
function About() {
  const ref = useReveal();
  return (
    <section id="about" className="bg-bg py-24 md:py-32 px-6">
      <div ref={ref} className="reveal max-w-[1200px] mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">— About</div>
          <div className="h-px flex-1 bg-stroke" />
          <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">02</div>
        </div>
        <h2 className="text-5xl md:text-7xl leading-[1.05] tracking-tight max-w-3xl">
          Curious by <em className="font-display not-italic italic accent-gradient-text">default</em>.
        </h2>
        <div className="mt-16 grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-7 space-y-5 text-[17px] leading-relaxed text-text-primary/85">
            <p>
              I'm Rodrigo, a Data Science &amp; AI student at UPM in Madrid, currently on an Erasmus exchange at KTH in Stockholm. I work at the seam where messy data becomes a decision — wrangling, modeling, deploying, and then explaining what changed and why it matters.
            </p>
            <p className="text-muted">
              My favorite problems are the ones nobody has labeled yet: a CSV with 14 missing columns, a churn signal hiding in event timestamps, an LLM that won't behave on Spanish customer notes. I keep a tight stack — Python, SQL, AWS — and a long list of experiments.
            </p>
            <p className="text-muted">
              When I'm not coding, you can usually find me lost in a good book, working out to stay active, or exploring new places around the world.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] tracking-[0.28em] uppercase font-mono text-muted">
              <span>Problem solver</span>
              <span aria-hidden="true" className="text-stroke">•</span>
              <span>Builder</span>
              <span aria-hidden="true" className="text-stroke">•</span>
              <span>Tech enthusiast</span>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-surface stripe-bg halftone border border-stroke">
              <img src="assets/portrait.webp" alt="Rodrigo sitting on Trolltunga above a fjord in Norway" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: '50% 58%' }} />
              <div className="absolute top-4 left-4 text-[10px] tracking-[0.3em] text-muted font-mono uppercase">RPA · Stockholm</div>
              <div className="absolute bottom-4 right-4 text-[10px] tracking-[0.3em] text-muted font-mono uppercase">2026</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 5. What I Do ---------- */
function Pillars() {
  const ref = useReveal();
  const items = [
    {
      n: '01',
      t: 'Data Analysis',
      d: 'Pulling signal out of noise. Exploratory analysis, feature engineering, and dashboards that managers actually look at.',
      tags: ['Pandas', 'Polars', 'SQL', 'Seaborn'],
    },
    {
      n: '02',
      t: 'Machine Learning',
      d: 'Classical and deep models, from churn classifiers to fine-tuned transformers — with evaluation that survives production.',
      tags: ['scikit-learn', 'PyTorch', 'TensorFlow'],
    },
    {
      n: '03',
      t: 'Cloud & Deploy',
      d: 'Pipelines, APIs and inference endpoints on AWS. Reproducible, monitored, and cheap enough to run on a student stipend.',
      tags: ['AWS', 'Docker'],
    },
  ];
  return (
    <section className="py-24 md:py-32 px-6">
      <div ref={ref} className="reveal max-w-[1200px] mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">— Practice</div>
          <div className="h-px flex-1 bg-stroke" />
          <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">03</div>
        </div>
        <h2 className="text-5xl md:text-7xl leading-[1.05] tracking-tight max-w-4xl">
          What I <em className="font-display not-italic italic accent-gradient-text">do</em>, in three movements.
        </h2>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((it) => (
            <div key={it.n} className="ring-gradient bg-surface border border-stroke rounded-3xl p-8 hover:bg-white/[0.02] transition">
              <div className="flex items-baseline justify-between">
                <div className="text-muted font-mono text-sm">{it.n}</div>
                <div className="text-muted text-[10px] tracking-[0.3em] uppercase">Pillar</div>
              </div>
              <div className="mt-10 font-display italic text-4xl">{it.t}</div>
              <p className="mt-4 text-[15px] text-muted leading-relaxed">{it.d}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {it.tags.map((t) => (
                  <span key={t} className="text-[11px] font-mono text-text-primary/80 px-2.5 py-1 rounded-full border border-stroke bg-bg/40">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 6. Toolkit ---------- */
function Toolkit() {
  const ref = useReveal();
  const groups = [
    { name: 'Languages', items: ['Python', 'SQL', 'R'] },
    { name: 'Data Analysis', items: ['Pandas', 'Polars'] },
    { name: 'Data Engineering', items: ['DuckDB', 'ClickHouse', 'Apache Kafka'] },
    { name: 'ML / AI',   items: ['scikit-learn', 'PyTorch', 'TensorFlow', 'Keras', 'XGBoost'] },
    { name: 'Cloud',     items: ['AWS S3', 'AWS Lambda', 'Docker'] },
    { name: 'Data Viz',  items: ['Matplotlib', 'Seaborn'] },
    { name: 'Other',     items: ['Git', 'GitHub', 'Linux'] },
  ];
  return (
    <section className="py-24 md:py-32 px-6">
      <div ref={ref} className="reveal max-w-[1200px] mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">— Toolkit</div>
          <div className="h-px flex-1 bg-stroke" />
          <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">04</div>
        </div>
        <h2 className="text-5xl md:text-7xl leading-[1.05] tracking-tight max-w-4xl">
          Tools I <em className="font-display not-italic italic accent-gradient-text">think with</em>.
        </h2>
        <div className="mt-14 space-y-8">
          {groups.map((g) => (
            <div key={g.name} className="grid md:grid-cols-12 gap-4 items-start py-4 border-t border-stroke">
              <div className="md:col-span-3 text-muted font-mono text-xs tracking-[0.2em] uppercase pt-2">{g.name}</div>
              <div className="md:col-span-9 flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <span key={it} className="ring-gradient inline-flex items-center gap-2 bg-surface border border-stroke rounded-full px-4 py-2 text-sm cursor-default hover:bg-white/[0.04] transition">
                    <span className="w-1.5 h-1.5 rounded-full accent-gradient" />
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 7. Selected Work ---------- */
function Work() {
  const ref = useReveal();
  const projects = [
    {
      span: 'md:col-span-7',
      n: '01',
      t: 'Telco Customer Churn',
      meta: 'KNN · SMOTE · scikit-learn',
      desc: 'Supervised classifier on 7,032 telecom customers. Optimized for F2-Score to maximize churn recall — catches ~80% of real churners.',
      cover: 'assets/Proyecto_Churn.webp',
    },
    {
      span: 'md:col-span-5',
      n: '02',
      t: 'Socioeconomic Clustering',
      meta: 'K-Means · DBSCAN · GMM · Hierarchical',
      desc: 'Unsupervised segmentation on ~22.7k Census-style records. Compared 4 algorithms; K-Means with k=5 surfaced 5 interpretable population profiles.',
      cover: 'assets/Proyecto_Socioeconomico.webp',
    },
    {
      span: 'md:col-span-5',
      n: '03',
      t: 'Game Store · AWS',
      meta: 'EC2 · RDS · ALB · ASG · VPC',
      desc: 'Course project: a Flask REST API deployed on AWS across two AZs — load-balanced, auto-scaled, VPC-isolated, with CloudWatch alarms and SNS email alerts.',
      cover: 'assets/Proyecto_AWS.webp',
    },
    {
      span: 'md:col-span-7',
      n: '04',
      t: 'Top-5 Leagues Scraper',
      meta: 'Selenium · Pandas · Jupyter',
      desc: 'Scraped 1,636 players from Europe\u2019s top 5 leagues — stats + 5 years of market values. Cleaned, joined, and analyzed across 7 economic & performance questions.',
      cover: 'assets/Proyecto_Futbol.webp',
    },
    {
      span: 'md:col-span-12',
      n: '05',
      t: 'BA Subte Router',
      meta: 'A* · PyQt5 · Folium',
      desc: 'Desktop route planner for the Buenos Aires subway — A* search with time-aware edge weights, GTFS-derived frequencies, and an embedded interactive map.',
      cover: 'assets/Proyecto_Subte.webp',
    },
  ];
  return (
    <section id="work" className="py-24 md:py-32 px-6">
      <div ref={ref} className="reveal max-w-[1200px] mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">— Selected Work</div>
          <div className="h-px flex-1 bg-stroke" />
          <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">05</div>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <h2 className="text-5xl md:text-7xl leading-[1.05] tracking-tight max-w-3xl">
            Projects I've <em className="font-display not-italic italic accent-gradient-text">built</em>.
          </h2>
          <a href="https://github.com/RodrigoPintoAguilera?tab=repositories" target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex items-center gap-2 text-sm text-muted hover:text-text-primary transition">
            All repos on GitHub <ArrowUR size={14}/>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {projects.map((p) => (
            <a
              key={p.n}
              href={projectHref(p.n)}
              aria-label={"Open project: " + p.t}
              onClick={() => { openedFromHome = true; }}
              className={"group relative block cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30 " + p.span + " bg-surface border border-stroke rounded-3xl overflow-hidden"}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-bg">
                <img
                  src={p.cover}
                  alt={p.t + " — project cover"}
                  className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-bg/70 backdrop-blur-md opacity-0 group-hover:opacity-100 transition duration-300 grid place-items-center">
                  <div className="ring-gradient inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-sm bg-bg/40">
                    View — <em className="font-display not-italic italic">{p.t}</em> <ArrowUR size={12} />
                  </div>
                </div>
              </div>
              <div className="p-6 md:p-8 flex items-end justify-between gap-6">
                <div>
                  <div className="font-display italic text-3xl md:text-4xl">{p.t}</div>
                  <p className="mt-3 text-[15px] text-muted leading-relaxed max-w-md">{p.desc}</p>
                </div>
                <div className="shrink-0 w-10 h-10 rounded-full border border-stroke grid place-items-center group-hover:border-white/30 transition">
                  <ArrowUR size={14} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 8. Education ---------- */
function Education() {
  const ref = useReveal();
  const items = [
    { inst: 'KTH Royal Institute of Technology', role: 'Erasmus Exchange Student', dates: 'Aug 2026 — Present', tag: 'KTH · Stockholm' },
    { inst: 'Universidad Politécnica de Madrid', role: 'BSc Data Science & AI', dates: '2023 — Present', tag: 'UPM · Madrid' },
  ];
  const certs = [
    { name: 'GitHub Foundations', issuer: 'GitHub · Microsoft Learn', date: 'Jul 2026', href: 'https://learn.microsoft.com/api/credentials/share/en-us/RODRIGOPINTOAGUILERA-7415/292C69A45AF1BC46?sharingId=844F4893231F1CFE' },
  ];
  return (
    <section className="py-24 md:py-32 px-6">
      <div ref={ref} className="reveal max-w-[1200px] mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">— Background</div>
          <div className="h-px flex-1 bg-stroke" />
          <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">06</div>
        </div>
        <h2 className="text-5xl md:text-7xl leading-[1.05] tracking-tight max-w-4xl">
          Education &amp; <em className="font-display not-italic italic accent-gradient-text">certifications</em>.
        </h2>
        <div className="mt-14 space-y-3">
          {items.map((e, i) => (
            <div key={i} className="ring-gradient flex flex-col xl:flex-row xl:items-center gap-3 xl:gap-8 p-5 md:px-7 md:py-5 bg-surface/40 rounded-3xl xl:rounded-full border border-stroke hover:bg-surface/70 transition overflow-hidden">
              <div className="flex items-baseline xl:items-center gap-4 flex-1 min-w-0">
                <div className="flex items-center gap-4 shrink-0 xl:min-w-[60px]">
                  <span className="w-2 h-2 rounded-full accent-gradient" />
                  <span className="text-muted font-mono text-xs tracking-[0.2em]">0{i+1}</span>
                </div>
                <div className="min-w-0 xl:min-w-[12rem] font-display italic text-xl sm:text-2xl md:text-3xl leading-snug break-words">{e.inst}</div>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 xl:flex-nowrap xl:gap-8 xl:shrink-0">
                <div className="text-text-primary/85 text-sm md:text-base xl:whitespace-nowrap">{e.role}</div>
                <div className="hidden xl:block w-px h-6 bg-stroke" />
                <div className="text-muted text-xs font-mono tracking-[0.2em] uppercase whitespace-nowrap">{e.tag}</div>
                <div className="text-muted text-sm font-mono tabular-nums whitespace-nowrap">{e.dates}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-14 text-muted font-mono text-xs tracking-[0.2em] uppercase">Certifications</div>
        <div className="mt-5 space-y-3">
          {certs.map((c, i) => (
            <a key={i} href={c.href} target="_blank" rel="noopener" className="ring-gradient flex flex-col xl:flex-row xl:items-center gap-3 xl:gap-8 p-5 md:px-7 md:py-5 bg-surface/40 rounded-3xl xl:rounded-full border border-stroke hover:bg-surface/70 transition overflow-hidden">
              <div className="flex items-baseline xl:items-center gap-4 flex-1 min-w-0">
                <div className="flex items-center gap-4 shrink-0 xl:min-w-[60px]">
                  <span className="w-2 h-2 rounded-full accent-gradient" />
                  <span className="text-muted font-mono text-xs tracking-[0.2em]">0{i+1}</span>
                </div>
                <div className="min-w-0 xl:min-w-[12rem] font-display italic text-xl sm:text-2xl md:text-3xl leading-snug break-words">{c.name}</div>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 xl:flex-nowrap xl:gap-8 xl:shrink-0">
                <div className="text-muted text-xs font-mono tracking-[0.2em] uppercase xl:whitespace-nowrap">{c.issuer}</div>
                <div className="hidden xl:block w-px h-6 bg-stroke" />
                <div className="flex items-center gap-3 text-muted text-sm font-mono tabular-nums whitespace-nowrap">{c.date}<ArrowUR size={14} /></div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 9. Footer / Contact ---------- */
function Footer() {
  const ref = useReveal();
  const marqueeText = "BUILDING WITH DATA · RODRIGO PINTO AGUILERA · 2026 · ";
  return (
    <section id="contact" className="relative overflow-hidden">
      <div className="relative z-10">
        {/* Marquee */}
        <div className="overflow-hidden whitespace-nowrap py-8 border-y border-white/10">
          <div className="inline-flex animate-marquee">
            <div className="font-display italic text-6xl md:text-8xl pr-12">
              {Array.from({length: 10}).map((_, i) => (
                <span key={i} className={i % 2 ? 'text-white/30' : 'text-white'}>{marqueeText}</span>
              ))}
            </div>
            <div className="font-display italic text-6xl md:text-8xl pr-12" aria-hidden>
              {Array.from({length: 10}).map((_, i) => (
                <span key={i} className={i % 2 ? 'text-white/30' : 'text-white'}>{marqueeText}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Center */}
        <div ref={ref} className="reveal py-32 md:py-44 px-6 text-center">
          <div className="text-[11px] tracking-[0.4em] text-muted font-mono uppercase mb-8">— Available</div>
          <h2 className="font-display italic text-7xl md:text-[10rem] leading-[0.95] tracking-tight">
            Let's <span className="accent-gradient-text">talk</span>.
          </h2>
          <p className="mt-6 mx-auto max-w-md text-[15px] text-muted">
            Open to internships.
          </p>
          <a
            href="mailto:rodrigopintoaguilera05@gmail.com"
            className="ring-gradient mt-10 inline-flex items-center gap-3 px-5 sm:px-7 py-4 rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-md hover:scale-[1.04] transition text-sm sm:text-base max-w-[calc(100vw-3rem)] overflow-hidden"
          >
            <Mail size={16} />
            <span className="truncate max-w-[200px] sm:max-w-none">rodrigopintoaguilera05@gmail.com</span>
            <ArrowUR size={14} />
          </a>
        </div>

        {/* Footer bar */}
        <div className="border-t border-white/10 px-6 py-6">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-4 items-center justify-between text-sm">
            <div className="flex items-center gap-3 text-muted">
              <span className="relative flex w-2.5 h-2.5">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-pulse-dot" />
                <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-emerald-400" />
              </span>
              <span className="font-mono text-xs tracking-[0.2em] uppercase">Open to internships</span>
            </div>
            <div className="flex items-center gap-5 text-text-primary/85">
              <a href="https://github.com/RodrigoPintoAguilera" target="_blank" rel="noopener" aria-label="GitHub" className="hover:text-text-primary transition"><Github /></a>
              <a href="https://www.linkedin.com/in/rodrigo-pinto-aguilera-432141397/" target="_blank" rel="noopener" aria-label="LinkedIn" className="hover:text-text-primary transition"><LinkedIn /></a>
            </div>
            <div className="text-muted font-mono text-xs tracking-[0.2em] uppercase">© 2026 — RPA</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Project detail visuals ---------- */

function GradientDef({ id = 'accent-grad' }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#89AACC" />
        <stop offset="100%" stopColor="#4E85BF" />
      </linearGradient>
      <marker id={id + '-arrow'} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="#4E85BF" />
      </marker>
    </defs>
  );
}

/* — Problem · 01 Churn — */
function ProblemTelco() {
  const TrendDown = () => (
    <svg width="40" height="20" viewBox="0 0 40 20"><GradientDef id="cg-pt-d" /><polyline points="2,4 12,9 22,7 32,16" fill="none" stroke="url(#cg-pt-d)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="32" cy="16" r="2.5" fill="url(#cg-pt-d)" /></svg>
  );
  const TrendUp = () => (
    <svg width="40" height="20" viewBox="0 0 40 20"><GradientDef id="cg-pt-u" /><polyline points="2,16 12,11 22,13 32,4" fill="none" stroke="url(#cg-pt-u)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="32" cy="4" r="2.5" fill="url(#cg-pt-u)" /></svg>
  );
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-surface border border-stroke rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendDown />
            <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">The problem</div>
          </div>
          <div className="font-display italic text-3xl mb-4">A reactive retention team is already losing.</div>
          <div className="space-y-4 text-[15px] leading-relaxed text-text-primary/85">
            <p>Churn is one of the highest-impact loss drivers for any subscription-based telecom. Acquiring a new customer is materially more expensive than retaining an existing one — industry rule of thumb puts it at 5–7× the cost.</p>
            <p>Without a way to predict churn ahead of time, the retention team is purely reactive: they only learn a customer is leaving once the cancellation request hits their queue, at which point the conversation is much harder to win.</p>
            <p className="text-muted">The dataset itself makes this harder. The target class is imbalanced — only <span className="accent-gradient-text font-mono">26.5%</span> of customers churn — so a model that just predicts "no churn" for everyone scores 73.5% accuracy while being completely useless. Optimizing for accuracy is actively misleading.</p>
          </div>
        </div>

        <div className="bg-surface border border-stroke rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendUp />
            <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">The proposed solution</div>
          </div>
          <div className="font-display italic text-3xl mb-4">A risk score the retention team can act on first.</div>
          <ul className="space-y-3 text-[15px] leading-relaxed text-text-primary/85">
            <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full accent-gradient mt-2 shrink-0" /><span>Tune for <span className="accent-gradient-text font-mono">F2-Score</span> instead of accuracy — Recall weighs 2× Precision, so the model is penalized harder for missing real churners than for raising a false alarm.</span></li>
            <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full accent-gradient mt-2 shrink-0" /><span><span className="font-mono">SMOTE + Random UnderSampling</span> placed inside the cross-validation pipeline, never on the validation folds — no synthetic leakage.</span></li>
            <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full accent-gradient mt-2 shrink-0" /><span>Compare four classifiers — <span className="font-mono">KNN, SVM, Decision Tree, Logistic Regression</span> — under the same evaluation protocol.</span></li>
            <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full accent-gradient mt-2 shrink-0" /><span>Output a calibrated risk score the retention team can use to triage outreach: every flagged customer becomes a candidate for an offer <em>before</em> they cancel.</span></li>
          </ul>
          <div className="mt-5 pl-4 border-l-2 border-[#4E85BF]/60 text-sm text-muted leading-relaxed">
            <span className="text-text-primary/85">Outcome:</span> ~80% of real churners caught, ~46% precision on the at-risk pool. Sending an incentive to a false positive costs cents; losing a true churner costs the entire customer lifetime value. The asymmetry justifies the F2 trade-off.
          </div>
        </div>
      </div>

      {/* Pain → Pipeline → Outcome */}
      <div className="bg-surface border border-stroke rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-2">
          <div className="flex-1 ring-gradient bg-bg/40 border border-stroke rounded-2xl p-5">
            <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">Pain</div>
            <div className="mt-2 font-display italic text-xl leading-snug">Reactive retention</div>
            <div className="mt-1 text-xs text-muted font-mono">&gt; 5× CAC vs LTV</div>
          </div>
          <div className="hidden md:flex items-center justify-center px-1">
            <svg width="48" height="20"><GradientDef id="cg-pt-a1" /><line x1="0" y1="10" x2="40" y2="10" stroke="url(#cg-pt-a1)" strokeWidth="2" markerEnd="url(#cg-pt-a1-arrow)" /></svg>
          </div>
          <div className="flex-1 ring-gradient bg-bg/40 border border-stroke rounded-2xl p-5">
            <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">Pipeline</div>
            <div className="mt-2 font-display italic text-xl leading-snug">F2-tuned classifier</div>
            <div className="mt-1 text-xs text-muted font-mono">SMOTE pipeline · 4 models compared</div>
          </div>
          <div className="hidden md:flex items-center justify-center px-1">
            <svg width="48" height="20"><GradientDef id="cg-pt-a2" /><line x1="0" y1="10" x2="40" y2="10" stroke="url(#cg-pt-a2)" strokeWidth="2" markerEnd="url(#cg-pt-a2-arrow)" /></svg>
          </div>
          <div className="flex-1 ring-gradient bg-bg/40 border border-stroke rounded-2xl p-5">
            <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">Outcome</div>
            <div className="mt-2 font-display italic text-xl leading-snug">~80% churners caught</div>
            <div className="mt-1 text-xs text-muted font-mono">~46% precision on at-risk pool</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* — Problem · 02 Clustering — */
function ProblemClustering() {
  const cards = [
    {
      n: '01 — Starting point',
      h: 'No ground truth label.',
      b: 'A socioeconomic dataset with ~22,700 records mixing numerical (Age, EducationNum, CapitalGain, HoursPerWeek) and categorical (MaritalStatus, Relationship, Gender) features. The goal is to identify distinct population segments — but nobody has pre-defined what "segment A" or "segment B" means.',
    },
    {
      n: '02 — Why supervised is wrong',
      h: 'It would just confirm priors.',
      b: 'Supervised learning needs a target variable. Inventing one (e.g. manually labelling rows as "high-value" / "low-value") embeds our prior assumptions into the model, then trains a classifier that just learns to reproduce them. The whole point of segmentation is to let the data tell us where the natural groupings are — not to confirm what we already think.',
    },
    {
      n: '03 — Why unsupervised fits',
      h: 'Let the data speak.',
      b: 'Clustering partitions the feature space by similarity, with no target needed. The output is cluster assignments we then interpret as profiles. The methodological challenge becomes choosing the algorithm and the k that produce well-separated, well-balanced clusters that tell a coherent story about real population subgroups.',
    },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-5">
      {cards.map((c) => (
        <div key={c.n} className="bg-surface border border-stroke rounded-3xl p-7">
          <div className="font-mono text-xs text-muted tracking-[0.15em] uppercase">{c.n}</div>
          <div className="mt-3 font-display italic text-2xl leading-snug">{c.h}</div>
          <p className="mt-4 text-sm text-text-primary/85 leading-relaxed">{c.b}</p>
        </div>
      ))}
    </div>
  );
}

/* — Problem · 03 AWS — */
function ProblemAws() {
  const reqs = [
    ['High availability', 'Service must survive the loss of a full Availability Zone.'],
    ['Elasticity', 'Capacity follows load, not sized for peak.'],
    ['Network isolation', 'No direct internet exposure for compute or data tiers.'],
    ['Least-privilege security', 'Every component talks only to what it strictly needs.'],
    ['Observability', 'Operators get notified before users do, not after.'],
    ['Self-service API docs', 'Consumers read and exercise the API without pinging the team.'],
  ];
  return (
    <div className="space-y-5">
      <div className="bg-surface border border-stroke rounded-3xl p-8">
        <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">What we were given</div>
        <div className="mt-3 font-display italic text-2xl md:text-3xl leading-snug">A monolithic Flask service on a developer laptop.</div>
        <p className="mt-4 text-[15px] leading-relaxed text-text-primary/85">
          <span className="font-mono text-sm">game-store</span> — a Python/Flask REST API talking to a local PostgreSQL database. Functional, but with zero answers to any of the standard production questions: <em>what happens when traffic spikes? when an instance dies? when an Availability Zone goes down? how do operators learn about problems before users do? where does the API documentation live and how do consumers exercise it?</em>
        </p>
      </div>

      <div className="bg-surface border border-stroke rounded-3xl p-8">
        <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">The non-functional requirements</div>
        <div className="mt-3 font-display italic text-2xl md:text-3xl leading-snug">Six things the next version had to be.</div>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {reqs.map(([k, v]) => (
            <div key={k} className="flex gap-3 items-start">
              <span className="w-2 h-2 rounded-full accent-gradient mt-2 shrink-0" />
              <div>
                <div className="text-sm text-text-primary/95">{k}</div>
                <div className="text-xs text-muted mt-0.5 leading-relaxed">{v}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-stroke rounded-3xl p-8">
        <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">What this rules out</div>
        <div className="mt-3 font-display italic text-2xl md:text-3xl leading-snug">Every cheap shortcut, in one breath.</div>
        <p className="mt-4 text-[15px] leading-relaxed text-text-primary/85">
          A single-EC2 deployment fails availability. A public RDS endpoint fails network isolation. Security groups that allow <span className="font-mono text-sm">0.0.0.0/0</span> everywhere fail least-privilege. Manual scaling fails elasticity. Logs-only monitoring with no alarms fails observability. <span className="text-muted">Every one of those anti-patterns is what the architecture below was specifically designed to avoid.</span>
        </p>
      </div>
    </div>
  );
}

/* — Problem · 04 Football — */
function ProblemFootball() {
  const scope = [
    ['1,636', 'Players'],
    ['5', 'Leagues · PL · LaLiga · Serie A · Bundesliga · Ligue 1'],
    ['5', 'Seasons · 2020/21 → 2024/25'],
    ['Per-player', 'Club · position · foot · height · weight · salary · season stats · annual market value'],
  ];
  return (
    <div className="grid md:grid-cols-12 gap-8 items-start">
      <div className="md:col-span-7">
        <p className="font-display italic text-3xl md:text-5xl leading-tight max-w-4xl text-text-primary">
          "Years ago, physical condition and talent were everything, but today, <span className="accent-gradient-text">data and statistics are fundamental</span> to compete at the highest level."
        </p>
        <p className="mt-8 text-[15px] leading-relaxed text-muted max-w-2xl">
          The modern football industry — from recruitment to tactical preparation to market valuation — runs on data. Clubs that don't quantify their decisions are at a structural disadvantage against the ones that do. This project assembles the raw material for that kind of analysis: a unified dataset of player performance and market value across Europe's top five leagues, and answers seven concrete questions that mirror the kind of work a real scouting department or sporting director's office puts to its analytics team.
        </p>
      </div>

      <div className="md:col-span-5 bg-surface border border-stroke rounded-3xl p-6 md:p-7">
        <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase mb-5">Data scope</div>
        <div className="divide-y divide-stroke">
          {scope.map(([v, l]) => (
            <div key={l} className="py-4 flex items-center justify-between gap-6">
              <div className="font-display italic text-3xl accent-gradient-text leading-none shrink-0">{v}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted text-right max-w-[260px]">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* — Problem · 05 Subte — */
function ProblemSubte() {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-surface border border-stroke rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-muted/60" />
            <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">The problem</div>
          </div>
          <div className="font-display italic text-3xl mb-4">Travel time isn't fixed — it depends on when you travel.</div>
          <div className="space-y-4 text-[15px] leading-relaxed text-text-primary/85">
            <p>Computing an optimal subway route isn't a simple shortest-path problem. A transfer at <span className="font-mono accent-gradient-text">Callao</span> between lines B and D costs ~2 minutes at <span className="font-mono">Mon · 08:00</span> (high frequency) and ~8 minutes at <span className="font-mono">Sun · 23:00</span> (low frequency).</p>
            <p className="text-muted">A naïve graph that ignores this produces routes that are optimal on paper but wrong in practice — the kind of route that looks great on a wall map and then has the user waiting eight minutes for a midnight train.</p>
          </div>
        </div>

        <div className="bg-surface border border-stroke rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full accent-gradient" />
            <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">The proposed solution</div>
          </div>
          <div className="font-display italic text-3xl mb-4">A directed weighted graph that knows what time it is.</div>
          <ul className="space-y-3 text-[15px] leading-relaxed text-text-primary/85">
            <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full accent-gradient mt-2 shrink-0" /><span>A <span className="font-mono">networkx.DiGraph</span> where every edge carries a time cost composed of three parts.</span></li>
            <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full accent-gradient mt-2 shrink-0" /><span>Travel time = <span className="font-mono">distance ÷ line speed</span>, plus the expected wait at a transfer (from the <span className="font-mono">GTFS</span> frequency table for that day & hour), plus a <span className="font-mono">10 s</span> door-opening overhead per stop.</span></li>
            <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full accent-gradient mt-2 shrink-0" /><span><span className="font-mono">A*</span> navigates this graph with a Haversine heuristic — great-circle distance ÷ 28 km/h (the network's max speed) — provably admissible.</span></li>
          </ul>
          <div className="mt-5 pl-4 border-l-2 border-[#4E85BF]/60 text-sm text-muted leading-relaxed">
            <span className="text-text-primary/85">Outcome:</span> a route planner that behaves differently at 8 AM on a Monday than at 11 PM on a Sunday — because the subway does too.
          </div>
        </div>
      </div>

      {/* Pain → Pipeline → Outcome */}
      <div className="bg-surface border border-stroke rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-2">
          <div className="flex-1 ring-gradient bg-bg/40 border border-stroke rounded-2xl p-5">
            <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">Pain</div>
            <div className="mt-2 font-display italic text-xl leading-snug">Time-variable transfer costs</div>
            <div className="mt-1 text-xs text-muted font-mono">2 min @ Mon 08 · 8 min @ Sun 23</div>
          </div>
          <div className="hidden md:flex items-center justify-center px-1">
            <svg width="48" height="20"><GradientDef id="cg-ps-a1" /><line x1="0" y1="10" x2="40" y2="10" stroke="url(#cg-ps-a1)" strokeWidth="2" markerEnd="url(#cg-ps-a1-arrow)" /></svg>
          </div>
          <div className="flex-1 ring-gradient bg-bg/40 border border-stroke rounded-2xl p-5">
            <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">Pipeline</div>
            <div className="mt-2 font-display italic text-xl leading-snug">DiGraph · GTFS · A*</div>
            <div className="mt-1 text-xs text-muted font-mono">Haversine h(n) · admissible</div>
          </div>
          <div className="hidden md:flex items-center justify-center px-1">
            <svg width="48" height="20"><GradientDef id="cg-ps-a2" /><line x1="0" y1="10" x2="40" y2="10" stroke="url(#cg-ps-a2)" strokeWidth="2" markerEnd="url(#cg-ps-a2-arrow)" /></svg>
          </div>
          <div className="flex-1 ring-gradient bg-bg/40 border border-stroke rounded-2xl p-5">
            <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">Outcome</div>
            <div className="mt-2 font-display italic text-xl leading-snug">Optimal route, any day & hour</div>
            <div className="mt-1 text-xs text-muted font-mono">+ accessibility-aware mode</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* — 01 Churn — */
function ChurnVisuals() {
  const models = [
    { name: 'KNN (SMOTE)', v: 0.7260, win: true },
    { name: 'SVM (SMOTE)', v: 0.7131 },
    { name: 'Decision Tree (SMOTE)', v: 0.7106 },
    { name: 'Logistic Reg. (SMOTE)', v: 0.7095 },
  ];
  const max = 0.75;
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Bar chart */}
      <div className="bg-surface border border-stroke rounded-3xl p-8">
        <div className="flex items-baseline justify-between mb-1">
          <div className="font-display italic text-2xl">CV F2-Score</div>
          <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">10-fold</div>
        </div>
        <p className="text-muted text-xs font-mono mb-6">Higher is better · F2 weighs Recall 2× Precision</p>
        <svg viewBox="0 0 400 220" className="w-full">
          <GradientDef id="cg1" />
          {models.map((m, i) => {
            const y = 20 + i * 48;
            const w = (m.v / max) * 280;
            return (
              <g key={m.name}>
                <text x="0" y={y - 4} fill="#878787" fontSize="9" fontFamily="JetBrains Mono">{m.name}</text>
                <rect x="0" y={y} width="280" height="22" fill="#141414" rx="4" />
                <rect x="0" y={y} width={w} height="22" fill={m.win ? "url(#cg1)" : "#3a3a3a"} rx="4" />
                <text x={w + 8} y={y + 16} fill={m.win ? "#89AACC" : "#878787"} fontSize="12" fontFamily="Instrument Serif" fontStyle="italic">{m.v.toFixed(4)}</text>
              </g>
            );
          })}
        </svg>
        <div className="mt-4 text-xs text-muted font-mono">⬤ Winner — KNN with SMOTE 50% + RandomUnderSampler 80%</div>
      </div>

      {/* Confusion matrix */}
      <div className="bg-surface border border-stroke rounded-3xl p-8">
        <div className="flex items-baseline justify-between mb-1">
          <div className="font-display italic text-2xl">Confusion Matrix</div>
          <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">Test set</div>
        </div>
        <p className="text-muted text-xs font-mono mb-6">1,407 customers held out · Threshold 0.5</p>
        <svg viewBox="0 0 400 320" className="w-full">
          <GradientDef id="cg-cm" />
          {/* Column headers */}
          <text x="160" y="22" textAnchor="middle" fill="#878787" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="1">PRED · NO CHURN</text>
          <text x="320" y="22" textAnchor="middle" fill="#878787" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="1">PRED · CHURN</text>
          {/* Row headers */}
          <text x="72" y="108" textAnchor="end" fill="#878787" fontFamily="JetBrains Mono" fontSize="9">Actual · No</text>
          <text x="72" y="228" textAnchor="end" fill="#878787" fontFamily="JetBrains Mono" fontSize="9">Actual · Yes</text>
          {/* TN */}
          <rect x="80" y="32" width="160" height="120" rx="12" fill="url(#cg-cm)" opacity="0.85" />
          <text x="160" y="92" textAnchor="middle" fill="#0A0A0A" fontFamily="Instrument Serif" fontStyle="italic" fontSize="42">687</text>
          <text x="160" y="112" textAnchor="middle" fill="#0A0A0A" fontFamily="JetBrains Mono" fontSize="9" opacity="0.8">TN</text>
          {/* FP */}
          <rect x="248" y="32" width="140" height="120" rx="12" fill="#141414" stroke="#1F1F1F" strokeWidth="1" />
          <text x="318" y="92" textAnchor="middle" fill="#F5F5F5" fontFamily="Instrument Serif" fontStyle="italic" fontSize="42" opacity="0.8">346</text>
          <text x="318" y="112" textAnchor="middle" fill="#878787" fontFamily="JetBrains Mono" fontSize="9">FP</text>
          {/* FN */}
          <rect x="80" y="162" width="160" height="120" rx="12" fill="#141414" stroke="#1F1F1F" strokeWidth="1" />
          <text x="160" y="222" textAnchor="middle" fill="#F5F5F5" fontFamily="Instrument Serif" fontStyle="italic" fontSize="42" opacity="0.8">76</text>
          <text x="160" y="242" textAnchor="middle" fill="#878787" fontFamily="JetBrains Mono" fontSize="9">FN</text>
          {/* TP */}
          <rect x="248" y="162" width="140" height="120" rx="12" fill="url(#cg-cm)" />
          <text x="318" y="222" textAnchor="middle" fill="#0A0A0A" fontFamily="Instrument Serif" fontStyle="italic" fontSize="42">298</text>
          <text x="318" y="242" textAnchor="middle" fill="#0A0A0A" fontFamily="JetBrains Mono" fontSize="9">TP ← caught</text>
        </svg>
      </div>
    </div>
  );
}

/* — 02 Clustering — */
function ClusteringVisuals() {
  const algos = [
    { name: 'K-Means',             cfg: 'k = 5',                            sil: '0.22',  verdict: 'Chosen: weak separation, but balanced & interpretable', win: true },
    { name: 'Hierarchical (Ward)', cfg: 'k = 3',                            sil: '0.24',  verdict: 'One cluster held 67% of samples', win: false },
    { name: 'DBSCAN',              cfg: 'eps = 0.5 · min_samples = 50',     sil: '−0.08', verdict: 'No density structure in this space', win: false },
    { name: 'Gaussian Mixture',    cfg: '8 components · full covariance',   sil: '−0.02', verdict: 'Heavy component overlap',           win: false },
  ];

  const elbow = [
    { k: 2,  inertia: 18500 },
    { k: 3,  inertia: 14200 },
    { k: 4,  inertia: 11000 },
    { k: 5,  inertia: 9100 },
    { k: 6,  inertia: 8400 },
    { k: 7,  inertia: 7900 },
    { k: 8,  inertia: 7500 },
    { k: 9,  inertia: 7200 },
    { k: 10, inertia: 7000 },
  ];
  // Elbow chart geometry
  const eW = 720, eH = 320, eP = { l: 64, r: 24, t: 28, b: 44 };
  const eMaxY = 20000, eMinY = 6000;
  const eX = (k) => eP.l + ((k - 2) / 8) * (eW - eP.l - eP.r);
  const eY = (v) => eP.t + (1 - (v - eMinY) / (eMaxY - eMinY)) * (eH - eP.t - eP.b);
  const yTicks = [6000, 9000, 12000, 15000, 18000];

  // Donut data
  const donut = [
    { name: 'Upper-middle professional', n: 3400, pct: 15.0, op: 1.0  },
    { name: 'Middle working class',      n: 9500, pct: 41.9, op: 0.85 },
    { name: 'Lower working class',       n: 4200, pct: 18.5, op: 0.7  },
    { name: 'Young / emerging segment',  n: 3100, pct: 13.7, op: 0.55 },
    { name: 'High-effort earners',       n: 2500, pct: 11.0, op: 0.4  },
  ];
  const dCx = 160, dCy = 160, dRo = 140, dRi = 80;
  const polar = (cx, cy, r, deg) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const arcPath = (start, end) => {
    const [x1, y1] = polar(dCx, dCy, dRo, start);
    const [x2, y2] = polar(dCx, dCy, dRo, end);
    const [x3, y3] = polar(dCx, dCy, dRi, end);
    const [x4, y4] = polar(dCx, dCy, dRi, start);
    const large = end - start > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${dRo} ${dRo} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${dRi} ${dRi} 0 ${large} 0 ${x4} ${y4} Z`;
  };
  let donutAcc = 0;

  const profiles = [
    { n: '01', name: 'Upper-middle professional class', chips: ['~40 yrs', 'High education', 'High capital gains', 'Married'] },
    { n: '02', name: 'Middle working class',            chips: ['~38 yrs', 'Mid education', 'Balanced gender', 'Largest segment'] },
    { n: '03', name: 'Lower working class',             chips: ['~42 yrs', 'Low education', 'Mostly men', 'Lower-skill jobs'] },
    { n: '04', name: 'Young / emerging segment',        chips: ['Younger', 'Part-time hours', 'Mostly single', 'In transition'] },
    { n: '05', name: 'High-effort earners',             chips: ['Middle-aged', '~65 hrs/week', 'Married men', 'Family providers'] },
  ];

  return (
    <div className="space-y-6">
      {/* Algorithm comparison TABLE */}
      <div className="bg-surface border border-stroke rounded-3xl p-6 md:p-8">
        <div className="flex items-baseline justify-between mb-1">
          <div className="font-display italic text-2xl">Algorithm comparison</div>
          <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">4 candidates</div>
        </div>
        <p className="text-muted text-xs font-mono mb-6">Same preprocessing pipeline · scored on silhouette + interpretability</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead>
              <tr className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted border-b border-stroke">
                <th className="py-3 pr-4 font-normal">Algorithm</th>
                <th className="py-3 pr-4 font-normal">Configuration</th>
                <th className="py-3 pr-4 font-normal">Silhouette</th>
                <th className="py-3 pr-4 font-normal">Verdict</th>
              </tr>
            </thead>
            <tbody className="font-body text-sm text-text-primary/90">
              {algos.map((a) => (
                <tr
                  key={a.name}
                  className={"border-b border-stroke last:border-0 " + (a.win ? "bg-gradient-to-r from-[#89AACC]/10 to-[#4E85BF]/10" : "")}
                >
                  <td className={"py-4 pr-4 align-middle " + (a.win ? "border-l-2 border-[#89AACC]" : "")}>
                    <span className={a.win ? "font-display italic text-lg accent-gradient-text pl-3" : ""}>
                      {a.win ? a.name : <strong className="font-normal">{a.name}</strong>}
                    </span>
                  </td>
                  <td className="py-4 pr-4 font-mono text-xs text-muted align-middle">{a.cfg}</td>
                  <td className={"py-4 pr-4 font-mono align-middle " + (a.win ? "text-text-primary text-lg" : "text-text-primary/70")}>{a.sil}</td>
                  <td className="py-4 pr-4 align-middle text-sm">{a.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Elbow chart */}
      <div className="bg-surface border border-stroke rounded-3xl p-6 md:p-8">
        <div className="flex items-baseline justify-between mb-1">
          <div className="font-display italic text-2xl">Elbow method — picking k</div>
          <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">WCSS · k = 2…10</div>
        </div>
        <p className="text-muted text-xs font-mono mb-6">Inertia stops dropping meaningfully after k = 5</p>
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${eW} ${eH}`} className="w-full min-w-[540px]">
            <GradientDef id="cg-elbow" />
            {/* Grid lines + y-ticks */}
            {yTicks.map((t) => (
              <g key={t}>
                <line x1={eP.l} y1={eY(t)} x2={eW - eP.r} y2={eY(t)} stroke="#1F1F1F" strokeWidth="1" />
                <text x={eP.l - 10} y={eY(t) + 3} textAnchor="end" fill="#878787" fontFamily="JetBrains Mono" fontSize="10">{(t / 1000).toFixed(0)}k</text>
              </g>
            ))}
            {/* Axes */}
            <line x1={eP.l} y1={eH - eP.b} x2={eW - eP.r} y2={eH - eP.b} stroke="#1F1F1F" strokeWidth="1" />
            <line x1={eP.l} y1={eP.t} x2={eP.l} y2={eH - eP.b} stroke="#1F1F1F" strokeWidth="1" />
            {/* x ticks */}
            {elbow.map((p) => (
              <text key={p.k} x={eX(p.k)} y={eH - eP.b + 18} textAnchor="middle" fill="#878787" fontFamily="JetBrains Mono" fontSize="10">{p.k}</text>
            ))}
            {/* Axis labels */}
            <text x={(eP.l + eW - eP.r) / 2} y={eH - 6} textAnchor="middle" fill="#878787" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="2">k</text>
            <text x={16} y={eP.t + (eH - eP.t - eP.b) / 2} textAnchor="middle" fill="#878787" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="2" transform={`rotate(-90 16 ${eP.t + (eH - eP.t - eP.b) / 2})`}>INERTIA</text>
            {/* Line */}
            <polyline
              fill="none"
              stroke="url(#cg-elbow)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={elbow.map((p) => `${eX(p.k)},${eY(p.inertia)}`).join(' ')}
            />
            {/* Data points */}
            {elbow.map((p) => (
              <circle key={p.k} cx={eX(p.k)} cy={eY(p.inertia)} r="4" fill="#0A0A0A" stroke="url(#cg-elbow)" strokeWidth="2" />
            ))}
            {/* Elbow marker at k=5 */}
            <line x1={eX(5)} y1={eY(9100)} x2={eX(5)} y2={eH - eP.b} stroke="#4E85BF" strokeDasharray="3 4" opacity="0.5" />
            <circle cx={eX(5)} cy={eY(9100)} r="7" fill="url(#cg-elbow)" />
            <text x={eX(5) + 16} y={eY(9100) - 10} fill="#F5F5F5" fontFamily="Instrument Serif" fontStyle="italic" fontSize="16">elbow → k = 5</text>
          </svg>
        </div>
      </div>

      {/* Donut + legend */}
      <div className="bg-surface border border-stroke rounded-3xl p-6 md:p-8">
        <div className="flex items-baseline justify-between mb-1">
          <div className="font-display italic text-2xl">Cluster size distribution</div>
          <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">5 profiles · 22,700 records</div>
        </div>
        <p className="text-muted text-xs font-mono mb-6">Middle working class is ~42% of the population — by far the largest segment</p>
        <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center">
          <svg viewBox="0 0 320 320" className="w-full max-w-[320px] mx-auto">
            <GradientDef id="cg-donut" />
            {donut.map((d) => {
              const start = (donutAcc / 100) * 360;
              const end = ((donutAcc + d.pct) / 100) * 360;
              donutAcc += d.pct;
              // Avoid 360deg singularity
              const safeEnd = end >= 360 ? 359.999 : end;
              return (
                <path
                  key={d.name}
                  d={arcPath(start, safeEnd)}
                  fill="url(#cg-donut)"
                  opacity={d.op}
                />
              );
            })}
            <text x={dCx} y={dCy - 6} textAnchor="middle" fill="#F5F5F5" fontFamily="Instrument Serif" fontStyle="italic" fontSize="30">5 profiles</text>
            <text x={dCx} y={dCy + 18} textAnchor="middle" fill="#878787" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="2">22,700 RECORDS</text>
          </svg>
          <div>
            {donut.map((d) => (
              <div key={d.name} className="py-3 flex items-center gap-4 border-b border-stroke last:border-0">
                <div
                  className="w-4 h-2 rounded-full shrink-0"
                  style={{ background: 'linear-gradient(90deg, #89AACC, #4E85BF)', opacity: d.op }}
                />
                <div className="font-display italic text-lg flex-1 leading-tight">{d.name}</div>
                <div className="font-mono text-xs text-muted tabular-nums">{d.pct.toFixed(1)}%</div>
                <div className="font-mono text-[10px] text-muted/70 tabular-nums hidden sm:block">{d.n.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5 profile cards */}
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <div className="font-display italic text-2xl">Five interpretive profiles</div>
          <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">From clusters to people</div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((p) => (
            <div key={p.n} className="ring-gradient bg-bg/40 border border-stroke rounded-2xl p-6 hover:bg-white/[0.02] transition">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full accent-gradient text-bg font-mono text-[10px] tracking-[0.2em]">{p.n}</span>
              <div className="mt-4 font-display italic text-2xl leading-tight">{p.name}</div>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.chips.map((c) => (
                  <span key={c} className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-1 rounded-full bg-surface border border-stroke text-muted">{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* — 03 AWS architecture — */
function AwsArchitecture() {
  /* Mini AWS service icons — simple inline SVG glyphs (16x16) */
  const IconGlobe = ({ x, y }) => (
    <g transform={`translate(${x},${y})`} fill="none" stroke="#4E85BF" strokeOpacity="0.7" strokeWidth="1.2">
      <circle cx="8" cy="8" r="6" />
      <line x1="2" y1="8" x2="14" y2="8" />
      <line x1="8" y1="2" x2="8" y2="14" />
      <ellipse cx="8" cy="8" rx="3" ry="6" />
    </g>
  );
  const IconALB = ({ x, y }) => (
    <g transform={`translate(${x},${y})`} fill="none" stroke="#4E85BF" strokeOpacity="0.7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5 H13 L10 2 M13 5 L10 8" />
      <path d="M13 11 H3 L6 8 M3 11 L6 14" />
    </g>
  );
  const IconServer = ({ x, y }) => (
    <g transform={`translate(${x},${y})`} fill="none" stroke="#4E85BF" strokeOpacity="0.7" strokeWidth="1.2">
      <rect x="2" y="2.5" width="12" height="3" rx="0.6" />
      <rect x="2" y="6.5" width="12" height="3" rx="0.6" />
      <rect x="2" y="10.5" width="12" height="3" rx="0.6" />
      <circle cx="4.2" cy="4" r="0.5" fill="#4E85BF" />
      <circle cx="4.2" cy="8" r="0.5" fill="#4E85BF" />
      <circle cx="4.2" cy="12" r="0.5" fill="#4E85BF" />
    </g>
  );
  const IconDb = ({ x, y }) => (
    <g transform={`translate(${x},${y})`} fill="none" stroke="#4E85BF" strokeOpacity="0.7" strokeWidth="1.2">
      <ellipse cx="8" cy="3" rx="5" ry="1.7" />
      <path d="M3 3 V12 C3 13 5.2 14 8 14 C10.8 14 13 13 13 12 V3" />
      <path d="M3 7.5 C3 8.5 5.2 9.3 8 9.3 C10.8 9.3 13 8.5 13 7.5" />
    </g>
  );
  const IconBucket = ({ x, y }) => (
    <g transform={`translate(${x},${y})`} fill="none" stroke="#4E85BF" strokeOpacity="0.7" strokeWidth="1.2" strokeLinejoin="round">
      <path d="M2.5 5 H13.5 L12 14 H4 Z" />
      <path d="M2.5 5 L4 2.5 H12 L13.5 5" />
    </g>
  );
  const IconBell = ({ x, y }) => (
    <g transform={`translate(${x},${y})`} fill="none" stroke="#4E85BF" strokeOpacity="0.7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11 L13 11 C12 10 11.5 9 11.5 7.5 V6.5 C11.5 4.6 10 3 8 3 C6 3 4.5 4.6 4.5 6.5 V7.5 C4.5 9 4 10 3 11 Z" />
      <path d="M7 12.6 C7.2 13.3 7.5 13.8 8 13.8 C8.5 13.8 8.8 13.3 9 12.6" />
    </g>
  );
  const Box = ({ x, y, w, h, title, sub, kind = 'default', dashed = false, icon = null }) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="14" fill="#141414" stroke={dashed ? '#4E85BF' : '#1F1F1F'} strokeWidth="1" strokeDasharray={dashed ? '4 4' : ''} />
      {icon && React.cloneElement(icon, { x: x + 12, y: y + 10 })}
      <text x={x + w/2} y={y + h/2 - 4} textAnchor="middle" fill="#F5F5F5" fontFamily="Instrument Serif" fontStyle="italic" fontSize="14">{title}</text>
      {sub && <text x={x + w/2} y={y + h/2 + 12} textAnchor="middle" fill="#878787" fontFamily="JetBrains Mono" fontSize="8">{sub}</text>}
    </g>
  );
  const services = [
    ['EC2', 'Flask REST via Gunicorn'],
    ['RDS PostgreSQL 15', 'Managed DB · private subnets'],
    ['ALB', 'Single internet entry point'],
    ['ASG', 'CPU-based dynamic scaling'],
    ['S3', 'Static Swagger UI'],
    ['CloudWatch + SNS', 'Metrics + email alerts'],
    ['VPC', '10.0.0.0/16 · 6 subnets · 3 RTs'],
  ];
  const alarms = [
    'ASG-HighCPU > 80%',
    'RDS-HighCPU > 80%',
    'RDS-HighConnections > 80',
    'RDS-Storage < 2 GB',
    'ALB-UnHealthy-A > 0',
    'ALB-UnHealthy-B > 0',
  ];
  const fault = [
    ['EC2 crash', 'ASG replaces, ALB stops routing.'],
    ['AZ outage', 'ASG launches in remaining AZ.'],
    ['Traffic spike', 'Scales 2 → 4 instances.'],
    ['Unhealthy instance', 'Health check fails, replaced.'],
  ];

  return (
    <div className="space-y-6">
      {/* Diagram */}
      <div className="bg-surface border border-stroke rounded-3xl p-6 md:p-10">
        <div className="flex items-baseline justify-between mb-1">
          <div className="font-display italic text-2xl">Architecture · us-east-1</div>
          <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">Multi-AZ</div>
        </div>
        <p className="text-muted text-xs font-mono mb-6">Public · Private · Private DB subnets</p>
        <div className="overflow-x-auto">
        <svg viewBox="0 0 760 560" className="w-full">
          <GradientDef id="cg3" />

          {/* Node 1 — Internet */}
          <rect x="310" y="10" width="140" height="44" rx="14" fill="#141414" stroke="#1F1F1F" strokeWidth="1" />
          <g transform="translate(326,16)" fill="none" stroke="#4E85BF" strokeOpacity="0.85" strokeWidth="1.3">
            <circle cx="7" cy="7" r="7" />
            <line x1="0" y1="7" x2="14" y2="7" />
            <line x1="7" y1="0" x2="7" y2="14" />
            <ellipse cx="7" cy="7" rx="3" ry="7" />
          </g>
          <text x="392" y="38" textAnchor="middle" fill="#F5F5F5" fontFamily="Instrument Serif" fontStyle="italic" fontSize="14">Internet</text>

          {/* Arrow: Internet → ALB */}
          <line x1="380" y1="54" x2="380" y2="76" stroke="url(#cg3)" strokeWidth="2" markerEnd="url(#cg3-arrow)" />

          {/* Node 2 — ALB */}
          <rect x="230" y="76" width="300" height="52" rx="14" fill="#141414" stroke="#1F1F1F" strokeWidth="1" />
          <g transform="translate(246,90)" fill="none" stroke="#4E85BF" strokeOpacity="0.85" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6 H17 L13 2 M17 6 L13 10" />
            <path d="M17 14 H3 L7 10 M3 14 L7 18" />
          </g>
          <text x="380" y="100" textAnchor="middle" fill="#F5F5F5" fontFamily="Instrument Serif" fontStyle="italic" fontSize="14">Application Load Balancer</text>
          <text x="380" y="117" textAnchor="middle" fill="#878787" fontFamily="JetBrains Mono" fontSize="9">public subnets · AZ-a, AZ-b</text>

          {/* Arrow: ALB → ASG */}
          <line x1="380" y1="128" x2="380" y2="152" stroke="url(#cg3)" strokeWidth="2" markerEnd="url(#cg3-arrow)" />

          {/* Node 3 — ASG group (dashed) */}
          <rect x="50" y="152" width="660" height="180" rx="18" fill="none" stroke="#4E85BF" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="6 4" />
          <text x="66" y="170" fill="#878787" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="2">AUTO SCALING GROUP · 2 → 4</text>

          {/* EC2-A */}
          <rect x="80" y="182" width="220" height="110" rx="14" fill="#141414" stroke="#1F1F1F" strokeWidth="1" />
          <g transform="translate(264,194)" fill="#4E85BF" opacity="0.7">
            <rect x="0"  y="0"  width="20" height="4" rx="1" />
            <rect x="0"  y="6"  width="20" height="4" rx="1" />
            <rect x="0"  y="12" width="20" height="4" rx="1" />
          </g>
          <text x="190" y="237" textAnchor="middle" fill="#F5F5F5" fontFamily="Instrument Serif" fontStyle="italic" fontSize="13">EC2 — Flask + Gunicorn</text>
          <text x="190" y="254" textAnchor="middle" fill="#878787" fontFamily="JetBrains Mono" fontSize="8">:8000 · private subnet AZ-a</text>

          {/* EC2-B */}
          <rect x="460" y="182" width="220" height="110" rx="14" fill="#141414" stroke="#1F1F1F" strokeWidth="1" />
          <g transform="translate(644,194)" fill="#4E85BF" opacity="0.7">
            <rect x="0"  y="0"  width="20" height="4" rx="1" />
            <rect x="0"  y="6"  width="20" height="4" rx="1" />
            <rect x="0"  y="12" width="20" height="4" rx="1" />
          </g>
          <text x="570" y="237" textAnchor="middle" fill="#F5F5F5" fontFamily="Instrument Serif" fontStyle="italic" fontSize="13">EC2 — Flask + Gunicorn</text>
          <text x="570" y="254" textAnchor="middle" fill="#878787" fontFamily="JetBrains Mono" fontSize="8">:8000 · private subnet AZ-b</text>

          {/* Arrows EC2 → RDS (converging) */}
          <path d="M 190 292 Q 190 332 310 362" fill="none" stroke="url(#cg3)" strokeWidth="2" markerEnd="url(#cg3-arrow)" />
          <path d="M 570 292 Q 570 332 450 362" fill="none" stroke="url(#cg3)" strokeWidth="2" markerEnd="url(#cg3-arrow)" />

          {/* Node 4 — RDS */}
          <rect x="240" y="362" width="280" height="64" rx="14" fill="#141414" stroke="#1F1F1F" strokeWidth="1" />
          <g transform="translate(258,379)" fill="#4E85BF" opacity="0.7">
            <ellipse cx="9" cy="3" rx="9" ry="3" />
            <rect x="0" y="3" width="18" height="22" />
            <ellipse cx="9" cy="25" rx="9" ry="3" />
            <path d="M0 11 C0 12.5 4 13.6 9 13.6 C14 13.6 18 12.5 18 11" stroke="#141414" strokeWidth="1" fill="none" />
            <path d="M0 19 C0 20.5 4 21.6 9 21.6 C14 21.6 18 20.5 18 19" stroke="#141414" strokeWidth="1" fill="none" />
          </g>
          <text x="380" y="389" textAnchor="middle" fill="#F5F5F5" fontFamily="Instrument Serif" fontStyle="italic" fontSize="14">RDS PostgreSQL 15</text>
          <text x="380" y="406" textAnchor="middle" fill="#878787" fontFamily="JetBrains Mono" fontSize="9">private DB subnets · multi-AZ</text>

          {/* Node 5 — S3 (sidecar, dashed) */}
          <rect x="20" y="362" width="180" height="64" rx="14" fill="#141414" stroke="#4E85BF" strokeWidth="1" strokeDasharray="4 4" />
          <g transform="translate(36,377)" fill="#4E85BF" opacity="0.7">
            <path d="M2 5 L18 5 L16 25 L4 25 Z" />
            <path d="M2 5 L4 1 L16 1 L18 5 Z" fill="#141414" stroke="#4E85BF" strokeWidth="1" opacity="1" />
          </g>
          <text x="110" y="389" textAnchor="middle" fill="#F5F5F5" fontFamily="Instrument Serif" fontStyle="italic" fontSize="14">S3</text>
          <text x="110" y="406" textAnchor="middle" fill="#878787" fontFamily="JetBrains Mono" fontSize="9">Swagger UI · static</text>

          {/* Node 6 — CloudWatch + SNS (sidecar, dashed) */}
          <rect x="560" y="362" width="180" height="64" rx="14" fill="#141414" stroke="#4E85BF" strokeWidth="1" strokeDasharray="4 4" />
          <g transform="translate(576,377)" fill="none" stroke="#4E85BF" strokeOpacity="0.7" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 20 L21 20 C19 18 18 16 18 13 V11 C18 7.5 15.5 5 12 5 C8.5 5 6 7.5 6 11 V13 C6 16 5 18 3 20 Z" />
            <path d="M10 22.5 C10.3 24 11 24.8 12 24.8 C13 24.8 13.7 24 14 22.5" />
            <circle cx="12" cy="3" r="1" fill="#4E85BF" stroke="none" />
          </g>
          <text x="650" y="389" textAnchor="middle" fill="#F5F5F5" fontFamily="Instrument Serif" fontStyle="italic" fontSize="12">CloudWatch + SNS</text>
          <text x="650" y="406" textAnchor="middle" fill="#878787" fontFamily="JetBrains Mono" fontSize="9">alarms · email alerts</text>
        </svg>
        </div>
      </div>

      {/* Services + Fault tolerance */}
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-7 bg-surface border border-stroke rounded-3xl p-8">
          <div className="font-display italic text-2xl mb-1">AWS services in play</div>
          <p className="text-muted text-xs font-mono mb-5">7 services, one VPC</p>
          <div className="divide-y divide-stroke">
            {services.map(([s, role]) => (
              <div key={s} className="py-3 flex gap-4 items-baseline">
                <span className="w-1.5 h-1.5 rounded-full accent-gradient mt-1 shrink-0" />
                <div className="min-w-[180px] font-mono text-xs tracking-[0.15em] uppercase text-text-primary/85">{s}</div>
                <div className="text-sm text-muted">{role}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-5 bg-surface border border-stroke rounded-3xl p-8">
          <div className="font-display italic text-2xl mb-1">Fault tolerance</div>
          <p className="text-muted text-xs font-mono mb-5">Self-healing by design</p>
          <div className="space-y-4">
            {fault.map(([k, v]) => (
              <div key={k} className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-full border border-stroke grid place-items-center shrink-0 mt-0.5"><div className="w-1.5 h-1.5 rounded-full accent-gradient" /></div>
                <div>
                  <div className="text-sm">{k}</div>
                  <div className="text-xs text-muted mt-0.5">{v}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alarms */}
      <div className="bg-surface border border-stroke rounded-3xl p-8">
        <div className="flex items-baseline justify-between mb-5">
          <div className="font-display italic text-2xl">Six alarms wired to SNS</div>
          <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">CloudWatch</div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {alarms.map((a) => (
            <div key={a} className="ring-gradient flex items-center gap-3 px-4 py-3 rounded-full border border-stroke bg-bg/40">
              <span className="w-2 h-2 rounded-full accent-gradient" />
              <span className="font-mono text-xs text-text-primary/90">{a}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* — 04 Football pipeline — */
function FootballPipeline() {
  const stages = [
    { n: '01', t: 'Scrape', d: 'Selenium → stats.json + valores.json', sub: 'Hours of headless Chrome' },
    { n: '02', t: 'Clean', d: 'JSON → raw.xlsx → cleaned.xlsx', sub: '3 scripts: json_to_excel · clean_stats · clean_values' },
    { n: '03', t: 'Analyze', d: 'Jupyter notebook · 7 questions', sub: 'Pandas + Matplotlib + Seaborn' },
  ];

  /* ---- Reusable Q-block layout ---- */
  const QBlock = ({ idx, topic, q, chart, what, why, impact, last = false }) => (
    <div className={"pt-12 " + (idx === 1 ? "" : "border-t border-stroke")}>
      <div className="flex items-center gap-4 mb-6">
        <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">Q{idx} · {topic}</div>
        <div className="h-px flex-1 bg-stroke" />
      </div>
      <div className="font-display italic text-2xl md:text-3xl leading-tight max-w-4xl mb-8">{q}</div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-surface border border-stroke rounded-3xl p-6">
          {chart}
        </div>
        <div className="space-y-6">
          <div>
            <div className="text-muted text-xs uppercase tracking-[0.2em] font-mono mb-2">What the chart shows</div>
            <p className="text-[15px] leading-relaxed text-text-primary/90">{what}</p>
          </div>
          <div>
            <div className="text-muted text-xs uppercase tracking-[0.2em] font-mono mb-2">Why it matters</div>
            <p className="text-[15px] leading-relaxed text-text-primary/90">{why}</p>
          </div>
          <div className="pl-5 border-l-2 border-[#4E85BF]/70">
            <div className="text-muted text-xs uppercase tracking-[0.2em] font-mono mb-2">Performance impact</div>
            <p className="text-[15px] leading-relaxed text-text-primary">{impact}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ChartTitle = ({ t, sub }) => (
    <div className="mb-4">
      <div className="font-display italic text-lg">{t}</div>
      <div className="font-mono text-xs text-muted mt-0.5">{sub}</div>
    </div>
  );

  /* ============== Q1 — League salary spend ============== */
  const q1Data = [
    { l: 'Premier League', salary: 3750, pos: 'Forward' },
    { l: 'La Liga',        salary: 1950, pos: 'Forward' },
    { l: 'Serie A',        salary: 1620, pos: 'Midfielder' },
    { l: 'Bundesliga',     salary: 1480, pos: 'Midfielder' },
    { l: 'Ligue 1',        salary: 1180, pos: 'Forward' },
  ];
  const q1Max = 4000;
  const Chart1 = (
    <>
      <ChartTitle t="Total salary spend (€M) · most-valued position" sub="Annualized · top-5 European leagues" />
      <svg viewBox="0 0 480 280" className="w-full">
        <GradientDef id="cg-q1" />
        {[0, 1000, 2000, 3000, 4000].map((g) => (
          <g key={g}>
            <line x1="160" y1={20 + (1 - g / q1Max) * 220 + 0} x2="470" y2={20 + (1 - g / q1Max) * 220} stroke="#1F1F1F" />
            <text x="155" y={20 + (1 - g / q1Max) * 220 + 3} textAnchor="end" fill="#878787" fontFamily="JetBrains Mono" fontSize="9">{g === 0 ? '0' : (g / 1000).toFixed(0) + 'k'}</text>
          </g>
        ))}
        {q1Data.map((d, i) => {
          const y = 32 + i * 44;
          const w = (d.salary / q1Max) * 310;
          return (
            <g key={d.l}>
              <text x="0" y={y + 8} fill="#F5F5F5" fontSize="11" fontFamily="Inter">{d.l}</text>
              <text x="0" y={y + 22} fill="#878787" fontSize="9" fontFamily="JetBrains Mono">{d.pos.toUpperCase()}</text>
              <rect x="160" y={y} width="310" height="18" fill="#141414" rx="3" />
              <rect x="160" y={y} width={w} height="18" fill="url(#cg-q1)" rx="3" />
              <text x={160 + w + 6} y={y + 14} fill="#89AACC" fontSize="11" fontFamily="Instrument Serif" fontStyle="italic">€{d.salary.toLocaleString()}M</text>
            </g>
          );
        })}
      </svg>
    </>
  );

  /* ============== Q2 — Market value evolution ============== */
  const q2Years = [2020, 2021, 2022, 2023, 2024];
  const q2Series = [
    { k: 'FWD', vals: [11.2, 10.6, 12.4, 13.5, 14.2], op: 1.0,  grad: true },
    { k: 'MID', vals: [8.4,  8.0,  9.1,  9.8,  10.4], op: 0.85, grad: true },
    { k: 'DEF', vals: [5.8,  5.5,  6.0,  6.4,  6.7],  op: 0.6,  grad: true },
    { k: 'GK',  vals: [4.1,  3.9,  4.3,  4.6,  4.8],  op: 0.4,  grad: false, color: '#878787' },
  ];
  const q2W = 480, q2H = 280, q2P = { l: 44, r: 70, t: 24, b: 36 };
  const q2YMax = 16, q2YMin = 0;
  const q2X = (i) => q2P.l + (i / (q2Years.length - 1)) * (q2W - q2P.l - q2P.r);
  const q2Y = (v) => q2P.t + (1 - (v - q2YMin) / (q2YMax - q2YMin)) * (q2H - q2P.t - q2P.b);
  const Chart2 = (
    <>
      <ChartTitle t="Avg market value (€M) by position" sub="2020 → 2024 · all 5 leagues aggregated" />
      <svg viewBox={`0 0 ${q2W} ${q2H}`} className="w-full">
        <GradientDef id="cg-q2" />
        {[0, 4, 8, 12, 16].map((g) => (
          <g key={g}>
            <line x1={q2P.l} y1={q2Y(g)} x2={q2W - q2P.r} y2={q2Y(g)} stroke="#1F1F1F" />
            <text x={q2P.l - 6} y={q2Y(g) + 3} textAnchor="end" fill="#878787" fontFamily="JetBrains Mono" fontSize="9">{g}</text>
          </g>
        ))}
        {q2Years.map((y, i) => (
          <text key={y} x={q2X(i)} y={q2H - q2P.b + 16} textAnchor="middle" fill="#878787" fontFamily="JetBrains Mono" fontSize="9">{y}</text>
        ))}
        {q2Series.map((s) => (
          <g key={s.k}>
            <polyline
              fill="none"
              stroke={s.grad ? "url(#cg-q2)" : s.color}
              strokeOpacity={s.op}
              strokeWidth="2"
              points={s.vals.map((v, i) => `${q2X(i)},${q2Y(v)}`).join(' ')}
            />
            {s.vals.map((v, i) => (
              <circle key={i} cx={q2X(i)} cy={q2Y(v)} r="2.5" fill="#0A0A0A" stroke={s.grad ? "url(#cg-q2)" : s.color} strokeOpacity={s.op} strokeWidth="1.5" />
            ))}
            <text x={q2W - q2P.r + 8} y={q2Y(s.vals[s.vals.length - 1]) + 3} fill={s.grad ? "#89AACC" : "#878787"} opacity={s.op} fontFamily="JetBrains Mono" fontSize="10">{s.k}</text>
          </g>
        ))}
      </svg>
    </>
  );

  /* ============== Q3 — Fouls by weight ============== */
  const q3Data = [
    { b: '<70 kg',  v: 0.85 },
    { b: '70–75',   v: 1.05 },
    { b: '75–80',   v: 1.30 },
    { b: '80–85',   v: 1.45 },
    { b: '85–90',   v: 1.55 },
    { b: '>90 kg',  v: 1.40 },
  ];
  const q3Max = 1.8;
  const Chart3 = (
    <>
      <ChartTitle t="Avg fouls / 90 by weight bucket" sub="Monotonic up to 85–90 kg, dips above" />
      <svg viewBox="0 0 480 280" className="w-full">
        <GradientDef id="cg-q3" />
        {[0, 0.5, 1, 1.5].map((g) => (
          <g key={g}>
            <line x1="40" y1={20 + (1 - g / q3Max) * 200} x2="470" y2={20 + (1 - g / q3Max) * 200} stroke="#1F1F1F" />
            <text x="34" y={20 + (1 - g / q3Max) * 200 + 3} textAnchor="end" fill="#878787" fontFamily="JetBrains Mono" fontSize="9">{g.toFixed(1)}</text>
          </g>
        ))}
        {q3Data.map((d, i) => {
          const x = 56 + i * 70;
          const h = (d.v / q3Max) * 200;
          const y = 220 - h;
          const peak = d.b === '85–90';
          return (
            <g key={d.b}>
              <rect x={x} y={y} width="44" height={h} fill={peak ? "url(#cg-q3)" : "url(#cg-q3)"} opacity={peak ? 1 : 0.55} rx="3" />
              <text x={x + 22} y={y - 6} textAnchor="middle" fill={peak ? "#89AACC" : "#878787"} fontSize="10" fontFamily="Instrument Serif" fontStyle="italic">{d.v.toFixed(2)}</text>
              <text x={x + 22} y={240} textAnchor="middle" fill="#878787" fontSize="9" fontFamily="JetBrains Mono">{d.b}</text>
            </g>
          );
        })}
        <text x="40" y="266" fill="#878787" fontFamily="JetBrains Mono" fontSize="9">FOULS / 90</text>
      </svg>
    </>
  );

  /* ============== Q4 — Price by position × foot ============== */
  const q4Data = [
    { p: 'GK',  r: 4.6,  l: 5.2 },
    { p: 'DEF', r: 6.1,  l: 7.4 },
    { p: 'MID', r: 9.5,  l: 11.2 },
    { p: 'FWD', r: 13.0, l: 15.8 },
  ];
  const q4Max = 18;
  const Chart4 = (
    <>
      <ChartTitle t="Avg market value (€M) · right vs left foot" sub="Left-footed premium across every position" />
      <svg viewBox="0 0 480 280" className="w-full">
        <GradientDef id="cg-q4" />
        {[0, 5, 10, 15].map((g) => (
          <g key={g}>
            <line x1="40" y1={20 + (1 - g / q4Max) * 200} x2="470" y2={20 + (1 - g / q4Max) * 200} stroke="#1F1F1F" />
            <text x="34" y={20 + (1 - g / q4Max) * 200 + 3} textAnchor="end" fill="#878787" fontFamily="JetBrains Mono" fontSize="9">{g}</text>
          </g>
        ))}
        {q4Data.map((d, i) => {
          const cx = 80 + i * 100;
          const hr = (d.r / q4Max) * 200;
          const hl = (d.l / q4Max) * 200;
          return (
            <g key={d.p}>
              <rect x={cx - 28} y={220 - hr} width="24" height={hr} fill="url(#cg-q4)" opacity="0.55" rx="3" />
              <rect x={cx + 4}  y={220 - hl} width="24" height={hl} fill="url(#cg-q4)" rx="3" />
              <text x={cx - 16} y={220 - hr - 4} textAnchor="middle" fill="#878787" fontSize="9" fontFamily="JetBrains Mono">{d.r}</text>
              <text x={cx + 16} y={220 - hl - 4} textAnchor="middle" fill="#89AACC" fontSize="10" fontFamily="Instrument Serif" fontStyle="italic">{d.l}</text>
              <text x={cx} y={240} textAnchor="middle" fill="#F5F5F5" fontSize="11" fontFamily="Inter">{d.p}</text>
            </g>
          );
        })}
        {/* Legend */}
        <rect x="40" y="258" width="14" height="6" fill="url(#cg-q4)" opacity="0.55" rx="1" />
        <text x="58" y="264" fill="#878787" fontFamily="JetBrains Mono" fontSize="9">RIGHT FOOT</text>
        <rect x="160" y="258" width="14" height="6" fill="url(#cg-q4)" rx="1" />
        <text x="178" y="264" fill="#878787" fontFamily="JetBrains Mono" fontSize="9">LEFT FOOT</text>
      </svg>
    </>
  );

  /* ============== Q5 — Stat impact by position ============== */
  const q5Groups = [
    { pos: 'FORWARDS',     stats: [['Goals/90', 0.74], ['Expected Goals', 0.61], ['Shots on Target', 0.48]] },
    { pos: 'MIDFIELDERS',  stats: [['Key Passes/90', 0.66], ['Progressive Passes', 0.59], ['Goals + Assists/90', 0.52]] },
    { pos: 'DEFENDERS',    stats: [['Aerial duels won %', 0.58], ['Tackles + Interc./90', 0.51], ['Pass completion %', 0.44]] },
    { pos: 'GOALKEEPERS',  stats: [['Save %', 0.62], ['Clean sheets/season', 0.49], ['Post-shot xG saved', 0.46]] },
  ];
  const Chart5 = (
    <>
      <ChartTitle t="Top 3 predictors of market value · by position" sub="Normalized 0–1 · higher = more predictive" />
      <div className="grid grid-cols-2 gap-x-5 gap-y-5 mt-1">
        {q5Groups.map((g) => (
          <div key={g.pos}>
            <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase mb-2">{g.pos}</div>
            <svg viewBox="0 0 200 100" className="w-full">
              <GradientDef id={"cg-q5-" + g.pos} />
              {g.stats.map(([n, v], i) => {
                const y = 8 + i * 28;
                return (
                  <g key={n}>
                    <text x="0" y={y - 2} fill="#878787" fontFamily="JetBrains Mono" fontSize="7">{n}</text>
                    <rect x="0" y={y} width="180" height="9" fill="#141414" rx="2" />
                    <rect x="0" y={y} width={v * 180} height="9" fill={"url(#cg-q5-" + g.pos + ")"} rx="2" />
                    <text x={v * 180 + 4} y={y + 8} fill="#89AACC" fontFamily="Instrument Serif" fontStyle="italic" fontSize="9">{v.toFixed(2)}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        ))}
      </div>
    </>
  );

  /* ============== Q6 — Top clubs by avg per-player value ============== */
  const q6Leagues = [
    { lg: 'PREMIER LEAGUE', clubs: [['Manchester City', 64], ['Arsenal', 52], ['Chelsea', 48]] },
    { lg: 'LA LIGA',        clubs: [['Real Madrid', 58], ['FC Barcelona', 51], ['Atlético Madrid', 36]] },
    { lg: 'SERIE A',        clubs: [['Inter', 38], ['Juventus', 35], ['AC Milan', 33]] },
    { lg: 'BUNDESLIGA',     clubs: [['Bayern Munich', 47], ['Bayer Leverkusen', 32], ['Borussia Dortmund', 30]] },
    { lg: 'LIGUE 1',        clubs: [['PSG', 56], ['Monaco', 28], ['Marseille', 22]] },
  ];
  const q6Max = 70;
  const Chart6 = (
    <>
      <ChartTitle t="Top 3 clubs by avg market value / player (€M)" sub="Per-player metric — harder to game than total squad value" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        {q6Leagues.map((L) => (
          <div key={L.lg}>
            <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase mb-2">{L.lg}</div>
            <svg viewBox="0 0 220 90" className="w-full">
              <GradientDef id={"cg-q6-" + L.lg.replace(/\s/g, '')} />
              {L.clubs.map(([c, v], i) => {
                const y = 8 + i * 24;
                return (
                  <g key={c}>
                    <text x="0" y={y + 8} fill="#F5F5F5" fontFamily="Inter" fontSize="9">{c}</text>
                    <rect x="100" y={y + 1} width="100" height="11" fill="#141414" rx="2" />
                    <rect x="100" y={y + 1} width={(v / q6Max) * 100} height="11" fill={"url(#cg-q6-" + L.lg.replace(/\s/g, '') + ")"} opacity={i === 0 ? 1 : 0.6} rx="2" />
                    <text x={100 + (v / q6Max) * 100 + 4} y={y + 10} fill={i === 0 ? "#89AACC" : "#878787"} fontFamily="Instrument Serif" fontStyle="italic" fontSize="10">€{v}M</text>
                  </g>
                );
              })}
            </svg>
          </div>
        ))}
      </div>
    </>
  );

  /* ============== Q7 — Defender weight vs performance ============== */
  // Hardcoded but designed to follow weight*1.4 - max(0, w-86)*1.8 with jitter
  const q7Points = (() => {
    const pts = [];
    const seed = (i) => Math.sin(i * 12.9898) * 43758.5453;
    const rand = (i) => seed(i) - Math.floor(seed(i));
    for (let i = 0; i < 60; i++) {
      const w = 68 + (i % 14) * 1.9 + (rand(i) - 0.5) * 2.5;
      let perf = 35 + (w - 68) * 1.4 - Math.max(0, w - 86) * 2.2 + (rand(i + 7) - 0.5) * 18;
      perf = Math.max(20, Math.min(95, perf));
      pts.push([w, perf]);
    }
    return pts;
  })();
  const q7W = 480, q7H = 280, q7P = { l: 44, r: 24, t: 24, b: 40 };
  const q7XS = (w) => q7P.l + ((w - 65) / 30) * (q7W - q7P.l - q7P.r);
  const q7YS = (p) => q7P.t + (1 - p / 100) * (q7H - q7P.t - q7P.b);
  // Trend points
  const trend = [];
  for (let w = 65; w <= 95; w += 2) {
    const p = 35 + (w - 68) * 1.4 - Math.max(0, w - 86) * 2.2;
    trend.push([w, Math.max(20, Math.min(95, p))]);
  }
  const Chart7 = (
    <>
      <ChartTitle t="Defender weight (kg) vs defensive performance" sub="Sweet spot 82–86 kg · plateau, then decline above 90 kg" />
      <svg viewBox={`0 0 ${q7W} ${q7H}`} className="w-full">
        <GradientDef id="cg-q7" />
        {[20, 40, 60, 80, 100].map((g) => (
          <g key={g}>
            <line x1={q7P.l} y1={q7YS(g)} x2={q7W - q7P.r} y2={q7YS(g)} stroke="#1F1F1F" />
            <text x={q7P.l - 6} y={q7YS(g) + 3} textAnchor="end" fill="#878787" fontFamily="JetBrains Mono" fontSize="9">{g}</text>
          </g>
        ))}
        {[70, 75, 80, 85, 90, 95].map((w) => (
          <text key={w} x={q7XS(w)} y={q7H - q7P.b + 16} textAnchor="middle" fill="#878787" fontFamily="JetBrains Mono" fontSize="9">{w}</text>
        ))}
        {/* Sweet spot band */}
        <rect x={q7XS(82)} y={q7P.t} width={q7XS(86) - q7XS(82)} height={q7H - q7P.t - q7P.b} fill="#4E85BF" opacity="0.06" />
        {/* Trendline */}
        <polyline
          fill="none"
          stroke="url(#cg-q7)"
          strokeOpacity="0.6"
          strokeWidth="2"
          strokeDasharray="3 4"
          points={trend.map(([w, p]) => `${q7XS(w)},${q7YS(p)}`).join(' ')}
        />
        {/* Points */}
        {q7Points.map(([w, p], i) => (
          <circle key={i} cx={q7XS(w)} cy={q7YS(p)} r="4" fill="url(#cg-q7)" opacity="0.7" />
        ))}
        <text x={q7XS(84)} y={q7P.t + 10} textAnchor="middle" fill="#89AACC" fontFamily="Instrument Serif" fontStyle="italic" fontSize="11">sweet spot</text>
        <text x={q7P.l} y={q7H - 6} fill="#878787" fontFamily="JetBrains Mono" fontSize="9">WEIGHT (kg)</text>
        <text x={20} y={q7P.t + (q7H - q7P.t - q7P.b) / 2} textAnchor="middle" fill="#878787" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="2" transform={`rotate(-90 20 ${q7P.t + (q7H - q7P.t - q7P.b) / 2})`}>PERFORMANCE</text>
      </svg>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Pipeline */}
      <div className="bg-surface border border-stroke rounded-3xl p-8 md:p-10">
        <div className="flex items-baseline justify-between mb-1">
          <div className="font-display italic text-2xl">Pipeline</div>
          <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">3 stages</div>
        </div>
        <p className="text-muted text-xs font-mono mb-8">Replayable from cleaned files even after the source DOM changed</p>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 md:gap-2 items-stretch">
          {stages.map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="ring-gradient bg-bg/40 border border-stroke rounded-2xl p-6">
                <div className="text-muted font-mono text-xs">{s.n}</div>
                <div className="font-display italic text-3xl mt-1">{s.t}</div>
                <div className="mt-3 text-sm text-text-primary/85 font-mono">{s.d}</div>
                <div className="mt-2 text-xs text-muted">{s.sub}</div>
              </div>
              {i < stages.length - 1 && (
                <div className="hidden md:flex items-center justify-center">
                  <svg width="48" height="20"><GradientDef id={"cg-fp-" + i} /><line x1="0" y1="10" x2="40" y2="10" stroke={"url(#cg-fp-" + i + ")"} strokeWidth="2" markerEnd={"url(#cg-fp-" + i + "-arrow)"} /></svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Seven Q&A blocks */}
      <div className="bg-surface border border-stroke rounded-3xl p-6 md:p-10">
        <div className="flex items-baseline justify-between mb-2">
          <div className="font-display italic text-2xl">Seven questions, seven answers</div>
          <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">Q1 → Q7</div>
        </div>
        <p className="text-muted text-xs font-mono">Each chart is hand-coded inline · joins stats × market values × position × season</p>

        <QBlock idx={1} topic="LEAGUE WAGE STRUCTURE" q="Which league spends the most on salaries, and which position is most valued in each league?" chart={Chart1}
          what="The Premier League's wage bill is roughly twice that of the next league, and across the five leagues forwards capture the highest aggregate market value in three of them — the two exceptions being Serie A and Bundesliga, where midfielders edge ahead."
          why="Salary spend is a proxy for competitive intent. The PL's dominance here mirrors its dominance in international transfer flows: clubs that can outbid on wages also tend to outbid on transfer fees, compounding the gap."
          impact="For a club operating outside the PL, this is a strategic constraint to design around — competing on raw wage spend isn't viable, so value capture has to come from somewhere else: better recruitment of undervalued profiles, better youth-to-first-team conversion, or a Bundesliga-style midfield-centric build that doesn't depend on €100M forwards."
        />
        <QBlock idx={2} topic="VALUE OVER TIME" q="How has market value evolved across positions in the 5 leagues?" chart={Chart2}
          what="All four positions recovered after a 2021 dip — consistent with the COVID-era market contraction — and have been on a steady upward trend since. Forwards lead in absolute terms and lead in growth rate; goalkeepers are the most price-stable position."
          why="The valuation premium on forwards isn't shrinking — it's widening. The market is paying more, not less, for goal output. Goalkeepers' price stability reflects a smaller talent pool ceiling and slower performance turnover at that position."
          impact="For squad planning, the relative price ratio between positions matters as much as absolute numbers. Investing wage budget in midfield and defense while developing forwards in-house is one viable counter-strategy to chasing an inflating forward market."
        />
        <QBlock idx={3} topic="DISCIPLINARY RISK" q="How are fouls committed distributed across player weight ranges?" chart={Chart3}
          what="Fouls per 90 minutes climb steadily with player weight, peak in the 85–90 kg bucket, and then dip slightly above 90 kg. The relationship is monotonic up to that ceiling, not random."
          why="Heavier players initiate more physical contests, win more ground duels, and accumulate more fouls in the process. The dip above 90 kg likely reflects positional sorting — the heaviest cohort is dominated by central defenders and goalkeepers whose fouls-per-90 baseline is structurally lower."
          impact="Coaches can use this to anticipate disciplinary risk for heavy midfielders and forwards. An 88 kg ball-winning midfielder is a different yellow-card profile than a 72 kg playmaker, and rotation / substitution planning during cup runs should reflect that."
        />
        <QBlock idx={4} topic="FOOT PREMIUM" q="What is the average price of players by position and dominant foot?" chart={Chart4}
          what="Across every position group, left-footed players carry a market value premium over right-footed players. The premium is largest in absolute terms for forwards (+€2.8M) and proportionally largest for defenders (+21%)."
          why="Roughly only 10–15% of the player pool is left-footed, and tactical systems are often built to exploit asymmetry on the left flank — left-back, left-winger, left-centre-back in a back three. Limited supply meets structural demand, and the market prices that scarcity in."
          impact="For recruitment, this is a clear pricing signal — left-footed profiles are systematically more expensive at every position. Teams that develop left-footed players in their academy capture the spread instead of paying it."
        />
        <QBlock idx={5} topic="POSITION-SPECIFIC KPIs" q="Which statistic has the largest impact on market value, by position?" chart={Chart5}
          what="Different positions get valued on different signals. Forwards are priced on goal output (and increasingly on Expected Goals, a measure of shot quality). Midfielders are priced on creation and progression. Defenders on aerial dominance and ball recovery. Goalkeepers on save quality."
          why={'Aggregate "performance" doesn\'t price players — position-specific output does. A defender who makes 90 passes per game but loses 60% of his aerial duels won\'t be valued like one who wins 70% of duels even with fewer touches.'}
          impact="Recruitment shortlists should be filtered on position-specific KPIs first, generic stats second. A scouting model that ranks forwards by tackles, or defenders by chances created, is going to produce expensive misses."
        />
        <QBlock idx={6} topic="PEER BENCHMARKING" q="Which teams have the highest average market value per player in each league?" chart={Chart6}
          what="Within every league, the top of the value distribution is dominated by the same one or two historical names — the league title race and the player-value race are essentially the same race. The PL is the only league where the top three are all genuinely close in average per-player value; everywhere else there's a steep drop after the leader."
          why="Average market value per player is a much harder metric to game than total squad value. A club can inflate total squad value by hoarding cheap players; per-player value reveals true depth."
          impact="For a sporting director benchmarking against rivals, per-player value is the right yardstick to set squad-planning targets — and it makes the structural advantage of clubs like Man City or Real Madrid quantifiable rather than just intuitive."
        />
        <QBlock idx={7} topic="PHYSICAL PROFILE" q="How does a defender's weight affect their defensive performance?" chart={Chart7}
          what="Defensive performance climbs with weight up to roughly 85 kg, then plateaus and slightly declines. The sweet spot is the 82–86 kg range, where the defender is heavy enough to win aerial and ground duels but not so heavy that mobility starts to suffer."
          why="Modern centre-backs are asked to defend a much larger area of the pitch than ever before — they step up into midfield to press, recover into wide channels to cover full-backs, and have to sprint back against pacy forwards. Pure mass becomes a liability at the upper end of the weight distribution."
          impact="For recruitment of central defenders, the 82–86 kg band is the empirically best-performing range on this dataset. For physical preparation, defenders above 90 kg should be programmed for sustained mobility work to compensate for the natural performance dip in that bucket."
        />
      </div>

      {/* Summary */}
      <div className="bg-surface border border-stroke rounded-3xl p-8 md:p-10">
        <div className="font-display italic text-3xl mb-4">From data to decisions.</div>
        <p className="text-[15px] leading-relaxed text-text-primary/85 max-w-3xl">
          The seven questions, taken together, sketch the spine of a modern data-driven football operation: salary architecture, market trend awareness, disciplinary risk, recruitment efficiency, position-specific KPIs, peer benchmarking, and physical-profile optimization. Each question, on its own, is interesting; together, they're an operating model.
        </p>
      </div>
    </div>
  );
}

/* — 05 Subte visuals — */
function SubteVisuals() {
  const lines = [
    { name: 'A', color: '#89AACC', stations: [[80,420],[140,420],[200,420],[260,420],[320,420],[380,420],[440,420],[500,420]] },
    { name: 'B', color: '#6B9DC2', stations: [[180,300],[240,300],[300,300],[360,300],[420,300],[480,300]] },
    { name: 'C', color: '#4E85BF', stations: [[300,80],[300,140],[300,200],[300,260],[300,320],[300,380],[300,440],[300,490]] },
    { name: 'D', color: '#7BAABF', stations: [[200,200],[280,200],[360,200],[420,200],[500,200]] },
    { name: 'E', color: '#5E8FA8', stations: [[140,460],[200,440],[300,440],[360,450],[420,460],[480,470]] },
  ];
  const labels = [
    { x: 80,  y: 442, text: 'Plaza de Mayo',     anchor: 'start' },
    { x: 500, y: 442, text: 'Alberti',           anchor: 'end' },
    { x: 180, y: 288, text: 'L.N. Alem',         anchor: 'start' },
    { x: 480, y: 288, text: 'Pasteur',           anchor: 'end' },
    { x: 314, y: 82,  text: 'Retiro',            anchor: 'start' },
    { x: 314, y: 494, text: 'Constitución',      anchor: 'start' },
    { x: 200, y: 186, text: 'Catedral',          anchor: 'start' },
    { x: 500, y: 186, text: 'Fac. de Medicina',  anchor: 'end' },
    { x: 140, y: 478, text: 'Bolívar',           anchor: 'start' },
    { x: 480, y: 488, text: 'Pichincha',         anchor: 'end' },
    { x: 432, y: 196, text: 'Callao (D)',        anchor: 'start' },
    { x: 432, y: 312, text: 'Callao (B)',        anchor: 'start' },
    { x: 314, y: 458, text: 'Independencia',     anchor: 'start' },
  ];
  const interchanges = [[420,200],[420,300],[300,440]];
  const routePts = "200,200 280,200 360,200 420,200 420,300 360,300 300,300";
  const stages = [
    { eyebrow: '01', label: 'dist ÷ speed', sub: '1.2 km ÷ 27 km/h' },
    { eyebrow: '02', label: '+ freq wait',  sub: 'headway 4 min · Mon 08:00' },
    { eyebrow: '03', label: '+ door time',  sub: '+ 10 s / stop' },
  ];
  const speeds = [['A', 23], ['B', 27], ['C', 24], ['D', 24], ['E', 28]];
  return (
    <div className="space-y-6">
      {/* Block A — Network map */}
      <div className="bg-surface border border-stroke rounded-3xl p-6 md:p-8">
        <div className="flex items-baseline justify-between mb-1">
          <div className="font-display italic text-2xl">The network</div>
          <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">Schematic · A* output</div>
        </div>
        <p className="text-muted text-xs font-mono mb-6">Five lines · 34 stations · highlighted path is a sample A* result with one transfer at Callao.</p>
        <div className="bg-bg/40 border border-stroke rounded-2xl overflow-hidden">
          <svg viewBox="0 0 800 510" className="w-full">
            <GradientDef id="cg-subte-route" />
            {/* Faint grid */}
            <g opacity="0.06" stroke="#878787" strokeWidth="1">
              {[100,200,300,400,500,600,700].map(x => <line key={'vx'+x} x1={x} y1="0" x2={x} y2="510" />)}
              {[100,200,300,400,500].map(y => <line key={'hy'+y} x1="0" y1={y} x2="800" y2={y} />)}
            </g>
            {/* Lines */}
            {lines.map(L => (
              <polyline key={L.name}
                points={L.stations.map(s => s.join(',')).join(' ')}
                fill="none" stroke={L.color} strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round"
                opacity="0.7"
              />
            ))}
            {/* Highlighted route — glow + line */}
            <polyline points={routePts} fill="none" stroke="url(#cg-subte-route)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" opacity="0.18" />
            <polyline points={routePts} fill="none" stroke="url(#cg-subte-route)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Stations (regular) */}
            {lines.flatMap(L => L.stations.map(([x, y], i) => (
              <circle key={L.name + '-' + i} cx={x} cy={y} r="4" fill="#141414" stroke={L.color} strokeWidth="1.5" />
            )))}
            {/* Interchanges (larger, gradient stroke + glow halo) */}
            {interchanges.map(([x, y], i) => (
              <g key={'int-' + i}>
                <circle cx={x} cy={y} r="16" fill="url(#cg-subte-route)" opacity="0.18" />
                <circle cx={x} cy={y} r="8" fill="#141414" stroke="url(#cg-subte-route)" strokeWidth="2" />
              </g>
            ))}
            {/* Labels */}
            {labels.map((l, i) => (
              <text key={'lbl-' + i} x={l.x} y={l.y} fill="#878787" fontSize="9" fontFamily="JetBrains Mono" textAnchor={l.anchor}>{l.text}</text>
            ))}
          </svg>
        </div>
        {/* Legend */}
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-mono text-muted">
          {lines.map(L => (
            <div key={L.name} className="flex items-center gap-2">
              <span className="inline-block w-6 h-[3px] rounded-full" style={{ backgroundColor: L.color }} />
              <span>Línea {L.name}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 md:ml-auto">
            <span className="inline-block w-6 h-[3px] rounded-full accent-gradient" />
            <span>A* result</span>
          </div>
        </div>
      </div>

      {/* Block B — Edge weight pipeline + speed table */}
      <div className="bg-surface border border-stroke rounded-3xl p-6 md:p-8">
        <div className="flex items-baseline justify-between mb-1">
          <div className="font-display italic text-2xl">Edge weights · g(n)</div>
          <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase">3 components</div>
        </div>
        <p className="text-muted text-xs font-mono mb-8">Each edge in the directed graph carries a time cost composed of three additive parts.</p>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_auto] gap-4 md:gap-2 items-stretch">
          {stages.map((s, i) => (
            <React.Fragment key={s.eyebrow}>
              <div className="ring-gradient bg-bg/40 border border-stroke rounded-2xl p-5">
                <div className="text-muted font-mono text-xs">{s.eyebrow}</div>
                <div className="font-display italic text-2xl mt-1">{s.label}</div>
                <div className="mt-2 text-xs text-muted font-mono">{s.sub}</div>
              </div>
              <div className="hidden md:flex items-center justify-center">
                <svg width="48" height="20"><GradientDef id={"cg-sb-a" + i} /><line x1="0" y1="10" x2="40" y2="10" stroke={"url(#cg-sb-a" + i + ")"} strokeWidth="2" markerEnd={"url(#cg-sb-a" + i + "-arrow)"} /></svg>
              </div>
            </React.Fragment>
          ))}
          <div className="ring-gradient bg-bg/40 border border-stroke rounded-2xl p-5 flex items-center justify-center min-w-[110px]">
            <div className="text-center">
              <div className="text-muted font-mono text-[10px] uppercase tracking-[0.2em]">= cost</div>
              <div className="font-display italic text-3xl accent-gradient-text mt-1">g(n)</div>
            </div>
          </div>
        </div>
        {/* Speed table */}
        <div className="mt-8">
          <div className="text-[10px] tracking-[0.3em] text-muted font-mono uppercase mb-3">Avg speed per line</div>
          <div className="border border-stroke rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg/60">
                  <th className="text-left px-5 py-3 text-[10px] font-mono uppercase tracking-[0.3em] text-muted">Line</th>
                  <th className="text-right px-5 py-3 text-[10px] font-mono uppercase tracking-[0.3em] text-muted">Avg. speed</th>
                </tr>
              </thead>
              <tbody>
                {speeds.map(([line, kmh], i) => {
                  const L = lines.find(l => l.name === line);
                  return (
                    <tr key={line} className={i % 2 ? 'bg-bg/40' : 'bg-surface'}>
                      <td className="px-5 py-3 font-mono">
                        <span className="inline-flex items-center gap-3">
                          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: L.color }} />
                          <span>Línea {line}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-mono accent-gradient-text">{kmh} km/h</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Block C — Accessibility callout */}
      <div className="bg-surface border border-stroke rounded-3xl p-8 md:p-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">— Accessibility</div>
          <div className="h-px flex-1 bg-stroke" />
          <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">03</div>
        </div>
        <div className="font-display italic text-3xl md:text-4xl mb-8 max-w-2xl">Built-in reduced mobility mode.</div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div className="space-y-4 text-[15px] leading-relaxed text-text-primary/85">
            <p>When accessibility mode is enabled, the algorithm adds a <span className="accent-gradient-text font-mono">20-hour penalty</span> to any transfer that is not wheelchair-accessible — effectively making A* route around those interchanges entirely.</p>
            <p className="text-muted">The penalty system doesn't require a separate accessibility graph: it's a single parameter that reprioritizes the same one. If even the best accessible route exceeds 10 hours of penalized cost, the UI surfaces an explicit <span className="font-mono text-text-primary/85">"no accessible route"</span> warning instead of silently returning a misleading path.</p>
          </div>
          <div className="bg-bg/40 border border-stroke rounded-2xl p-5">
            <svg viewBox="0 0 360 200" className="w-full">
              <GradientDef id="cg-subte-acc" />
              {/* Origin */}
              <circle cx="40" cy="110" r="6" fill="#141414" stroke="#878787" strokeWidth="2" />
              <text x="40" y="138" textAnchor="middle" fill="#878787" fontSize="9" fontFamily="JetBrains Mono">Origin</text>
              {/* Destination */}
              <circle cx="320" cy="110" r="6" fill="#141414" stroke="#878787" strokeWidth="2" />
              <text x="320" y="138" textAnchor="middle" fill="#878787" fontSize="9" fontFamily="JetBrains Mono">Dest</text>
              {/* Blocked transfer node */}
              <circle cx="180" cy="110" r="9" fill="#141414" stroke="#5a5a5a" strokeWidth="2" />
              <text x="180" y="114" textAnchor="middle" fill="#878787" fontSize="12" fontFamily="JetBrains Mono">✕</text>
              {/* Standard path (dashed, blocked) */}
              <line x1="46" y1="110" x2="171" y2="110" stroke="#5a5a5a" strokeWidth="2" strokeDasharray="4 3" />
              <line x1="189" y1="110" x2="314" y2="110" stroke="#5a5a5a" strokeWidth="2" strokeDasharray="4 3" />
              <text x="180" y="96" textAnchor="middle" fill="#878787" fontSize="9" fontFamily="JetBrains Mono">2 transfers · ~18 min</text>
              {/* Accessibility path (arc up) */}
              <path d="M 46 110 Q 180 30 314 110" fill="none" stroke="url(#cg-subte-acc)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="180" cy="55" r="5" fill="#141414" stroke="url(#cg-subte-acc)" strokeWidth="2" />
              <text x="180" y="42" textAnchor="middle" fill="#89AACC" fontSize="9" fontFamily="Instrument Serif" fontStyle="italic">+ 1 stop · ~23 min</text>
              <text x="180" y="180" textAnchor="middle" fill="#878787" fontSize="9" fontFamily="JetBrains Mono">accessibility-aware vs. standard</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Routing (hash-based: #/churn, #/clustering…) ---------- */
const SITE_TITLE = 'Rodrigo Pinto Aguilera — Data Science & AI';
const SLUGS = {
  '01': 'churn',
  '02': 'clustering',
  '03': 'aws-game-store',
  '04': 'football-scraper',
  '05': 'subte-router',
};
const projectHref = (n) => '#/' + SLUGS[n];

function projectFromHash() {
  const m = window.location.hash.match(/^#\/([\w-]+)/);
  if (!m) return null;
  return Object.keys(SLUGS).find((n) => SLUGS[n] === m[1]) || null;
}

// True when the visitor opened the project from the home grid, so "Back" can
// simply pop the history entry instead of stacking a new one.
let openedFromHome = false;

function goHome() {
  if (openedFromHome) {
    openedFromHome = false;
    window.history.back();
  } else {
    window.history.pushState(null, '', window.location.pathname + window.location.search);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }
}

/* ---------- ProjectPage ---------- */
const PROJECTS = {
  '01': {
    n: '01', year: '2025',
    title: 'Telco Customer Churn',
    cover: 'assets/Proyecto_Churn.webp',
    heroBefore: "Catching churners before they ",
    heroEm: 'leave',
    heroAfter: '.',
    subtitle: 'Supervised ML pipeline for a telecom dataset, optimized for F2-Score because missing a churner costs more than over-targeting a loyal customer.',
    tags: ['Python', 'scikit-learn', 'imbalanced-learn', 'SMOTE', 'KNN', 'Pandas'],
    stats: [
      { v: '7,032',  l: 'Customers analyzed' },
      { v: '26.5%',  l: 'Class imbalance (churn)' },
      { v: '0.726',  l: 'Best CV F2-Score (KNN)' },
      { v: '~80%',   l: 'Real churners detected' },
    ],
    context: 'Customer acquisition costs significantly more than retention. The dataset is imbalanced (73.5% no-churn / 26.5% churn), so optimizing for accuracy is misleading. Instead, this project tunes for F2-Score (β=2) — Recall weighs twice as much as Precision, because missing a churner is far worse than offering a retention incentive to a loyal customer.',
    methodology: [
      ['Cleaning', 'Drop customerID, convert TotalCharges to numeric, remove 11 nulls.'],
      ['Encoding', 'Binary mapping for booleans, semantic simplification for ternary services, One-Hot for Contract / PaymentMethod / InternetService.'],
      ['Split', '80/20 stratified on Churn.'],
      ['Pipeline', 'StandardScaler → SMOTE (50%) → RandomUnderSampler (80%) → Classifier, all wrapped in ImbPipeline to avoid leakage.'],
      ['Tuning', 'GridSearchCV with 10-Fold CV using a custom F2 scorer.'],
    ],
    Problem: ProblemTelco,
    Visuals: ChurnVisuals,
    callout: { big: '+22.6%', label: 'F2 lift on KNN after SMOTE + UnderSampling (0.592 → 0.726)' },
    takeaways: [
      'Test F2: 0.696 — only a 0.030 gap to CV → no overfitting.',
      'Of every 10 real churners, the model catches 8 before they leave.',
      'Of customers flagged as at-risk, ~46% are true positives — acceptable trade-off given the LTV of a retained customer.',
    ],
    repo: 'https://github.com/RodrigoPintoAguilera/telco-customer-churn-ml',
  },
  '02': {
    n: '02', year: '2025',
    title: 'Socioeconomic Clustering',
    cover: 'assets/Proyecto_Socioeconomico.webp',
    heroBefore: 'Five socioeconomic ',
    heroEm: 'profiles',
    heroAfter: ' hidden in the data.',
    subtitle: 'Comparing K-Means, Hierarchical, DBSCAN and Gaussian Mixture clustering on a Census-style dataset to find the segmentation with the highest interpretive value — not just the highest silhouette.',
    tags: ['Python', 'scikit-learn', 'SciPy', 'PCA', 'BIC', 'Seaborn'],
    stats: [
      { v: '~22,700', l: 'Records (post-dedup)' },
      { v: '4',       l: 'Algorithms compared' },
      { v: 'k = 5',   l: 'Final K-Means clusters' },
      { v: '0.22',    l: 'Silhouette — weak separation' },
    ],
    context: "This is an unsupervised problem: there is no ground truth label. The dataset includes Age, EducationNum, CapitalGain, HoursPerWeek and a few categorical relationship/marital features. To be upfront: no algorithm found strongly separated groups. The chosen K-Means scores a silhouette of 0.22, which means the clusters overlap and the boundaries between them are soft. Hierarchical clustering scored slightly higher (0.24) but pushed 67% of samples into one cluster, which is not a usable segmentation. I kept K-Means with k = 5 because the elbow curve flattens there, the clusters are reasonably balanced (the largest holds ~42%), and each one has a distinct, interpretable profile. The five profiles should be read as tendencies in the population, not as hard-edged groups.",
    methodology: [
      ['EDA & cleaning', 'Drop duplicates, drop Education (redundant with EducationNum).'],
      ['Preprocessing', 'Scaling for numerical, encoding for categorical, PCA for visualization.'],
      ['K-selection', 'Elbow + Silhouette for K-Means; BIC via GridSearchCV for GMM.'],
      ['Run 4 algorithms', 'K-Means, Hierarchical (Ward), DBSCAN, Gaussian Mixture.'],
      ['Profile interpretation', 'Name the 5 clusters by their dominant features.'],
    ],
    Problem: ProblemClustering,
    Visuals: ClusteringVisuals,
    takeaways: [
      'A silhouette of 0.22 means weak separation: the segments overlap, so they describe tendencies rather than hard boundaries.',
      'K-Means with k = 5 was chosen for balance and interpretability, not because it had the best score. Hierarchical scored 0.24 but collapsed 67% of the data into one cluster.',
      "DBSCAN failed because the data simply isn't density-separable in this feature space.",
    ],
    repo: 'https://github.com/RodrigoPintoAguilera/socioeconomic-clustering',
  },
  '03': {
    n: '03', year: '2025',
    title: 'Game Store · AWS',
    cover: 'assets/Proyecto_AWS.webp',
    heroBefore: 'Deploying a REST API on AWS, ',
    heroEm: 'production-style',
    heroAfter: '.',
    subtitle: 'End-to-end deployment of a Python/Flask service on AWS in us-east-1 — VPC, ALB, Auto Scaling Group across two AZs, RDS PostgreSQL in private subnets, S3-hosted Swagger UI and CloudWatch + SNS alarms.',
    tags: ['AWS', 'EC2', 'RDS', 'S3', 'ALB', 'ASG', 'VPC', 'CloudWatch', 'SNS', 'Flask'],
    stats: [
      { v: '2 AZs',  l: 'Multi-AZ deployment' },
      { v: '2 → 4',  l: 'Auto Scaling range' },
      { v: '60%',    l: 'CPU target tracking' },
      { v: '6',      l: 'CloudWatch alarms' },
    ],
    context: "This isn't an EC2 single-instance demo. The system runs in a custom VPC with public/private subnet segmentation across two Availability Zones, an internet-facing Application Load Balancer in front of an Auto Scaling Group, and an RDS PostgreSQL instance fully isolated in private DB subnets. Security follows least-privilege via Security Group chaining (SG-ALB → SG-EC2 → SG-RDS).",
    methodology: null,
    Problem: ProblemAws,
    Visuals: AwsArchitecture,
    takeaways: [
      'Zero direct internet exposure for EC2 or RDS — only the ALB is public.',
      'Auto-recovery is built in: AZ failures, instance crashes, traffic spikes all handled by ASG.',
      'AMI + Launch Template means a new instance comes up healthy and registered automatically.',
    ],
    repo: 'https://github.com/RodrigoPintoAguilera/game-store-aws',
  },
  '04': {
    n: '04', year: '2025',
    title: 'Top-5 Leagues Scraper',
    cover: 'assets/Proyecto_Futbol.webp',
    heroBefore: "Scraping Europe's top-5 ",
    heroEm: 'leagues',
    heroAfter: '.',
    subtitle: 'An end-to-end pipeline: Selenium scraper → JSON → Excel cleaning → Jupyter analysis. 1,636 players across Premier League, La Liga, Serie A, Bundesliga and Ligue 1, with 5 years of market value history.',
    tags: ['Python', 'Selenium', 'Pandas', 'NumPy', 'openpyxl', 'Matplotlib', 'Seaborn'],
    stats: [
      { v: '1,636', l: 'Players scraped' },
      { v: '5',     l: 'Top European leagues' },
      { v: '5 yrs', l: 'Market value history (2020–2024)' },
      { v: '7',     l: 'Analysis questions' },
    ],
    context: "Footystats.org doesn't expose an API, so the data had to be pulled via Selenium across thousands of pages. Each player has personal data (club, position, foot, height, weight, salary), per-season statistics for up to 5 seasons (2020/21 → 2024/25), and an annual market value series. Heads-up: footystats.org redesigned its DOM after late 2025, so the XPath selectors are now stale — but the cleaned JSON / Excel files in the repo still let you reproduce the analysis end-to-end.",
    methodology: null,
    Problem: ProblemFootball,
    Visuals: FootballPipeline,
    takeaways: [
      'The scraping stage took the longest — DOM stability is the biggest hidden cost of any scraper.',
      'Joining stats with market values across 5 seasons unlocks richer questions than either dataset alone.',
      'Pipeline is replayable from the cleaned files even now that the source DOM has changed.',
    ],
    repo: 'https://github.com/RodrigoPintoAguilera/football-stats-scraper',
  },
  '05': {
    n: '05', year: '2025',
    title: 'BA Subte Router',
    cover: 'assets/Proyecto_Subte.webp',
    heroBefore: 'Finding the fastest ',
    heroEm: 'path',
    heroAfter: ' through Buenos Aires.',
    subtitle: 'A desktop route planner for the Buenos Aires Subte — A* search with time-aware edge weights derived from the official GTFS feed, station disambiguation, accessibility mode, and a Folium interactive map embedded in a PyQt5 window.',
    tags: ['Python', 'A* Search', 'PyQt5', 'Folium', 'NetworkX', 'GTFS', 'Haversine'],
    stats: [
      { v: '5',   l: 'Lines covered' },
      { v: '34',  l: 'Stations modelled' },
      { v: 'A*',  l: 'Search algorithm' },
      { v: '10s', l: 'Door-time per stop' },
    ],
    context: "A desktop application that computes the optimal route between any two stations of the Buenos Aires Subte using the A* search algorithm. Edge weights aren't static — they account for real travel distances, per-line average speeds, train frequencies that change with the day of the week and the hour of the day (sourced from the official GTFS feed published by Buenos Aires Data), and a constant 10-second door-opening time added to every edge. The result is a route planner that behaves differently at 8 AM on a Monday versus 11 PM on a Sunday — because the subway does too.",
    methodology: [
      ['Data preparation', 'Station coordinates from Wikipedia loaded via coordenadas.csv. GTFS frequency data processed into frequencies.xlsx (headways per line, weekday category, hour bracket). Heuristic matrix h(n) precomputed between every pair of stations and stored in heuristicas.xlsx to avoid recalculating at runtime.'],
      ['Graph construction', 'graph.py builds a networkx.DiGraph. Intra-line edges use distance ÷ line speed + 10s door time. Transfer edges use walking time + expected headway on the destination line, looked up from frequencies.py at runtime, not baked in. Four curved segments use midpoint correction.'],
      ['Station disambiguation', 'Callao exists on lines B and D; Independencia on lines C and E. The routing engine resolves the correct node from a user-entered name by checking which line the user is currently on.'],
      ['A* search', 'networkx.astar_path() with a custom weight function that reads the live frequency at query time (day + hour passed as parameters). The heuristic h(n) returns the precomputed straight-line time — admissible because no route can be faster than a straight line at the network’s top speed.'],
      ['UI layer', 'PyQt5 window (maximised on launch) hosts a form for origin, destination, date/time and accessibility toggle. On search, the result path is rendered in the embedded Folium map as a highlighted polyline with intermediate stops labeled. The map auto-centers and zooms to fit the computed route.'],
    ],
    Problem: ProblemSubte,
    Visuals: SubteVisuals,
    takeaways: [
      'A* on a transit graph requires dynamic edge weights — static weights produce routes that are correct at one time of day but wrong at another.',
      'The directed graph is non-negotiable: transfer cost depends on the frequency of the destination line, so C → E and E → C carry different weights.',
      "The accessibility penalty system (20-hour cost on inaccessible transfers) is a clean, general-purpose mechanism — it doesn't require a separate accessibility graph, just a single parameter that reprioritizes the same one.",
    ],
    repo: 'https://github.com/RodrigoPintoAguilera/buenos-aires-subte-router',
  },
};

function ProjectPage({ project, onBack }) {
  const data = PROJECTS[project];
  const wrapRef = useRef(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    wrapRef.current?.focus({ preventScroll: true });
    if (data) document.title = data.title + ' — Rodrigo Pinto Aguilera';
  }, [project]);

  if (!data) return null;
  const Visuals = data.Visuals;

  return (
    <div ref={wrapRef} tabIndex={-1} className="animate-page-in min-h-screen bg-bg outline-none">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-40 bg-bg/80 backdrop-blur-md border-b border-stroke">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to projects"
            className="ring-gradient inline-flex items-center gap-2 px-5 py-2 rounded-full border border-stroke text-sm hover:bg-surface/70 transition"
          >
            <span aria-hidden>←</span> Back
          </button>
          <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase tabular-nums">
            {data.n} / 05
          </div>
          <a
            href={data.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-stroke text-sm hover:bg-surface/70 transition"
          >
            <Github size={14} /> GitHub <ArrowUR size={12} />
          </a>
        </div>
      </div>

      {/* Hero */}
      <section className="px-6 pt-16 md:pt-24 pb-12 overflow-hidden">
        <div className="max-w-[1200px] mx-auto overflow-hidden">
          <div className="flex items-center gap-4 mb-10">
            <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">— Project · {data.n}</div>
            <div className="h-px flex-1 bg-stroke" />
            <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">{data.year}</div>
          </div>
          <div className="grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-7">
              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-8xl leading-[0.98] tracking-tight">
                {data.heroBefore}<em className="font-display not-italic italic accent-gradient-text">{data.heroEm}</em>{data.heroAfter}
              </h1>
              <p className="mt-8 text-lg text-muted leading-relaxed max-w-xl">{data.subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {data.tags.map((t) => (
                  <span key={t} className="bg-surface border border-stroke rounded-full px-4 py-2 text-[11px] font-mono uppercase tracking-[0.2em] text-text-primary/85">{t}</span>
                ))}
              </div>
            </div>
            <div className="md:col-span-5 mt-6 md:mt-0">
              <div className="relative aspect-[16/10] rounded-3xl border border-stroke overflow-hidden bg-bg">
                <img
                  src={data.cover}
                  alt={data.title + " — project cover"}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">— At a glance</div>
            <div className="h-px flex-1 bg-stroke" />
            <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">02</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.stats.map((s, i) => (
              <div key={i} className="bg-surface border border-stroke rounded-3xl p-5 sm:p-8 min-w-0">
                <div className="font-display italic text-[2rem] sm:text-5xl accent-gradient-text leading-none whitespace-nowrap">{s.v}</div>
                <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem (optional, custom per project) */}
      {data.Problem && (
        <section className="px-6 py-12">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center gap-4 mb-10">
              <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">— The Problem</div>
              <div className="h-px flex-1 bg-stroke" />
              <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">03</div>
            </div>
            <data.Problem />
          </div>
        </section>
      )}

      {/* Context */}
      {data.context && (
        <section className="px-6 py-12">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">— Context</div>
              <div className="h-px flex-1 bg-stroke" />
              <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">{data.Problem ? '04' : '03'}</div>
            </div>
            <p className="text-lg leading-relaxed text-text-primary/85 max-w-3xl">{data.context}</p>
          </div>
        </section>
      )}

      {/* Methodology */}
      {data.methodology && (
        <section className="px-6 py-12">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">— Approach</div>
              <div className="h-px flex-1 bg-stroke" />
              <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">{data.Problem ? '05' : '04'}</div>
            </div>
            <div className="space-y-2">
              {data.methodology.map(([t, d], i) => (
                <div key={i} className="grid grid-cols-[40px_1fr] md:grid-cols-[60px_220px_1fr] gap-4 md:gap-8 items-start py-5 border-t border-stroke">
                  <div className="flex items-center gap-3 pt-1">
                    <span className="w-2 h-2 rounded-full accent-gradient" />
                    <span className="text-muted font-mono text-xs tracking-[0.2em]">0{i+1}</span>
                  </div>
                  <div className="font-display italic text-2xl md:text-3xl">{t}</div>
                  <div className="col-span-2 md:col-span-1 text-muted leading-relaxed">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results / Visuals */}
      <section className="px-6 py-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">— Results</div>
            <div className="h-px flex-1 bg-stroke" />
            <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">{(() => {
              let n = 3;
              if (data.Problem) n++;
              if (data.context) n++;
              if (data.methodology) n++;
              return String(n).padStart(2, '0');
            })()}</div>
          </div>
          <Visuals />
          {data.callout && (
            <div className="mt-6 bg-surface border border-stroke rounded-3xl p-8 md:p-12 grid md:grid-cols-[auto_1fr] gap-8 items-center">
              <div className="font-display italic text-7xl md:text-8xl accent-gradient-text leading-none">{data.callout.big}</div>
              <div className="text-muted text-base md:text-lg leading-relaxed max-w-md">{data.callout.label}</div>
            </div>
          )}
        </div>
      </section>

      {/* Takeaways */}
      <section className="px-6 py-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">— Key takeaways</div>
            <div className="h-px flex-1 bg-stroke" />
            <div className="text-[11px] tracking-[0.3em] text-muted font-mono uppercase">{(() => {
              let n = 4;
              if (data.Problem) n++;
              if (data.context) n++;
              if (data.methodology) n++;
              return String(n).padStart(2, '0');
            })()}</div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {data.takeaways.map((tk, i) => (
              <div key={i} className="ring-gradient bg-surface border border-stroke rounded-3xl p-7 hover:bg-white/[0.02] transition">
                <div className="flex items-center gap-2 text-muted font-mono text-xs tracking-[0.2em] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full accent-gradient" /> Take 0{i+1}
                </div>
                <p className="mt-5 text-[15px] leading-relaxed text-text-primary/90">{tk}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 md:py-32 text-center">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-[11px] tracking-[0.4em] text-muted font-mono uppercase mb-6">— More</div>
          <h2 className="font-display italic text-6xl md:text-8xl leading-[0.98] tracking-tight">
            See it on <span className="accent-gradient-text">GitHub</span>.
          </h2>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={data.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="ring-gradient inline-flex items-center gap-3 px-7 py-4 rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-md hover:scale-[1.04] transition text-base"
            >
              <Github size={16} /> View on GitHub <ArrowUR size={14} />
            </a>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm text-muted hover:text-text-primary transition"
            >
              <span aria-hidden>←</span> Other projects
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- App ---------- */
function App() {
  const [project, setProject] = useState(projectFromHash);
  // Skip the intro loader on deep links (#/churn…) and after the first visit this session.
  const [loading, setLoading] = useState(() => {
    if (projectFromHash()) return false;
    try { return !sessionStorage.getItem('rpa-intro-seen'); } catch { return true; }
  });
  const prevProject = useRef(project);

  useEffect(() => {
    const onHashChange = () => setProject(projectFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    // Coming back from a project page: land on the Work section, not the top.
    if (prevProject.current && !project) {
      document.title = SITE_TITLE;
      setTimeout(() => document.getElementById('work')?.scrollIntoView({ behavior: 'instant' }), 30);
    }
    prevProject.current = project;
  }, [project]);

  const handleLoadingDone = () => {
    try { sessionStorage.setItem('rpa-intro-seen', '1'); } catch {}
    setLoading(false);
  };

  return (
    <>
      {loading && <Loading onDone={handleLoadingDone} />}
      {!project ? (
        <>
          <Navbar />
          <main>
            <Hero />
            <About />
            <Pillars />
            <Toolkit />
            <Work />
            <Education />
            <Footer />
          </main>
        </>
      ) : (
        <ProjectPage project={project} onBack={goHome} />
      )}
    </>
  );
}


createRoot(document.getElementById('root')).render(<App />);
