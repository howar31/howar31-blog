# CLAUDE.md

Project-wide index. For detailed architecture see [SPEC.md](./SPEC.md).
For human usage and setup see [README.md](./README.md).

## What this is

Static personal blog. Hugo (extended) → GitHub Pages → custom domain
`blog.howar31.com`. Migrated from VuePress v2 RC in April 2026.
No Node.js runtime, no npm, no bundler.

@.claude/writing-voice.md

## Commands

```bash
# Dev server with live reload — primary development loop
hugo server --buildFuture
# → http://localhost:1313/

# Production build (matches GitHub Actions output)
hugo --minify
# → ./public/

# Create a new post (page bundle so images sit next to the markdown)
hugo new posts/<slug>/index.md
```

## Conventions

- **Page bundles**: every post is `content/posts/<slug>/index.md` with images
  in the same folder (`./images/...` works out of the box).
- **Image captions**: `![descriptive alt](./images/foo.png)` becomes a
  `<figure>` card with the alt text as `<figcaption>`. If the alt looks
  like a filename (`*.png` / `*.jpg` / etc.) or is empty, the render hook
  emits a plain `<img>` instead — see SPEC.md → render-image hook.
- **Diagrams — no Mermaid**: GitHub Pages does **not** render ``` ```mermaid ```
  fences. Hand-author SVG into the post's `images/` folder and reference
  with a descriptive alt (`![架構圖](./images/foo.svg)`) so the render-image
  hook wraps it. Recipe: light background panel (e.g. `#f8fafc`) + dark
  text so it reads on the dark theme; explicit `width`/`height` on the
  `<svg>` root at **~2× the `viewBox`** so the lightbox `<img>` has enough
  natural size to enlarge; per-post scoped `<style>` raising
  `.vp-image-modal-card { max-width: 96vw }` and
  `.vp-image-modal-img { max-height: 92vh }`; SVG font stack
  `-apple-system,'PingFang TC','Microsoft JhengHei',sans-serif`. **Before
  every commit**, verify no markdown post still contains a `mermaid`
  fence — convert each to SVG first. Confirmed working in post
  `self-hosted-vaultwarden-on-gcp`. Diagrams = hand-authored SVG (this
  recipe); real UI = screenshots (PNG already has large natural size, so
  skip the 2× `width`/`height` step).
- **Headings**: use `## `–`#### ` for in-post section headings — never
  `# ` (H1). The template already renders the post title as the page's
  single `<h1>`. A post with ≥ 2 section headings automatically gets a
  sticky Table of Contents in the right column (see SPEC.md → post page).
- **UI language**: interface chrome (nav, labels, buttons, ARIA text,
  reading-time, ToC, search) is **English only**. There is no i18n and no
  language switcher — the design system mentioned a zh-TW/en toggle, but it
  was intentionally not built. Article *content* may be Chinese; UI strings
  must not. Dates render as ISO `2006-01-02`.
- **Category = platform era** (`categories` frontmatter): a fixed, closed
  set of exactly three values — `wordpress`, `vuepress`, `hugo` — denoting
  the blog architecture the post was published under, NOT a topical label.
  Every post carries exactly one. The current architecture is Hugo, so
  every new post uses `- hugo`; historical posts keep `wordpress` /
  `vuepress` (do not mass-retag them). Topic belongs in `tags`, never in
  `categories` (e.g. `ai-agent` is a tag). Reject any other category value.
- **Taxonomy naming** (both categories and tags): `lowercase-dash`. The
  frontmatter value *equals* the URL slug *equals* the displayed string —
  no humanize transform anywhere. Keep new tags in this form:
  `- dev-notes` ✓, not `- Dev Notes` ✗.
- **Icons**: use the inline-SVG partial, never raw `<i class="fa...">`. The
  Font Awesome CDN was removed; only icons present in `assets/icons/` work.
  To add a new icon, download the FA Free 5.15.4 SVG into the matching
  `solid` / `regular` / `brands` subfolder.

  ```html
  {{ partial "icon" "fas fa-search" }}
  {{ partial "icon" "fas fa-arrow-up back-to-top-icon" }}  <!-- extra classes -->
  ```

- **Callouts** use Hugo shortcodes, not VuePress `:::` containers:

  ```markdown
  {{< tip "Optional title" >}}
  Body text with **Markdown**.
  {{< /tip >}}

  {{< warning >}}
  Body text.
  {{< /warning >}}
  ```

- **Class naming** (`.vp-navbar`, `.vp-navbar-inner`, `.vp-site-name`,
  `.vp-footer`, `.vp-page`, etc.) is inherited from the previous VuePress
  theme so the migrated SCSS applies directly — it is *not* a current
  dependency on VuePress. Avoid nested SCSS `&-suffix` after descendant
  combinators; libsass compiles it into broken selectors (see SPEC.md →
  SCSS pitfalls).
- **Commit style**: conventional commits (`feat:` / `fix:` / `docs:` /
  `chore:` / `refactor:`). One commit per feature. Follow the `/commit`
  skill.
- **Branch workflow**: feature branches → PR into `master`. Never push
  directly to `master` without explicit confirmation. **Exception —
  content-only changes** (only files under `content/posts/`: writing or
  editing posts): commit straight to `master`, no PR. Opening a PR triggers
  Gemini review, which is needless overhead for prose; reserve PRs for
  code / theme / config changes.

## Where things live

| Path | Purpose |
|---|---|
| `content/posts/<slug>/index.md` | Blog post (+ per-post image folder) |
| `layouts/` | Hugo templates (see SPEC.md for partials breakdown) |
| `layouts/_default/_markup/render-image.html` | Goldmark hook: wraps captioned images in `<figure>` cards |
| `layouts/partials/post-card.html` | Reusable post card partial (title, meta, summary, tags, auto thumbnail) |
| `layouts/partials/sidebar.html` | Sidebar — About / Categories / Tags / Support cards (home + list/taxonomy pages) |
| `layouts/index.json` | Hugo JSON output template → `/index.json` — feeds front-end search |
| `assets/scss/main.scss` | SCSS entrypoint: 4 variables + `@import` of 12 partials (`_tokens` … `_pagination`) |
| `assets/scss/_*.scss` | SCSS partials — design tokens, base, layout, navbar, footer, hero, post-list, sidebar, post, search, back-to-top, pagination |
| `assets/js/theme.js` | Dark-mode toggle, search modal, back-to-top, Prism `line-numbers`, image lightbox, figure tilt |
| `assets/icons/{solid,regular,brands}/` | Font Awesome Free 5.15.4 SVG sources; inlined via `layouts/partials/icon.html` |
| `assets/images/avatar.png` | Avatar master (256×256); Hugo resizes to 32/64/128/144/180 on demand |
| `layouts/partials/icon.html` | Inline-SVG icon partial: `{{ partial "icon" "fas fa-search" }}` |
| `static/fonts/` | Self-hosted fonts: `AtkinsonHyperlegibleNext.woff2`, `jetbrains-mono/jetbrains-mono-latin-{400,700}-normal.woff2` |
| `static/` | Static files copied verbatim to `public/` (manifest, CNAME, logo, SW cleanup shim) |
| `config.toml` | Site config: `baseURL`, `[params]`, menus, taxonomies, markup |
| `.github/workflows/hugo.yml` | GitHub Pages deployment workflow |
| `LICENSE` | CC BY 4.0 — covers blog *content*. Code is incidental and falls under the same notice. |

## Known open items

- `static/service-worker.js` is a cleanup shim that unregisters the old
  VuePress PWA service worker and clears its caches. It is not loaded by
  any page — only pre-existing SW clients fetch it. Safe to leave forever.
- Code-block line numbers are not sticky during horizontal scroll.
- Google Analytics disabled in `config.toml` (Universal Analytics
  `UA-8779590-7` retired 2023-07). Re-enable by setting `googleAnalytics`
  to a GA4 `G-XXXXXXX` ID.
- `css.Sass: libsass` is deprecated in Hugo 0.153+. Works today; future upgrade
  to dartsass is a one-line config change (plus installing `dart-sass`).
