---
title: 從 VuePress v1 升級到 v2
date: 2025-11-23
description: 將我的 blog 從 VuePress v1 升級到 v2 的過程，包括配置變更、組件遷移和效能改進
categories:
  - Dev Notes
tags:
  - vuepress
  - migration
  - vite
  - typescript
---

# 從 VuePress v1 升級到 v2

使用 VuePress v1 架設 blog 好幾年了，我決定升級到 VuePress v2，主要是想用更現代的建置系統、更好的效能，還有更好的開發體驗。  VuePress v2 帶來了不少改進，包括 Vite 打包工具、Vue 3 支援、TypeScript 支援，還有更模組化的插件架構。

這篇文章記錄了我從 VuePress v1 升級到 v2 的過程，包括遇到的問題和解決方法。

## 為什麼要升級？

VuePress v2 有幾個讓我想要升級的理由：

- **Vite 打包工具** - 建置時間比 webpack 快很多，熱模組替換也更快
- **Vue 3 支援** - 現代的 Composition API 和更好的效能
- **TypeScript 支援** - 型別安全的配置和更好的 IDE 支援
- **模組化架構** - 更好的插件系統和更靈活的客製化
- **效能改進** - 優化的打包分割和更快的頁面載入
- **更好的開發體驗** - 改進的錯誤訊息和除錯工具

::: tip
寫這篇文章的時候，VuePress v2 還在 Release Candidate (RC) 階段 (v2.0.0-rc.26)，不過已經穩定到可以上 production 了。  官方 v2 正式版應該很快就會發布。
:::

## 環境

升級時使用的環境：

- macOS (各種版本)
- Node.js v20 或更高版本
- npm (隨 Node.js 一起安裝)
- TypeScript 5.0+

::: warning
VuePress v2 需要 Node.js v16 或更高版本。  我建議使用 Node.js v20 或更高版本，體驗會比較好。
:::

## 主要變更概述

在深入細節之前，先快速看一下主要的變更：

1. **配置檔案** - 從 `config.js` (CommonJS) 變成 `config.ts` (TypeScript)
2. **組件系統** - 從 Options API 變成 Composition API (`<script setup>`)
3. **打包工具** - 從 webpack 變成 Vite
4. **樣式系統** - 從 Stylus 變成 SCSS
5. **插件系統** - 從內建功能變成模組化插件
6. **API 變更** - 新的 `defineUserConfig` API 和不同的主題配置

## 配置遷移

### 舊的配置 (v1)

在 VuePress v1，配置通常是用 JavaScript 的 CommonJS 寫的：

```javascript
// blog/.vuepress/config.js
module.exports = {
    title: 'Howar31 Blog',
    description: 'Dev Notes and Idea Sharing with ❤',
    dest: 'public',
    themeConfig: {
        nav: [
            { text: 'Home', link: '/' },
            { text: 'All Posts', link: '/all-post.md' },
        ],
        sidebar: 'auto',
    },
    plugins: [
        ['@vuepress/search', {
            searchMaxSuggestions: 10
        }],
    ],
}
```

### 新的配置 (v2)

在 VuePress v2，配置使用 TypeScript 和新的 `defineUserConfig` API：

```typescript
// blog/.vuepress/config.ts
import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { searchPlugin } from "@vuepress/plugin-search";

export default defineUserConfig({
    title: "Howar31 Blog",
    description: "Dev Notes and Idea Sharing with ❤",
    dest: "public",
    bundler: viteBundler({
        viteOptions: {
            build: {
                rollupOptions: {
                    output: {
                        manualChunks: (id: string) => {
                            if (id.includes("node_modules")) {
                                return "vendor";
                            }
                        },
                    },
                },
            },
        },
    }),
    theme: defaultTheme({
        navbar: [
            { text: "Home", link: "/" },
            { text: "All Posts", link: "/all-post.md" },
        ],
        sidebar: "auto",
    }),
    plugins: [
        searchPlugin({
            locales: {
                "/": {
                    placeholder: "Search",
                },
            },
        }),
    ],
});
```

### 主要配置變更

1. **Import 語句** - 所有功能現在都要從各自的套件 import
2. **打包工具配置** - 必須明確指定 `viteBundler`
3. **主題配置** - `themeConfig` 現在是 `theme` 函數呼叫的一部分
4. **插件格式** - 插件現在是函數而不是陣列
5. **TypeScript 支援** - 完整的 TypeScript 支援和型別檢查

::: tip
`dest` 選項在 v2 還是一樣的方式運作，所以你的建置輸出目錄不需要改變。
:::

## 組件遷移

最顯著的變更之一，就是把 Vue 組件從 Options API 遷移到 Composition API。

### 舊的組件 (v1 - Options API)

```vue
<template>
  <div class="blog-index-list">
    <table>
      <tbody>
        <tr v-for="post in posts">
          <td>{{ formateDate(post.frontmatter.date) }}</td>
          <td><router-link :to="post.path">{{ post.frontmatter.title }}</router-link></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from "moment"

export default {
  props: ['limit'],
  methods: {
    formateDate(date, format = 'YYYY-MM-DD') {
      return moment(date).format(format)
    },
  },
  computed: {
    posts() {
      let posts = this.$site.pages
        .filter(post => !post.frontmatter.blog_index)
        .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));

      if (this.limit > 0) {
        posts = posts.slice(0, this.limit);
      }

      return posts;
    }
  }
}
</script>
```

### 新的組件 (v2 - Composition API)

```vue
<template>
    <div class="blog-index-list">
        <div class="list-item" v-for="post in posts" :key="post.path">
            <div class="list-item-title">
                <span class="post-title">
                    <router-link :to="post.path">{{ post.title || post.path || "Untitled" }}</router-link>
                </span>
            </div>
            <div class="list-item-meta" v-if="post.date">
                <span class="post-date">
                    <i class="far fa-clock"></i>
                    {{ formateDate(post.date) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoutes } from "@vuepress/client";
import moment from "moment";

const props = defineProps({
    limit: {
        type: [Number, String],
        default: 0,
    },
});

const routes = useRoutes();
const allPages = ref([]);

onMounted(async () => {
    // 非同步載入頁面資料
    // ... 實作細節
});

const formateDate = (date, format = "YYYY-MM-DD") => {
    if (!date) return "";
    return moment(date).format(format);
};

const posts = computed(() => {
    // 過濾和排序文章
    // ... 實作細節
});
</script>
```

### 主要組件變更

1. **`<script setup>`** - 使用 Composition API 語法
2. **`useRoutes()`** - 新的 API 來存取路由，取代 `$site.pages`
3. **非同步資料載入** - 頁面資料必須非同步載入
4. **Props 定義** - 使用 `defineProps()` 而不是 `props` 選項
5. **計算屬性** - 使用 `computed()` 函數而不是 `computed` 選項

::: warning
`$site` 和 `$page` 全域變數在 v2 已經不能用了。  你需要使用新的 composables，像是 `useRoutes()` 和 `usePageData()`。
:::

## 打包工具變更：Webpack 到 Vite

VuePress v2 使用 Vite 而不是 webpack，帶來顯著的效能改進。

### 建置效能

- **更快的建置時間** - Vite 基於 esbuild 的打包比 webpack 快很多
- **更快的 HMR** - 熱模組替換幾乎是即時的
- **更好的 Tree Shaking** - 更有效率的死碼消除

### Vite 配置

你可以透過 `viteBundler` 選項來自訂 Vite 的行為：

```typescript
bundler: viteBundler({
    viteOptions: {
        build: {
            rollupOptions: {
                output: {
                    manualChunks: (id: string) => {
                        // 把所有 vendor 程式碼合併成單一個 chunk
                        if (id.includes("node_modules")) {
                            return "vendor";
                        }
                    },
                },
            },
        },
        chunkSizeWarningLimit: 1000,
    },
}),
```

這個配置可以透過合併 vendor 程式碼成單一個 chunk，來減少 HTTP 請求的數量。

::: tip
Vite 的開發伺服器啟動速度比 webpack 快很多，開發體驗好很多。
:::

## 樣式系統變更

### 從 Stylus 到 SCSS

VuePress v1 預設使用 Stylus，而 v2 使用 SCSS。  這個變更需要更新你的樣式檔案。

**舊的 (Stylus)：**

```stylus
// blog/.vuepress/override.styl
$accentColor = #3eaf7c
$textColor = #2c3e50
```

**新的 (SCSS)：**

```scss
// blog/.vuepress/styles/index.scss
:root {
  --c-brand: #3b82f6;
  --c-text: #1e293b;
  --c-bg: #ffffff;
}
```

### 深色模式支援

VuePress v2 有更好的深色模式支援。  你可以使用 CSS 變數和 `[data-theme="dark"]` 選擇器：

```scss
html[data-theme="dark"],
[data-theme="dark"] {
  --c-bg: rgb(0, 0, 0);
  --c-text: #ffffff;
  --c-border: rgba(255, 255, 255, 0.1);
}
```

## 插件系統變更

### 舊的插件格式 (v1)

```javascript
plugins: [
    ['@vuepress/search', {
        searchMaxSuggestions: 10
    }],
    ['@vuepress/pwa', {
        serviceWorker: true,
    }],
]
```

### 新的插件格式 (v2)

```typescript
import { searchPlugin } from "@vuepress/plugin-search";
import { pwaPlugin } from "@vuepress/plugin-pwa";

plugins: [
    searchPlugin({
        locales: {
            "/": {
                placeholder: "Search",
            },
        },
    }),
    pwaPlugin({
        serviceWorker: true,
        updatePopup: true,
    }),
]
```

### 主要插件變更

1. **需要 Import** - 插件必須從各自的套件 import
2. **函數呼叫** - 插件現在是函數而不是陣列
3. **型別安全** - TypeScript 提供更好的插件選項型別檢查
4. **模組化套件** - 每個插件都是獨立的 npm 套件

## Package.json 變更

### 依賴更新

**舊的 (v1)：**

```json
{
  "dependencies": {
    "vuepress": "^1.8.0"
  }
}
```

**新的 (v2)：**

```json
{
  "dependencies": {
    "vuepress": "^2.0.0-rc.26",
    "moment": "^2.29.1"
  },
  "devDependencies": {
    "@vuepress/bundler-vite": "^2.0.0-rc.26",
    "@vuepress/plugin-google-analytics": "^2.0.0-rc.26",
    "@vuepress/plugin-pwa": "^2.0.0-rc.26",
    "@vuepress/plugin-search": "^2.0.0-rc.26",
    "@vuepress/theme-default": "^2.0.0-rc.26",
    "@types/node": "^20.0.0",
    "sass-embedded": "^1.93.3",
    "typescript": "^5.0.0"
  }
}
```

::: warning
因為 VuePress v2 RC 版本的 peer dependency 衝突，安裝依賴時可能需要使用 `npm install --legacy-peer-deps`。
:::

## 遇到的問題和解決方法

遷移過程中遇到了一些問題。  以下是主要的問題和我的解決方法：

### 問題 1：`$site` 和 `$page` 不能用了

**問題：** 依賴 `this.$site.pages` 或 `this.$page` 的組件不能運作了。

**解決方法：** 改用新的 composables `useRoutes()` 和 `usePageData()`。  不過要注意，路由資料在 v2 必須非同步載入。

```typescript
import { useRoutes } from "@vuepress/client";

const routes = useRoutes();
// 路由資料在 routes.value 裡面
```

### 問題 2：組件資料載入

**問題：** BlogIndex 組件需要載入頁面資料，但 v1 的同步存取方式不能用了。

**解決方法：** 實作了批次載入，用 async/await 來漸進式載入頁面資料：

```typescript
onMounted(async () => {
    const batchSize = 5;
    for (let i = 0; i < validRoutes.length; i += batchSize) {
        const batch = validRoutes.slice(i, i + batchSize);
        const batchPromises = batch.map(async ([path, route]) => {
            const module = await route.loader();
            // 處理頁面資料
        });
        await Promise.all(batchPromises);
    }
});
```

### 問題 3：樣式系統遷移

**問題：** 現有的 Stylus 樣式需要轉換成 SCSS。

**解決方法：** 手動把所有 Stylus 檔案轉換成 SCSS，利用 CSS 變數來獲得更好的主題支援。

### 問題 4：Peer Dependency 衝突

**問題：** npm install 因為 VuePress v2 RC 套件之間的 peer dependency 衝突而失敗。

**解決方法：** 安裝時使用 `--legacy-peer-deps` 參數：

```bash
npm install --legacy-peer-deps
```

### 問題 5：TypeScript 配置

**問題：** 配置檔案出現 TypeScript 錯誤。

**解決方法：** 建立 `tsconfig.json`，設定適合 VuePress v2 的配置：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

## 效能改進

遷移之後，我注意到幾個效能改進：

1. **更快的建置時間** - 建置時間減少了大約 60%
2. **更快的 HMR** - 熱重載幾乎是即時的
3. **更小的打包大小** - 更好的 tree shaking 和程式碼分割
4. **更快的頁面載入** - 優化的 chunk 分割減少 HTTP 請求

BlogIndex 組件也因為批次載入而受益，改善了初始頁面載入時間。

## 遷移檢查清單

如果你打算把自己的 VuePress v1 網站遷移到 v2，這裡有個檢查清單：

- [ ] 更新 Node.js 到 v16 或更高版本
- [ ] 更新 `package.json` 依賴
- [ ] 把 `config.js` 轉換成 `config.ts`
- [ ] 更新配置使用新 API
- [ ] 把組件從 Options API 遷移到 Composition API
- [ ] 把 Stylus 樣式轉換成 SCSS
- [ ] 更新插件配置
- [ ] 測試所有組件和頁面
- [ ] 如果需要，更新 CI/CD 配置
- [ ] 測試建置和部署流程

## 結論

從 VuePress v1 遷移到 v2 是個大工程，但好處很值得。  現代的建置系統、改進的效能，還有更好的開發體驗，讓 v2 成為一個值得升級的選擇。

主要的挑戰是：

- 理解新的 API 和組件系統
- 把組件從 Options API 遷移到 Composition API
- 把樣式從 Stylus 轉換成 SCSS
- 處理組件中的非同步資料載入

不過，有了官方遷移指南和一些耐心，遷移過程是可以管理的。  效能改進和現代工具讓這個投資很值得。

::: tip
如果你打算遷移，我建議先讀一下[官方 VuePress v2 遷移指南](https://v2.vuepress.vuejs.org/guide/migration.html)，然後逐步進行遷移，邊做邊測試。
:::

## 參考資料

- [VuePress v2 文件](https://v2.vuepress.vuejs.org/)
- [VuePress v2 遷移指南](https://v2.vuepress.vuejs.org/guide/migration.html)
- [Vite 文件](https://vitejs.dev/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
