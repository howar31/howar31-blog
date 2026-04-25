# Howar31 Blog

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
- **FontAwesome v5.8.1** (CDN) — icons for post meta, theme toggle, sponsor buttons
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
│   ├── index.html                # Home: 2-column (main + taxonomy sidebar)
│   ├── _default/
│   │   ├── baseof.html · single.html · list.html · terms.html
│   │   └── _markup/render-image.html  # Wraps captioned images in <figure> cards
│   ├── partials/                 # head · header · footer · post-meta · back-to-top
│   └── shortcodes/               # tip · warning  (replace VuePress ::: containers)
├── assets/
│   ├── scss/main.scss            # All styles (dark-mode glow, navbar, figure cards, lightbox)
│   └── js/theme.js               # Dark-mode toggle, back-to-top, Prism line-numbers, lightbox, figure tilt
├── archetypes/default.md         # Template used by `hugo new`
├── static/                       # Copied verbatim: CNAME, manifest.json, logo/, SW cleanup shim
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
  - vuepress          # lowercase-dash; value = URL slug = displayed string
tags:
  - hugo
  - migration
---
```

**Taxonomy naming**: always lowercase-dash (`vuepress`, `dev-notes`, `ci-cd`).
The frontmatter value equals the URL slug and equals the text shown in sidebar /
terms page / post meta — no transform anywhere in the templates. Keep it
consistent when adding new terms.

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

## Links

- **Blog** — [blog.howar31.com](https://blog.howar31.com)
- **Author** — [howar31.com](https://howar31.com)
- **GitHub** — [github.com/howar31](https://github.com/howar31)
