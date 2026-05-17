# Blog UI Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin blog.howar31.com to the Howar31 Brand design system — token-driven SCSS, brand typography, full navbar with front-end search, post cards with auto thumbnails, glass sidebar — without changing content, URLs, or the pure-Hugo build.

**Architecture:** Token layer + partial split + targeted component rewrite. The 1542-line `main.scss` is first split into focused partials (mechanical, zero visual change), then individual partials are rewritten. Components already matching the design system (drifting glow, figure card, lightbox, Prism toolbar, back-to-top ring) are ported verbatim and never touched again.

**Tech Stack:** Hugo (extended) static site, SCSS via Hugo Pipes → libsass, vanilla JS, FontAwesome 5.8.1, Prism.js. No Node.js / npm / bundler.

**Design reference (stable, read-only):** `~/.claude/cache/howar31-blog-design/`
- `colors_and_type.css` — canonical token values.
- `ui_kits/blog/{index.html,components.jsx,app.jsx}` — blog surface mockup.
- `fonts/AtkinsonHyperlegibleNext.woff2` — display font to self-host.
- Project README (brand foundations): `~/.claude/cache/howar31-blog-design/README.md`.

**Spec:** `docs/superpowers/specs/2026-05-18-blog-ui-refactor-design.md`.

**Verification model:** This is a static site with no test framework. Every task verifies with a Hugo build (`hugo --gc --minify`) that must finish with zero errors, plus a described manual visual check on `hugo server --buildFuture` (http://localhost:1313/). "Expected" describes build output and what to see on screen.

**Branch:** All work on `ui-refactor` (already created and checked out).

---

### Task 1: Split `main.scss` into partials (mechanical, no visual change)

Move existing CSS verbatim into focused partials. No values change. The compiled output must be visually identical to before.

**Files:**
- Create: `assets/scss/_tokens.scss`, `_base.scss`, `_layout.scss`, `_navbar.scss`, `_footer.scss`, `_hero.scss`, `_post-list.scss`, `_sidebar.scss`, `_post.scss`, `_back-to-top.scss`, `_pagination.scss`
- Modify: `assets/scss/main.scss` (becomes an `@import` list)

- [ ] **Step 1: Create the partials by moving existing blocks**

Read the current `assets/scss/main.scss` (1542 lines) and distribute its contents — **unchanged, byte-for-byte** — into the partials below. Hugo/libsass `@import` of `_name.scss` is referenced as `@import "name";`.

- `_tokens.scss` — the `:root` block (current lines ~946-1003) and the **entire** `html[data-theme="dark"], [data-theme="dark"]` block (~1012-1115) including its nested rules (variables, `body` background, `body::before/::after` glow, `.vp-page/.vp-theme-container` transparent + z-index, `.vp-navbar` z-index, dark scrollbar), plus `@keyframes float-glow-1/2` (1117-1146). Move the whole dark block intact — do not split its nested rules out.
- `_base.scss` — global reset (`*`, `html`, `body`), `h1-h6`, `p`, `a`, `code`, `pre[class*=language-]`, `div.code-toolbar`, `pre.line-numbers`, `blockquote`, `table`, `img`, `hr`, scrollbar (`::-webkit-scrollbar*`), the `body { font-family }` rule, the `a:not(...)` link-override chains, `.btn`.
- `_layout.scss` — `.vp-theme-container`, `.vp-page`, `.vp-content`, `.theme-default-content`, `.vp-content-wide`.
- `_navbar.scss` — every `.vp-navbar*` / `.vp-site-name` / `.theme-toggle*` rule.
- `_footer.scss` — every `.vp-footer*` / `.vp-sponsor-btn` rule.
- `_hero.scss` — `.home-hero`, `.home-layout`, `.home-main-header`, `.home-main-cta*`.
- `_post-list.scss` — `.post-list`.
- `_sidebar.scss` — `.home-sidebar`, `.term-list`.
- `_post.scss` — `.post-figure*` + `@keyframes figure-glow-drift`, `.blog-post-meta`, `.hint-container`, `.vp-image-modal*`, `.post-content img`.
- `_back-to-top.scss` — `.back-to-top*`.
- `_pagination.scss` — `.pagination`.

Keep the SCSS variables (`$navbar-height`, `$content-max-width`, `$breakpoint-*`) at the top of `main.scss` (before the imports) so all partials can use them. Keep every `@media` block with the partial that owns its selectors.

- [ ] **Step 2: Rewrite `main.scss` as an ordered import list**

```scss
// Howar31 Blog — Hugo edition. SCSS entrypoint; see docs/superpowers/specs.
$navbar-height: 3.6rem;
$content-max-width: 740px;
$breakpoint-narrow: 959px;
$breakpoint-mobile: 719px;

@import "tokens";
@import "base";
@import "layout";
@import "navbar";
@import "footer";
@import "hero";
@import "post-list";
@import "sidebar";
@import "post";
@import "search";
@import "back-to-top";
@import "pagination";
```

Note: `search` is imported but `_search.scss` does not exist yet — create an empty `assets/scss/_search.scss` now so the build does not fail (it gets filled in Task 5).

- [ ] **Step 3: Build and compare**

Run: `hugo --gc --minify`
Expected: build succeeds, zero errors. Then run `hugo server --buildFuture`, open the home page and a post — the site looks **exactly** as before this task (this is a pure refactor).

- [ ] **Step 4: Commit**

```bash
git add assets/scss/
git commit -m "refactor: split main.scss into focused partials

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Design tokens — dark canonical

Rewrite `_tokens.scss` to the full design-system token set. Dark mode becomes canonical; dark background moves from pure black to slate-950.

**Files:**
- Modify: `assets/scss/_tokens.scss`

- [ ] **Step 1: Rewrite `_tokens.scss`**

Open the reference `~/.claude/cache/howar31-blog-design/colors_and_type.css` and port its `:root` block (raw scales, semantic dark tokens, glass tokens, glow, shadows, status, radii, type stacks, type scale, weights, line-heights, tracking — lines 45-159).

Structure `_tokens.scss` as:
1. `:root` — all design-system tokens from the reference, **plus** the existing `--c-*` semantic names mapped to **light-mode** values (keep current light values from the pre-split file: `--c-bg: #ffffff`, `--c-bg-soft: #f8fafc`, `--c-text: #1e293b`, etc.). The `--c-*` names stay because layouts and other partials reference them.
2. `html[data-theme="dark"], [data-theme="dark"]` — override every `--c-*` with the dark values, sourced from the design system: `--c-bg: rgb(2, 6, 23)` (slate-950, **changed from `rgb(0,0,0)`**), `--c-bg-soft: rgba(255,255,255,0.05)`, `--c-text: #ffffff`, `--c-text-light: rgba(255,255,255,0.7)`, `--c-text-lighter: rgba(255,255,255,0.6)`, `--c-border: rgba(255,255,255,0.1)`, `--c-brand: var(--blue-400)`, code colors `--code-bg-color: #0f172a` / `--code-text-color: #cbd5e1`. Keep the existing dark-mode `body { background-color }`, `body::before` / `body::after` glow rules, `.vp-page/.vp-theme-container` transparent + z-index rules, and dark scrollbar rules — port them verbatim (update the `body` background to `rgb(2,6,23)`).
3. `@keyframes float-glow-1` and `float-glow-2` — port verbatim.

Do **not** add a `@font-face` here yet (Task 3 handles fonts).

- [ ] **Step 2: Build and visual check**

Run: `hugo --gc --minify`
Expected: build succeeds. On `hugo server`, in dark mode the page background is now deep slate-blue `rgb(2,6,23)` instead of pure black; the violet glow reads slightly warmer against it. Light mode unchanged. No layout shifts.

- [ ] **Step 3: Commit**

```bash
git add assets/scss/_tokens.scss
git commit -m "refactor: adopt design-system tokens, slate-950 dark canvas

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Typography + dark-default theme

Adopt brand fonts and make dark the default theme.

**Files:**
- Create: `static/fonts/AtkinsonHyperlegibleNext.woff2`
- Modify: `config.toml` (the `googleFonts` param), `layouts/partials/head.html`, `assets/scss/_tokens.scss`, `assets/scss/_base.scss`

- [ ] **Step 1: Self-host the display font**

Copy the woff2 into `static/` so Hugo serves it verbatim at the site root (`/fonts/...`):

```bash
mkdir -p static/fonts
cp ~/.claude/cache/howar31-blog-design/fonts/AtkinsonHyperlegibleNext.woff2 static/fonts/AtkinsonHyperlegibleNext.woff2
```

- [ ] **Step 2: Add `@font-face` and font tokens to `_tokens.scss`**

At the **top** of `_tokens.scss`, before `:root`, add the Atkinson `@font-face` (the file is served at `/fonts/...` from `static/`):

```scss
@font-face {
  font-family: "Atkinson Hyperlegible Next";
  src: url("/fonts/AtkinsonHyperlegibleNext.woff2") format("woff2");
  font-weight: 200 800;
  font-style: normal;
  font-display: swap;
}
```

Inside `:root`, add/confirm the font-family tokens (from the reference `colors_and_type.css`):
```scss
--font-sans: "Noto Sans TC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-display: "Atkinson Hyperlegible Next", var(--font-sans);
--font-mono: "JetBrains Mono", "Noto Sans Mono", "Consolas", "Monaco", "Courier New", monospace;
```

- [ ] **Step 3: Update font loading in `config.toml` and `head.html`**

In `config.toml`, replace the `googleFonts` param value with:
```
googleFonts = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;600;700&display=swap"
```
`head.html` already loads `site.Params.googleFonts` — no template change needed there for fonts.

- [ ] **Step 4: Apply fonts in `_base.scss`**

In `_base.scss`, change the `body { font-family }` rule to `font-family: var(--font-sans);`. Change `code` and `pre[class*="language-"]` `font-family` from `'Fira Code', var(--code-font-family)` to `var(--font-mono)`. In `_tokens.scss`, update `--code-font-family` to start with `'JetBrains Mono'`.

- [ ] **Step 5: Dark-default boot script**

In `layouts/partials/head.html`, change the inline boot script so the default (no stored choice) is dark:
```js
var stored = localStorage.getItem('howar31-theme');
var theme = stored || 'dark';
if (theme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}
```

- [ ] **Step 6: Build and visual check**

Run: `hugo --gc --minify`
Expected: build succeeds. On `hugo server` in a fresh browser profile (no localStorage), the site loads in dark mode. Body text renders in Noto Sans TC; code blocks in JetBrains Mono. The toggle still flips to light and back.

- [ ] **Step 7: Commit**

```bash
git add config.toml layouts/partials/head.html assets/scss/_tokens.scss assets/scss/_base.scss static/fonts/AtkinsonHyperlegibleNext.woff2
git commit -m "feat: adopt brand fonts and default to dark theme

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Full navbar + About page

Expand the minimal navbar to nav links + GitHub + search trigger, with a mobile hamburger menu. Create the About page.

**Files:**
- Modify: `config.toml` (`[[menu.main]]`), `layouts/partials/header.html`, `assets/scss/_navbar.scss`, `assets/js/theme.js`
- Create: `content/about.md`

- [ ] **Step 1: Add the main menu to `config.toml`**

After the `[[menu.footer]]` blocks, add:
```toml
[[menu.main]]
  name = "Home"
  url = "/"
  weight = 10
[[menu.main]]
  name = "Posts"
  url = "/posts/"
  weight = 20
[[menu.main]]
  name = "Categories"
  url = "/categories/"
  weight = 30
[[menu.main]]
  name = "Tags"
  url = "/tags/"
  weight = 40
[[menu.main]]
  name = "About"
  url = "/about/"
  weight = 50
```
Update the comment above the footer menu (it currently says no `[[menu.main]]` entries exist) to reflect that a main menu now exists.

- [ ] **Step 2: Rewrite `layouts/partials/header.html`**

```html
<header class="vp-navbar" role="banner">
  <div class="vp-navbar-inner">
    <a class="vp-site-name" href="{{ "/" | relURL }}">{{ site.Title }}</a>

    <nav class="vp-nav" aria-label="Primary">
      {{- range site.Menus.main }}
      {{- $active := or (eq $.RelPermalink .URL) (and (ne .URL "/") (hasPrefix $.RelPermalink .URL)) }}
      <a class="vp-nav-link{{ if $active }} is-active{{ end }}" href="{{ .URL | relURL }}">{{ .Name }}</a>
      {{- end }}
    </nav>

    <div class="vp-navbar-actions">
      <button type="button" class="vp-icon-btn" data-search-open aria-label="Search" title="Search">
        <i class="fas fa-search" aria-hidden="true"></i>
      </button>
      <a class="vp-icon-btn" href="https://github.com/howar31" rel="noopener" target="_blank" aria-label="GitHub">
        <i class="fab fa-github" aria-hidden="true"></i>
      </a>
      <button type="button" class="theme-toggle" data-theme-toggle aria-label="Toggle dark mode" title="Toggle dark mode">
        <i class="far fa-sun theme-toggle-light" aria-hidden="true"></i>
        <i class="far fa-moon theme-toggle-dark" aria-hidden="true"></i>
      </button>
      <button type="button" class="vp-nav-burger" data-nav-toggle aria-label="Menu" aria-expanded="false">
        <i class="fas fa-bars" aria-hidden="true"></i>
      </button>
    </div>
  </div>

  <nav class="vp-nav-mobile" data-nav-panel aria-label="Mobile" hidden>
    {{- range site.Menus.main }}
    <a class="vp-nav-mobile-link" href="{{ .URL | relURL }}">{{ .Name }}</a>
    {{- end }}
  </nav>
</header>
```

- [ ] **Step 3: Rewrite `_navbar.scss`**

Style, using design-system values (navbar already sticky/blur in the current partial — keep that):
- `.vp-navbar-inner` — `display:flex; align-items:center; gap:2rem; max-width:1080px`.
- `.vp-nav` — `display:flex; gap:1.4rem; flex:1`. `.vp-nav-link` — `font-size:0.875rem; font-weight:500; color:var(--c-text-light); padding-bottom:2px; border-bottom:2px solid transparent; transition:color .2s ease`. `.vp-nav-link.is-active` — `color:var(--c-text); border-bottom-color:var(--blue-400)`. Hover → `color:var(--c-text)`.
- `.vp-icon-btn` — square ~34px, transparent bg, `color:var(--c-text-light)`, `border-radius:var(--radius-md)`; hover → `color:var(--c-brand)`, faint bg `var(--c-bg-soft)`. Keep `.theme-toggle` as-is (already styled in this partial).
- `.vp-nav-burger` — `display:none` on desktop.
- `.vp-nav-mobile` — `display:none` on desktop; holds stacked links.
- At `@media (max-width: $breakpoint-mobile)`: hide `.vp-nav`, show `.vp-nav-burger` (`display:inline-flex`), and when not `[hidden]` show `.vp-nav-mobile` as a full-width column under the bar (`background:var(--c-bg)`, top border, padding, stacked `.vp-nav-mobile-link` rows).

Remember the project SCSS pitfall: do not write `&-suffix` after a descendant combinator.

- [ ] **Step 4: Add the mobile-nav toggle to `theme.js`**

Inside the IIFE in `assets/js/theme.js`, after the dark-mode block, add:
```js
// ---- Mobile nav toggle -----------------------------------------------
var navToggle = document.querySelector('[data-nav-toggle]');
var navPanel = document.querySelector('[data-nav-panel]');
if (navToggle && navPanel) {
  navToggle.addEventListener('click', function () {
    var open = navPanel.hasAttribute('hidden');
    if (open) navPanel.removeAttribute('hidden');
    else navPanel.setAttribute('hidden', '');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}
```

- [ ] **Step 5: Create the About page**

Create `content/about.md`. Draft the body from landing-page brand copy (the user will refine later — this is a scaffold):
```markdown
---
title: 關於
---

熱衷開源的 Web Developer，深耕後端與雲端基礎建設。

這個部落格記錄開發筆記、前端工藝，以及日常使用的工具。

- 個人網站：[howar31.com](https://howar31.com)
- GitHub：[github.com/howar31](https://github.com/howar31)
```

- [ ] **Step 6: Build and visual check**

Run: `hugo --gc --minify`
Expected: build succeeds. On `hugo server`: the navbar shows Home/Posts/Categories/Tags/About, a search icon, a GitHub icon, the theme toggle. The current page's nav link is underlined blue. `/about/` renders the About page. At ~375 px width the links collapse into a hamburger that toggles a stacked panel.

- [ ] **Step 7: Commit**

```bash
git add config.toml layouts/partials/header.html assets/scss/_navbar.scss assets/js/theme.js content/about.md
git commit -m "feat: full navbar with nav links, GitHub, mobile menu; add About page

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Front-end search

Generate a JSON search index and add a glass search modal driven by vanilla JS.

**Files:**
- Modify: `config.toml` (`[outputs]`), `assets/scss/_search.scss`, `assets/js/theme.js`
- Create: `layouts/index.json`

- [ ] **Step 1: Enable JSON output for the home page**

In `config.toml`, change the `[outputs]` block:
```toml
[outputs]
  home = ["HTML", "RSS", "JSON"]
  section = ["HTML", "RSS"]
```

- [ ] **Step 2: Create the search index template**

Create `layouts/index.json`:
```go-html-template
{{- $posts := where site.RegularPages "Type" "posts" -}}
[
{{- range $i, $p := $posts -}}
{{- if $i }},{{ end }}
{"title": {{ $p.Title | jsonify }},
 "url": {{ $p.RelPermalink | jsonify }},
 "date": {{ $p.Date.Format "2006年01月02日" | jsonify }},
 "summary": {{ (or $p.Description (truncate 160 $p.Summary)) | jsonify }},
 "tags": {{ (or $p.Params.tags slice) | jsonify }},
 "categories": {{ (or $p.Params.categories slice) | jsonify }}}
{{- end }}
]
```

- [ ] **Step 3: Add search modal styles to `_search.scss`**

Fill the (currently empty) `assets/scss/_search.scss`. The modal mirrors the lightbox glass recipe:
- `.vp-search` — `position:fixed; inset:0; z-index:200; display:flex; justify-content:center; padding-top:12vh;` hidden via `opacity:0; visibility:hidden;` with an `.is-open` state (copy the open/close transition pattern from `.vp-image-modal` in `_post.scss`).
- `.vp-search-backdrop` — `position:absolute; inset:0; background:rgba(0,0,0,0.7)`.
- `.vp-search-card` — `position:relative; width:min(560px,92vw); max-height:70vh; border-radius:var(--radius-xl); border:1px solid var(--glass-border); backdrop-filter:blur(24px); overflow:hidden;` with `@supports` glass/opaque fallback like the lightbox card.
- `.vp-search-input` — full-width, transparent, no border, `color:var(--c-text)`, `font-size:1rem`, padding `1rem 1.25rem`, bottom divider `1px solid var(--c-border)`.
- `.vp-search-results` — scrollable list; each `.vp-search-result` is a block link: title (`var(--c-text)`, weight 600), meta line (date · categories, `var(--c-text-lighter)`, `font-size:0.8rem`); hover → bg `var(--c-bg-soft)`. `.vp-search-empty` — muted centered "找不到符合的文章".

- [ ] **Step 4: Add search logic to `theme.js`**

Inside the IIFE, after the mobile-nav block, add a search module that: builds the modal DOM (like the lightbox does), opens on `[data-search-open]` click and on `/` keypress (when not typing in a field), closes on Esc / backdrop, lazy-fetches `/index.json` once on first open, and filters live.

```js
// ---- Search ----------------------------------------------------------
var searchOpen = document.querySelector('[data-search-open]');
if (searchOpen) {
  var search = document.createElement('div');
  search.className = 'vp-search';
  search.setAttribute('role', 'dialog');
  search.setAttribute('aria-modal', 'true');
  search.setAttribute('aria-label', '搜尋文章');
  search.innerHTML =
    '<div class="vp-search-backdrop"></div>' +
    '<div class="vp-search-card">' +
      '<input class="vp-search-input" type="search" placeholder="搜尋文章…" aria-label="搜尋文章">' +
      '<div class="vp-search-results"></div>' +
    '</div>';
  document.body.appendChild(search);

  var sInput = search.querySelector('.vp-search-input');
  var sResults = search.querySelector('.vp-search-results');
  var sBackdrop = search.querySelector('.vp-search-backdrop');
  var sIndex = null;

  function renderResults(q) {
    q = q.trim().toLowerCase();
    if (!sIndex) { sResults.innerHTML = ''; return; }
    if (!q) { sResults.innerHTML = ''; return; }
    var tokens = q.split(/\s+/);
    var hits = sIndex.filter(function (p) {
      var hay = (p.title + ' ' + (p.summary || '') + ' ' +
        (p.tags || []).join(' ') + ' ' + (p.categories || []).join(' ')).toLowerCase();
      return tokens.every(function (t) { return hay.indexOf(t) !== -1; });
    });
    if (!hits.length) {
      sResults.innerHTML = '<div class="vp-search-empty">找不到符合的文章</div>';
      return;
    }
    sResults.innerHTML = hits.map(function (p) {
      var meta = [p.date].concat(p.categories || []).join(' · ');
      return '<a class="vp-search-result" href="' + p.url + '">' +
        '<div class="vp-search-result-title"></div>' +
        '<div class="vp-search-result-meta"></div></a>';
    }).join('');
    // Set text via textContent to avoid HTML injection.
    var nodes = sResults.querySelectorAll('.vp-search-result');
    hits.forEach(function (p, i) {
      nodes[i].querySelector('.vp-search-result-title').textContent = p.title;
      nodes[i].querySelector('.vp-search-result-meta').textContent =
        [p.date].concat(p.categories || []).join(' · ');
    });
  }

  function openSearch() {
    search.classList.add('is-open');
    root.classList.add('modal-open');
    if (!sIndex) {
      fetch('/index.json').then(function (r) { return r.json(); })
        .then(function (data) { sIndex = data; renderResults(sInput.value); })
        .catch(function () { sIndex = []; });
    }
    window.requestAnimationFrame(function () { sInput.focus(); });
  }
  function closeSearch() {
    search.classList.remove('is-open');
    root.classList.remove('modal-open');
  }

  searchOpen.addEventListener('click', openSearch);
  sBackdrop.addEventListener('click', closeSearch);
  sInput.addEventListener('input', function () { renderResults(sInput.value); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && search.classList.contains('is-open')) closeSearch();
    if (e.key === '/' && !search.classList.contains('is-open')) {
      var tag = (e.target && e.target.tagName) || '';
      if (tag !== 'INPUT' && tag !== 'TEXTAREA') { e.preventDefault(); openSearch(); }
    }
  });
}
```

Note: `root` is already defined earlier in `theme.js` (`var root = document.documentElement;`). `.modal-open` overflow lock already exists in `_post.scss`.

- [ ] **Step 5: Build and visual check**

Run: `hugo --gc --minify`
Expected: build succeeds; `public/index.json` exists and contains the post array. On `hugo server`: clicking the navbar search icon (or pressing `/`) opens a centered glass modal; typing filters posts live; clicking a result navigates; Esc and backdrop close it.

- [ ] **Step 6: Commit**

```bash
git add config.toml layouts/index.json assets/scss/_search.scss assets/js/theme.js
git commit -m "feat: client-side search with Hugo JSON index and glass modal

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Post-card partial + post-list styling

Create a reusable post-card partial with auto thumbnail and read time; style it as the design-system card row.

**Files:**
- Create: `layouts/partials/post-card.html`
- Modify: `assets/scss/_post-list.scss`

- [ ] **Step 1: Create `layouts/partials/post-card.html`**

The partial receives a page as context (`.`). Resolves a thumbnail: `image` frontmatter param (a bundle resource name) → else first image resource → else none.

```go-html-template
{{- $img := "" -}}
{{- with .Params.image }}{{ $img = ($.Resources.GetMatch .) }}{{ end -}}
{{- if not $img }}{{ with (.Resources.ByType "image") }}{{ $img = index . 0 }}{{ end }}{{ end -}}
<article class="post-card{{ if $img }} has-thumb{{ end }}">
  <div class="post-card-body">
    <h3 class="post-card-title"><a href="{{ .RelPermalink }}">{{ .Title }}</a></h3>
    <div class="post-card-meta">
      <span><i class="far fa-calendar-alt" aria-hidden="true"></i>
        <time datetime="{{ .Date.Format "2006-01-02" }}">{{ .Date.Format "2006年01月02日" }}</time></span>
      <span><i class="far fa-clock" aria-hidden="true"></i> {{ .ReadingTime }} 分鐘閱讀</span>
      {{- with .Params.categories }}
      <span><i class="fas fa-cat" aria-hidden="true"></i>
        {{- range $i, $c := . }}{{ if $i }}、{{ end }}<a href="{{ printf "/categories/%s/" ($c | urlize) | relURL }}">{{ $c }}</a>{{ end -}}
      </span>
      {{- end }}
    </div>
    {{- with .Description }}<p class="post-card-summary">{{ . }}</p>{{ end }}
    {{- with .Params.tags }}
    <div class="post-card-tags">
      {{- range . }}
      <a class="vp-pill" href="{{ printf "/tags/%s/" (. | urlize) | relURL }}">
        <i class="fas fa-hashtag" aria-hidden="true"></i>{{ . }}</a>
      {{- end }}
    </div>
    {{- end }}
  </div>
  {{- with $img }}
  <a class="post-card-thumb" href="{{ $.RelPermalink }}" aria-hidden="true" tabindex="-1"
     style="background-image:url('{{ .RelPermalink }}')"></a>
  {{- end }}
</article>
```

- [ ] **Step 2: Style the card in `_post-list.scss`**

Replace the contents of `_post-list.scss` (currently the old `.post-list` rules) with card styling matching `~/.claude/cache/howar31-blog-design/ui_kits/blog/components.jsx` `PostCard`:
- `.post-list` — `list-style:none; padding:0; margin:0;` (still a container if used as `<ul>`; cards may also be direct siblings).
- `.post-card` — `display:grid; grid-template-columns:1fr; gap:1.5rem; padding:1.5rem 0; border-bottom:1px solid var(--c-border);`. `.post-card.has-thumb` → `grid-template-columns:1fr 200px;`. Last card: no border.
- `.post-card-title` — `margin:0; font-size:1.375rem; font-weight:600; letter-spacing:-0.01em;` link `color:var(--c-text)`, `transition:color .2s ease`; on `.post-card:hover` the title link → `color:var(--violet-400)`.
- `.post-card-meta` — `display:flex; flex-wrap:wrap; gap:1.125rem; margin-top:0.5rem; font-size:0.8125rem; color:var(--c-text-lighter);` icons slightly faded; links inherit and hover → `var(--c-brand)`.
- `.post-card-summary` — `margin-top:0.75rem; color:var(--c-text-light); font-size:0.9375rem; line-height:1.7;`.
- `.post-card-tags` — `display:flex; flex-wrap:wrap; gap:0.4rem; margin-top:0.75rem;`.
- `.vp-pill` — pill chip: `display:inline-flex; align-items:center; gap:0.25rem; font-size:0.6875rem; padding:0.18rem 0.6rem; border-radius:var(--radius-pill); border:1px solid var(--c-border); background:var(--c-bg-soft); color:var(--c-text-light); transition:all .2s ease;` hover → `border-color:var(--c-brand); color:var(--c-text);`. The `<i class="fa-hashtag">` inside is `font-size:0.6em; opacity:0.6;`.
- `.post-card-thumb` — `display:block; height:130px; border-radius:var(--radius-lg); background-size:cover; background-position:center; border:1px solid var(--c-border); transition:transform .4s cubic-bezier(0.2,0.8,0.2,1), box-shadow .4s cubic-bezier(0.2,0.8,0.2,1); box-shadow:var(--shadow-card);`. On `.post-card:hover` → `transform:translateY(-2px) rotate(-0.5deg); box-shadow:0 16px 32px rgba(0,0,0,0.5), var(--shadow-violet-glow);`.
- `@media (max-width:$breakpoint-mobile)`: `.post-card.has-thumb` → `grid-template-columns:1fr;` and `.post-card-thumb` → `height:170px; order:-1;` (thumb above text on mobile).
- `@media (prefers-reduced-motion: reduce)`: `.post-card-thumb` → `transition:none;` and no `transform` on hover.

- [ ] **Step 3: Build check**

Run: `hugo --gc --minify`
Expected: build succeeds (the partial is not yet referenced by any template — this only verifies it compiles when included later; safe to proceed). No visual change yet.

- [ ] **Step 4: Commit**

```bash
git add layouts/partials/post-card.html assets/scss/_post-list.scss
git commit -m "feat: reusable post-card partial with auto thumbnail and read time

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Home hero + post cards

Wire the post-card partial into the home page and restyle the hero.

**Files:**
- Modify: `layouts/index.html`, `assets/scss/_hero.scss`

- [ ] **Step 1: Update `layouts/index.html`**

Replace the `<ul class="post-list">…</ul>` block (the inline `<li>` markup) with the partial. The sidebar `<aside>` is replaced in Task 8 — leave it for now. New hero + main:

```go-html-template
{{ define "main" }}
<section class="home">
  <header class="home-hero">
    <div class="home-eyebrow">THE BLOG</div>
    <h1 class="home-title">{{ site.Title }}</h1>
    <p class="home-tagline">{{ site.Params.description }}</p>
  </header>

  <div class="home-layout">
    <section class="home-main">
      <header class="home-main-header">
        <h2>Recent Posts</h2>
        <a class="home-main-more" href="{{ "/posts/" | relURL }}">All Posts →</a>
      </header>

      {{- $recent := first 10 (where site.RegularPages "Type" "posts").ByDate.Reverse -}}
      {{- $total := len (where site.RegularPages "Type" "posts") -}}
      <div class="post-list">
        {{- range $recent }}
        {{ partial "post-card.html" . }}
        {{- end }}
      </div>

      <div class="home-main-cta">
        <a class="home-main-cta-btn" href="{{ "/posts/" | relURL }}">
          <span>Browse all {{ $total }} posts</span>
          <i class="fas fa-arrow-right" aria-hidden="true"></i>
        </a>
      </div>
    </section>

    {{- /* Sidebar: existing <aside> retained here; replaced by the
           sidebar.html partial in Task 8 Step 3. Do not change it now. */ -}}
    <aside class="home-sidebar" aria-label="Taxonomy navigation">
      {{- /* ...keep the current categories + tags <aside> block exactly as
             it is in the existing layouts/index.html... */ -}}
    </aside>
  </div>
</section>
{{ end }}
```

The `<aside class="home-sidebar">` block stays **byte-for-byte as in the current `layouts/index.html`** (the categories + tags sidebar) so this task's build stays green. Task 8 Step 3 replaces the whole `<aside>…</aside>` with `{{ partial "sidebar.html" . }}`.

- [ ] **Step 2: Restyle the hero in `_hero.scss`**

Keep `.home-layout`, `.home-main-header`, `.home-main-cta*` as they are. Update `.home-hero`:
- `.home-hero` — `text-align:center; padding:3rem 0 2rem;`.
- `.home-eyebrow` — `font-size:0.8125rem; text-transform:uppercase; letter-spacing:0.12em; color:var(--c-text-lighter); margin-bottom:0.625rem;`.
- `.home-title` — keep the gradient `background-clip:text` treatment; `font-size:2.5rem; font-weight:700; font-family:var(--font-display); letter-spacing:-0.02em; margin:0;`.
- `.home-tagline` — `margin-top:0.5rem; color:var(--c-text-light); font-size:1rem;`.
- In the existing `@media (max-width:$breakpoint-mobile)` block, set `.home-title { font-size:1.875rem; }`.

- [ ] **Step 3: Build and visual check**

Run: `hugo --gc --minify`
Expected: build succeeds. On `hugo server`, the home page shows the eyebrow + gradient title hero and the recent posts as design-system cards (title, meta with read time, summary, tag pills, thumbnail where a post bundle has an image). Hover lifts and tilts the thumbnail.

- [ ] **Step 4: Commit**

```bash
git add layouts/index.html assets/scss/_hero.scss
git commit -m "feat: redesign home hero and post list with brand cards

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Home sidebar — About / Tags / Support

Replace the categories+tags sidebar with glass About, Tag-cloud, and Support cards.

**Files:**
- Create: `layouts/partials/sidebar.html`
- Modify: `assets/scss/_sidebar.scss`, `layouts/index.html`

- [ ] **Step 1: Create `layouts/partials/sidebar.html`**

```go-html-template
{{- $sponsor := site.Params.sponsor | default dict -}}
<aside class="home-sidebar" aria-label="Sidebar">
  <div class="side-card">
    <img class="side-avatar" src="{{ site.Params.avatar | relURL }}" width="64" height="64" alt="Howar31">
    <div class="side-eyebrow">About</div>
    <div class="side-name">{{ site.Params.author }}</div>
    <p class="side-bio">熱衷開源的 Web Developer，深耕後端與雲端基礎建設。</p>
    <div class="side-links">
      <a class="side-social" href="https://github.com/howar31" rel="noopener" target="_blank" aria-label="GitHub"><i class="fab fa-github" aria-hidden="true"></i></a>
      <a class="side-social" href="https://howar31.com" rel="noopener" target="_blank" aria-label="howar31.com"><i class="fas fa-globe" aria-hidden="true"></i></a>
    </div>
  </div>

  {{- with site.Taxonomies.tags }}
  <div class="side-card">
    <div class="side-eyebrow">Tags</div>
    <div class="side-tagcloud">
      {{- range $term, $pages := . }}
      <a class="vp-pill side-tag" href="{{ printf "/tags/%s/" ($term | urlize) | relURL }}"
         style="font-size:{{ add 11 (math.Min 5 (len $pages)) }}px">
        #{{ $term }} <span class="side-tag-count">{{ len $pages }}</span></a>
      {{- end }}
    </div>
  </div>
  {{- end }}

  {{- if or $sponsor.kofi $sponsor.paypal }}
  <div class="side-card">
    <div class="side-eyebrow">Support This Blog</div>
    <p class="side-bio">If a post here saved you time, consider buying me a coffee.</p>
    <div class="side-support">
      {{- with $sponsor.kofi }}
      <a class="side-support-btn sponsor-kofi" href="https://ko-fi.com/{{ . }}" rel="noopener" target="_blank">
        <i class="fas fa-coffee" aria-hidden="true"></i> Ko-fi</a>
      {{- end }}
      {{- with $sponsor.paypal }}
      <a class="side-support-btn sponsor-paypal" href="{{ . }}" rel="noopener" target="_blank">
        <i class="fab fa-paypal" aria-hidden="true"></i> PayPal</a>
      {{- end }}
    </div>
  </div>
  {{- end }}
</aside>
```

- [ ] **Step 2: Rewrite `_sidebar.scss`**

Keep `.home-sidebar` sticky positioning and the `.term-list` rules (still used by `terms.html`). Add:
- `.home-sidebar` — `display:grid; gap:1.25rem; align-content:start;` keep `position:sticky; top:calc(#{$navbar-height} + 1rem);`.
- `.side-card` — glass card: `padding:1.25rem; background:var(--c-bg-soft); border:1px solid var(--c-border); border-radius:var(--radius-xl); backdrop-filter:blur(20px);`. (Use the theme-aware `--c-*` names so the card is correct in both dark and light modes.)
- `.side-avatar` — `border-radius:50%; border:1px solid var(--c-border);`.
- `.side-eyebrow` — `font-size:0.6875rem; text-transform:uppercase; letter-spacing:0.12em; color:var(--c-text-lighter); margin-top:0.5rem;`.
- `.side-name` — `font-size:1rem; font-weight:600; margin-top:0.25rem;`.
- `.side-bio` — `margin:0.375rem 0 0; color:var(--c-text-light); font-size:0.8125rem; line-height:1.6;`.
- `.side-links` — `display:flex; gap:0.625rem; margin-top:0.75rem;`. `.side-social` — 34px square, `border-radius:8px; background:var(--c-bg-soft); border:1px solid var(--c-border); color:var(--c-text-light);` hover → `color:var(--c-brand); border-color:var(--c-brand);`.
- `.side-tagcloud` — `display:flex; flex-wrap:wrap; gap:0.4rem; margin-top:0.625rem;`. `.side-tag-count` — `opacity:0.5;`.
- `.side-support` — `display:grid; gap:0.5rem; margin-top:0.5rem;`. `.side-support-btn` — `padding:0.55rem 0.9rem; border-radius:8px; text-align:center; font-size:0.8125rem; font-weight:500; display:inline-flex; align-items:center; justify-content:center; gap:0.4rem;`. `.sponsor-kofi` / `.sponsor-paypal` — reuse the brand hover colors already in `_footer.scss` (`#ff5e5b` / `#003087`); resting state `background:var(--c-bg-soft); border:1px solid var(--c-border); color:var(--c-text);`.

- [ ] **Step 3: Use the partial in `layouts/index.html`**

Replace the old `<aside class="home-sidebar">…</aside>` block (left in place during Task 7) with `{{ partial "sidebar.html" . }}`.

- [ ] **Step 4: Build and visual check**

Run: `hugo --gc --minify`
Expected: build succeeds. The home sidebar shows three glass cards: About (avatar, name, bio, GitHub + globe icons), a Tag cloud with count badges and size variation, and a Support card with Ko-fi + PayPal buttons. Sidebar drops below the post list at mobile width.

- [ ] **Step 5: Commit**

```bash
git add layouts/partials/sidebar.html assets/scss/_sidebar.scss layouts/index.html
git commit -m "feat: glass sidebar with About, tag cloud, support cards

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: List, taxonomy, single, and post-meta restyle

Apply the shared post card to list/taxonomy pages and restyle the single-post meta.

**Files:**
- Modify: `layouts/_default/list.html`, `layouts/_default/terms.html`, `layouts/_default/single.html`, `layouts/partials/post-meta.html`, `assets/scss/_post.scss`

- [ ] **Step 1: Update `list.html` to use the post-card partial**

```go-html-template
{{ define "main" }}
<section class="list">
  <h1>{{ .Title }}</h1>
  {{- with .Content }}<div class="list-intro">{{ . }}</div>{{ end }}
  <div class="post-list">
    {{- range .Paginator.Pages }}
    {{ partial "post-card.html" . }}
    {{- end }}
  </div>
  {{- template "_internal/pagination.html" . -}}
</section>
{{ end }}
```

- [ ] **Step 2: Confirm `terms.html` — no change needed**

`layouts/_default/terms.html` renders only the taxonomy term index (a `<ul class="term-list">` of category/tag names with counts), not a post list. The `.term-list` rules survive verbatim in `_sidebar.scss` from Task 1. Leave `terms.html` unchanged; just confirm it still compiles and the term pills render with the glass-pill style after the token changes.

- [ ] **Step 3: Restyle the single-post meta — `post-meta.html`**

Rewrite `layouts/partials/post-meta.html` to a compact icon row + tag pills (no `分類：`/`標籤：` text labels; meta reads as icons like the cards):

```go-html-template
{{- $categories := .Params.categories -}}
{{- $tags := .Params.tags -}}
<div class="blog-post-meta">
  <div class="meta-row">
    <span class="meta-item"><i class="far fa-calendar-alt" aria-hidden="true"></i>
      <time datetime="{{ .Date.Format "2006-01-02" }}">{{ .Date.Format "2006年01月02日" }}</time></span>
    <span class="meta-item"><i class="far fa-clock" aria-hidden="true"></i> {{ .ReadingTime }} 分鐘閱讀</span>
    {{- with $categories }}
    <span class="meta-item"><i class="fas fa-cat" aria-hidden="true"></i>
      {{- range $i, $c := . }}{{ if $i }}、{{ end }}<a href="{{ printf "/categories/%s/" ($c | urlize) | relURL }}">{{ $c }}</a>{{ end -}}
    </span>
    {{- end }}
  </div>
  {{- with .Description }}<div class="meta-description"><p>{{ . }}</p></div>{{ end }}
  {{- with $tags }}
  <div class="meta-tags">
    {{- range . }}
    <a class="vp-pill" href="{{ printf "/tags/%s/" (. | urlize) | relURL }}">
      <i class="fas fa-hashtag" aria-hidden="true"></i>{{ . }}</a>
    {{- end }}
  </div>
  {{- end }}
</div>
```

- [ ] **Step 4: Update `_post.scss` for the new meta**

The `.blog-post-meta` / `.meta-row` / `.meta-item` / `.meta-description` rules already exist in `_post.scss` — keep them. Remove the now-unused `.meta-label` / `.meta-value` rules. Add `.meta-tags { display:flex; flex-wrap:wrap; gap:0.4rem; margin-top:0.25rem; }` (`.vp-pill` is already defined in `_post-list.scss`). Confirm `single.html` itself needs no change (it already includes `post-meta.html`); if the post `<h1>` should not be gradient, leave it — `_base.scss` `h1` is plain, which matches the design-system article title.

- [ ] **Step 5: Build and visual check**

Run: `hugo --gc --minify`
Expected: build succeeds. `/posts/` and category/tag pages render the same brand cards as the home page, with pagination. A single post shows the compact icon meta row + tag pills; in-content hint blocks, code blocks, figure cards, and the image lightbox are unchanged.

- [ ] **Step 6: Commit**

```bash
git add layouts/_default/list.html layouts/_default/terms.html layouts/_default/single.html layouts/partials/post-meta.html assets/scss/_post.scss
git commit -m "feat: brand cards on list/taxonomy pages, restyle post meta

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Footer restyle + full-site verification

Restyle the footer to the brand and do a final cross-page review.

**Files:**
- Modify: `assets/scss/_footer.scss` (and `layouts/partials/footer.html` only if needed)

- [ ] **Step 1: Restyle `_footer.scss`**

Keep the footer's two-column structure (About links + Support — Support stays here so non-home pages keep a tip entry). Update values to brand tokens:
- `.vp-footer` — `margin-top:5rem; padding:2.5rem 1.5rem 1.5rem; border-top:1px solid var(--c-border); background:transparent;` (drop the soft background so the glow shows through). `color:var(--c-text-light); font-size:0.9rem;`.
- `.vp-footer-heading` — uppercase eyebrow: `font-size:0.6875rem; letter-spacing:0.12em; color:var(--c-text-lighter);`.
- `.vp-sponsor-btn` — pill shape `border-radius:var(--radius-pill);` keep the existing brand hover colors.
- `.vp-footer-bottom` — keep centered; the heart icon stays `var(--c-brand)`.
Verify no SCSS `&-suffix`-after-descendant-combinator selectors were introduced.

- [ ] **Step 2: Full production build**

Run: `hugo --gc --minify`
Expected: build completes with **zero errors and zero warnings**. Confirm `public/index.json`, `public/about/index.html`, `public/posts/index.html`, `public/categories/index.html`, `public/tags/index.html` all exist.

- [ ] **Step 3: Cross-page visual review**

Run `hugo server --buildFuture` and review at desktop (~1280 px) and mobile (~375 px) widths, in **both** dark and light themes:
- Home: hero, post cards (with and without thumbnails), sidebar cards.
- A single post: meta row, a code block, a hint block, a figure card, image lightbox (click an image).
- `/posts/` with pagination, a category page, a tag page.
- `/about/`.
- Navbar: nav links + active state, GitHub link, theme toggle, mobile hamburger.
- Search: open via icon and via `/`, type a query, open a result, close via Esc.
Expected: every surface matches the design-system language (slate canvas, glass cards, gradient brand, pills); no horizontal scroll at 375 px; no console errors.

- [ ] **Step 4: Commit**

```bash
git add assets/scss/_footer.scss layouts/partials/footer.html
git commit -m "feat: restyle footer to brand design system

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 5: Update project docs**

Per project CLAUDE.md, the `/commit` skill syncs `SPEC.md`. Note that `SPEC.md` and `CLAUDE.md` reference the SCSS as a single `main.scss` and describe the minimal navbar — these need updating to reflect the partial structure, the full navbar, search, and the post-card partial. Run the `/commit` skill (or `spec` skill) to refresh `SPEC.md`, or flag this for the user. Do not hand-edit silently.

---

## Verification Summary

- Every task ends with `hugo --gc --minify` succeeding with zero errors.
- Task 1 is a pure refactor — output must be visually identical.
- Task 10 Step 3 is the full manual acceptance pass across all page types, both themes, both viewport sizes.
- Optional: expose `hugo server` via Tailscale (`expose-local-tailscale` skill) for phone review.
- Final integration: PR `ui-refactor` → `master` (per project CLAUDE.md branch workflow); do not push to `master` directly.
