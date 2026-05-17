# SPEC.md

Accurate, AI-readable architecture spec for this Hugo site. Intended to orient
future agents quickly without having to re-derive everything from the code.

## Runtime stack

| Layer | Tool | Notes |
|---|---|---|
| Static site generator | **Hugo extended ≥ 0.160.1** | `codeFences = false`, `goldmark.renderer.unsafe = true` |
| CSS | SCSS via Hugo Pipes (libsass) | Fingerprinted + minified; `main.scss` is an entrypoint that `@import`s 12 partials |
| JS | Plain ES5-ish (defer) | Hugo `minify` + `fingerprint` |
| Syntax highlighter | **Prism.js 1.29.0** (client-side) | Core + 20 language grammars + 4 plugins, bundled at build time |
| Prism theme | `prism-themes@1.9.0/themes/prism-dracula.min.css` | Force `background-color: #0f172a` so it matches site regardless of page theme |
| Icon font | FontAwesome 5.8.1 (CDN) | Used for post meta, nav toggle, sponsor buttons |
| Body font | Google Fonts **Noto Sans TC** | Loaded via `[params.googleFonts]` URL in `config.toml` |
| Code font | Google Fonts **JetBrains Mono** | Replaces previous Fira Code; same Google Fonts request |
| Display font | **Atkinson Hyperlegible Next** (self-hosted) | `static/fonts/AtkinsonHyperlegibleNext.woff2`; used for home hero title via `--font-display` |
| Hosting | GitHub Pages via `upload-pages-artifact` + `deploy-pages` | Custom domain `blog.howar31.com` (CNAME in `static/`) |

No Node.js is executed at build or runtime. All remote third-party code
(Prism, prism-themes) is fetched once at build time via
`resources.GetRemote`, concatenated, minified, fingerprinted, served from
the site's own origin with SRI.

## Directory layout

```
howar31-blog/
├── config.toml                          # Site config (see "Config" below)
├── archetypes/default.md                # Template for `hugo new`
├── content/
│   ├── about.md                         # About page (linked from navbar; /about/)
│   └── posts/
│       ├── _index.md                    # Overrides section title → "Recent Posts"
│       └── <slug>/
│           ├── index.md                 # Post (page bundle)
│           └── images/…                 # Post-local images
├── layouts/
│   ├── index.html                       # Home page (hero + post-card list + sidebar)
│   ├── index.json                       # JSON output template: /index.json for search
│   ├── _default/
│   │   ├── baseof.html                  # HTML skeleton + Prism JS bundle
│   │   ├── single.html                  # Post page
│   │   ├── list.html                    # /posts/, /categories/<x>/, /tags/<x>/
│   │   ├── terms.html                   # /categories/, /tags/ (taxonomy index)
│   │   └── _markup/
│   │       └── render-image.html        # Goldmark hook: image → figure card
│   ├── partials/
│   │   ├── head.html                    # <head>: theme boot, SCSS pipe, Prism CSS bundle, meta
│   │   ├── header.html                  # Full navbar: gradient site name + nav links + search + GitHub + theme toggle + mobile hamburger
│   │   ├── footer.html                  # About + Sponsor columns + © line
│   │   ├── post-card.html               # Reusable post card (title, meta, summary, tags, thumbnail)
│   │   ├── post-meta.html               # .blog-post-meta under each post h1
│   │   ├── sidebar.html                 # Home sidebar: About card, tag cloud, support card
│   │   └── back-to-top.html             # SVG circle scroll-progress button
│   └── shortcodes/
│       ├── tip.html                     # {{< tip "…" >}} callout
│       └── warning.html                 # {{< warning "…" >}} callout
├── assets/
│   ├── scss/
│   │   ├── main.scss                    # SCSS entrypoint: 4 variables + @import of 12 partials
│   │   ├── _tokens.scss                 # Design-system tokens: color scales, glass/shadow/radius/type; dark canonical
│   │   ├── _base.scss                   # CSS reset, body, typography, links
│   │   ├── _layout.scss                 # Page structure: vp-page, vp-content, vp-content-wide
│   │   ├── _navbar.scss                 # .vp-navbar, .vp-nav, .vp-nav-mobile
│   │   ├── _footer.scss                 # .vp-footer
│   │   ├── _hero.scss                   # .home-hero
│   │   ├── _post-list.scss              # .post-list, .post-card
│   │   ├── _sidebar.scss                # .home-sidebar, .side-card, .term-list
│   │   ├── _post.scss                   # .post-content, .post-figure, .vp-image-modal, shortcodes
│   │   ├── _search.scss                 # .vp-search modal
│   │   ├── _back-to-top.scss            # .back-to-top
│   │   └── _pagination.scss             # Hugo internal pagination
│   └── js/theme.js                      # All runtime JS (no Prism logic here)
├── static/                              # Passed through untouched
│   ├── CNAME                            # blog.howar31.com
│   ├── manifest.json                    # PWA manifest
│   ├── service-worker.js                # Cleanup shim: unregisters old VuePress SW + clears caches
│   ├── fonts/
│   │   └── AtkinsonHyperlegibleNext.woff2  # Self-hosted display font
│   └── logo/…                           # Site icons (avatar, apple-touch, etc.)
└── .github/workflows/hugo.yml           # CI: install Hugo → build --minify → deploy Pages
```

## Config (`config.toml`) key fields

- `baseURL = "https://blog.howar31.com/"`
- `languageCode = "zh-tw"`
- `googleAnalytics` — **disabled** (commented out). Previous UA ID
  `UA-8779590-7` retired 2023-07. Re-enable by setting a GA4 `G-XXXXXXX`
  value. While disabled, Hugo's `_internal/google_analytics.html` emits
  nothing
- `enableEmoji`, `enableGitInfo`, `enableRobotsTXT`: all `true`
- `[markup.highlight] codeFences = false` → Goldmark emits clean
  `<pre><code class="language-xxx">`, Prism takes over client-side
- `[markup.goldmark.renderer] unsafe = true` → allow raw HTML in Markdown
- `[markup.goldmark.parser] wrapStandAloneImageWithinParagraph = false`
  → required for the render-image hook (see "Render hooks" below) so a
  standalone `![]()` becomes `<figure>` not `<p><figure>…</figure></p>`
- `[taxonomies] category = "categories"`, `tag = "tags"`
- `[permalinks] posts = "/posts/:contentbasename/"` → URL uses parent folder
  name (slug) not title-derived
- `[[menu.main]]` — **defined**: Home (weight 10), Posts (20), Categories
  (30), Tags (40), About (50). `header.html` iterates `site.Menus.main`
  for both desktop nav links and the mobile hamburger panel
- `[[menu.footer]]`: About column (howar31.com / GitHub / Source Code)
- `[params.sponsor]`: `kofi = "howar31"`, `paypal = "https://donate.howar31.com"`
  — verified identifiers only. Do **not** add `githubSponsors`; not enabled
  on the user's account
- `[params.googleFonts]` — URL loading **Noto Sans TC** + **JetBrains Mono**
  via Google Fonts; injected in `head.html` via `<link rel="stylesheet">`
- `[outputs] home = ["HTML", "RSS", "JSON"]` — the JSON output type feeds
  `layouts/index.json` → `/index.json` → front-end search

## Home page architecture

Two-column CSS Grid at ≥ 720px; stacks at < 720px.

```
.home
├── .home-hero                           # Eyebrow + display-font title + tagline
└── .home-layout (grid: 1fr 16rem)
    ├── .home-main
    │   ├── .home-main-header            # "Recent Posts" + "All Posts →"
    │   ├── .post-list × 10 latest       # Each item uses post-card.html partial
    │   └── .home-main-cta               # "Browse all N posts →" pill button
    └── .home-sidebar (partial: sidebar.html, position: sticky)
        ├── .side-card "About"           # Avatar, name, bio, GitHub + howar31.com links
        ├── .side-card "Tags"            # Count-sized .vp-pill tag cloud
        └── .side-card "Support"        # Ko-fi + PayPal buttons from [params.sponsor]
```

The `vp-content-wide` wrapper (baseof.html chose this when `.IsHome`) gives
the home page `max-width: 1080px` instead of the usual `740px`, to fit the
grid.

## Taxonomy convention (important)

**Frontmatter value = URL slug = displayed string.** All lowercase with
dashes. No humanize transform anywhere in templates.

- Frontmatter: `categories: [vuepress]`, `tags: [dev-notes, css]`
- URL: `/categories/vuepress/`, `/tags/dev-notes/`
- Displayed in sidebar / terms / post-meta: `vuepress`, `dev-notes`, `css`

Three categories in use: `hugo` (1 post, the current era), `vuepress`
(11 posts, 2019-2026 VuePress v1/v2 era) and `wordpress` (42 archive
posts from the pre-VuePress WordPress era).

When adding a new post, keep all taxonomy values lowercase-dash. Don't mix
Title Case (`- Vuepress`) or acronyms (`- CSS`); the displayed text would
drift from other places rendered differently.

## Layout responsibilities

- **`baseof.html`** — HTML skeleton; delegates `head`, `header`, `footer`,
  `back-to-top` to partials; injects compiled `theme.js` and the Prism
  bundle (built at template render time via `resources.GetRemote` → `Concat`
  → `minify` → `fingerprint`). `.IsHome` selects `vp-content-wide` vs
  `vp-content theme-default-content`.
- **`head.html`** — Inline FOUC-prevention script reads
  `localStorage['howar31-theme']` and defaults to **dark** when no stored
  preference exists (`var theme = stored || 'dark'`). Compiles `main.scss`,
  fetches Prism CSS bundle, adds FA + Google Fonts (Noto Sans TC +
  JetBrains Mono), OG / PWA meta, RSS link, GA block in production.
- **`header.html`** — Full navbar: gradient site name (`.vp-site-name`) +
  desktop nav links (`.vp-nav`, iterates `site.Menus.main` with active-state
  detection) + search-trigger icon button + GitHub icon link + theme toggle +
  mobile hamburger (`.vp-nav-burger`) that toggles `.vp-nav-mobile` panel.
- **`footer.html`** — Two-column grid (`repeat(auto-fit, minmax(14rem, 1fr))`).
  "About" column iterates `site.Menus.footer`; "Support this blog" renders
  Ko-fi + PayPal buttons when the relevant params are set. Bottom line is
  `© YEAR author. description`.
- **`single.html`** — `<article>` with `<h1>`, `post-meta`, `.Content`.
  First Markdown `# title` line is stripped at content-migration time so
  there is only one `h1`.
- **`list.html`** — Used for `/posts/`, category pages, tag pages. Paginated
  post list (20 per page); each item rendered by the `post-card.html` partial.
- **`terms.html`** — Used for `/categories/` and `/tags/` indexes. Renders
  a pill cloud of terms via `.Data.Terms.Alphabetical`, using `.Name`
  (the raw lowercase-dash slug) as display text.
- **`index.json`** — Hugo JSON output template. Emits `/index.json`: a JSON
  array of `{title, url, date, summary, tags, categories}` for every post.
  Consumed lazily by the front-end search module in `theme.js`.

## Partials

- **`post-card.html`** — Reusable `<article class="post-card">`: title link,
  meta row (date · reading time · category), summary paragraph, tag pills,
  and an auto-resolved thumbnail (`.Params.image` → first image resource in
  page bundle → no thumbnail). Used by both `index.html` (home recent-posts)
  and `list.html` (/posts/, category, tag pages).
- **`post-meta.html`** — `<div class="blog-post-meta">` compact icon row:
  date · reading time · category (FA icons; no text labels). Tag pills below
  the description. Old `分類：` / `標籤：` text labels and `.meta-label` /
  `.meta-value` rules were removed in the refactor.
- **`sidebar.html`** — Home sidebar `<aside class="home-sidebar">` with three
  `.side-card` glass cards: About (avatar, name, bio, GitHub + howar31.com
  links), Tag cloud (count-sized `.vp-pill` pills via `site.Taxonomies.tags`),
  Support (Ko-fi + PayPal buttons from `[params.sponsor]`). Styled in
  `_sidebar.scss`.
- **`back-to-top.html`** — Fixed button bottom-right with two concentric
  `<circle>`s (track + progress bar). Circle geometry (`cx/cy/r`) is set as
  **HTML attributes** not CSS, because iOS Safari ≤ 16 does not support the
  CSS SVG Geometry module. `theme.js` computes scroll ratio and updates
  `stroke-dashoffset`.

## Shortcodes

- **`tip`** → `<div class="hint-container tip">` with FA lightbulb
- **`warning`** → `<div class="hint-container warning">` with triangle icon

Both accept an optional positional arg as title:
`{{< tip "Edit — 2019-07-05" >}}...{{< /tip >}}`.

Styled in `_post.scss` under `.hint-container` — blue-border pill for tip,
amber for warning, with dark-mode variants. Inner content is rendered via
`{{ .Inner | markdownify }}`.

## Render hooks

### `layouts/_default/_markup/render-image.html`

Goldmark fires this hook for every Markdown `![alt](src)`. The hook
classifies the alt and chooses one of two outputs:

- **Descriptive alt** → `<figure class="post-figure"><img …
  loading="lazy"><figcaption>{alt}</figcaption></figure>`. The alt text
  IS the caption — single source of truth, no need to repeat it as a
  paragraph below the image
- **Filename-style alt** (suffixes `.png/.jpg/.jpeg/.gif/.webp/.svg`,
  case-insensitive) **or empty alt** → plain `<img …
  loading="lazy">` without a figure wrapper

Pairs with `markup.goldmark.parser.wrapStandAloneImageWithinParagraph =
false` in `config.toml`; otherwise Goldmark would wrap the figure in
`<p>`, producing invalid HTML (`<figure>` is block-level).

The `ducky-shine-5` post originally had each image followed by a plain
text line repeating the alt; those 44 duplicate lines were stripped at
hook-introduction time so the rendered output now shows just one
caption per image.

## SCSS (`assets/scss/`)

`main.scss` is a thin entrypoint (4 SCSS variables + `@import` of 12
partials). Variables defined there and available to all partials:
`$navbar-height: 3.6rem`, `$content-max-width: 740px`,
`$breakpoint-narrow: 959px`, `$breakpoint-mobile: 719px`.

Partial import order: `_tokens, _base, _layout, _navbar, _footer, _hero,
_post-list, _sidebar, _post, _search, _back-to-top, _pagination`.

### `_tokens.scss` — design-system foundation

- Self-hosts the **Atkinson Hyperlegible Next** display font via `@font-face`.
- `:root` block defines the full design-system token set: color scales
  (`--blue-*`, `--violet-*`, `--slate-*`), glass tokens (`--glass-bg`,
  `--glass-border`, `--glass-blur`), shadow tokens (`--shadow-card`,
  `--shadow-blue`, etc.), glow tokens (`--glow-1`, `--glow-2`), radius
  tokens (`--radius-sm` through `--radius-pill`), type stacks
  (`--font-sans`, `--font-mono`, `--font-display`, etc.), and semantic
  `--c-*` / `--vp-c-*` vars — all set to **light-mode** values in `:root`.
- **Dark mode is the canonical default.** `html[data-theme="dark"]` overrides
  all `--c-*` / `--vp-c-*` / code vars to the dark palette. Dark mode also
  adds `body::before` / `::after` purple radial gradients with
  `float-glow-1` / `float-glow-2` 20s / 25s infinite keyframe animations.

### General SCSS notes

- `.vp-*` class naming inherited from the previous VuePress default theme
  to allow the original SCSS rules to apply directly.
- Sticky `.vp-navbar` with `backdrop-filter: blur(24px)` — site title uses
  `background: linear-gradient(to right, var(--blue-400), var(--violet-400))`
  + `-webkit-background-clip: text` for the gradient text effect.
- Code blocks (`pre[class*="language-"]`) are forced to the slate-900 dark
  palette regardless of site theme (intentional: code is always dark,
  matches the previous VuePress look).
- `.term-list > li > a` produces pill-style tag chips (used by `terms.html`
  and `_sidebar.scss`). The old `.sidebar-terms` size variant was removed
  in the refactor — `_sidebar.scss` now uses `.side-tagcloud` with inline
  `font-size` scaling instead.
- `.post-figure` (the captioned image card produced by the render hook):
  - **Light mode** — opaque `var(--c-bg-soft)` card, `padding: 0.5em`,
    `border-radius: 10px`, directional drop shadow; image inside has
    its own `border-radius: 4px`. Hover bumps the shadow and adds a
    faint violet halo (`rgba(167, 139, 250, 0.12)`)
  - **Dark mode** — frosted-glass frame: `backdrop-filter: blur(20px)`
    + `rgba(255, 255, 255, 0.04)` background + 1px white-tint border.
    The blur picks up the page's animated `body::before/::after` violet
    gradients passing behind. A `.post-figure::before` pseudo-element
    layers an additional local violet ambient glow (`rgba(139, 92, 246,
    0.18)` radial at `opacity: 0.55`, animated via the
    `figure-glow-drift` keyframe — a 14s gentle translate + scale loop
    that mirrors the body's `float-glow-1/2` vibe). Hover lifts the
    pseudo-element to `opacity: 1` and brightens the border
  - **Overflow clamp** — `body { overflow-x: clip }` (not `hidden`)
    prevents the `::before` `-30%` bleed from creating a horizontal
    scroll on mobile while preserving the sticky navbar (`clip` doesn't
    establish a scroll container)
  - **Hover tilt** — JS adds `.is-tilting` class on `mouseenter`, which
    swaps in a short `transform 0.2s ease-out` transition. JS sets
    `transform: perspective(800px) rotateX/Y(±6°) scale(1.02)` from
    cursor position via rAF. `mouseleave` removes the class so the
    default `0.4s cubic-bezier` transition eases back. Gated client-side
    by `(hover: hover) and (pointer: fine)` and
    `prefers-reduced-motion`. SCSS-side `@media
    (prefers-reduced-motion: reduce)` belt-and-braces disables both the
    transition and the `figure-glow-drift` animation
- `.vp-image-modal` lightbox lives in `_post.scss`. Backdrop is
  `rgba(0, 0, 0, 0.85)` in both light and dark mode (standard lightbox
  UX, intentionally not bound to `--c-*`). z-index 200 (backdrop) / 201
  (close button) sits above navbar (50) and back-to-top (100). Open
  state toggled via `.is-open` with opacity + visibility transition.
  `html.modal-open { overflow: hidden }` locks page scroll
- `.vp-image-modal-card` wraps the image and caption inside the modal,
  mirroring the in-page `.post-figure` look at a larger size. Always
  uses the navbar's frosted-glass treatment regardless of theme
  (`backdrop-filter: blur(24px)` + `rgba(255, 255, 255, 0.08)` over the
  dark backdrop) plus a violet ambient `0 0 64px` box-shadow for
  brand-coloured ambient. `.vp-image-modal-caption` is hidden by default
  and only shown when `.vp-image-modal-card` has `.has-caption` (added
  by JS when the source figure had a `figcaption`). Caption colour is
  fixed `rgba(255, 255, 255, 0.92)` rather than `var(--c-text)` because
  the modal always sits on a dark backdrop. `<= 640px` media query
  trims close-button margins and caps image height to 73vh

### SCSS pitfall (document so future edits don't regress)

Do **not** use `&-<suffix>` after a descendant combinator inside nested
scopes. Libsass expands `&-suffix` using the *entire* parent selector,
which duplicates ancestors. For example:

```scss
.outer {
  .block {
    &.open &-child { ... }   // BUG
  }
}
```

compiles to `.outer .block.open .outer .block-child` (`.outer` duplicated)
— the selector never matches the DOM. Spell the descendant class out
explicitly instead:

```scss
&.open .block-child { ... }   // OK
```

This tripped up the navbar dropdown rules in an earlier iteration; both
the buggy selectors and the code that depended on them were removed, but
keep this note when adding new BEM-style nested rules.

## JS (`assets/js/theme.js`)

Single IIFE, `defer`-loaded. Responsibilities in order:

1. **Prism line-numbers opt-in** — On script start, adds `.line-numbers`
   class to every `<pre>` containing a `code[class*="language-"]`, so
   Prism's line-numbers plugin activates on its DOMContentLoaded sweep.
2. **Dark mode toggle** — Click handler on `[data-theme-toggle]` sets
   `data-theme` attribute + writes `localStorage['howar31-theme']`.
   `matchMedia('(prefers-color-scheme: dark)').addEventListener('change', …)`
   respects system changes **only** when the user hasn't made an explicit
   choice yet.
3. **Mobile nav toggle** — Click handler on `[data-nav-toggle]` toggles
   the `hidden` attribute on `[data-nav-panel]` (`.vp-nav-mobile`) and
   updates `aria-expanded`. A `resize` listener auto-hides the panel at
   ≥ 720px viewport width.
4. **Search modal** — Builds a `.vp-search` dialog once and appends it to
   `<body>`. Opens on the navbar search button (`[data-search-open]`) or
   the `/` key (when no input/textarea is focused); closes on Esc or
   backdrop click. Lazy-fetches `/index.json` once on first open; all
   filtering is client-side token match. Focus trap keeps Tab/Shift+Tab
   inside the modal. See "Front-end search" section for full details.
5. **Back-to-top progress ring** — Scroll listener (rAF throttled) updates
   `stroke-dashoffset` on `.back-to-top-bar` based on
   `scrollTop / (scrollHeight - innerHeight)`. Button fades in after 200px.
6. **Post-image lightbox** — On post pages, builds a single
   `.vp-image-modal` (containing a `.vp-image-modal-card` figure with
   `<img>` + `<figcaption>`) once and appends it to `<body>`. Delegated
   click handler on `.post-content` opens the modal for any `<img>` not
   wrapped in `<a>` (linked images keep their navigation behaviour). The
   modal copies `src`/`srcset`/`sizes`/`alt` so responsive images still
   pick the correct source at the larger render size. If the source
   `<img>` is inside a `figure.post-figure` with a `<figcaption>`, the
   text is mirrored into `.vp-image-modal-caption` and `.has-caption`
   added to the card (CSS shows the caption strip); otherwise the
   caption stays hidden. Three close paths: click on backdrop (clicks on
   the card itself do **not** close), click on the X button (44×44
   touch target, top-right), `Escape` key. Body scroll is locked via
   `html.modal-open` while open. `aria-modal`, `aria-hidden`,
   `aria-label` toggled for assistive tech; focus moves to the close
   button on open and back to the originating image on close. The
   lightbox is intentionally one-shot — no prev/next navigation, no
   pinch/pan logic beyond the browser's native gestures
7. **Figure card 3D tilt** — On post pages, attaches `mouseenter` /
   `mousemove` / `mouseleave` listeners to every `figure.post-figure`.
   Mousemove computes a `(x, y)` offset from the card centre and writes
   `transform: perspective(800px) rotateX/Y(±6°) scale(1.02)` on a
   single rAF per frame; the `.is-tilting` class swaps the SCSS
   transition to a short ease-out for instant cursor follow.
   Mouseleave drops the class, clears the inline transform, and the
   default `0.4s cubic-bezier` transition eases the card back to rest.
   Skipped entirely when `(hover: hover) and (pointer: fine)` is false
   (touch devices) or `prefers-reduced-motion: reduce` is set

Prism logic (highlighting, toolbar, copy-to-clipboard) lives entirely in
the Prism bundle, not in `theme.js`.

## Front-end search

Zero-dependency, all client-side, no build step.

### Data source: `layouts/index.json`

Hugo template that emits `/index.json` (enabled by `[outputs] home =
["HTML", "RSS", "JSON"]` in `config.toml`). Structure:

```json
[
  {
    "title": "Post title",
    "url": "/posts/slug/",
    "date": "2026年01月02日",
    "summary": "description or auto-truncated plaintext (≤160 chars)",
    "tags": ["tag-a", "tag-b"],
    "categories": ["category"]
  },
  ...
]
```

### Search module in `theme.js`

- Builds a glass `.vp-search` modal (role=dialog) with a backdrop, a
  `.vp-search-card` containing `.vp-search-input` and `.vp-search-results`,
  and appends it to `<body>` once.
- **Open triggers**: click on `[data-search-open]` (navbar search button),
  or `/` keydown when focus is not in an input or textarea.
- **Close triggers**: `Escape` key, click on `.vp-search-backdrop`.
- **Index loading**: on first open, `fetch('/index.json')` is called once;
  result is cached in `sIndex`. Subsequent opens reuse the cache.
- **Filtering**: each `input` event splits the query into whitespace-delimited
  tokens; a post matches if every token appears (case-insensitive) somewhere
  in `title + summary + tags + categories`. Results are rendered as
  `.vp-search-result` anchor elements with title and `date · category` meta.
  Empty query clears results; no matches shows "找不到符合的文章".
- **Accessibility**: `aria-modal`, `aria-label`, focus trap (Tab/Shift+Tab
  cycle within the modal), focus returns to the search trigger on close.
- **Styled** in `assets/scss/_search.scss`.

## Prism pipeline

Built at render time in `baseof.html`:

```
{{ $urls := slice "<prism core>" "<components>..." "<plugins>..." }}
{{ $parts := slice }}
{{ range $urls }}
  {{ with try (resources.GetRemote .) }}
    {{ with .Value }}{{ $parts = $parts | append . }}{{ end }}
  {{ end }}
{{ end }}
{{ $bundle := $parts | resources.Concat "js/prism.js" | minify | fingerprint }}
```

Plugin load order matters: **core → markup-templating → language grammars →
line-numbers → toolbar → show-language → copy-to-clipboard** (toolbar must
register before the plugins that attach to it). Autoloader is deliberately
not used — all grammars are bundled so there are no runtime CDN fetches.

Bundle sizes as of shipping: JS ≈ 65 KB, CSS ≈ 3.2 KB. SRI attribute is
generated automatically by Hugo `fingerprint`.

## PWA status

Shell-only (no offline support):

- ✅ `manifest.json` in `static/`
- ✅ `<link rel="manifest">` injected in `head.html`
- ✅ `theme-color`, `apple-touch-icon`, `msapplication-TileImage` set
- ✅ HTTPS (via GitHub Pages + Cloudflare / custom domain)
- ✅ `static/service-worker.js` — **cleanup shim only**. The old VuePress
  site used `@vuepress/plugin-pwa` which registered a service worker at
  `/service-worker.js`. This file replaces that SW: on install it calls
  `skipWaiting()`, on activate it calls `self.registration.unregister()`
  and deletes all caches. No page registers it — only browsers that still
  have the old VuePress SW will fetch the update. Safe to leave
  indefinitely; has zero runtime cost for new visitors
- ❌ No active service worker → no offline cache, no background sync

## Deployment

`.github/workflows/hugo.yml`:

1. Installs Hugo extended at the version in `HUGO_VERSION` env (matches the
   local dev version).
2. `hugo --gc --minify --baseURL "${base_url}/"` (base URL injected by
   `actions/configure-pages`).
3. `upload-pages-artifact` + `deploy-pages` — no custom domain handling
   here, the `static/CNAME` file is picked up verbatim by GitHub Pages.

Triggers on push to `master` or `main`. PRs do **not** build (no
`on: pull_request`).

After the first deploy, repo **Settings → Pages**:

- Source: GitHub Actions (not branch)
- Custom domain: `blog.howar31.com`
- Enforce HTTPS: on

## Known limitations / follow-ups

- **Sticky line numbers** in code blocks: Prism's native line-numbers
  plugin positions the gutter absolutely inside `<pre>`; during horizontal
  scroll the gutter scrolls too. Two attempts (JS wrap + sticky, pure-CSS
  flex + sticky) both broke mobile layout and were reverted. A clean
  solution likely requires writing a custom line-numbers implementation.
- **GA4 upgrade** — Analytics currently disabled in `config.toml`. Set
  `googleAnalytics = "G-XXXXXXX"` (GA4 ID) to re-enable.
- **libsass → dartsass** — When Hugo removes libsass, install dart-sass
  (`brew install dart-sass`) and change `head.html`'s `$opts` to
  `"transpiler" "dartsass"`.
- **GitHub Sponsors** — Not enabled on `howar31` account. Global fallback
  `howar31/.github/FUNDING.yml` already covers Ko-fi + PayPal for every
  public repo, so nothing repo-specific is needed here.

## Previous stack, for reference

VuePress v2.0.0-rc.26 (stuck in RC for 3+ years), Vite bundler, Custom
theme extending `@vuepress/theme-default`, 4 Vue components
(`BlogIndex.vue`, `DynamicFooter.vue`, `PostMeta.vue`, `VPPage.vue`),
Stylus → SCSS, PWA + search plugins. All removed in the migration commit.
History is fully preserved in the `master` ref prior to the merge — see
the commit log.
