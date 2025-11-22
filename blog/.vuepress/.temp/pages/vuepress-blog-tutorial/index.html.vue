<template><div><h1 id="create-a-blog-with-vuepress-on-gitlab-pages" tabindex="-1"><a class="header-anchor" href="#create-a-blog-with-vuepress-on-gitlab-pages"><span>Create a Blog with VuePress on GitLab Pages</span></a></h1>
<p>After several years hosting my blog on Wordpress, I decided to move my blog to VuePress so that I may write my blog with Markdown, and also customize my blog with Vue.js.</p>
<p>VuePress is a Vue-powered static site generator, which can easily help you to setup a SPA website in just few minutes.  And with CI/CD and GitLab Pages integration, it becomes one of the best solution for personal blog which can be programmatically themed with Vue.js, automatically publish with CI/CD, and free host with GitLab Pages.</p>
<p>There are tons of <em>VuePress + GitLab Pages</em> tutorials on the web already.  In this article, I will focus on how I setup my blog with minimal customization on default VuePress theme, and how to migrate the old posts from Wordpress to VuePress.</p>
<h2 id="so-why-vuepress-and-gitlab-pages" tabindex="-1"><a class="header-anchor" href="#so-why-vuepress-and-gitlab-pages"><span>So why VuePress and GitLab Pages?</span></a></h2>
<p>Sum up the main reasons why I choose this solution bundle:</p>
<ul>
<li><strong>Static site generator</strong>, which means my blog will be blazing fast to load and browse since it's all pre-rendered HTML, JS and CSS.  Futhermore, VuePress is powered by Vue.js which is a SPA framework that provides even better browsing experience.</li>
<li><strong>Markdown</strong> is easy and fast to write a document <em><strong>with basic formatting like this</strong></em>.  And also keeping blog posts as files (rather than DB records) is good for future migration to different content management system (or even just files are ready to read).</li>
<li><strong>CI/CD</strong> is convenient to get things done automatically.  With CI/CD set on GitLab, you just need to save your file and commit/push to git and it's done (especially good for developers who are familiar with git).  The workers (we called runners on GitLab) will handle all the tests, jobs, and deployments by themselves.</li>
<li><strong>Money</strong> is always a factor to consider while we choose what we want.  Hosting static webpages with custom domain and <a href="https://about.gitlab.com/product/pages/" target="_blank" rel="noopener noreferrer">tons of great features</a> on GitLab is just <strong>free</strong>, even with a private repo.  (shouting out to GitHub)</li>
</ul>
<p>and lots more to say.  Anyways these are my concerns, ymmv.</p>
<h2 id="environment" tabindex="-1"><a class="header-anchor" href="#environment"><span>Environment</span></a></h2>
<p>I built my blog with these environment settings:</p>
<ul>
<li>Macbook Air 2015 Early</li>
<li>macOS Mojave, 10.14.3</li>
<li>Nginx 1.12.1</li>
<li>Node.js 11.11.0</li>
<li>npm 6.9.0</li>
<li>VSCode 1.32.3</li>
</ul>
<p>and the following setup steps will base on this environment setup.</p>
<h2 id="setup-vuepress" tabindex="-1"><a class="header-anchor" href="#setup-vuepress"><span>Setup VuePress</span></a></h2>
<p>Let's start with VuePress.  You may also checkout <a href="https://vuepress.vuejs.org/" target="_blank" rel="noopener noreferrer">VuePress Official Website</a> for detail documents.</p>
<h3 id="install-vuepress" tabindex="-1"><a class="header-anchor" href="#install-vuepress"><span>Install VuePress</span></a></h3>
<p>First, install VuePress globally:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">-g</span> vuepress</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>Create a Markdown file <code v-pre>README.md</code> as homepage:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token builtin class-name">echo</span> <span class="token string">'# Hello VuePress'</span> <span class="token operator">></span> README.md</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>Accroding to <a href="https://vuepress.vuejs.org/guide/markdown.html#links" target="_blank" rel="noopener noreferrer">official document</a>, VuePress will parse <code v-pre>README.md</code> or <code v-pre>index.md</code> to <code v-pre>index.html</code> while generating static webpages.</p>
<p>For more info about README and index please visit <a href="https://github.com/vuejs/vuepress/pull/23" target="_blank" rel="noopener noreferrer">here</a>.</p>
</div>
<p>Quickly preview your site with a temp web server:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">vuepress dev</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="hint-container warning">
<p class="hint-container-title">Warning</p>
<p>As of the time of writing, <a href="https://github.com/vuejs/vuepress/issues/1417" target="_blank" rel="noopener noreferrer">there was a bug</a> in webpack-dev-middleware which prevents this command to establish the temp dev web server.  To work around this, you may build the static HTML files and host them with your own web server, such as Apache or Nginx.</p>
</div>
<p>To build the static HTML files, simply run:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">vuepress build</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>and the HTML files will be generated to <code v-pre>.vuepress/dist</code> by default.</p>
<p>And that's it, this is the minimal setup for VuePress.  You may now see a simple webpage which is generated with your Markdown content.</p>
<h3 id="config-build-path" tabindex="-1"><a class="header-anchor" href="#config-build-path"><span>Config Build Path</span></a></h3>
<p>Before continue to GitLab Pages setup, there are some configs to set for easy CI/CD in the next step.  These configs are optional, I will show you my setup here.</p>
<p>To change the built files destination, we must set it up in config file.  By default the config file is not exist, you may create a config file by yourself:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">vi</span> blog/.vuepress/config.js</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p><code v-pre>config.js</code> file contains all the VuePress site-wide settings.  It will be loaded before parsing any Markdown pages.</p>
<p>Put this content into <code v-pre>config.js</code> to setup the built files destination:</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code class="language-javascript"><span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">'Howar31 Blog'</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">dest</span><span class="token operator">:</span> <span class="token string">'public'</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The <code v-pre>title</code> is the title of the site.</p>
<p>The <code v-pre>dest</code> path is based on your file's root, that is, your built files will now be put in <code v-pre>./public</code> instead of <code v-pre>.vuepress/dist</code>.</p>
<p>We change the <code v-pre>dest</code> to <code v-pre>public</code> since GitLab Pages use <code v-pre>public</code> as artifacts folder.  Of course, you may change the GitLab Pages artifacts folder to <code v-pre>.vuepress/dist</code> instead, if you don't want to set the <code v-pre>dest</code> in VuePress here.</p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>If you are hosting the blog other than root url, please set the base url <code v-pre>base: '/path/to/site/'</code> in <code v-pre>config.js</code>.</p>
</div>
<p>This is the minimal <code v-pre>config.js</code> setting for VuePress.</p>
<h3 id="config-npm-package-json" tabindex="-1"><a class="header-anchor" href="#config-npm-package-json"><span>Config npm (package.json)</span></a></h3>
<p>In order to manage dependencies, create a <code v-pre>package.json</code> at root folder.</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code class="language-json"><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"main"</span><span class="token operator">:</span> <span class="token string">"index.js"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"directories"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"blog"</span><span class="token operator">:</span> <span class="token string">"blog"</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"blog:build"</span><span class="token operator">:</span> <span class="token string">"vuepress build blog"</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"dependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"vuepress"</span><span class="token operator">:</span> <span class="token string">"^0.14.10"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"moment"</span><span class="token operator">:</span> <span class="token string">"^2.24.0"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"yaml-front-matter"</span><span class="token operator">:</span> <span class="token string">"^4.0.0"</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The <code v-pre>directories</code> will be the folder where to save all the blog posts.  In this case, <code v-pre>./blog/</code> will be the root for all my blog posts.</p>
<p>The <code v-pre>scripts</code> includes npm commands.  Create a <code v-pre>blog:build</code> command which will execute <code v-pre>vuepress build blog</code>.  The command <code v-pre>vuepress build</code> can accept a parameter which will indicate the Markdown files in what folder to build.  In other words, the parameter is the path to document root.</p>
<p>The <code v-pre>dependencies</code> includes which version of the VuePress you want to install (for CI/CD), and all other optional npm packages.  In the example above, I use VuePress 10.14.10, and also includes <code v-pre>moment</code> and <code v-pre>yaml-front-matter</code> packages for later customization.</p>
<p>After saving the <code v-pre>package.json</code>, you may try to run the commands to install the dependencies:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> <span class="token function">install</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>and the script <code v-pre>blog:build</code> to build the static files:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> run blog:build</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>These commands will also be used by GitLab CI/CD runner which will be illustrated later.</p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>Note that since we changed the <code v-pre>dest</code> in <code v-pre>config.js</code> and <code v-pre>directories</code> in <code v-pre>package.json</code>.  VuePress will now find Markdown files in <code v-pre>./blog/</code> and generate the static HTML files to <code v-pre>./public/</code>.</p>
<p>You have to create blog posts (Markdown files) in <code v-pre>./blog/</code> so that VuePress can find them.  And the '.vuepress/dist` mentioned above are now safe to remove since the static HTML files are now in their new home.</p>
</div>
<h2 id="setup-gitlab-pages" tabindex="-1"><a class="header-anchor" href="#setup-gitlab-pages"><span>Setup GitLab Pages</span></a></h2>
<p>GitLab is an open-source web-based git repository manager which also provides DevOps lifecycle tool, wiki, issue-tracking, CI/CD pipeline and <a href="https://gitlab.com/" target="_blank" rel="noopener noreferrer">more</a>.  And GitLab provide a free static site hosting service called <strong>GitLab Pages</strong>, which is quite similar with GitHub Pages, but with much more customization options (with their CI/CD integration).</p>
<h3 id="config-gitlab-ci-cd" tabindex="-1"><a class="header-anchor" href="#config-gitlab-ci-cd"><span>Config GitLab CI/CD</span></a></h3>
<p>First of all, you have to create a GitLab account if you don't have one.  And then create a new repository to host your VuePress project.</p>
<p>In the project view, where is a <code v-pre>Set up CI/CD</code> button, click it.</p>
<p><img src="@source/vuepress-blog-tutorial/images/setup_cicd.png" alt=""></p>
<p>or you can create a file <code v-pre>.gitlab-ci.yml</code> manually.  Edit the file with the content below:</p>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token key atrule">image</span><span class="token punctuation">:</span> node<span class="token punctuation">:</span>latest</span>
<span class="line"><span class="token key atrule">pages</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">cache</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">paths</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> node_modules/</span>
<span class="line">  <span class="token key atrule">script</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> npm install</span>
<span class="line">    <span class="token punctuation">-</span> npm run blog<span class="token punctuation">:</span>build</span>
<span class="line">  <span class="token key atrule">artifacts</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">paths</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> public</span>
<span class="line">  <span class="token key atrule">only</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> master</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>This YAML file is GitLab CI/CD setup.  You may read the <a href="https://docs.gitlab.com/ee/ci/quick_start/" target="_blank" rel="noopener noreferrer">quick start by GitLab official</a>.  For detail configuration please visit <a href="https://docs.gitlab.com/ee/ci/yaml/README.html" target="_blank" rel="noopener noreferrer">another official document</a>.</p>
<p>The <a href="https://docs.gitlab.com/runner/" target="_blank" rel="noopener noreferrer">shared runner</a> on gitlab.com is in docker mode.  The <code v-pre>image</code> will told the runner use <code v-pre>node:latest</code> docker image.</p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>GitLab.com provides several shared runners and free to use with <a href="https://gitlab.com/help/user/admin_area/settings/continuous_integration#shared-runners-build-minutes-quota" target="_blank" rel="noopener noreferrer">limited pipeline quota</a>.  But if you want to use your own runners, or hosting the GitLab CE by yourself, you have to configure the runners by yourself.</p>
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
<p>To access your built blog, go to <code v-pre>Settings &gt; Pages</code> in project page.</p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>If you are using self-hosted GitLab CE, please note that you need to enable the Pages features in Admin Area (ask your admin if you don't know what is this).  Otherwise, you won't be able to find th <code v-pre>Pages</code> in <code v-pre>Settings</code>.</p>
</div>
<p>And you will see your blog url (the default is <code v-pre>USER_NAME.gitlab.io/PROJECT_NAME</code>).</p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>GitLab Pages takes about 10 to 30 minutes while deploying your blog.  And it will take longer if you have just set up your custom domain (flush DNS helps maybe).  Please wait a little while if you see 404.</p>
<p>But if you still see 404 after hours, please check your CI/CD settings to see whether the job succeed and the artifacts uploaded to GitLab are not empty (or gibberish).</p>
</div>
<p>In the Pages settings, you may also find some configs you can tune, such as force HTTPS, custom domains, and disable the Pages for this project.</p>
<h2 id="write-a-blog-post" tabindex="-1"><a class="header-anchor" href="#write-a-blog-post"><span>Write a Blog Post</span></a></h2>
<p>At this point, your <em>VuePress + GitLab Pages</em> pipeline are all set.  As long as you push a commit to GitLab, the pipline will be run and your blog will be updated.</p>
<p>The directory structure should be:</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">.</span>
<span class="line">├ blog/</span>
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
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>To create a new blog post, simply create a new folder under the <code v-pre>blog</code> folder.  And then create a <code v-pre>README.md</code> under that new folder.  Also a <code v-pre>images</code> folder if you want to have some images in your post.  For example:</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">.</span>
<span class="line">├ blog/</span>
<span class="line">│ ├ .vuepress/</span>
<span class="line highlighted">│ ├ new-post/</span>
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
<p>Due to the file path, the url of the new post will be <code v-pre>http://example.com/new-post/</code>.</p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>VuePress 0.x URL is stick to the file path.  In future VuePress 1.x, there will have options for permalinks.  In this article, I use 0.x as example since 1.x is still unstable.</p>
</div>
<p>In Markdown file, VuePress support <a href="https://vuepress.vuejs.org/guide/markdown.html#front-matter" target="_blank" rel="noopener noreferrer">YAML front matter</a>.  The data will be available in this page and also usable by Vue layout and components.</p>
<p>For VuePress default theme, <code v-pre>title</code>, <code v-pre>lang</code> and <code v-pre>meta</code> will automatically be set on the page.  And I also add <code v-pre>date</code> for blog post of course.  It will be used later in blog post index and sidebar generation (illustrate later).</p>
<p>Recommand new blog post template:</p>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token key atrule">title</span><span class="token punctuation">:</span> POST_TITLE</span>
<span class="line"><span class="token key atrule">date</span><span class="token punctuation">:</span> YYYY<span class="token punctuation">-</span>MM<span class="token punctuation">-</span>DD</span>
<span class="line"><span class="token punctuation">---</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># POST_TITLE</span></span>
<span class="line"></span>
<span class="line">POST_CONTENT</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>After the YAML front matter, all other content will be parsed by Markdown parser.</p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>VuePress use <a href="https://github.com/markdown-it/markdown-it" target="_blank" rel="noopener noreferrer">markdown-it</a> as the Markdown parser, which can also be further configured accroding to <a href="https://vuepress.vuejs.org/config/#markdown" target="_blank" rel="noopener noreferrer">official document</a>.</p>
</div>
<p>In addition to Markdown, you may also write HTML (not recommanded), and place Vue components in Markdown files.</p>
<h2 id="customize-vuepress" tabindex="-1"><a class="header-anchor" href="#customize-vuepress"><span>Customize VuePress</span></a></h2>
<p>VuePress looks elegant even with the default theme without any customization.  But if you want to make it personal, you will need some tweaks and configs.</p>
<p>If you are an UI/UX designer, you may want to fully customize and redesign how the VuePress looks.  And yes you can do it by <a href="https://vuepress.vuejs.org/default-theme-config/#ejecting" target="_blank" rel="noopener noreferrer">eject the default theme</a> and start modify them by yourself.  But in order to receive future update from VuePress official, I'd rather to use default theme with slightly override.</p>
<h3 id="enable-navbar-and-sidebar" tabindex="-1"><a class="header-anchor" href="#enable-navbar-and-sidebar"><span>Enable Navbar and Sidebar</span></a></h3>
<p>With default VuePress installation, there is no way for visitor to navigate between posts.  You may config navbar and sidebar to solve this issue.</p>
<h4 id="config-navbar" tabindex="-1"><a class="header-anchor" href="#config-navbar"><span>Config Navbar</span></a></h4>
<p>We will start with navbar.  All VuePress site-wide configs are in <code v-pre>.vuepress/config.js</code>.  Edit it and add <code v-pre>nav</code> to <code v-pre>themeConfig</code> section:</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code class="language-javascript"><span class="line"><span class="token literal-property property">themeConfig</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">nav</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token punctuation">{</span> <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">'Link to File'</span><span class="token punctuation">,</span> <span class="token literal-property property">link</span><span class="token operator">:</span> <span class="token string">'/filename.md'</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">{</span> <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">'Link to Path'</span><span class="token punctuation">,</span> <span class="token literal-property property">link</span><span class="token operator">:</span> <span class="token string">'/path/'</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">'Dropdown'</span><span class="token punctuation">,</span> <span class="token literal-property property">items</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token punctuation">{</span></span>
<span class="line">          <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">'Group 1'</span><span class="token punctuation">,</span> <span class="token literal-property property">items</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">            <span class="token punctuation">{</span> <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">'Link to File'</span><span class="token punctuation">,</span> <span class="token literal-property property">link</span><span class="token operator">:</span> <span class="token string">'/filename.md'</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token punctuation">{</span> <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">'Link to Path'</span><span class="token punctuation">,</span> <span class="token literal-property property">link</span><span class="token operator">:</span> <span class="token string">'/path/'</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token punctuation">{</span></span>
<span class="line">          <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">'Group 2'</span><span class="token punctuation">,</span> <span class="token literal-property property">items</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">            <span class="token punctuation">{</span> <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">'External Link'</span><span class="token punctuation">,</span> <span class="token literal-property property">link</span><span class="token operator">:</span> <span class="token string">'https://google.com'</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token punctuation">{</span> <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">'External Link 2'</span><span class="token punctuation">,</span> <span class="token literal-property property">link</span><span class="token operator">:</span> <span class="token string">'https://vuepress.vuejs.org'</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Example above shows that the navbar items supports serveral types of link:</p>
<ul>
<li><strong>Link to File</strong> will simply create a link point to the file you assigned.</li>
<li><strong>Link to Path</strong> will try to find <code v-pre>README.md</code> or <code v-pre>index.md</code> under that path</li>
<li><strong>Dropdown</strong> is a nested menu, and can furtuer be nested with <strong>Group</strong></li>
</ul>
<p>For more details about navbar config, you may read the <a href="https://vuepress.vuejs.org/default-theme-config/#navbar" target="_blank" rel="noopener noreferrer">official guide</a>.</p>
<h4 id="config-sidebar" tabindex="-1"><a class="header-anchor" href="#config-sidebar"><span>Config Sidebar</span></a></h4>
<p>Sidebar has more features than navbar.  That means the config will be slightly complicated:</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code class="language-javascript"><span class="line"><span class="token literal-property property">themeConfig</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">sidebar</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token string">'/path/'</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token string">'/file-a'</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">[</span><span class="token string">'/file-b'</span><span class="token punctuation">,</span> <span class="token string">'Explicit link text'</span><span class="token punctuation">]</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Example above shows that you may point the link to path (closed with <code v-pre>/</code> will try to find <code v-pre>README.md</code> under that path) and to file (<code v-pre>.md</code> can be omitted).</p>
<p>With this setup, you may manually link your blog posts in sidebar.  But that's stupid to add a link manually each time you write a new post.  So I wrote some script to do this job.</p>
<p>You can add custom Javascript at the beginning of the <code v-pre>.vuepress/config.js</code> which will be loaded before any Markdown page is parsed.</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code class="language-javascript"><span class="line"><span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'fs'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">const</span> moment <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'moment'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">const</span> yamlFront <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'yaml-front-matter'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> sortDelimiter <span class="token operator">=</span> <span class="token string">';'</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * Generate sidebar array</span>
<span class="line"> * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>array<span class="token punctuation">}</span></span> <span class="token parameter">markdownPaths</span> contains an array list of file paths</span>
<span class="line"> * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>bool<span class="token punctuation">}</span></span> <span class="token parameter">sort</span> sort the output array by 'date' in YAML header descendantly or not</span>
<span class="line"> * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>int<span class="token punctuation">}</span></span> <span class="token parameter">limit</span> limit the returned results, 0 will return all results</span>
<span class="line"> */</span></span>
<span class="line"><span class="token keyword">function</span> <span class="token function">generateSidebar</span><span class="token punctuation">(</span><span class="token parameter">markdownPaths<span class="token punctuation">,</span> sort <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">,</span> limit <span class="token operator">=</span> <span class="token number">0</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">let</span> renderedPosts <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Array</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token keyword">if</span> <span class="token punctuation">(</span>sort<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    markdownPaths<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token parameter">filePath</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">      fileContents <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token function">readFileSync</span><span class="token punctuation">(</span>filePath<span class="token punctuation">,</span> <span class="token string">'utf8'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      fileMeta <span class="token operator">=</span> yamlFront<span class="token punctuation">.</span><span class="token function">loadFront</span><span class="token punctuation">(</span>fileContents<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>fileMeta<span class="token punctuation">.</span>blog_index <span class="token operator">==</span> <span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span></span>
<span class="line">      fileTimestamp <span class="token operator">=</span> <span class="token function">moment</span><span class="token punctuation">(</span>fileMeta<span class="token punctuation">.</span>date<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      renderedPosts<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>fileTimestamp <span class="token operator">+</span> sortDelimiter <span class="token operator">+</span> filePath<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    renderedPosts <span class="token operator">=</span> renderedPosts<span class="token punctuation">.</span><span class="token function">sort</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">reverse</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>limit <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      renderedPosts <span class="token operator">=</span> renderedPosts<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> limit<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    renderedPosts<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">sortedPath<span class="token punctuation">,</span> index<span class="token punctuation">,</span> array</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">      array<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">=</span> sortedPath<span class="token punctuation">.</span><span class="token function">substring</span><span class="token punctuation">(</span>sortedPath<span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span>sortDelimiter<span class="token punctuation">)</span> <span class="token operator">+</span> sortDelimiter<span class="token punctuation">.</span>length <span class="token operator">+</span> basePath<span class="token punctuation">.</span>length<span class="token punctuation">,</span> sortedPath<span class="token punctuation">.</span><span class="token function">lastIndexOf</span><span class="token punctuation">(</span><span class="token string">'/'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">'/'</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">    renderedPosts <span class="token operator">=</span> markdownPaths<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">filePath</span> <span class="token operator">=></span> filePath<span class="token punctuation">.</span><span class="token function">substring</span><span class="token punctuation">(</span>basePath<span class="token punctuation">.</span>length<span class="token punctuation">,</span> filePath<span class="token punctuation">.</span><span class="token function">lastIndexOf</span><span class="token punctuation">(</span><span class="token string">'/'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">'/'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">  <span class="token keyword">return</span> renderedPosts<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>This function will parse your Markdown files and generate a sidebar array accrodingly.  So that you don't need to setup the sidebar items manually.</p>
<p>First of all, I used 3 node modules:</p>
<ul>
<li><a href="https://nodejs.org/api/fs.html" target="_blank" rel="noopener noreferrer">File System (fs)</a> to read the files.</li>
<li><a href="https://www.npmjs.com/package/yaml-front-matter" target="_blank" rel="noopener noreferrer">Yaml Front Matter(yaml-front-matter)</a> to parse the YAML front matter in files read by fs</li>
<li><a href="https://momentjs.com/" target="_blank" rel="noopener noreferrer">Moment.js (moment)</a> to handle the datetime object.</li>
</ul>
<p>You can install and save them to package.json by:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> <span class="token function">install</span> yaml-front-matter <span class="token parameter variable">--save</span></span>
<span class="line"><span class="token function">npm</span> <span class="token function">install</span> moment <span class="token parameter variable">--save</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>Before the parameters, I use a flag <code v-pre>blog_index</code> to tell this function to skip some specific files so that the files won't show up in the sidebar.  It's useful if the file is not a post and you want to ignore it.  To set this flag in your Markdown file, add this in YAML front matter:</p>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token key atrule">blog_index</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"><span class="token punctuation">---</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The <code v-pre>sort</code> parameter, you may decide to sort the output array by date in YAML or not.  Since it's a blog, we will set this parameter to true.</p>
<p>And the <code v-pre>limit</code> parameter can limit the output count.  It's useful if you want to get <em>5 latest posts</em> in your blog.</p>
<p>And about the <code v-pre>markdownPaths</code> parameters, you have to pass an array which contains a list of file paths you want to be generated in sidebar.</p>
<p>This function will return an array which you can insert it directly into the sidebar config, like:</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code class="language-javascript"><span class="line"><span class="token keyword">let</span> blogPosts <span class="token operator">=</span> <span class="token function">generateSidebar</span><span class="token punctuation">(</span>blogPaths<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">themeConfig</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">sidebar</span><span class="token operator">:</span> blogPosts<span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>and this will just work, which shows 5 latest posts in the sidebar.</p>
<p>Back to the <code v-pre>markdownPaths</code> parameter again, you don't have to create this path list manually, just let glob do the job:</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code class="language-javascript"><span class="line"><span class="token keyword">const</span> glob <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'glob'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">const</span> basePath <span class="token operator">=</span> <span class="token string">'blog'</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">let</span> blogPaths <span class="token operator">=</span> glob<span class="token punctuation">.</span><span class="token function">sync</span><span class="token punctuation">(</span>basePath <span class="token operator">+</span> <span class="token string">'/*/*.md'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">let</span> blogPosts <span class="token operator">=</span> <span class="token function">generateSidebar</span><span class="token punctuation">(</span>blogPaths<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Remember the directory structure?</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">.</span>
<span class="line">├ blog/</span>
<span class="line">│ ├ .vuepress/</span>
<span class="line highlighted">│ ├ new-post/</span>
<span class="line highlighted">│ │ ├ images/</span>
<span class="line highlighted">│ │ └ README.md</span>
<span class="line">│ └ README.md</span>
<span class="line">├ ...</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>We create a post by creating a folder first then place the Markdown files inside.  So <code v-pre>basePath + '/*/*.md'</code> will parse all the first-level folder in <code v-pre>basePath</code> and find the Markdown files.  Of course, the <code v-pre>basePath</code> is <code v-pre>blog</code> which we set in <code v-pre>directories</code> in <code v-pre>package.json</code>.  By changing the path in <code v-pre>sync()</code>, you may traverse through the directory you want and generate the sidebar for that directory.</p>
<p>Furthermore, you may ultilize the <em>Multiple Sidebar</em> VuePress provided.  And combine with specific items you want to show on all sidebar.  Such as:</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code class="language-javascript"><span class="line"><span class="token keyword">let</span> blogPaths <span class="token operator">=</span> glob<span class="token punctuation">.</span><span class="token function">sync</span><span class="token punctuation">(</span>basePath <span class="token operator">+</span> <span class="token string">'/*/*.md'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">let</span> blogPosts <span class="token operator">=</span> <span class="token function">generateSidebar</span><span class="token punctuation">(</span>blogPaths<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">let</span> archivedPaths <span class="token operator">=</span> glob<span class="token punctuation">.</span><span class="token function">sync</span><span class="token punctuation">(</span>basePath <span class="token operator">+</span> <span class="token string">'/archived/*/*.md'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">let</span> archivedPosts <span class="token operator">=</span> <span class="token function">generateSidebar</span><span class="token punctuation">(</span>archivedPaths<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">let</span> generalSidebar <span class="token operator">=</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token string">'/'</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">themeConfig</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">sidebar</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token string-property property">'/archive/'</span><span class="token operator">:</span> generalSidebar<span class="token punctuation">.</span><span class="token function">concat</span><span class="token punctuation">(</span><span class="token punctuation">[</span>archivedPosts<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token string-property property">'/'</span><span class="token operator">:</span> generalSidebar<span class="token punctuation">.</span><span class="token function">concat</span><span class="token punctuation">(</span><span class="token punctuation">[</span>blogPosts<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>For more details about sidebar config, you may read the <a href="https://vuepress.vuejs.org/default-theme-config/#sidebar" target="_blank" rel="noopener noreferrer">official guide</a>.</p>
<h3 id="custom-components" tabindex="-1"><a class="header-anchor" href="#custom-components"><span>Custom Components</span></a></h3>
<p>VuePress is powered by Vue.js.  So obviously Vue components will work in VuePress.  In this section, I will create a component which can show a post list as a basic example of how to create a Vue component in VuePress and how to use it.</p>
<h4 id="create-a-component" tabindex="-1"><a class="header-anchor" href="#create-a-component"><span>Create a Component</span></a></h4>
<p>To create a component, you need to create <code v-pre>.vuepress/components</code> first, and put all your component <code v-pre>.vue</code> files inside.  Let's create a <code v-pre>BlogIndex.vue</code> component:</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">.</span>
<span class="line">├ blog/</span>
<span class="line">│ ├ .vuepress/</span>
<span class="line highlighted">│ │ └ components/</span>
<span class="line highlighted">│ │   └ BlogIndex.vue</span>
<span class="line">│ └ README.md</span>
<span class="line">├ ...</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>A basic component can have three sections:</p>
<ul>
<li><strong><code v-pre>&lt;template&gt;</code></strong> is the HTML part of the component</li>
<li><strong><code v-pre>&lt;style&gt;</code></strong> apparently is the CSS part</li>
<li><strong><code v-pre>&lt;script&gt;</code></strong> is the Javascript part, and where the Vue script will be in</li>
</ul>
<p>First we create the HTML which contains a table to show the post list:</p>
<div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html"><pre v-pre><code class="language-html"><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span></span>
<span class="line">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>table</span> <span class="token attr-name">class</span> <span class="token attr-value"><span class="token punctuation attr-equals">=</span> <span class="token punctuation">"</span>blog-index-list<span class="token punctuation">"</span></span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>tbody</span><span class="token punctuation">></span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>tr</span> <span class="token attr-name">v-for</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>post in posts<span class="token punctuation">"</span></span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>td</span><span class="token punctuation">></span></span>{{ formateDate(post.frontmatter.date) }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>td</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>td</span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>router-link</span> <span class="token attr-name">:to</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>post.path<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>{{ post.frontmatter.title }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>router-link</span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>td</span><span class="token punctuation">></span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>tr</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>tbody</span><span class="token punctuation">></span></span></span>
<span class="line">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>table</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>And the style to format the list:</p>
<div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html"><pre v-pre><code class="language-html"><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>style</span> <span class="token attr-name">scoped</span><span class="token punctuation">></span></span><span class="token style"><span class="token language-css"></span>
<span class="line"><span class="token selector">.blog-index-list</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">display</span><span class="token punctuation">:</span> table<span class="token punctuation">;</span></span>
<span class="line">  <span class="token property">width</span><span class="token punctuation">:</span> 100%<span class="token punctuation">;</span></span>
<span class="line">  <span class="token property">table-layout</span><span class="token punctuation">:</span> auto<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"><span class="token selector">.blog-index-list td</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">overflow</span><span class="token punctuation">:</span> hidden<span class="token punctuation">;</span></span>
<span class="line">  <span class="token property">text-overflow</span><span class="token punctuation">:</span> ellipsis<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"><span class="token selector">.blog-index-list td:first-child</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">width</span><span class="token punctuation">:</span> 1px<span class="token punctuation">;</span></span>
<span class="line">  <span class="token property">white-space</span><span class="token punctuation">:</span> nowrap<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>style</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>I set the <code v-pre>table</code> with <code v-pre>table-layout: auto;</code>, then set the first <code v-pre>td</code> with <code v-pre>width: 1px; white-space:nowrap;</code>.  This will make the first column of the table to automatically adjust the width to fit the content by itself.</p>
<p>And the <code v-pre>posts</code> used above in template is a computed property:</p>
<div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html"><pre v-pre><code class="language-html"><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript"></span>
<span class="line"><span class="token keyword">import</span> moment <span class="token keyword">from</span> <span class="token string">"moment"</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token string">'limit'</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">formateDate</span><span class="token punctuation">(</span>date<span class="token punctuation">,</span> format <span class="token operator">=</span> <span class="token string">'YYYY-MM-DD'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">return</span> <span class="token function">moment</span><span class="token punctuation">(</span>date<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">format</span><span class="token punctuation">(</span>format<span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token literal-property property">computed</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">posts</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">let</span> posts <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$site<span class="token punctuation">.</span>pages</span>
<span class="line">        <span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span><span class="token parameter">post</span> <span class="token operator">=></span> <span class="token operator">!</span>post<span class="token punctuation">.</span>frontmatter<span class="token punctuation">.</span>blog_index<span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span><span class="token parameter">post</span> <span class="token operator">=></span> <span class="token operator">!</span>post<span class="token punctuation">.</span>path<span class="token punctuation">.</span><span class="token function">startsWith</span><span class="token punctuation">(</span><span class="token string">'/archived/'</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">.</span><span class="token function">sort</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span>b<span class="token punctuation">.</span>frontmatter<span class="token punctuation">.</span>date<span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span>a<span class="token punctuation">.</span>frontmatter<span class="token punctuation">.</span>date<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>limit <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        posts <span class="token operator">=</span> posts<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>limit<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">      <span class="token keyword">return</span> posts<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>This component accept a property called <code v-pre>limit</code> which will use to limit the output count of the posts if set.  And I used <em>Moment.js</em> for date formatting and post sorting.</p>
<p>The <code v-pre>this.$site</code> is generated by VuePress which contains the site meta data.  And there is also a <code v-pre>this.$page</code> which contains the page meta data.  For more details, please read the <a href="https://vuepress.vuejs.org/guide/custom-themes.html#site-and-page-metadata" target="_blank" rel="noopener noreferrer">official document</a>.</p>
<h4 id="use-a-component" tabindex="-1"><a class="header-anchor" href="#use-a-component"><span>Use a Component</span></a></h4>
<p>To use a component in your Markdown files, simply write:</p>
<div class="language-markdown line-numbers-mode" data-highlighter="prismjs" data-ext="md"><pre v-pre><code class="language-markdown"><span class="line"><span class="token title important"><span class="token punctuation">##</span> Recent Posts</span></span>
<span class="line"></span>
<span class="line">Here are the 5 most recent posts.</span>
<span class="line"></span>
<span class="line highlighted"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>BlogIndex</span> <span class="token attr-name">category</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>current<span class="token punctuation">"</span></span> <span class="token attr-name">limit</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>5<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>and the component will be loaded into your webpage.</p>
<h3 id="override-css-styles" tabindex="-1"><a class="header-anchor" href="#override-css-styles"><span>Override CSS Styles</span></a></h3>
<p>Override the default theme CSS style instead of creating a whole new theme, allows you to keep receiving the updates and bug fixes for VuePress official.  By default, VuePress use <a href="http://stylus-lang.com/" target="_blank" rel="noopener noreferrer">Stylus</a>.  But you can also write CSS in .styl files.</p>
<p>To override the CSS style, create <code v-pre>.vuepress/override.styl</code> and <code v-pre>.vuepress/style.styl</code> files:</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">.</span>
<span class="line">├ blog/</span>
<span class="line">│ ├ .vuepress/</span>
<span class="line highlighted">│ │ ├ override.styl</span>
<span class="line highlighted">│ │ └ style.styl</span>
<span class="line">│ └ README.md</span>
<span class="line">├ ...</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>In <code v-pre>override.styl</code>, only override the default variables of the default theme:</p>
<div class="language-stylus line-numbers-mode" data-highlighter="prismjs" data-ext="styl"><pre v-pre><code class="language-stylus"><span class="line"><span class="token comment">// showing default values</span></span>
<span class="line"><span class="token variable-declaration"><span class="token variable">$accentColor</span> <span class="token operator">=</span> <span class="token hexcode">#3eaf7c</span></span></span>
<span class="line"><span class="token variable-declaration"><span class="token variable">$textColor</span> <span class="token operator">=</span> <span class="token hexcode">#2c3e50</span></span></span>
<span class="line"><span class="token variable-declaration"><span class="token variable">$borderColor</span> <span class="token operator">=</span> <span class="token hexcode">#eaecef</span></span></span>
<span class="line"><span class="token variable-declaration"><span class="token variable">$codeBgColor</span> <span class="token operator">=</span> <span class="token hexcode">#282c34</span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>And write your custom styles in <code v-pre>style.styl</code>.  Note that you can create custom variables and import other .styl files:</p>
<div class="language-stylus line-numbers-mode" data-highlighter="prismjs" data-ext="styl"><pre v-pre><code class="language-stylus"><span class="line"><span class="token atrule-declaration"><span class="token atrule">@import</span> <span class="token string">"another-style.styl"</span></span></span>
<span class="line"></span>
<span class="line"><span class="token variable-declaration"><span class="token variable">$myColor</span> <span class="token operator">=</span> <span class="token hexcode">#FFFFFF</span><span class="token punctuation">;</span></span></span>
<span class="line"><span class="token variable-declaration"><span class="token variable">$anotherColor</span> <span class="token operator">=</span> <span class="token hexcode">#000000</span><span class="token punctuation">;</span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>These two files will be loaded automatically and applied to your VuePress.</p>
<h2 id="migrate-from-wordpress-to-vuepress" tabindex="-1"><a class="header-anchor" href="#migrate-from-wordpress-to-vuepress"><span>Migrate from Wordpress to VuePress</span></a></h2>
<p>I've hosted my blog on Wordpress for several years.  And I want to keep my old posts while moving to new blog.  Fortunately, I found this tools to help me to convert my Wordpress posts to Markdown files:</p>
<p><a href="https://github.com/lonekorean/wordpress-export-to-markdown" target="_blank" rel="noopener noreferrer">wordpress-export-to-markdown</a> by <a href="https://github.com/lonekorean" target="_blank" rel="noopener noreferrer">lonekorean</a></p>
<p>Before using this tool, you will have to:</p>
<ul>
<li>Install <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">Node.js</a> v10.12+</li>
<li><a href="https://codex.wordpress.org/Tools_Export_Screen" target="_blank" rel="noopener noreferrer">Export your Wordpress posts to XML file</a></li>
</ul>
<p>and clone this project to a folder:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">git</span> clone git@github.com:lonekorean/wordpress-export-to-markdown.git</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>then run the commands:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> <span class="token function">install</span></span>
<span class="line"><span class="token function">node</span> index.js</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>and it will create a folder <code v-pre>./output</code> which contains all your posts in Markdown and the images that were added by dragging/dropping or clicking Add Media or Set Featured Image when editing a post in Wordpress.</p>
<p>And here you go, copy the files in <code v-pre>output</code> to your site generator's folder.</p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>Note that, although the images are downloaded, they are not linked in Markdown files.  That is, all the image links in Markdown files ares still point to the old URL.  You will have to edit them to new URL (the downloaded images path) manually.</p>
</div>
<h2 id="conclusion" tabindex="-1"><a class="header-anchor" href="#conclusion"><span>Conclusion</span></a></h2>
<p>VuePress is a new but powerful static site generator.  With GitLab powerful CI/CD support, you may easily create a static website in minutes.  There are still lots of options for customizing your VuePress.  And as VuePress is still under active development, lots of new features are coming in the near future.  Please remember to visit the <a href="https://vuepress.vuejs.org" target="_blank" rel="noopener noreferrer">official VuePress website</a> (which is also built with VuePress itself) and read the documents there.</p>
<h2 id="future-works" tabindex="-1"><a class="header-anchor" href="#future-works"><span>Future Works</span></a></h2>
<p>In this article, I demonstrated how to build a blog with VuePress 0.14.10.  As of the time of writing, the <a href="https://v1.vuepress.vuejs.org/" target="_blank" rel="noopener noreferrer">VuePress 1.x</a> is under development which is still in Alpha state (1.0.0-alpha.44 so far).  VuePress 1.x has more customization options, such as plugins, themes, permalinks, etc.  But it's still not stable yet that the site might crash under some circumstances.  And the 0.x is still under maintain.  I do believe I will upgrade my blog once the 1.x is released, and may wirte a new article to share my thought.</p>
</div></template>


