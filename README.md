# Howar31 Blog VuePress

Personal blog built with VuePress v2, featuring modern web technologies and automatic deployment to GitHub Pages.

## 🚀 Features

- **VuePress v2** - Modern static site generator (migrated from v1.8.0)
- **Vite Bundler** - Fast build and hot module replacement with optimized chunk configuration
- **Custom Theme** - Clean and responsive design matching main website style with dark mode support
- **Performance Optimized** - Optimized Vite build configuration and BlogIndex batch loading
- **Search** - Full-text search functionality
- **PWA** - Progressive Web App with offline support
- **Google Analytics** - Website analytics integration
- **Auto Deployment** - Automatic deployment to GitHub Pages via GitHub Actions

## 📋 Prerequisites

- **Node.js** v20 or higher
- **npm** (comes with Node.js)
- **nvm** (recommended for Node.js version management)

## 🛠️ Installation

### 1. Install Node.js v20 using nvm

```bash
# Install nvm (if not already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# Reload shell configuration
source ~/.zshrc  # or ~/.bashrc

# Install Node.js v20
nvm install 20

# Use Node.js v20
nvm use 20
```

### 2. Clone the repository

```bash
git clone git@github.com:howar31/howar31-blog-vuepress.git
cd howar31-blog-vuepress
```

### 3. Install dependencies

```bash
npm install --legacy-peer-deps
```

> **Note:** The `--legacy-peer-deps` flag is required due to peer dependency conflicts between VuePress v2 RC versions.

## 🏃 Development

Start the development server:

```bash
npm run blog:dev
```

The site will be available at `http://localhost:8080` with hot module replacement.

## 🏗️ Build

Build the site for production:

```bash
npm run blog:build
```

The built files will be in the `public/` directory.

## 📁 Project Structure

```
howar31-blog-vuepress/
├── blog/                          # Blog content directory
│   ├── .vuepress/
│   │   ├── components/            # Custom Vue components
│   │   │   ├── BlogIndex.vue      # Blog post list component (with batch loading)
│   │   │   └── DynamicFooter.vue # Dynamic footer component
│   │   ├── styles/                # Custom styles
│   │   │   └── index.scss         # Custom theme styles matching main website
│   │   ├── config.mjs             # VuePress configuration
│   │   └── client.js              # Client-side configuration
│   ├── wordpress/                 # Archived WordPress posts
│   └── *.md                       # Blog posts
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions deployment workflow
├── public/                        # Build output directory (generated)
├── package.json                   # Project dependencies
└── README.md                      # This file
```

## 🚢 Deployment

This project uses GitHub Actions for automatic deployment to GitHub Pages.

### Automatic Deployment

1. Push changes to `master` or `main` branch
2. GitHub Actions will automatically:
   - Install dependencies (using `npm ci --legacy-peer-deps`)
   - Build the site with optimized Vite configuration
   - Deploy to GitHub Pages

> **Note:** The deployment workflow uses `--legacy-peer-deps` flag to handle VuePress v2 RC peer dependency conflicts.

**Deployment Triggers:**
- Changes to `blog/` directory (content, configuration, styles, components)
- Changes to `package.json` or `package-lock.json` (dependencies)
- Changes to other files that affect the build

**Excluded from Deployment:**
- `README.md` - Documentation only
- `.cursor/` - IDE configuration
- `.github/` - GitHub configuration (including workflow files)
- `LICENSE` - License file
- `.gitignore` - Git ignore rules

## 🔧 Configuration

Main configuration file: `blog/.vuepress/config.mjs`

Key configurations:
- **Theme**: Default theme with custom styles matching main website design
- **Plugins**: Search, Google Analytics, PWA
- **Build Output**: `public/` directory
- **Vite Optimization**: Optimized chunk splitting to reduce HTTP requests
- **Performance**: BlogIndex component with batch loading optimization

## 📦 Dependencies

### Core
- `vuepress@^2.0.0-rc.26` - VuePress framework
- `@vuepress/bundler-vite@^2.0.0-rc.26` - Vite bundler
- `@vuepress/theme-default@^2.0.0-rc.26` - Default theme

### Plugins
- `@vuepress/plugin-search@^2.0.0-rc.26` - Search functionality
- `@vuepress/plugin-google-analytics@^2.0.0-rc.26` - Google Analytics
- `@vuepress/plugin-pwa@^2.0.0-rc.26` - Progressive Web App

### Utilities
- `moment@^2.29.1` - Date formatting
- `sass-embedded@^1.93.3` - SCSS preprocessor

## 🎨 Custom Components

### BlogIndex

Displays a list of blog posts with filtering and sorting capabilities. Optimized with batch loading for better performance.

Usage in markdown:
```markdown
<BlogIndex type="current" limit="5" />
```

Props:
- `type`: Filter type (`"current"` | `"wordpress"`)
- `limit`: Maximum number of posts to display

### DynamicFooter

Displays footer with dynamically generated current year.

Usage in markdown:
```markdown
<DynamicFooter />
```

## 🎨 Custom Styling

The blog uses custom styles (`blog/.vuepress/styles/index.scss`) that match the main website design:

- **Color Palette**: Blue gradient theme matching howar31.com
- **Dark Mode**: Full dark mode support with proper mobile sidebar positioning
- **Responsive Design**: Optimized for mobile and desktop devices
- **Typography**: Consistent typography and spacing

## 📝 License

This project is open source and available under the MIT License.

## 🔗 Links

- **Blog**: [https://blog.howar31.com](https://blog.howar31.com)
- **Author**: [https://howar31.com](https://howar31.com)
- **GitHub**: [https://github.com/howar31](https://github.com/howar31)

## 📚 Resources

- [VuePress v2 Documentation](https://v2.vuepress.vuejs.org/)
- [VuePress v2 Migration Guide](https://v2.vuepress.vuejs.org/guide/migration.html)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
