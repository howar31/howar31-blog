# SPEC.md

Accurate, AI-readable architecture spec for this Hugo site. Intended to orient
future agents quickly without having to re-derive everything from the code.

## Runtime stack

| Layer | Tool | Notes |
|---|---|---|
| Static site generator | **Hugo extended ≥ 0.160.1** | `codeFences = false`, `goldmark.renderer.unsafe = true` |
| CSS | SCSS via Hugo Pipes (libsass) | Fingerprinted + minified |
| JS | Plain ES5-ish (defer) | Hugo `minify` + `fingerprint` |
| Syntax highlighter | **Prism.js 1.29.0** (client-side) | Core + 20 language grammars + 4 plugins, bundled at build time |
| Prism theme | `prism-themes@1.9.0/themes/prism-dracula.min.css` | Force `background-color: #0f172a` so it matches site regardless of page theme |
| Icon font | FontAwesome 5.8.1 (CDN) | Used for post meta, nav toggle, sponsor buttons |
| Code font | Google Fonts Fira Code | For `code` / `pre` |
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
│   └── posts/
│       ├── _index.md                    # Overrides section title → "Recent Posts"
│       └── <slug>/
│           ├── index.md                 # Post (page bundle)
│           └── images/…                 # Post-local images
├── layouts/
│   ├── index.html                       # Home page (2-column grid)
│   ├── _default/
│   │   ├── baseof.html                  # HTML skeleton + Prism JS bundle
│   │   ├── single.html                  # Post page
│   │   ├── list.html                    # /posts/, /categories/<x>/, /tags/<x>/
│   │   ├── terms.html                   # /categories/, /tags/ (taxonomy index)
│   │   └── _markup/
│   │       └── render-image.html        # Goldmark hook: image → figure card
│   ├── partials/
│   │   ├── head.html                    # <head>: theme boot, SCSS pipe, Prism CSS bundle, meta
│   │   ├── header.html                  # .vp-navbar — site name + theme toggle (minimal)
│   │   ├── footer.html                  # About + Sponsor columns + © line
│   │   ├── post-meta.html               # .blog-post-meta under each post h1
│   │   └── back-to-top.html             # SVG circle scroll-progress button
│   └── shortcodes/
│       ├── tip.html                     # {{< tip "…" >}} callout
│       └── warning.html                 # {{< warning "…" >}} callout
├── assets/
│   ├── scss/main.scss                   # All styles
│   └── js/theme.js                      # All runtime JS (no Prism logic here)
├── static/                              # Passed through untouched
│   ├── CNAME                            # blog.howar31.com
│   ├── manifest.json                    # PWA manifest (no SW yet)
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
- `[[menu.main]]`: **not defined**. Navbar is minimal — logo + theme toggle
  only. `header.html` does not iterate `site.Menus.main`, so there are no
  nav items to configure
- `[[menu.footer]]`: About column (howar31.com / GitHub / Source Code)
- `[params.sponsor]`: `kofi = "howar31"`, `paypal = "https://donate.howar31.com"`
  — verified identifiers only. Do **not** add `githubSponsors`; not enabled
  on the user's account

## Home page architecture

Two-column CSS Grid at ≥ 720px; stacks at < 720px.

```
.home
├── .home-hero                           # Blue→violet gradient title + tagline
└── .home-layout (grid: 1fr 16rem)
    ├── .home-main
    │   ├── .home-main-header            # "Recent Posts" + "All Posts →"
    │   ├── .post-list × 10 latest
    │   └── .home-main-cta               # Pill "Browse all N posts →"
    └── .home-sidebar (position: sticky)
        ├── .sidebar-block "Categories"  # pills via .term-list.sidebar-terms
        └── .sidebar-block "Tags"        # same pattern
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
  `localStorage['howar31-theme']` (or `prefers-color-scheme`) and sets
  `data-theme="dark"` before paint. Compiles `main.scss`, fetches Prism CSS
  bundle, adds FA + Google Fonts, OG / PWA meta, RSS link, GA block in
  production.
- **`header.html`** — Minimal: site-name (with blue→violet gradient text
  via `background-clip: text`) + theme toggle button. No nav items.
- **`footer.html`** — Two-column grid (`repeat(auto-fit, minmax(14rem, 1fr))`).
  "About" column iterates `site.Menus.footer`; "Support this blog" renders
  Ko-fi + PayPal buttons when the relevant params are set. Bottom line is
  `© YEAR author. description`.
- **`single.html`** — `<article>` with `<h1>`, `post-meta`, `.Content`.
  First Markdown `# title` line is stripped at content-migration time so
  there is only one `h1`.
- **`list.html`** — Used for `/posts/`, category pages, tag pages. Simple
  paginated post list (20 per page).
- **`terms.html`** — Used for `/categories/` and `/tags/` indexes. Renders
  a pill cloud of terms via `.Data.Terms.Alphabetical`, using `.Name`
  (the raw lowercase-dash slug) as display text.

## Partials

- **`post-meta.html`** — `<div class="blog-post-meta">` with date, optional
  description, categories, tags. FA icons: `far fa-clock`, `fas fa-cat`,
  `fas fa-hashtag`. Date formatted `YYYY年MM月DD日`.
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

Styled in `main.scss` under `.hint-container` — blue-border pill for tip,
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

## SCSS (`assets/scss/main.scss`)

- Heavy reuse of CSS custom properties (`--c-bg`, `--c-text`, `--c-brand`,
  etc.) switched via `html[data-theme="dark"]` selector. Dark mode adds two
  fixed `body::before` / `::after` purple radial gradients with
  `float-glow-1` / `float-glow-2` 20s / 25s infinite keyframe animations.
- `.vp-*` class naming inherited from the previous VuePress default theme
  to allow the original SCSS rules to apply directly.
- Sticky `.vp-navbar` with `backdrop-filter: blur(24px)` — site title uses
  `background: linear-gradient(to right, var(--blue-400), var(--violet-400))`
  + `-webkit-background-clip: text` for the gradient text effect.
- Code blocks (`pre[class*="language-"]`) are forced to the slate-900 dark
  palette regardless of site theme (intentional: code is always dark,
  matches the previous VuePress look).
- `.term-list > li > a` produces pill-style tag chips, with a
  `.sidebar-terms` variant that is smaller.
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
  - **Hover tilt** — JS adds `.is-tilting` class on `mouseenter`, which
    swaps in a short `transform 0.2s ease-out` transition. JS sets
    `transform: perspective(800px) rotateX/Y(±6°) scale(1.02)` from
    cursor position via rAF. `mouseleave` removes the class so the
    default `0.4s cubic-bezier` transition eases back. Gated client-side
    by `(hover: hover) and (pointer: fine)` and
    `prefers-reduced-motion`. SCSS-side `@media
    (prefers-reduced-motion: reduce)` belt-and-braces disables both the
    transition and the `figure-glow-drift` animation
- `.vp-image-modal` lightbox lives at the end of the file. Backdrop is
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
3. **Back-to-top progress ring** — Scroll listener (rAF throttled) updates
   `stroke-dashoffset` on `.back-to-top-bar` based on
   `scrollTop / (scrollHeight - innerHeight)`. Button fades in after 200px.
4. **Post-image lightbox** — On post pages, builds a single
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
5. **Figure card 3D tilt** — On post pages, attaches `mouseenter` /
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

Shell-only:

- ✅ `manifest.json` in `static/`
- ✅ `<link rel="manifest">` injected in `head.html`
- ✅ `theme-color`, `apple-touch-icon`, `msapplication-TileImage` set
- ✅ HTTPS (via GitHub Pages + Cloudflare / custom domain)
- ❌ **No service worker** → no offline cache, no background sync

Adding offline support is out of scope for the migration. When revisited,
drop a static `service-worker.js` in `static/` and register it from
`theme.js`.

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
