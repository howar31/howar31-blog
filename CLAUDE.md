# CLAUDE.md

Project-wide index. For detailed architecture see [SPEC.md](./SPEC.md).
For human usage and setup see [README.md](./README.md).

## What this is

Static personal blog. Hugo (extended) → GitHub Pages → custom domain
`blog.howar31.com`. Migrated from VuePress v2 RC in April 2026.
No Node.js runtime, no npm, no bundler.

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
- **Taxonomy naming** (both categories and tags): `lowercase-dash`. The
  frontmatter value *equals* the URL slug *equals* the displayed string —
  no humanize transform anywhere. Keep new tags in this form:
  `- dev-notes` ✓, not `- Dev Notes` ✗.
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
  directly to `master` without explicit confirmation.

## Where things live

| Path | Purpose |
|---|---|
| `content/posts/<slug>/index.md` | Blog post (+ per-post image folder) |
| `layouts/` | Hugo templates (see SPEC.md for partials breakdown) |
| `layouts/_default/_markup/render-image.html` | Goldmark hook: wraps captioned images in `<figure>` cards |
| `assets/scss/main.scss` | All site styles (SCSS via Hugo Pipes → libsass) |
| `assets/js/theme.js` | Dark-mode toggle, back-to-top, Prism `line-numbers`, image lightbox, figure tilt |
| `static/` | Static files copied verbatim to `public/` (manifest, CNAME, logo, SW cleanup shim) |
| `config.toml` | Site config: `baseURL`, `[params]`, menus, taxonomies, markup |
| `.github/workflows/hugo.yml` | GitHub Pages deployment workflow |

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
