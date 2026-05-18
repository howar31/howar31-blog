# Blog UI Refactor — Design Spec

**Date:** 2026-05-18
**Scope:** Visual redesign of blog.howar31.com (Hugo static site) to match the
"Howar31 Brand" design system handoff from Claude Design.
**Branch:** `ui-refactor` → PR into `master`.

## 1. Goal

Re-skin the blog to the brand design system: deep slate canvas, blue→violet
gradient brand, drifting purple glow, frosted-glass surfaces, brand typography.
Content and URLs are unchanged. No Node.js / npm / bundler introduced — stays a
pure Hugo build.

## 2. Source of truth

Design system bundle (extracted from `Howar31 Brand-handoff (1).zip`):
- `colors_and_type.css` — CSS variable tokens (color, type, glass, shadow, radii).
- `ui_kits/blog/` — `index.html`, `components.jsx`, `app.jsx` — the blog surface
  mockup. Recreate its visual output; do not copy React structure.
- `howar31-brand/project/README.md` — brand foundations narrative.
- `fonts/` — bundled woff2 (only Atkinson Hyperlegible Next is self-hosted; see §4).

## 3. Decisions (locked with user)

| Topic | Decision |
|---|---|
| Default theme | Dark default; light mode + toggle retained. |
| Navbar | Full nav links + GitHub + front-end search. No language toggle (site is zh-TW only). |
| Post-card thumbnail | Auto: `.Params.image` → else first page-bundle image resource → else text-only card. |
| Home sidebar | About card + Tag cloud + Support card. Categories removed from sidebar (reachable via navbar). |
| About card bio | Chinese one-liner adapted from landing-page copy. |
| About card links | GitHub + howar31.com only (no Twitter, no email). |
| Fonts | Noto Sans TC + JetBrains Mono via Google Fonts CSS2; Atkinson Hyperlegible Next self-hosted. |
| Refactor strategy | Token layer + partial split + targeted component rewrite (keep components already matching the design system). |
| Support placement | Sidebar card (home) **and** footer column (all pages). Minor redundancy on home, accepted. |

### Out of scope (in design-system README but not in the actual mockup)
- **PostFooter** (share / related posts) — listed in `ui_kits/blog/README.md`
  but not implemented in `index.html`. Deferred.
- **EN/中 language toggle** — no i18n content exists. Deferred.

## 4. Design tokens — `assets/scss/_tokens.scss`

Adopt the variable set from `colors_and_type.css`. Keep the existing `--c-*`
semantic names (layouts and SCSS reference them widely) and add the new tokens.

- Raw scales: blue/violet/slate (already present).
- New tokens: `--bg-card`, `--bg-card-hover`, `--glass-bg`, `--glass-bg-strong`,
  `--glass-border`, `--glass-blur`, `--shadow-card`, `--shadow-card-hover`,
  `--shadow-blue`, `--shadow-violet-glow`, `--radius-sm/md/lg/xl/pill`,
  `--brand-grad`, type-scale and tracking tokens.
- **Dark mode is canonical.** Dark `--c-bg` changes from pure black `rgb(0,0,0)`
  to slate-950 `rgb(2,6,23)`.
- Light mode retained as the secondary form; map every new token to a sane
  light value so both themes render correctly.

## 5. Typography

- **Body:** Noto Sans TC — Google Fonts CSS2 (`unicode-range` slicing keeps CJK
  download minimal; lighter than the bundled 1.7 MB single-file subset).
- **Mono:** JetBrains Mono — Google Fonts. Replaces Fira Code in `config.toml`
  `googleFonts` param and in SCSS `code` / `pre` font stacks.
- **Display:** Atkinson Hyperlegible Next — self-hosted woff2 (42 KB) in
  `static/fonts/`, `@font-face` in `_tokens.scss`. Used for hero title + site name.
- Code blocks keep their fixed dark palette (Prism owns colors).

## 6. Theme boot

`layouts/partials/head.html` inline boot script: `theme = stored || 'dark'`
(was `stored || system-pref`). Toggle button + `theme.js` logic unchanged
except the system-preference listener still applies only when no stored choice.

## 7. Navbar — `layouts/partials/header.html` + `_navbar.scss`

Sticky, `height 3.6rem`, `backdrop-filter: blur(24px)`, translucent canvas bg.
- Gradient wordmark site name (existing).
- Nav links: `Home / Posts / Categories / Tags / About` via `[[menu.main]]` in
  `config.toml`. Active state = white text + blue underline.
- Search icon button (opens search modal — §8).
- GitHub icon link.
- Theme toggle (existing).
- **Mobile:** hamburger button toggles a slide-down panel holding the nav links;
  search / GitHub / theme stay in the bar. Toggle logic added to `theme.js`.
- **New content:** `content/about.md` — About page scaffolded with a drafted
  bio from landing-page copy; user refines later.

## 8. Front-end search

- `config.toml`: add `JSON` to home `[outputs]`.
- `layouts/index.json`: home JSON template, ranges over
  `where site.RegularPages "Type" "posts"`, emits an array of
  `{title, summary, url, date, tags, categories}`.
- UI: glass modal overlay opened by the navbar search button or the `/` key,
  closed by Esc / backdrop. An input filters results live.
- Matching: hand-rolled lowercase token match over title + summary + tags
  (zero dependency — ~54 posts, no search library needed). Implemented in
  `theme.js`; fetches `/index.json` once on first open.
- Styles in `_search.scss`.

## 9. Home — `layouts/index.html` + partials

- **Hero:** uppercase eyebrow + gradient `<h1>` (site title) + tagline
  (site description). `_hero.scss`.
- **Post card** (`_post-list.scss`, shared by home / list / taxonomy): grid row —
  left: title, meta (date · `X 分鐘閱讀` · category), summary, tag pills; right:
  figure thumbnail. Divider between cards. Hover: title → violet, thumbnail
  tilt + glow. Read time from Hugo `.ReadingTime`.
  - Thumbnail resolution: `.Params.image` → else `(.Resources.ByType "image")`
    first item → else render text-only card (no right column).
  - Extract into `layouts/partials/post-card.html` so home / list / terms reuse it.
- **Sidebar** (`_sidebar.scss`) — glass cards:
  - About card: 2015 avatar, name, Chinese bio, GitHub + howar31.com links.
  - Tag cloud: pills sized by post count, with counts.
  - Support card: Ko-fi + PayPal from `params.sponsor`.

## 10. Post / list / taxonomy pages

- `single.html` + `post-meta.html`: plain (non-gradient) title; meta row
  restyled with icons + tag pills. In-content hint blocks, code figures,
  figure cards, and the image lightbox **already match the design system —
  left unchanged.**
- `list.html` (posts section) and `terms.html` (categories/tags): use the
  shared `post-card.html` partial; taxonomy term pills restyled as glass pills.

## 11. SCSS architecture

Split the 1542-line `assets/scss/main.scss` into partials imported by `main.scss`:

```
_tokens.scss  _base.scss   _layout.scss  _navbar.scss  _footer.scss
_hero.scss    _post-list.scss  _sidebar.scss  _post.scss  _search.scss
_back-to-top.scss  _pagination.scss
```

`main.scss` becomes an ordered `@import` list. Constraint (from project
CLAUDE.md / SPEC.md): avoid nested SCSS `&-suffix` after descendant combinators
— libsass compiles them into broken selectors.

Components kept verbatim (already design-system compliant): drifting glow
background, `.post-figure` card + tilt, `.vp-image-modal` lightbox, Prism code
toolbar, back-to-top progress ring.

## 12. JavaScript — `assets/js/theme.js`

Existing behaviors unchanged (theme toggle, Prism line-numbers tagging,
back-to-top ring, lightbox, figure tilt). Added:
- Mobile nav hamburger toggle.
- Search modal: open/close, `/` and Esc key handling, one-time `index.json`
  fetch, live filtering and result rendering.

## 13. Files touched

| File | Change |
|---|---|
| `config.toml` | `[[menu.main]]`, `googleFonts`, home `[outputs]` + JSON |
| `layouts/partials/head.html` | boot script default, font links |
| `layouts/partials/header.html` | full navbar |
| `layouts/partials/footer.html` | restyle |
| `layouts/index.html` | hero + post cards + sidebar |
| `layouts/index.json` | new — search index |
| `layouts/partials/post-card.html` | new — shared post card |
| `layouts/partials/sidebar.html` | new — about / tags / support |
| `layouts/_default/list.html`, `terms.html`, `single.html`, `post-meta.html` | restyle |
| `assets/scss/*` | split into partials, rewrite components |
| `assets/js/theme.js` | nav + search |
| `static/fonts/AtkinsonHyperlegibleNext.woff2` | new — self-hosted display font |
| `content/about.md` | new — About page |

## 14. Verification

No automated test framework exists. Verification is:
1. `hugo --minify` builds with zero errors/warnings.
2. `hugo server --buildFuture` manual review across: home, a post, `/posts/`,
   a category page, a tag page, `/about/`, the search overlay, mobile width
   (~375 px) and desktop, in both dark and light themes.
3. Optionally expose via Tailscale for phone review.

## 15. Risks / notes

- Google Fonts is a runtime third-party fetch; already accepted (current site
  loads Fira Code the same way). Prism remains self-hosted.
- Auto-thumbnail picks the first image *resource* in a page bundle, which is
  name-ordered, not necessarily the first image in prose. Acceptable for the
  current corpus; `image:` frontmatter overrides when precise control is needed.
- About page content is drafted, not authored by the user — flagged for the
  user to refine post-merge.
