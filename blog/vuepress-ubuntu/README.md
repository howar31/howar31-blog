---
title: Setup VuePress with GitLab Pages on Ubuntu 18.04 LTS
date: 2019-04-17
description: Vuepress 0.14.11 + GitLab Pages, minimal setup on Ubuntu 18.04.1 LTS
---

# Setup VuePress with GitLab Pages on Ubuntu 18.04 LTS

This is a lite version of setup tutorial about Vuepress docs on Ubuntu.  For detailed  tutorial I wrote, please visit [Create a docs with VuePress on GitLab Pages](/vuepress-docs-tutorial/).

## Environment

- Ubuntu 18.04.1 LTS
- Node.js 11.14.0
- npm 6.9.0

## Setup VuePress

[VuePress Official Guide](https://vuepress.vuejs.org/guide/)

### Install VuePress

First, install VuePress globally:

```bash
npm install -g vuepress
```

or if you want to install locally:

```bash
npm install vuepress
```

::: warning
With Vuepress installed locally, you may need to use `npx vuepress` in command line.
:::

### Config Build Path for GitLab Pages

To change the built files destination, we must set it up in config file.  By default the config file is not exist, you may create a config file by yourself:

```bash
vi docs/.vuepress/config.js
```

`config.js` file contains all the VuePress site-wide settings.  It will be loaded before parsing any Markdown pages.

Put this content into `config.js` to setup the built files destination:

```javascript
module.exports = {
    title: 'Docs Title',
    dest: 'public',
}
```

The `title` is the title of the site.

The `dest` path is based on your file's root, that is, your built files will now be put in `./public` instead of `.vuepress/dist`.

We change the `dest` to `public` since GitLab Pages use `public` as artifacts folder.  Of course, you may change the GitLab Pages artifacts folder to `.vuepress/dist` instead, if you don't want to set the `dest` in VuePress here.

::: tip
If you are hosting the docs other than root url, please set the base url `base: '/path/to/site/'` in `config.js`.
:::

This is the minimal `config.js` setting for VuePress.

### First Build

Create a Markdown file `README.md` as homepage:

```bash
echo '# Hello VuePress' > docs/README.md
```

Quickly preview your site with a temp web server:

```bash
vuepress dev
```

To build the static HTML files:

```bash
vuepress build
```

and the HTML files will be generated to the path you set above.

### Config npm (package.json)

In order to manage dependencies, create a `package.json` at root folder.

```json
{
  "main": "index.js",
  "directories": {
    "docs": "docs"
  },
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  },
  "dependencies": {
    "vuepress": "^0.14.11",
  }
}
```

The `directories` will be the folder where to save all the docs posts.  In this case, `./docs/` will be the root for all docs.

The `scripts` includes npm commands.  Create a `docs:build` command which will execute `vuepress build docs`, and `docs:dev` for development.

The `dependencies` includes which version of the VuePress you want to install (for CI/CD), and all other optional npm packages.

Save the `package.json` and run the script `docs:build` to build the static files:

```bash
npm run docs:build
```

These commands will later be used by GitLab CI/CD runner also.

## Setup GitLab Pages

### Config GitLab CI/CD

First of all, you have to create a GitLab account if you don't have one.  And then create a new repository to host your VuePress project.

Create a file `.gitlab-ci.yml` manually, and edit the file with the content below:

```yaml
image: node:latest
pages:
  cache:
    paths:
    - node_modules/
  script:
    - npm install
    - npm run docs:build
  artifacts:
    paths:
      - public
  only:
    - master
```

This YAML file is GitLab CI/CD setup.  You may read the [quick start by GitLab official](https://docs.gitlab.com/ee/ci/quick_start/).  For detail configuration please visit [another official document](https://docs.gitlab.com/ee/ci/yaml/README.html).

The [shared runner](https://docs.gitlab.com/runner/) on gitlab.com is in docker mode.  The `image` will told the runner use `node:latest` docker image.

::: warning
You need to setup your own runner if you are using self-hosted GitLab CE.
:::

The `pages` is the job name.  This is a special job name [that you cannot change](https://docs.gitlab.com/ee/ci/yaml/README.html#pages).  With this job name, GitLab will upload and deploy your static contents to GitLab Pages.

The files in `cache`'s `paths` will be uploaded to GitLab server.  And will be downloaded to docker container while running the pipeline next time.  Here we told GitLab to keep the `node_modules` folder to avoid fresh npm install each time we run the pipeline.

The `script` contains the commands to run.  And we build VuePress here.

The files in `artifacts`'s `path` will be uploaded to GitLab Pages.  So here we should put our static HTML files.  This is why we changed the VuePress `dest` from `./vuepress/dist` to `public`.

The `only` means this pipeline will only be run if the branch is `master`.

Save and commit the files.  Then the GitLab CI/CD is ready.

For more details about CI/CD deployment for different static generators, please see the [official page example](https://gitlab.com/pages).

### Config Git

Add `.gitignore` to ignore some generated files:

```
node_modules
/public/
```

### Config GitLab Pages

Actually there are nothing more to setup if your CI/CD is set correctly.  You may see if the job succeed or failed in `CI/CD > Pipelines` in GitLab project page.

To access your built docs, go to `Settings > Pages` in project page.

::: tip
If you are using self-hosted GitLab CE, please note that you need to enable the Pages features in Admin Area (ask your admin if you don't know what is this).  Otherwise, you won't be able to find th `Pages` in `Settings`.
:::

And you will see your docs url (the default is `USER_NAME.gitlab.io/PROJECT_NAME`).

::: tip
GitLab Pages takes about 10 to 30 minutes while deploying your docs.  And it will take longer if you have just set up your custom domain (flush DNS helps maybe).  Please wait a little while if you see 404.

But if you still see 404 after hours, please check your CI/CD settings to see whether the job succeed and the artifacts uploaded to GitLab are not empty (or gibberish).
:::

In the Pages settings, you may also find some configs you can tune, such as force HTTPS, custom domains, and disable the Pages for this project.

## Write a Document

At this point, your *VuePress + GitLab Pages* pipeline are all set.  As long as you push a commit to GitLab, the pipline will be run and your docs will be updated.

The directory structure should be:

```
.
├ docs/
│ ├ .vuepress/
│ └ README.md
├ node_modules/
├ public/
├ .gitignore
├ .gitlab-ci.yml
├ package.json
├ package-lock.json
└ README.md
```

To create a new doc, simply create a new folder under the `docs` folder.  And then create a `README.md` under that new folder.  Also a `images` folder if you want to have some images in your doc.  For example:

```{4-6}
.
├ docs/
│ ├ .vuepress/
│ ├ new-doc/
│ │ ├ images/
│ │ └ README.md
│ └ README.md
├ node_modules/
├ public/
├ .gitignore
├ .gitlab-ci.yml
├ package.json
├ package-lock.json
└ README.md
```

Write the Markdown in `README.md`, and put your images in `images` folder.  To link the image `filename.jpg` (for example) in Markdown, simply write:

```markdown
![](./images/filename.jpg)
```

and the image will be loaded.

Due to the file path, the url of the new post will be `http://example.com/new-doc/`.

::: tip
VuePress 0.x URL is stick to the file path.  In future VuePress 1.x, there will have options for permalinks.  In this article, I use 0.x as example since 1.x is still unstable.
:::

In Markdown file, VuePress support [YAML front matter](https://vuepress.vuejs.org/guide/markdown.html#front-matter).  The data will be available in this page and also usable by Vue layout and components.

For VuePress default theme, `title`, `lang` and `meta` will automatically be set on the page, example:

```yaml
---
title: POST_TITLE
---

# DOC_TITLE

DOC_CONTENT
```

After the YAML front matter, all other content will be parsed by Markdown parser.

::: tip
VuePress use [markdown-it](https://github.com/markdown-it/markdown-it) as the Markdown parser, which can also be further configured accroding to [official document](https://vuepress.vuejs.org/config/#markdown).
:::

In addition to Markdown, you may also write HTML (not recommanded), and place Vue components in Markdown files.
