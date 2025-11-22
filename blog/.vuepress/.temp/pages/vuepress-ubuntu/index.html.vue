<template><div><h1 id="setup-vuepress-with-gitlab-pages-on-ubuntu-18-04-lts" tabindex="-1"><a class="header-anchor" href="#setup-vuepress-with-gitlab-pages-on-ubuntu-18-04-lts"><span>Setup VuePress with GitLab Pages on Ubuntu 18.04 LTS</span></a></h1>
<p>This is a lite version of setup tutorial about Vuepress docs on Ubuntu.  For detailed  tutorial I wrote, please visit <RouteLink to="/vuepress-blog-tutorial/">Create a docs with VuePress on GitLab Pages</RouteLink>.</p>
<h2 id="environment" tabindex="-1"><a class="header-anchor" href="#environment"><span>Environment</span></a></h2>
<ul>
<li>Ubuntu 18.04.1 LTS</li>
<li>Node.js 11.14.0</li>
<li>npm 6.9.0</li>
</ul>
<h2 id="setup-vuepress" tabindex="-1"><a class="header-anchor" href="#setup-vuepress"><span>Setup VuePress</span></a></h2>
<p><a href="https://vuepress.vuejs.org/guide/" target="_blank" rel="noopener noreferrer">VuePress Official Guide</a></p>
<h3 id="install-vuepress" tabindex="-1"><a class="header-anchor" href="#install-vuepress"><span>Install VuePress</span></a></h3>
<p>First, install VuePress globally:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">-g</span> vuepress</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>or if you want to install locally:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> <span class="token function">install</span> vuepress</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="hint-container warning">
<p class="hint-container-title">Warning</p>
<p>With Vuepress installed locally, you may need to use <code v-pre>npx vuepress</code> in command line.</p>
</div>
<h3 id="config-build-path-for-gitlab-pages" tabindex="-1"><a class="header-anchor" href="#config-build-path-for-gitlab-pages"><span>Config Build Path for GitLab Pages</span></a></h3>
<p>To change the built files destination, we must set it up in config file.  By default the config file is not exist, you may create a config file by yourself:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">vi</span> docs/.vuepress/config.js</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p><code v-pre>config.js</code> file contains all the VuePress site-wide settings.  It will be loaded before parsing any Markdown pages.</p>
<p>Put this content into <code v-pre>config.js</code> to setup the built files destination:</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code class="language-javascript"><span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">'Docs Title'</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">dest</span><span class="token operator">:</span> <span class="token string">'public'</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The <code v-pre>title</code> is the title of the site.</p>
<p>The <code v-pre>dest</code> path is based on your file's root, that is, your built files will now be put in <code v-pre>./public</code> instead of <code v-pre>.vuepress/dist</code>.</p>
<p>We change the <code v-pre>dest</code> to <code v-pre>public</code> since GitLab Pages use <code v-pre>public</code> as artifacts folder.  Of course, you may change the GitLab Pages artifacts folder to <code v-pre>.vuepress/dist</code> instead, if you don't want to set the <code v-pre>dest</code> in VuePress here.</p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>If you are hosting the docs other than root url, please set the base url <code v-pre>base: '/path/to/site/'</code> in <code v-pre>config.js</code>.</p>
</div>
<p>This is the minimal <code v-pre>config.js</code> setting for VuePress.</p>
<h3 id="first-build" tabindex="-1"><a class="header-anchor" href="#first-build"><span>First Build</span></a></h3>
<p>Create a Markdown file <code v-pre>README.md</code> as homepage:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token builtin class-name">echo</span> <span class="token string">'# Hello VuePress'</span> <span class="token operator">></span> docs/README.md</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>Quickly preview your site with a temp web server:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">vuepress dev</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>To build the static HTML files:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">vuepress build</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>and the HTML files will be generated to the path you set above.</p>
<h3 id="config-npm-package-json" tabindex="-1"><a class="header-anchor" href="#config-npm-package-json"><span>Config npm (package.json)</span></a></h3>
<p>In order to manage dependencies, create a <code v-pre>package.json</code> at root folder.</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code class="language-json"><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"main"</span><span class="token operator">:</span> <span class="token string">"index.js"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"directories"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"docs"</span><span class="token operator">:</span> <span class="token string">"docs"</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"docs:dev"</span><span class="token operator">:</span> <span class="token string">"vuepress dev docs"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"docs:build"</span><span class="token operator">:</span> <span class="token string">"vuepress build docs"</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"dependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"vuepress"</span><span class="token operator">:</span> <span class="token string">"^0.14.11"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The <code v-pre>directories</code> will be the folder where to save all the docs posts.  In this case, <code v-pre>./docs/</code> will be the root for all docs.</p>
<p>The <code v-pre>scripts</code> includes npm commands.  Create a <code v-pre>docs:build</code> command which will execute <code v-pre>vuepress build docs</code>, and <code v-pre>docs:dev</code> for development.</p>
<p>The <code v-pre>dependencies</code> includes which version of the VuePress you want to install (for CI/CD), and all other optional npm packages.</p>
<p>Save the <code v-pre>package.json</code> and run the script <code v-pre>docs:build</code> to build the static files:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> run docs:build</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>These commands will later be used by GitLab CI/CD runner also.</p>
<h2 id="setup-gitlab-pages" tabindex="-1"><a class="header-anchor" href="#setup-gitlab-pages"><span>Setup GitLab Pages</span></a></h2>
<h3 id="config-gitlab-ci-cd" tabindex="-1"><a class="header-anchor" href="#config-gitlab-ci-cd"><span>Config GitLab CI/CD</span></a></h3>
<p>First of all, you have to create a GitLab account if you don't have one.  And then create a new repository to host your VuePress project.</p>
<p>Create a file <code v-pre>.gitlab-ci.yml</code> manually, and edit the file with the content below:</p>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token key atrule">image</span><span class="token punctuation">:</span> node<span class="token punctuation">:</span>latest</span>
<span class="line"><span class="token key atrule">pages</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">cache</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">paths</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> node_modules/</span>
<span class="line">  <span class="token key atrule">script</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> npm install</span>
<span class="line">    <span class="token punctuation">-</span> npm run docs<span class="token punctuation">:</span>build</span>
<span class="line">  <span class="token key atrule">artifacts</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">paths</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> public</span>
<span class="line">  <span class="token key atrule">only</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> master</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>This YAML file is GitLab CI/CD setup.  You may read the <a href="https://docs.gitlab.com/ee/ci/quick_start/" target="_blank" rel="noopener noreferrer">quick start by GitLab official</a>.  For detail configuration please visit <a href="https://docs.gitlab.com/ee/ci/yaml/README.html" target="_blank" rel="noopener noreferrer">another official document</a>.</p>
<p>The <a href="https://docs.gitlab.com/runner/" target="_blank" rel="noopener noreferrer">shared runner</a> on gitlab.com is in docker mode.  The <code v-pre>image</code> will told the runner use <code v-pre>node:latest</code> docker image.</p>
<div class="hint-container warning">
<p class="hint-container-title">Warning</p>
<p>You need to setup your own runner if you are using self-hosted GitLab CE.</p>
</div>
<p>The <code v-pre>pages</code> is the job name.  This is a special job name <a href="https://docs.gitlab.com/ee/ci/yaml/README.html#pages" target="_blank" rel="noopener noreferrer">that you cannot change</a>.  With this job name, GitLab will upload and deploy your static contents to GitLab Pages.</p>
<p>The files in <code v-pre>cache</code>'s <code v-pre>paths</code> will be uploaded to GitLab server.  And will be downloaded to docker container while running the pipeline next time.  Here we told GitLab to keep the <code v-pre>node_modules</code> folder to avoid fresh npm install each time we run the pipeline.</p>
<p>The <code v-pre>script</code> contains the commands to run.  And we build VuePress here.</p>
<p>The files in <code v-pre>artifacts</code>'s <code v-pre>path</code> will be uploaded to GitLab Pages.  So here we should put our static HTML files.  This is why we changed the VuePress <code v-pre>dest</code> from <code v-pre>./vuepress/dist</code> to <code v-pre>public</code>.</p>
<p>The <code v-pre>only</code> means this pipeline will only be run if the branch is <code v-pre>master</code>.</p>
<p>Save and commit the files.  Then the GitLab CI/CD is ready.</p>
<p>For more details about CI/CD deployment for different static generators, please see the <a href="https://gitlab.com/pages" target="_blank" rel="noopener noreferrer">official page example</a>.</p>
<h3 id="config-git" tabindex="-1"><a class="header-anchor" href="#config-git"><span>Config Git</span></a></h3>
<p>Add <code v-pre>.gitignore</code> to ignore some generated files:</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">node_modules</span>
<span class="line">/public/</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="config-gitlab-pages" tabindex="-1"><a class="header-anchor" href="#config-gitlab-pages"><span>Config GitLab Pages</span></a></h3>
<p>Actually there are nothing more to setup if your CI/CD is set correctly.  You may see if the job succeed or failed in <code v-pre>CI/CD &gt; Pipelines</code> in GitLab project page.</p>
<p>To access your built docs, go to <code v-pre>Settings &gt; Pages</code> in project page.</p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>If you are using self-hosted GitLab CE, please note that you need to enable the Pages features in Admin Area (ask your admin if you don't know what is this).  Otherwise, you won't be able to find th <code v-pre>Pages</code> in <code v-pre>Settings</code>.</p>
</div>
<p>And you will see your docs url (the default is <code v-pre>USER_NAME.gitlab.io/PROJECT_NAME</code>).</p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>GitLab Pages takes about 10 to 30 minutes while deploying your docs.  And it will take longer if you have just set up your custom domain (flush DNS helps maybe).  Please wait a little while if you see 404.</p>
<p>But if you still see 404 after hours, please check your CI/CD settings to see whether the job succeed and the artifacts uploaded to GitLab are not empty (or gibberish).</p>
</div>
<p>In the Pages settings, you may also find some configs you can tune, such as force HTTPS, custom domains, and disable the Pages for this project.</p>
<h2 id="write-a-document" tabindex="-1"><a class="header-anchor" href="#write-a-document"><span>Write a Document</span></a></h2>
<p>At this point, your <em>VuePress + GitLab Pages</em> pipeline are all set.  As long as you push a commit to GitLab, the pipline will be run and your docs will be updated.</p>
<p>The directory structure should be:</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">.</span>
<span class="line">├ docs/</span>
<span class="line">│ ├ .vuepress/</span>
<span class="line">│ └ README.md</span>
<span class="line">├ node_modules/</span>
<span class="line">├ public/</span>
<span class="line">├ .gitignore</span>
<span class="line">├ .gitlab-ci.yml</span>
<span class="line">├ package.json</span>
<span class="line">├ package-lock.json</span>
<span class="line">└ README.md</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>To create a new doc, simply create a new folder under the <code v-pre>docs</code> folder.  And then create a <code v-pre>README.md</code> under that new folder.  Also a <code v-pre>images</code> folder if you want to have some images in your doc.  For example:</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">.</span>
<span class="line">├ docs/</span>
<span class="line">│ ├ .vuepress/</span>
<span class="line highlighted">│ ├ new-doc/</span>
<span class="line highlighted">│ │ ├ images/</span>
<span class="line highlighted">│ │ └ README.md</span>
<span class="line">│ └ README.md</span>
<span class="line">├ node_modules/</span>
<span class="line">├ public/</span>
<span class="line">├ .gitignore</span>
<span class="line">├ .gitlab-ci.yml</span>
<span class="line">├ package.json</span>
<span class="line">├ package-lock.json</span>
<span class="line">└ README.md</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Write the Markdown in <code v-pre>README.md</code>, and put your images in <code v-pre>images</code> folder.  To link the image <code v-pre>filename.jpg</code> (for example) in Markdown, simply write:</p>
<div class="language-markdown line-numbers-mode" data-highlighter="prismjs" data-ext="md"><pre v-pre><code class="language-markdown"><span class="line">![](./images/filename.jpg)</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>and the image will be loaded.</p>
<p>Due to the file path, the url of the new post will be <code v-pre>http://example.com/new-doc/</code>.</p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>VuePress 0.x URL is stick to the file path.  In future VuePress 1.x, there will have options for permalinks.  In this article, I use 0.x as example since 1.x is still unstable.</p>
</div>
<p>In Markdown file, VuePress support <a href="https://vuepress.vuejs.org/guide/markdown.html#front-matter" target="_blank" rel="noopener noreferrer">YAML front matter</a>.  The data will be available in this page and also usable by Vue layout and components.</p>
<p>For VuePress default theme, <code v-pre>title</code>, <code v-pre>lang</code> and <code v-pre>meta</code> will automatically be set on the page, example:</p>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token key atrule">title</span><span class="token punctuation">:</span> POST_TITLE</span>
<span class="line"><span class="token punctuation">---</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># DOC_TITLE</span></span>
<span class="line"></span>
<span class="line">DOC_CONTENT</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>After the YAML front matter, all other content will be parsed by Markdown parser.</p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>VuePress use <a href="https://github.com/markdown-it/markdown-it" target="_blank" rel="noopener noreferrer">markdown-it</a> as the Markdown parser, which can also be further configured accroding to <a href="https://vuepress.vuejs.org/config/#markdown" target="_blank" rel="noopener noreferrer">official document</a>.</p>
</div>
<p>In addition to Markdown, you may also write HTML (not recommanded), and place Vue components in Markdown files.</p>
</div></template>


