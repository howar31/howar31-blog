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
| Icons | **Font Awesome Free 5.15.4** SVG sources, inlined at render time | 17 SVGs in `assets/icons/{solid,regular,brands}/`; emitted by `layouts/partials/icon.html`. No CDN, no webfont. |
| Body font | OS system fonts | `--font-sans` resolves to PingFang TC / Microsoft JhengHei UI / system Noto; **no Google Fonts request** |
| Code font | **JetBrains Mono** Latin 400/700 (self-hosted) | `static/fonts/jetbrains-mono/jetbrains-mono-latin-{400,700}-normal.woff2`; preloaded; `unicode-range` skips CJK |
| Display font | **Atkinson Hyperlegible Next** (self-hosted) | `static/fonts/AtkinsonHyperlegibleNext.woff2`; used for home hero title via `--font-display` |
| Avatar pipeline | Hugo `images.Resize` from `assets/images/avatar.png` | One 256×256 master; sidebar uses 64/128 WebP, favicons use 32/144/180 PNG |
| Hosting | GitHub Pages via `upload-pages-artifact` + `deploy-pages` | Custom domain `blog.howar31.com` (CNAME in `static/`) |

No Node.js is executed at build or runtime. All remote third-party code
(Prism, prism-themes) is fetched once at build time via
`resources.GetRemote`, concatenated, minified, fingerprinted, served from
the site's own origin with SRI. The blog chrome makes **zero** third-party
HTTP requests at page-load time (Font Awesome CDN, Google Fonts and any
external font CSS were removed during the performance pass).

## Directory layout

```
howar31-blog/
├── config.toml                          # Site config (see "Config" below)
├── archetypes/default.md                # Template for `hugo new`
├── content/
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
│   │   ├── single.html                  # Post page — prose + optional sticky ToC (2-column)
│   │   ├── list.html                    # /posts/ + taxonomy term pages (2-column, with sidebar)
│   │   └── _markup/
│   │       └── render-image.html        # Goldmark hook: image → figure card
│   ├── partials/
│   │   ├── head.html                    # <head>: theme boot, SCSS pipe, Prism CSS bundle, font preloads, meta
│   │   ├── header.html                  # Minimal navbar: gradient site name + search + theme toggle
│   │   ├── footer.html                  # About + Sponsor columns + © line
│   │   ├── post-card.html               # Reusable post card (title, meta, summary, tags, thumbnail)
│   │   ├── post-meta.html               # .blog-post-meta under each post h1
│   │   ├── sidebar.html                 # Sidebar: About / Categories / Tags / Support cards
│   │   ├── icon.html                    # Inline FA SVG renderer: {{ partial "icon" "fas fa-search" }}
│   │   └── back-to-top.html             # SVG circle scroll-progress button
│   └── shortcodes/
│       ├── tip.html                     # {{< tip "…" >}} callout
│       └── warning.html                 # {{< warning "…" >}} callout
├── assets/
│   ├── scss/
│   │   ├── main.scss                    # SCSS entrypoint: 4 variables + @import of 12 partials
│   │   ├── _tokens.scss                 # Design-system tokens: color scales, glass/shadow/radius/type; dark canonical
│   │   ├── _base.scss                   # CSS reset, body, typography, links
│   │   ├── _layout.scss                 # Containers (vp-content/-wide/-post) + responsive --wide-max/--sidebar-w steps
│   │   ├── _navbar.scss                 # .vp-navbar, .vp-site-name, .vp-icon-btn, .theme-toggle
│   │   ├── _footer.scss                 # .vp-footer
│   │   ├── _hero.scss                   # .home-hero, .home-layout (2-column grid)
│   │   ├── _post-list.scss              # .post-list, .post-card, .vp-pill
│   │   ├── _sidebar.scss                # .home-sidebar, .side-card
│   │   ├── _post.scss                   # .post-content, .post-layout + ToC, .post-figure, .vp-image-modal, shortcodes
│   │   ├── _search.scss                 # .vp-search modal
│   │   ├── _back-to-top.scss            # .back-to-top
│   │   └── _pagination.scss             # Hugo internal pagination
│   ├── icons/{solid,regular,brands}/    # Font Awesome Free 5.15.4 SVG sources (inlined via layouts/partials/icon.html — no FA CDN)
│   ├── images/avatar.png                # 256×256 master — Hugo generates 32/64/128/144/180 variants on demand
│   └── js/theme.js                      # All runtime JS (no Prism logic here)
├── static/                              # Passed through untouched
│   ├── CNAME                            # blog.howar31.com
│   ├── manifest.json                    # PWA manifest
│   ├── service-worker.js                # Cleanup shim: unregisters old VuePress SW + clears caches
│   ├── fonts/
│   │   ├── AtkinsonHyperlegibleNext.woff2          # Self-hosted display font
│   │   └── jetbrains-mono/
│   │       ├── jetbrains-mono-latin-400-normal.woff2  # Code body weight
│   │       └── jetbrains-mono-latin-700-normal.woff2  # Prism keyword weight
│   └── logo/…                           # Static site icons (og-image.jpg, icon.png)
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
- `disableKinds = ["taxonomy"]` — the taxonomy term-index pages
  (`/categories/`, `/tags/`) are **not** generated. Individual term pages
  (`/tags/<tag>/`, `/categories/<cat>/`) are still generated and reachable
  via post-card tag/category links and the sidebar Categories / Tags cards
- `[markup.highlight] codeFences = false` → Goldmark emits clean
  `<pre><code class="language-xxx">`, Prism takes over client-side
- `[markup.goldmark.renderer] unsafe = true` → allow raw HTML in Markdown
- `[markup.goldmark.parser] wrapStandAloneImageWithinParagraph = false`
  → required for the render-image hook (see "Render hooks" below) so a
  standalone `![]()` becomes `<figure>` not `<p><figure>…</figure></p>`
- `[taxonomies] category = "categories"`, `tag = "tags"`
- `[permalinks] posts = "/posts/:contentbasename/"` → URL uses parent folder
  name (slug) not title-derived
- `[[menu.main]]` — **not defined**. The top navbar is intentionally minimal
  (site name + search + theme toggle); `header.html` renders no nav links
- `[[menu.footer]]`: About column (howar31.com / GitHub / Source Code)
- `[params.sponsor]`: `kofi = "howar31"`, `paypal = "https://donate.howar31.com"`
  — verified identifiers only. Do **not** add `githubSponsors`; not enabled
  on the user's account
- `[params]` intentionally **does not define** `fontAwesomeCDN` /
  `fontAwesomeIntegrity` / `googleFonts` / `avatar`. Earlier versions kept
  these; they were removed once icons went inline-SVG, fonts were
  self-hosted, and the avatar moved into the Hugo asset pipeline. Do not
  re-add without first changing the code that would consume them
- `[outputs] home = ["HTML", "RSS", "JSON"]` — the JSON output type feeds
  `layouts/index.json` → `/index.json` → front-end search

## Page layout — home, /posts/, taxonomy term pages

Two-column CSS Grid at ≥ 720px; stacks to one column at < 720px. The home
page (`index.html`), the `/posts/` section, and every taxonomy term page
(`/tags/<tag>/`, `/categories/<cat>/`, served by `list.html`) all use this
same layout — main content on the left, the `sidebar.html` partial on the
right. With the navbar carrying no nav links, the sidebar (Categories card +
tag cloud) is the primary cross-navigation, so it appears on all of these
pages, not just the home page.

Home page:

```
.home
├── .home-hero                           # Display-font gradient title + tagline
└── .home-layout (grid: 1fr var(--sidebar-w))
    ├── .home-main
    │   ├── .home-main-header            # "Recent Posts" + "All Posts →"
    │   ├── .post-list × 5 latest        # Each post rendered by post-card.html
    │   └── .home-main-cta               # "Browse all N posts →" pill button
    └── .home-sidebar (partial: sidebar.html, position: sticky)
        ├── .side-card "About"           # Avatar, name, bio, GitHub + howar31.com links
        ├── .side-card "Categories"      # .vp-pill links to /categories/<cat>/
        ├── .side-card "Tags"            # Count-sized .vp-pill tag cloud
        └── .side-card "Support"         # Ko-fi + PayPal buttons from [params.sponsor]
```

`list.html` reuses the same `.home-layout` grid and the `sidebar.html`
partial; its main column is the page `<h1>` plus the paginated post-card list.

### Responsive width

`baseof.html` picks the container class by page kind: `home`, `section` and
`term` pages get `.vp-content-wide`; single posts (`.Type == "posts"`) get
`.vp-content-post` (fixed `1080px`, holds the prose + ToC 2-column — see
"Post page"); any other page gets the narrow `.vp-content` (`740px`).

`.vp-content-wide` and the sidebar column step up on large / 4K displays via
CSS custom properties (`--wide-max`, `--sidebar-w`) defined with media-query
overrides in `_layout.scss`:

| Viewport | `--wide-max` | `--sidebar-w` |
|---|---|---|
| base | 1080px | 16rem |
| ≥ 1440px | 1320px | 18rem |
| ≥ 1920px | 1560px | 20rem |
| ≥ 2560px | 1760px | 22rem |

The navbar (`.vp-navbar-inner`) and footer (`.vp-footer-inner`,
`.vp-footer-bottom`) use the same `--wide-max` max-width and the same
`0 1.5rem` inner padding as `.vp-content-wide`, so the chrome and the page
content stay edge-aligned at every width.

## Post page (`single.html`)

A single post renders a 2-column layout: the prose column keeps the 740px
reading width (`.post-main`), with a sticky **Table of Contents** in the
right column (`.post-toc`). The ToC is Hugo's `.TableOfContents` (H2–H4, per
`[markup.tableOfContents]`) — the article's own outline, not the browse
sidebar.

- `single.html` shows the ToC only when the post has **≥ 2** ToC entries
  (`findRE "<li"` over `.TableOfContents`); shorter posts render the prose
  single-column.
- The container is `.vp-content-post` (fixed `1080px`, does not scale to 4K).
- `.post-layout.has-toc` is the 2-column grid; the `.post-toc` column must
  stretch (no `align-items: start`) so the sticky `.post-toc-inner` has room
  to travel.
- `.post-content h2/h3/h4` carry `scroll-margin-top` so anchor jumps clear
  the sticky navbar.
- Below 960px (`$breakpoint-narrow`) it collapses to one column and the ToC
  drops above the article, no longer sticky.
- Post section headings must be `##`–`####`. A body `#` (H1) adds a stray
  second `<h1>` and is excluded from the ToC (which starts at H2).

## Taxonomy convention (important)

**Frontmatter value = URL slug = displayed string.** All lowercase with
dashes. No humanize transform anywhere in templates.

- Frontmatter: `categories: [vuepress]`, `tags: [dev-notes, css]`
- URL: `/categories/vuepress/`, `/tags/dev-notes/`
- Displayed in the sidebar, on term pages, and in post-meta: `vuepress`,
  `dev-notes`, `css`

Three categories in use: `hugo` (1 post, the current era), `vuepress`
(11 posts, 2019-2026 VuePress v1/v2 era) and `wordpress` (42 archive
posts from the pre-VuePress WordPress era).

When adding a new post, keep all taxonomy values lowercase-dash. Don't mix
Title Case (`- Vuepress`) or acronyms (`- CSS`); the displayed text would
drift from other places rendered differently.

## UI language

All interface chrome — navbar, labels, buttons, ARIA text, reading-time, the
post ToC, the search modal — is **English only**. There is no i18n and no
language switcher: the design-system handoff mentioned a zh-TW/en toggle, but
it was intentionally not built. Article *content* may be Chinese; UI strings
must not be. Dates render as ISO `2006-01-02` (post meta, post cards,
`index.json`); the `<time datetime>` attribute carries the same value.

## Layout responsibilities

- **`baseof.html`** — HTML skeleton; delegates `head`, `header`, `footer`,
  `back-to-top` to partials; injects compiled `theme.js` and the Prism
  bundle (built at template render time via `resources.GetRemote` → `Concat`
  → `minify` → `fingerprint`). Selects the container class by page kind:
  `home` / `section` / `term` → `vp-content-wide`; single posts
  (`.Type == "posts"`) → `vp-content-post`; everything else →
  `vp-content theme-default-content`.
- **`head.html`** — Inline FOUC-prevention script reads
  `localStorage['howar31-theme']` and defaults to **dark** when no stored
  preference exists (`var theme = stored || 'dark'`). Compiles `main.scss`,
  builds the Prism CSS bundle, preloads the self-hosted display font and
  the JetBrains Mono Latin-400 woff2, derives the favicon / apple-touch /
  msapplication tile icons from `assets/images/avatar.png` via
  `images.Resize`, emits OG / PWA meta, the RSS `<link>` and the GA block
  in production. Does **not** request any third-party CSS or font.
- **`header.html`** — Minimal navbar: gradient site name (`.vp-site-name`) +
  an action cluster of a search-trigger icon button (`[data-search-open]`)
  and the theme toggle. No nav links, no mobile menu. The GitHub link lives
  in the sidebar About card and the footer, not the navbar.
- **`footer.html`** — Two-column grid (`repeat(auto-fit, minmax(14rem, 1fr))`).
  "About" column iterates `site.Menus.footer`; "Support this blog" renders
  Ko-fi + PayPal buttons when the relevant params are set. Bottom line is
  `© YEAR author. description`.
- **`single.html`** — `<article>` → `.post-layout` holding `.post-main`
  (`<h1>`, `post-meta`, `.post-content`) and, when the post has ≥ 2 ToC
  entries, a `.post-toc` aside with `.TableOfContents`. The template `<h1>`
  is the page's only `<h1>`. See "Post page" for the 2-column / ToC details.
- **`list.html`** — Used for `/posts/` and every taxonomy term page
  (`/categories/<x>/`, `/tags/<x>/`). Renders the 2-column layout (main +
  `sidebar.html`); the main column is the page `<h1>` plus a paginated
  post-card list (10 per page, `[pagination] pagerSize`), each post
  rendered by the `post-card.html`
  partial.
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
- **`sidebar.html`** — `<aside class="home-sidebar">` with up to four
  `.side-card` glass cards: About (avatar, name, bio, GitHub + howar31.com
  links), Categories (`.vp-pill` links to `/categories/<cat>/` via
  `site.Taxonomies.categories`), Tags (count-sized `.vp-pill` cloud via
  `site.Taxonomies.tags`), Support (Ko-fi + PayPal buttons from
  `[params.sponsor]`). Rendered by both `index.html` and `list.html`. Styled
  in `_sidebar.scss`.
- **`back-to-top.html`** — Fixed button bottom-right with two concentric
  `<circle>`s (track + progress bar). Circle geometry (`cx/cy/r`) is set as
  **HTML attributes** not CSS, because iOS Safari ≤ 16 does not support the
  CSS SVG Geometry module. `theme.js` computes scroll ratio and updates
  `stroke-dashoffset`.
- **`icon.html`** — Inline-SVG icon renderer. Call signature:
  `{{ partial "icon" "fas fa-search" }}` or with extra classes:
  `{{ partial "icon" "fas fa-arrow-up back-to-top-icon" }}`. Splits the
  argument into FA style (`fas` / `far` / `fab`) → folder
  (`solid` / `regular` / `brands`) and icon slug, reads
  `assets/icons/<folder>/<slug>.svg`, strips the licence comment, injects
  `class="icon icon-<slug>[ <extra>]"` plus `aria-hidden="true"` and
  `focusable="false"`. Adding a new icon means dropping the matching SVG
  into the right folder; nothing else needs editing.

## Shortcodes

- **`tip`** → `<div class="hint-container tip">` with inline `fa-lightbulb` SVG (via `icon.html` partial)
- **`warning`** → `<div class="hint-container warning">` with inline `fa-exclamation-triangle` SVG

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

The responsive width steps (`--wide-max`, `--sidebar-w` CSS custom
properties + their media-query overrides) live in `_layout.scss` — see
"Responsive width" above.

### `_tokens.scss` — design-system foundation

- Self-hosts the **Atkinson Hyperlegible Next** display font via `@font-face`.
- Self-hosts **JetBrains Mono** Latin 400 and 700 via two `@font-face` rules
  pointing at `static/fonts/jetbrains-mono/…`. Both use `font-display: swap`
  and a `unicode-range` covering Basic Latin plus typographic punctuation;
  CJK in code blocks falls through to the system mono fallback chain
  (`PingFang TC` / `Microsoft JhengHei` / `Sarasa Mono TC` / `Consolas`).
- `--font-sans` is a pure system-font stack (no Google Fonts); zh-TW
  glyphs resolve to `PingFang TC` on Apple, `Microsoft JhengHei UI` on
  Windows, and the system Noto on Android. This is intentional — the
  previous Google Fonts request for `Noto Sans TC` was the single largest
  render-blocking resource and was removed for that reason.
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
- `.vp-pill` (defined in `_post-list.scss`) is the shared pill/chip — used by
  post-card tag pills, the sidebar tag cloud, the sidebar Categories card,
  and post-meta tag pills.
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
  - **Overflow clamp** — `body { overflow-x: clip }` in **both** themes
    (not `hidden`) prevents the `::before` `-30%` bleed from creating a
    horizontal scroll on mobile while preserving the sticky navbar:
    `clip` does not establish a scroll container, `hidden` does (which
    would break `position: sticky`)
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

### SCSS pitfalls (document so future edits don't regress)

**1. Nested `&-<suffix>` after a descendant combinator (libsass)**

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

**2. Grid tracks — `minmax(0, 1fr)`, never bare `1fr`**

A bare `1fr` track is `minmax(auto, 1fr)`. The `auto` floor is the
column's content min-content, so a non-wrapping child (a long `<pre>`
code line) or a wide descendant inflates the track past the viewport.
`body { overflow-x: clip }` then slices the content off with no
scrollbar. iOS Safari exposes this far more readily than Chromium — it
does not shrink the `auto` floor below content size. Always write
`minmax(0, 1fr)` for flexible tracks: it behaves like `1fr` but lets the
track shrink to its container. Applies to `.post-layout.has-toc`,
`.home-layout`, and `.post-card` (all three).

**3. `auto` inline margins suppress grid-item stretch**

`margin: 0 auto` on a grid item *suppresses* `justify-self: stretch` —
the item is then sized to its max-content (clamped only by `max-width`),
overflowing narrow viewports. `.post-layout.has-toc .post-main` keeps
`margin: 0 auto` (to re-center on tablets) **and** sets `width: 100%`,
which pins it to the track while `max-width` still caps it. Separately,
a grid item whose automatic minimum must collapse needs explicit
`min-width: 0` (e.g. `.home-main`) — without it the item's min-content
inflates the parent column.

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
3. **Search modal** — Builds a `.vp-search` dialog once and appends it to
   `<body>`. Opens on the navbar search button (`[data-search-open]`) or
   the `/` key (when no input/textarea is focused); closes on Esc,
   backdrop click, or the close button. Lazy-fetches `/index.json` once on
   first open; all filtering is client-side token match. Focus trap keeps
   Tab/Shift+Tab inside the modal. See "Front-end search" section for full
   details.
4. **Back-to-top progress ring** — Scroll listener (rAF throttled) updates
   `stroke-dashoffset` on `.back-to-top-bar` based on
   `scrollTop / (scrollHeight - innerHeight)`. Button fades in after 200px.
5. **Post-image lightbox** — On post pages, builds a single
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
6. **Figure card 3D tilt** — On post pages, attaches `mouseenter` /
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
  `.vp-search-card` containing a close button, `.vp-search-input` and
  `.vp-search-results`, and appends it to `<body>` once.
- **Open triggers**: click on `[data-search-open]` (navbar search button),
  or `/` keydown when focus is not in an input or textarea.
- **Close triggers**: `Escape` key, click on `.vp-search-backdrop`, or the
  `.vp-search-close` button.
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

## Licensing

`LICENSE` at the repo root is the canonical **CC BY 4.0** text (downloaded
from `creativecommons.org/licenses/by/4.0/legalcode.txt`). The licence
covers the blog content — prose, images authored by Howar31, and the small
amount of theme code bundled in this repo. Reuse and translation are
allowed with attribution; downstream content that reuses a post must credit
Howar31 and link back.

This is intentionally a **content** licence, not a permissive code licence
(MIT/Apache), because the value here is the writing. Future agents adding
substantial new code (e.g. spinning the theme off as a reusable package)
should flag the relicensing question before doing so.

## Key decisions

### Performance: zero third-party requests on the blog chrome

Identified during a PageSpeed audit. Three render-blocking / heavy
third-party resources used to load on every page; all are gone now.

- **Font Awesome CDN** (`use.fontawesome.com/.../all.css`, ~55 KB raw,
  served without gzip from the third party). Inventory found only 17
  unique icons in the layouts. Replaced with FA Free 5.15.4 SVG sources
  inlined at render time via `layouts/partials/icon.html`. SVGs live in
  `assets/icons/{solid,regular,brands}/`. CSS hook: `.icon` (`width:1em;
  height:1em; fill:currentColor; vertical-align:-0.125em`) in `_base.scss`.
- **Google Fonts `Noto Sans TC` + `JetBrains Mono`** (a render-blocking
  `<link rel="stylesheet">` plus CJK woff2 downloads). `Noto Sans TC` was
  dropped — `--font-sans` is now a pure system stack (PingFang TC /
  Microsoft JhengHei UI / system Noto). `JetBrains Mono` Latin 400 + 700
  woff2 were pulled from `@fontsource/jetbrains-mono@5.0.20` and committed
  under `static/fonts/jetbrains-mono/`. Only the 400 weight is preloaded;
  700 streams in on demand for Prism keyword highlights.
- **Oversized avatar** — the master is a single 256×256 PNG in
  `assets/images/avatar.png`. `head.html` derives 32-px favicon, 144-px
  msapplication tile and 180-px apple-touch via `images.Resize`;
  `sidebar.html` emits a 64-px + 128-px WebP `srcset` with `loading="lazy"
  decoding="async"`. The sidebar avatar transfer shrank from 96 KB to
  ~1.3 KB.

Net result: the blog's HTML, CSS and JS now load only from
`blog.howar31.com`. The only remaining third-party network calls are
analytics (if a GA4 ID is set later) and the `posts/made-with-love` demo
post, which intentionally embeds a Font Awesome `<link>` in its Markdown
body to illustrate an icon snippet — that is content, not chrome.

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
