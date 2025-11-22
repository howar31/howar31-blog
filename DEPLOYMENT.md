# GitHub Pages Deployment Guide

This project uses GitHub Actions to automatically deploy to GitHub Pages.

## Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save the settings

### 2. Repository Configuration

The repository is configured to:
- Build on push to `master` or `main` branch
- Use Node.js v20
- Build output directory: `public/`
- Deploy automatically to GitHub Pages

### 3. Workflow File

The deployment workflow is located at:
`.github/workflows/deploy.yml`

### 4. Build Configuration

- Source directory: `blog/`
- Build command: `npm run blog:build`
- Output directory: `public/` (configured in `blog/.vuepress/config.mjs`)

## Manual Deployment

If you need to deploy manually:

```bash
# Install dependencies
npm install

# Build the site
npm run blog:build

# The built files will be in the `public/` directory
```

## Notes

- The workflow uses `npm ci` for faster, reliable builds
- Node.js v20 is required (matches local development)
- The workflow automatically handles caching for faster builds
