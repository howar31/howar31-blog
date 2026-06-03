# Howar31 Blog

[![License](https://img.shields.io/github/license/howar31/howar31-blog?style=flat-square)](./LICENSE)
[![Made with Hugo](https://img.shields.io/badge/made%20with-Hugo-FF4088?style=flat-square&logo=hugo&logoColor=white)](https://gohugo.io/)
[![Deploy](https://img.shields.io/github/actions/workflow/status/howar31/howar31-blog/hugo.yml?style=flat-square&label=deploy)](https://github.com/howar31/howar31-blog/actions/workflows/hugo.yml)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fblog.howar31.com&style=flat-square&label=blog.howar31.com)](https://blog.howar31.com/)
[![Last commit](https://img.shields.io/github/last-commit/howar31/howar31-blog?style=flat-square)](https://github.com/howar31/howar31-blog/commits/master)
[![Stars](https://img.shields.io/github/stars/howar31/howar31-blog?style=flat-square)](https://github.com/howar31/howar31-blog/stargazers)
[![Sponsor on Ko-fi](https://img.shields.io/badge/sponsor-Ko--fi-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/howar31)

Personal blog built with [Hugo](https://gohugo.io/), deployed to GitHub Pages
under the custom domain `blog.howar31.com`.

Previously powered by VuePress v1 → v2; migrated to Hugo in April 2026 for
faster builds, a stable ecosystem, and zero Node.js runtime dependency.

For deeper architecture details see [SPEC.md](./SPEC.md).
For a concise index of conventions and commands see [CLAUDE.md](./CLAUDE.md).

## Stack

- **[Hugo](https://gohugo.io/) extended v0.160.1+** — static site generator
- **[Prism.js](https://prismjs.com/) 1.29.0** — client-side syntax highlighting
  (Dracula theme), line numbers, copy button, language badge; the whole
  Prism bundle is fetched once at build time via `resources.GetRemote` and
  served from the site's own origin
- **Font Awesome Free 5.15.4 (SVGs)** — 17 icons inlined at build time via
  `layouts/partials/icon.html`; no CDN request, no webfont
- **Self-hosted fonts** — Atkinson Hyperlegible Next (display) and
  JetBrains Mono Latin 400/700 (code blocks); zh-TW body text uses the OS
  system font (PingFang TC / Microsoft JhengHei / system Noto)
- **GitHub Actions** — deploys to GitHub Pages on push to `master`

No Node.js, no npm, no bundler.

## Prerequisites

- Hugo **extended** v0.160 or newer (`brew install hugo`)
- Git

## Local development

```bash
git clone git@github.com:howar31/howar31-blog.git
cd howar31-blog

# Dev server with live reload
hugo server --buildFuture
# → http://localhost:1313/

# One-off production build (matches the GitHub Actions output)
hugo --minify
# → ./public/
```

## Project layout

```
howar31-blog/
├── config.toml                   # Hugo site config (baseURL, menus, params, markup)
├── content/
│   └── posts/
│       ├── _index.md             # Overrides /posts/ heading → "Recent Posts"
│       └── <slug>/index.md       # 54 posts; images sit in the same folder
├── layouts/
│   ├── index.html                # Home: 2-column (recent posts + sidebar)
│   ├── index.json                # JSON search index → /index.json
│   ├── _default/
│   │   ├── baseof.html · single.html · list.html
│   │   └── _markup/render-image.html  # Wraps captioned images in <figure> cards
│   ├── partials/                 # head · header · footer · post-meta · post-card · sidebar · back-to-top
│   └── shortcodes/               # tip · warning  (replace VuePress ::: containers)
├── assets/
│   ├── scss/                     # main.scss entrypoint + 12 partials (_tokens … _pagination)
│   ├── icons/                    # Font Awesome Free 5.15.4 SVG sources (solid / regular / brands)
│   ├── images/avatar.png         # Source for sidebar avatar + favicons (Hugo resizes on demand)
│   └── js/theme.js               # Dark-mode toggle, search, back-to-top, Prism line-numbers, lightbox, figure tilt
├── archetypes/default.md         # Template used by `hugo new`
├── static/                       # Copied verbatim: CNAME, manifest.json, logo/, fonts/ (Atkinson + JetBrains Mono), SW cleanup shim
├── .github/workflows/hugo.yml    # Pages deployment
├── README.md / CLAUDE.md / SPEC.md
```

## Writing a post

```bash
hugo new posts/my-new-post/index.md
```

Each post is a [page bundle](https://gohugo.io/content-management/page-bundles/)
so images live next to the Markdown and can be referenced relatively.

Frontmatter:

```yaml
---
title: "My new post"
date: 2026-04-22
description: "Short summary shown in list pages and <meta name=description>."
categories:
  - hugo              # platform era — hugo | vuepress | wordpress; new posts = hugo
tags:
  - dev-notes         # topic tags, lowercase-dash; value = URL slug = displayed string
  - migration
---
```

**Categories vs tags**: `categories` is a fixed set — `hugo` / `vuepress` /
`wordpress` — marking the blog platform era a post was published under, not
its topic. New posts use `hugo`; the post's subject goes in `tags`.

**Taxonomy naming**: always lowercase-dash (`vuepress`, `dev-notes`, `ci-cd`).
The frontmatter value equals the URL slug and equals the text shown in the
sidebar, on term pages, and in post meta — no transform anywhere in the
templates. Keep it consistent when adding new terms.

### Headings

Use `##`–`####` for in-post section headings — never `#` (H1). The page
title is already rendered as the single `<h1>`; a `#` in the body adds a
second one. A post with **two or more** section headings automatically
gets a sticky Table of Contents in the right column on wide screens.

### Images

Drop images into the post folder and reference them relatively
(`![alt](./images/foo.png)`). The alt text becomes the figure caption
automatically — no need to write the caption a second time on the line
below. Filename-style alts (`![foo.png](...)`) are treated as pure
imagery and emit a plain `<img>` without a caption strip.

Readers can click any in-body image to view it enlarged in a frosted
glass modal that mirrors the in-page card. Close with the X button, the
dark backdrop, or `Esc`. No shortcode needed.

### Tip / warning callouts

Shortcodes mirror the old VuePress `:::` containers:

```markdown
{{< tip "Optional title" >}}
Body text with **Markdown** works.
{{< /tip >}}

{{< warning >}}
Body text.
{{< /warning >}}
```

## Deployment

Push to `master` → `.github/workflows/hugo.yml` runs `hugo --minify` and
deploys to GitHub Pages. `static/CNAME` maps the site to `blog.howar31.com`.

After the first deploy, under repo **Settings → Pages**:

- **Source**: GitHub Actions (not a branch)
- **Custom domain**: `blog.howar31.com`
- **Enforce HTTPS**: on

## Support this blog

Independent, no ads. If something here saved you time:

- ☕ [Ko-fi](https://ko-fi.com/howar31)
- 💸 [PayPal](https://donate.howar31.com)

## License

Blog content is released under [CC BY 4.0](./LICENSE) — reuse and translate
freely, just credit Howar31 and link back. The same notice covers the small
amount of theme code bundled in this repo.

## Links

- **Blog** — [blog.howar31.com](https://blog.howar31.com)
- **Author** — [howar31.com](https://howar31.com)
- **GitHub** — [github.com/howar31](https://github.com/howar31)
