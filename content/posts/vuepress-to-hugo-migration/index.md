---
title: 升上 VuePress v2 RC 五個月後，決定再遷移到 Hugo 的紀錄
date: 2026-04-22
description: 升 v2 RC 才 5 個月就決定再搬一次 — 選型、遷移、踩雷、以及最後的結果
categories:
  - hugo
tags:
  - hugo
  - vuepress
  - migration
  - static-site
  - dev-notes
---

## 前言

2025 年 11 月才剛從 VuePress v1.8 升上 v2.0.0-rc.26，本以為至少能安穩用個幾年。結果升完五個月就遇到一堆問題，最後在 2026 年 4 月決定**再搬一次**，這次換到 Hugo。

這篇記錄從評估、選型、遷移、踩雷到最後部署上線的完整過程，順便也拿這篇當 component 測試文，把 Hugo 版型的 code block、tip、warning、表格、SVG、taxonomy 一次全部跑過。

## 為什麼升 v2 才 5 個月就要再搬？

升級前以為是一次「大幅刷新但之後穩定」的投資。升完才真正理解現狀：

- **VuePress v2 本身自 2022 就卡在 RC**，到 2026 仍然沒有 stable。這個「卡 RC 3+ 年」的背景是在**升上去之後**才有切身感受
- **插件生態沒跟上**：v1 時期依賴的若干插件在 v2 沒有對應版本，有些甚至上游直接放棄維護
- **RC 階段的 theme API 仍會 breaking change**：升 v2 時已經改了一次 theme，完全不想再因為某次 RC 升級又全部改一次
- **Dev server 啟動 30 秒**：寫文章的摩擦大到開了就忘記要寫什麼

與其繼續賭 v2 什麼時候脫 RC，不如直接換到**生態穩定、建置極快**的工具。於是評估了 Astro、Next.js、Eleventy、Hugo，最後選 Hugo：

| 候選 | 建置速度 | 生態穩定度 | Runtime 依賴 | 主要缺點 |
|---|---|---|---|---|
| **Hugo** | 極快（幾百毫秒） | 十年以上穩定 | Go binary | 模板語法較陌生 |
| Astro | 中等 | 快速演進中 | Node.js | 還在 breaking changes |
| Next.js | 慢（依頁面數成長） | 成熟但偏 App | Node.js | 對靜態部落格 overkill |
| Eleventy | 快 | 小眾但穩定 | Node.js | template 選擇多到雜亂 |

Hugo 的勝出原因很簡單：**Go 寫的單一執行檔、零 Node.js、零 npm、template 語法雖然怪但至少不會自己 breaking change**。

## 架構對比

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 540" role="img" aria-label="VuePress 與 Hugo 架構堆疊對比" style="max-width:100%;height:auto;display:block;margin:1.5rem auto;">
  <style>
    .t-title{font:bold 18px -apple-system,"Helvetica Neue",Arial,sans-serif;}
    .t-box{font:13px -apple-system,"Helvetica Neue",Arial,sans-serif;fill:currentColor;}
    .vp-color{fill:#42b883;}
    .hugo-color{fill:#ff4088;}
    .box-before{fill:rgba(66,184,131,0.08);stroke:rgba(66,184,131,0.55);stroke-width:1.5;}
    .box-after{fill:rgba(255,64,136,0.08);stroke:rgba(255,64,136,0.55);stroke-width:1.5;}
    .divider{stroke:currentColor;stroke-width:1;stroke-dasharray:4 4;opacity:0.3;}
    .sub{font:11px -apple-system,"Helvetica Neue",Arial,sans-serif;fill:currentColor;opacity:0.6;}
  </style>
  <text x="190" y="30" text-anchor="middle" class="t-title vp-color">Before · VuePress v2 RC</text>
  <rect class="box-before" x="60" y="50" width="260" height="38" rx="6"/>
  <text x="190" y="74" text-anchor="middle" class="t-box">Node.js runtime (≥ 20)</text>
  <rect class="box-before" x="60" y="100" width="260" height="38" rx="6"/>
  <text x="190" y="124" text-anchor="middle" class="t-box">npm (≈ 900 packages)</text>
  <rect class="box-before" x="60" y="150" width="260" height="38" rx="6"/>
  <text x="190" y="174" text-anchor="middle" class="t-box">Vite bundler</text>
  <rect class="box-before" x="60" y="200" width="260" height="38" rx="6"/>
  <text x="190" y="224" text-anchor="middle" class="t-box">Vue 3 runtime</text>
  <rect class="box-before" x="60" y="250" width="260" height="38" rx="6"/>
  <text x="190" y="274" text-anchor="middle" class="t-box">VuePress v2 core (RC)</text>
  <rect class="box-before" x="60" y="300" width="260" height="38" rx="6"/>
  <text x="190" y="324" text-anchor="middle" class="t-box">@vuepress/theme-default</text>
  <rect class="box-before" x="60" y="350" width="260" height="38" rx="6"/>
  <text x="190" y="374" text-anchor="middle" class="t-box">PWA + Search plugins</text>
  <rect class="box-before" x="60" y="400" width="260" height="38" rx="6"/>
  <text x="190" y="424" text-anchor="middle" class="t-box">4 custom Vue components</text>
  <text x="190" y="465" text-anchor="middle" class="sub">建置時：整棵 npm 依賴樹</text>
  <text x="190" y="485" text-anchor="middle" class="sub">執行時：靜態 HTML + Vue hydration</text>
  <line x1="400" y1="50" x2="400" y2="490" class="divider"/>
  <text x="610" y="30" text-anchor="middle" class="t-title hugo-color">After · Hugo</text>
  <rect class="box-after" x="480" y="50" width="260" height="38" rx="6"/>
  <text x="610" y="74" text-anchor="middle" class="t-box">Hugo binary (單一 Go 執行檔 ≈ 30MB)</text>
  <rect class="box-after" x="480" y="100" width="260" height="38" rx="6"/>
  <text x="610" y="124" text-anchor="middle" class="t-box">Goldmark (內建 markdown)</text>
  <rect class="box-after" x="480" y="150" width="260" height="38" rx="6"/>
  <text x="610" y="174" text-anchor="middle" class="t-box">Prism.js bundle (build-time fetch)</text>
  <rect class="box-after" x="480" y="200" width="260" height="38" rx="6"/>
  <text x="610" y="224" text-anchor="middle" class="t-box">純 HTML / CSS / JS 輸出</text>
  <text x="610" y="465" text-anchor="middle" class="sub">建置時：一顆二進位檔</text>
  <text x="610" y="485" text-anchor="middle" class="sub">執行時：純靜態、無 hydration</text>
</svg>

VuePress 時代整個堆疊是「Node.js 生態的所有東西」；Hugo 時代收斂成一顆 30MB 執行檔加上 Go template。執行時端也更乾淨：以前送到瀏覽器的還有 Vue 的 hydration runtime，現在純粹是 HTML + 少量 vanilla JS。

## 遷移計畫

整個遷移拆成 3 個 phase：

1. **Phase 1**：建立 Hugo 骨架、搬 53 篇文章、1:1 對齊原本的視覺
2. **Phase 2**：手機版 bug 修正（hamburger menu、iOS Safari 圓環）
3. **Phase 3**：清理舊 VuePress、部署、prod smoke test

{{< tip "先讓內容可讀，再補視覺" >}}
每個 phase 都獨立可 commit、可回朔。Phase 1 做完其實 UI 還很陽春，但**文章已經全部能正確 render**，那時就可以先發版（或先切 dev server 給自己看），再慢慢補版型細節。這個順序讓心理壓力大幅下降，隨時可以停。
{{< /tip >}}

## 關鍵實作

### 文章搬移

53 篇分成兩批來源：11 篇 VuePress 時代的新文章放在 `blog/<slug>/README.md`，42 篇 WordPress archive 放在 `blog/wordpress/<slug>/index.md`。全部統一搬到 `content/posts/<slug>/index.md`（Hugo 的 [page bundle](https://gohugo.io/content-management/page-bundles/)）：

```bash
# 11 篇 VuePress 時代文章
for dir in blog/*/; do
  slug=$(basename "$dir")
  [ "$slug" = "wordpress" ] && continue
  [ "$slug" = ".vuepress" ] && continue
  mkdir -p "content/posts/$slug"
  cp -r "$dir"* "content/posts/$slug/"
  mv "content/posts/$slug/README.md" "content/posts/$slug/index.md"
done

# 42 篇 WordPress archive
cp -r blog/wordpress/*/ content/posts/
```

Archive 的 frontmatter 只有 `title` 和 `date`，**統一補上 `categories: [wordpress]`** 方便未來篩選與搜尋。新文章的 frontmatter 長這樣：

```yaml
---
title: Discord 完全隱藏封鎖的訊息
date: 2026-01-01
description: 使用 CSS injection 完全隱藏 Discord 中被封鎖或忽略的訊息提示
categories:
  - vuepress
tags:
  - discord
  - css
  - dev-notes
---
```

Hugo 原生支援這些欄位，不需要轉換。

### Prism.js build-time bundle

客戶端 syntax highlighting 用 Prism.js，但不想 runtime 打 CDN（會慢、會有失敗風險、也會洩漏使用者資訊給第三方）。Hugo 的 `resources.GetRemote` 正好可以在 build 時把所有 Prism 片段抓下來、concat、minify、fingerprint，最後輸出帶 SRI 的 `<script>` tag。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 260" role="img" aria-label="Prism.js build-time bundle pipeline" style="max-width:100%;height:auto;display:block;margin:1.5rem auto;">
  <style>
    .node{fill:rgba(96,165,250,0.08);stroke:rgba(96,165,250,0.55);stroke-width:1.5;}
    .node-out{fill:rgba(196,181,253,0.12);stroke:rgba(196,181,253,0.65);stroke-width:1.5;}
    .t-node{font:12px -apple-system,"Helvetica Neue",Arial,sans-serif;fill:currentColor;}
    .t-sub{font:10px -apple-system,"Helvetica Neue",Arial,sans-serif;fill:currentColor;opacity:0.55;}
    .t-phase{font:bold 12px -apple-system,"Helvetica Neue",Arial,sans-serif;fill:currentColor;opacity:0.75;}
    .arrow{stroke:currentColor;stroke-width:1.5;fill:none;opacity:0.55;}
    .phase-band{fill:currentColor;opacity:0.05;}
  </style>
  <rect class="phase-band" x="20" y="70" width="690" height="100" rx="8"/>
  <text x="365" y="62" text-anchor="middle" class="t-phase">Build time</text>
  <rect class="phase-band" x="720" y="70" width="165" height="100" rx="8"/>
  <text x="802" y="62" text-anchor="middle" class="t-phase">Runtime</text>
  <rect class="node" x="35" y="95" width="120" height="50" rx="6"/>
  <text x="95" y="118" text-anchor="middle" class="t-node">21 × CDN URLs</text>
  <text x="95" y="134" text-anchor="middle" class="t-sub">core + grammars + plugins</text>
  <path class="arrow" d="M 160 120 L 195 120 M 190 115 L 200 120 L 190 125"/>
  <rect class="node" x="200" y="95" width="110" height="50" rx="6"/>
  <text x="255" y="118" text-anchor="middle" class="t-node">GetRemote</text>
  <text x="255" y="134" text-anchor="middle" class="t-sub">try + err handle</text>
  <path class="arrow" d="M 315 120 L 350 120 M 345 115 L 355 120 L 345 125"/>
  <rect class="node" x="355" y="95" width="90" height="50" rx="6"/>
  <text x="400" y="118" text-anchor="middle" class="t-node">Concat</text>
  <text x="400" y="134" text-anchor="middle" class="t-sub">載入順序</text>
  <path class="arrow" d="M 450 120 L 485 120 M 480 115 L 490 120 L 480 125"/>
  <rect class="node" x="490" y="95" width="70" height="50" rx="6"/>
  <text x="525" y="120" text-anchor="middle" class="t-node">Minify</text>
  <path class="arrow" d="M 565 120 L 595 120 M 590 115 L 600 120 L 590 125"/>
  <rect class="node" x="600" y="95" width="95" height="50" rx="6"/>
  <text x="647" y="118" text-anchor="middle" class="t-node">Fingerprint</text>
  <text x="647" y="134" text-anchor="middle" class="t-sub">SHA-384</text>
  <path class="arrow" d="M 700 120 L 725 120 M 720 115 L 730 120 L 720 125"/>
  <rect class="node-out" x="730" y="82" width="145" height="76" rx="6"/>
  <text x="802" y="108" text-anchor="middle" class="t-node">&lt;script defer</text>
  <text x="802" y="124" text-anchor="middle" class="t-node">  src="prism.abc.js"</text>
  <text x="802" y="140" text-anchor="middle" class="t-node">  integrity="sha384..."&gt;</text>
  <text x="802" y="156" text-anchor="middle" class="t-sub">自家 origin · 65 KB</text>
  <text x="450" y="210" text-anchor="middle" class="t-sub">每次 deploy 固定一次 fetch，之後 Cloudflare + 瀏覽器 cache 接手</text>
  <text x="450" y="228" text-anchor="middle" class="t-sub">無 runtime CDN 依賴 · SRI 防 bundle 竄改 · fingerprint 自動 cache bust</text>
</svg>

Hugo template 長這樣：

```html
{{ $urls := slice
  "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"
  "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-markup-templating.min.js"
  "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-bash.min.js"
}}
{{ $parts := slice }}
{{ range $urls }}
  {{ with try (resources.GetRemote .) }}
    {{ with .Err }}{{ errorf "fetch failed: %s" . }}{{ end }}
    {{ with .Value }}{{ $parts = $parts | append . }}{{ end }}
  {{ end }}
{{ end }}
{{ $bundle := $parts | resources.Concat "js/prism.js" | minify | fingerprint }}
<script defer src="{{ $bundle.RelPermalink }}"
        integrity="{{ $bundle.Data.Integrity }}"></script>
```

結果：**0 個 runtime CDN fetch**，且 SRI 防止中間人竄改 bundle。Prism 的 language badge、複製按鈕、行號三個 plugin 全部跟著這包一起送。最終 JS bundle 約 65 KB（minified），相比每次打 21 個 CDN request 好非常多。

### SCSS 在 libsass 的地雷

libsass 對 `&-suffix` 的展開跟 dart-sass 不一致。下面這種寫法會**重複 ancestor**：

```scss
.vp-navbar {
  .vp-nav-dropdown {
    &.open &-menu {
      display: flex;
    }
  }
}
```

libsass 編譯出來：

```css
.vp-navbar .vp-nav-dropdown.open .vp-navbar .vp-nav-dropdown-menu {
  display: flex;
}
```

注意 `.vp-navbar` 被**重複**了。DOM 上不可能 match 這個 selector，行為上就是**整條規則徹底失效**。

{{< warning "libsass 與 dart-sass 行為不同" >}}
這個 bug 只在 libsass 出現。Hugo 0.153+ 已把 libsass 標為 deprecated，未來強制改用 dart-sass 之後這段展開會變正確。但**現在（2026-04）仍在用 libsass**，所以同樣的 SCSS 在舊版 Hugo 上是壞的、新版會正常 — 過渡期最好主動避開 `&-suffix` after 後代選擇器。
{{< /warning >}}

正確寫法是把 class name 寫完整：

```scss
.vp-navbar {
  .vp-nav-dropdown {
    &.open .vp-nav-dropdown-menu {  // 明寫 class 名，不要用 &-menu
      display: flex;
    }
  }
}
```

### iOS Safari ≤ 16 的 SVG 地雷

Back-to-top 按鈕用 SVG 圓環表示捲動進度，原本幾何屬性 `cx` / `cy` / `r` 寫在 SCSS（**CSS SVG Geometry Module**）：

```scss
.back-to-top-bar {
  cx: 23;
  cy: 23;
  r: 21;
}
```

iOS Safari ≤ 16 **不支援這個 module**，舊版 iOS 看到的 `cx` / `cy` / `r` 全部是 0，圓圈畫不出來。修法是把這三個值移回 HTML attribute：

```html
<circle class="back-to-top-bar" cx="23" cy="23" r="21" />
```

{{< tip >}}
CSS SVG Geometry 是相對新的規格（2021-2022 才開始被各家瀏覽器支援）。處理 SVG 幾何屬性時，如果考慮移動裝置使用者，建議全部寫 HTML attribute，不要用 CSS。
{{< /tip >}}

（順帶一提，這篇文章中的三張示意圖全部是 inline SVG，`r` / `cx` / `cy` 都寫在 HTML attribute — 現在讀到這裡的你如果看得到上面兩張流程圖，代表這個 bug 沒有 regression。）

### Taxonomy 統一：lowercase-dash

原本 VuePress 時代 tag / category 混用三種 style：

- Title Case：`Dev Notes`
- All Caps：`CSS`
- lowercase-dash：`dev-notes`

不同頁面顯示還不一致（sidebar 小寫、post-meta 原樣、URL 又是另一種）。Hugo 遷移時統一改成 **lowercase-dash**，且 **template 內完全沒有 humanize / title-case 轉換**：

```yaml
tags:
  - dev-notes       # 不是 Dev Notes
  - css             # 不是 CSS
  - ci-cd           # 不是 CI/CD
```

**Frontmatter 值 = URL slug = 顯示字串**，三位一體，永遠一致。這樣也避免了「我到底要用哪一版」的心智負擔。

## 踩雷紀錄

遷移過程中掉過的其他坑：

- `hugo server --buildFuture` 一定要加，否則未來日期的草稿文章會被跳過
- `[markup.highlight].codeFences = false` 要手動加，否則 Hugo 的 Chroma highlighter 會攔截所有 fenced code block，輪不到 Prism 上
- `[markup.goldmark.renderer].unsafe = true` 要加，否則舊 archive 裡的 raw HTML（`<center>`、`<font>`）全部變成 escaped 字串
- 移除 `[[menu.main]]` 後要**同步改 header partial** 不要再 iterate `site.Menus.main`，否則會出現一個空的 nav bar
- Hugo 0.141+ 把 `resources.GetRemote` 的 `.Err` 行為改了，要用 `try` wrapper 包起來
- `hugo --minify` 產出的 HTML 會合併 class 屬性，任何依賴 class 順序的 selector 都要測試一次

## 成果

從「想寫文章 → 看到 preview」的時間：

| 指標 | VuePress 2 RC | Hugo | 差距 |
|---|---|---|---|
| Dev server 啟動 | ≈ 30 秒 | ≈ 200 毫秒 | **150x** |
| 全量 build | ≈ 45 秒 | ≈ 800 毫秒 | **56x** |
| 依賴數 (npm install) | ≈ 900 packages | 0 packages | — |
| 客戶端 JS (初版) | ≈ 180 KB | 1.5 KB + 65 KB Prism | **2.7x 小** |
| Runtime 依賴 | Node.js ≥ 20 | 無 | — |
| Lighthouse (mobile) | 70-80 | 95+ | — |

> 最實用的其實不是速度本身，而是「**開了就能寫**」。以前要等 30 秒 dev server 暖機，中間就會手滑去滑手機，然後完全忘了要寫什麼。

## 部落格演進

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 220" role="img" aria-label="部落格 stack 演進 timeline" style="max-width:100%;height:auto;display:block;margin:1.5rem auto;">
  <style>
    .t-era{font:bold 14px -apple-system,"Helvetica Neue",Arial,sans-serif;fill:currentColor;}
    .t-year{font:11px -apple-system,"Helvetica Neue",Arial,sans-serif;fill:currentColor;opacity:0.6;}
    .t-note{font:11px -apple-system,"Helvetica Neue",Arial,sans-serif;fill:currentColor;opacity:0.7;}
    .line{stroke:currentColor;stroke-width:2;opacity:0.3;}
    .dot-wp{fill:rgba(33,117,155,0.2);stroke:#21759b;stroke-width:3;}
    .dot-vp1{fill:rgba(66,184,131,0.2);stroke:#42b883;stroke-width:3;}
    .dot-vp2{fill:rgba(66,184,131,0.1);stroke:#42b883;stroke-width:3;stroke-dasharray:3 2;}
    .dot-hugo{fill:rgba(255,64,136,0.2);stroke:#ff4088;stroke-width:3;}
  </style>
  <line x1="60" y1="110" x2="840" y2="110" class="line"/>
  <circle cx="110" cy="110" r="10" class="dot-wp"/>
  <text x="110" y="80" text-anchor="middle" class="t-era">WordPress</text>
  <text x="110" y="140" text-anchor="middle" class="t-year">≈ 2008</text>
  <text x="110" y="160" text-anchor="middle" class="t-note">PHP · MySQL</text>
  <text x="110" y="177" text-anchor="middle" class="t-note">pre-git era</text>
  <circle cx="340" cy="110" r="10" class="dot-vp1"/>
  <text x="340" y="80" text-anchor="middle" class="t-era">VuePress v1</text>
  <text x="340" y="140" text-anchor="middle" class="t-year">2019-03 - 2025-11</text>
  <text x="340" y="160" text-anchor="middle" class="t-note">Vue 2 · Webpack</text>
  <text x="340" y="177" text-anchor="middle" class="t-note">約 6.5 年</text>
  <circle cx="560" cy="110" r="10" class="dot-vp2"/>
  <text x="560" y="80" text-anchor="middle" class="t-era">VuePress v2 RC</text>
  <text x="560" y="140" text-anchor="middle" class="t-year">2025-11 - 2026-04</text>
  <text x="560" y="160" text-anchor="middle" class="t-note">Vue 3 · Vite</text>
  <text x="560" y="177" text-anchor="middle" class="t-note">只撐 5 個月</text>
  <circle cx="780" cy="110" r="10" class="dot-hugo"/>
  <text x="780" y="80" text-anchor="middle" class="t-era">Hugo</text>
  <text x="780" y="140" text-anchor="middle" class="t-year">2026-04 -</text>
  <text x="780" y="160" text-anchor="middle" class="t-note">Go binary</text>
  <text x="780" y="177" text-anchor="middle" class="t-note">零 Node.js</text>
  <path d="M 838 104 L 850 110 L 838 116" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
</svg>

從 2008 年還在用 WordPress、2019 年搬到 VuePress v1、2025 年 11 月才剛升 v2 RC、五個月後再搬到 Hugo — 算下來 18 年、三次大遷移，最近兩次還剛好擠在半年之內。每次換 stack 都會寫一篇「為什麼要換」的文章，幾年後回頭看都會苦笑。這次記錄下來的東西未來 Hugo 也會過時，那時再看應該還是會苦笑 — 但至少中間幾年可以專心寫文章，不用跟工具鏈打架。

## 結語

技術選型沒有永遠的答案，只有**當下最合適的取捨**。選 Hugo 不代表它最好，而是它最符合「我想寫文章的時候不要有摩擦」這個目標。

同樣地，半年前選擇升 v2 RC 也不是錯誤決定 — 那時的資訊就是那樣，當下的選擇也合理。只是升完後才看清 VuePress v2 這個 RC 背後的長期狀況，判斷變了，就再搬一次。這種事沒辦法完全預防，只能讓「再搬一次」的成本越低越好，而這又回到同一個結論：**選生態穩定的工具**，下次再搬的機會就會小。

{{< tip "給也在考慮遷移的人" >}}
別一口氣重寫太多。先以「**內容可讀 + 基本版面可看**」為第一里程碑發版，再慢慢補視覺細節。這次我是先砍到最原始版型跑通，再一點一點把 VuePress 的 dark mode glow、gradient title、圖標 meta 加回來。中間任何時候都可以停下來 commit、都可以回朔，壓力小很多。
{{< /tip >}}

---

*本文同時作為 Hugo 遷移後的 component 測試文，內容涵蓋多語言 code block（含複製按鈕、行號、語言 badge）、tip / warning callout、inline SVG、表格、blockquote、dark mode 切換、Prism 語法標記。如果你看到這篇文章每個元件都正確顯示，代表整個系統在工作。*
