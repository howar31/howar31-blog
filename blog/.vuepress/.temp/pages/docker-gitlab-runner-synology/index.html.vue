<template><div><h1 id="setup-dockerize-gitlab-runner-on-synology-nas" tabindex="-1"><a class="header-anchor" href="#setup-dockerize-gitlab-runner-on-synology-nas"><span>Setup Dockerize GitLab Runner on Synology NAS</span></a></h1>
<p>In this article, I will illustrate how to setup a GitLab Runner with docker executor on Synology NAS DSM.  And also show you how to setup docker-in-docker for docker executor in a container to call other docker containers/images on the host.</p>
<h2 id="environment" tabindex="-1"><a class="header-anchor" href="#environment"><span>Environment</span></a></h2>
<p>I have two Synology NAS and I tested the steps in this article on both devices.  And the system (DSM) versions are the same.</p>
<ul>
<li>Synology DS916+ and DS718+</li>
<li>DSM 6.2.1-23824 Update 6</li>
</ul>
<p>Although there are some differences from regular Docker installation, I used the Docker package from Synology Package Center which provides GUI for easy management.</p>
<ul>
<li>Docker v17.05.0-0400</li>
</ul>
<p>For GitLab Runner, I use the latest official docker image</p>
<ul>
<li>gitlab/gitlab-runner:latest (11.8.0 as the time of writing)
<ul>
<li>Git revision: 4745a6f3</li>
<li>GIt branch 11-8-stable</li>
<li>GO version: goi1.8.7</li>
<li>Built: 2019-02-22T08:01:16+0000</li>
<li>OS/Arch: linux/amd64</li>
</ul>
</li>
</ul>
<h2 id="installation" tabindex="-1"><a class="header-anchor" href="#installation"><span>Installation</span></a></h2>
<p>In the following tutorial, I will assume you have admin (root) control of your Synology NAS system.  And also already installed the Docker package from Synology Package Center.</p>
<p>For GitLab, you may use <a href="https://gitlab.com" target="_blank" rel="noopener noreferrer">gitlab.com</a>, or a self-hosted GitLab CE.  Please note that it is impossible to setup a <code v-pre>Shared Runner</code> on gitlab.com since the admin of it is GitLab company itself.</p>
<h3 id="install-dockerized-gitlab-runner" tabindex="-1"><a class="header-anchor" href="#install-dockerized-gitlab-runner"><span>Install Dockerized GitLab Runner</span></a></h3>
<p>There are many ways to run a GitLab Runner.  And one of the easiest way is to install the runner as a docker service.  It's so easy to install and run the runner as a docker service since there are GitLab official Runner docker image on <a href="https://hub.docker.com/r/gitlab/gitlab-runner/" target="_blank" rel="noopener noreferrer">Docker Hub</a>, and also <a href="https://docs.gitlab.com/runner/install/docker.html" target="_blank" rel="noopener noreferrer">official installation guide</a>.</p>
<p>To install a GitLab Runner on Synology NAS, first, SSH into your NAS.</p>
<div class="hint-container warning">
<p class="hint-container-title">Warning</p>
<p>You must enable SSH login in <code v-pre>Control Panel &gt; Terminal &amp; SNMP &gt; Terminal (tab) &gt; Enable SSH service (checkbox)</code>.  And only accounts beloning to the administrators group are able to login into NAS via SSH.</p>
</div>
<p>And use the command below to install a latest official GitLab Runner:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">--name</span> gitlab-runner-docker <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">--restart</span> always <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">--env</span> <span class="token assign-left variable">HTTP_PROXY</span><span class="token operator">=</span><span class="token string">"http://127.0.0.1:3128"</span> <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">--env</span> <span class="token assign-left variable">HTTPS_PROXY</span><span class="token operator">=</span><span class="token string">"http://127.0.0.1:3128"</span> <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">-v</span> /run/docker.sock:/var/run/docker.sock <span class="token punctuation">\</span></span>
<span class="line">gitlab/gitlab-runner:latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>--name</code> is your container's name which will also appear in <strong>Synology Docker &gt; Container</strong> GUI.</li>
<li><code v-pre>--restart always</code> will set your container auto-restart.</li>
<li><code v-pre>--env</code> will set the container's environment variables.  In this example, I set the proxy for my container. (optional)</li>
<li><code v-pre>-v</code> to monut the host file in containers.  Here I mount the host <code v-pre>docker.sock</code> which will allow the container to access the host docker, which is known as <strong>Docker-in-Docker</strong>.  We need this since I want to run the GitLab Runner as docker executor which will illustrate later.</li>
</ul>
<div class="hint-container warning">
<p class="hint-container-title">Warning</p>
<p>The Docker containers should be run as an isolated environment.  Please read <a href="https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/" target="_blank" rel="noopener noreferrer">this article</a> first before setting up Docker-in-Docker.</p>
</div>
<p>That's it!  Your GitLab Runner should be installed and up.  Check it by SSH into your Docker container:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> gitlab-runner-docker /bin/bash</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li><code v-pre>gitlab-runner-docker</code> is the container name, you should change it accordingly.</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>You may run any command in your container by:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> <span class="token operator">&lt;</span>container name<span class="token operator">></span> <span class="token operator">&lt;</span>command<span class="token operator">></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></div>
<p>And you can also see the container running in Synology Docker GUI.</p>
<h3 id="register-gitlab-runner-with-docker-executor-mode" tabindex="-1"><a class="header-anchor" href="#register-gitlab-runner-with-docker-executor-mode"><span>Register GitLab Runner with Docker Executor Mode</span></a></h3>
<p>Before using the runner in GitLab, we have to register the runner the the GitLab first.  There are several types of runners on GitLab:</p>
<ul>
<li>Shared Runners</li>
<li>Specific Runners</li>
<li>Group Runners</li>
</ul>
<p>For more runner type please read the <a href="https://docs.gitlab.com/ee/ci/runners/#shared-specific-and-group-runners" target="_blank" rel="noopener noreferrer">official documents</a>.</p>
<p>In the following tutorial, I will illustrate how to register a specific runner to gitlab.com with configs below:</p>
<ul>
<li>GitLab Runner
<ul>
<li>Hosted on Synology NAS</li>
<li>Official gitlab-runner docker image</li>
<li>GitLab Runner name: <code v-pre>gitlab-runner-docker</code></li>
</ul>
</li>
<li>GitLab
<ul>
<li>Using official GitLab (gitlab.com)</li>
</ul>
</li>
</ul>
<p>To register the runner, SSH into Synology NAS and run command with root:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> gitlab-runner-docker gitlab-runner register</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>the <code v-pre>gitlab-runner</code> is the tool command for the runner, and <code v-pre>register</code> will start the wizard to register the runner to GitLab.  For example:</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line highlighted">root@Synology-Nas:~# docker exec -it gitlab-runner-docker gitlab-runner register</span>
<span class="line">Runtime platform                                    arch=amd64 os=linux pid=30 revision=4745a6f3 version=11.8.0</span>
<span class="line">Running in system-mode.</span>
<span class="line"></span>
<span class="line">Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com/):</span>
<span class="line highlighted">https://gitlab.com</span>
<span class="line">Please enter the gitlab-ci token for this runner:</span>
<span class="line highlighted">Examp1eT0ken</span>
<span class="line">Please enter the gitlab-ci description for this runner:</span>
<span class="line highlighted">[gitlab-runner-docker]:</span>
<span class="line">Please enter the gitlab-ci tags for this runner (comma separated):</span>
<span class="line highlighted"></span>
<span class="line">Registering runner... succeeded                     runner=Examp1eT0ken</span>
<span class="line">Please enter the executor: docker, shell, ssh, kubernetes, docker-ssh, parallels, virtualbox, docker+machine, docker-ssh+machine:</span>
<span class="line highlighted">docker</span>
<span class="line">Please enter the default Docker image (e.g. ruby:2.1):</span>
<span class="line highlighted">node:latest</span>
<span class="line">Runner registered successfully. Feel free to start it, but if it's running already the config should be automatically reloaded!</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>In the example above, set the URL to gitlab.com and enter the token (<code v-pre>Examp1eT0ken</code> for example).  To get the token, you need to go to your <code v-pre>GitLab project &gt; Settings &gt; CI/CD</code> and expand <code v-pre>Runners</code> section where you can find the URL and token to copy.</p>
<p>The description and tags can be skip if you don't need it.  And the register wizard will try to connect to gitlab.com and register the runner.</p>
<p>And then you have to set the executor of the runner.  There are many types of the executors, read the <a href="https://docs.gitlab.com/runner/executors/" target="_blank" rel="noopener noreferrer">official document</a> for details.  In this tutorial, I set <code v-pre>docker</code> executor for example.  And the wizard will ask for default docker image if you set docker executor.</p>
<p>The GitLab runner is now set and all the settings will be store in <code v-pre>/etc/gitlab-runner/config.toml</code>.</p>
<p>For more details about registering the runners please read the <a href="https://docs.gitlab.com/runner/register/index.html" target="_blank" rel="noopener noreferrer">official document</a>.</p>
<h3 id="setup-docker-in-docker" tabindex="-1"><a class="header-anchor" href="#setup-docker-in-docker"><span>Setup Docker-in-Docker</span></a></h3>
<p>Since we set the runner executor as <strong>docker</strong> mode, I would suggest setup docker-in-docker which will allow your gitlab-runner container to call and use the containers on the host (Synology NAS).  This will make you more easy to manage all your containers in Synology Docker GUI.</p>
<div class="hint-container warning">
<p class="hint-container-title">Warning</p>
<p>Please read this article before setup docker-in-docker:</p>
<p><a href="https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/" target="_blank" rel="noopener noreferrer">Using Docker-in-Docker for your CI or testing environment? Think twice.</a></p>
</div>
<p>To setup docker-in-docker, we first need to SSH into the container (with root):</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> gitlab-runner-docker /bin/bash</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>and edit the runner config file:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">vi</span> /etc/gitlab-runner/config.toml</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>We have to add <code v-pre>privileged = true</code> and <code v-pre>pull_policy = &quot;if-not-present&quot;</code> to the config file:</p>
<div class="language-toml line-numbers-mode" data-highlighter="prismjs" data-ext="toml"><pre v-pre><code class="language-toml"><span class="line"><span class="token key property">concurrent</span> <span class="token punctuation">=</span> <span class="token number">1</span></span>
<span class="line"><span class="token key property">check_interval</span> <span class="token punctuation">=</span> <span class="token number">0</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token table class-name">session_server</span><span class="token punctuation">]</span></span>
<span class="line">  <span class="token key property">session_timeout</span> <span class="token punctuation">=</span> <span class="token number">1800</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token table class-name">runners</span><span class="token punctuation">]</span><span class="token punctuation">]</span></span>
<span class="line">  <span class="token key property">name</span> <span class="token punctuation">=</span> <span class="token string">"GitLab Runner Docker"</span></span>
<span class="line">  <span class="token key property">url</span> <span class="token punctuation">=</span> <span class="token string">"https://gitlab.com"</span></span>
<span class="line">  <span class="token key property">token</span> <span class="token punctuation">=</span> <span class="token string">"Examp1eT0ken"</span></span>
<span class="line">  <span class="token key property">executor</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token table class-name">runners.docker</span><span class="token punctuation">]</span></span>
<span class="line">    <span class="token key property">tls_verify</span> <span class="token punctuation">=</span> <span class="token boolean">false</span></span>
<span class="line">    <span class="token key property">image</span> <span class="token punctuation">=</span> <span class="token string">"node:latest"</span></span>
<span class="line">    <span class="token key property">disable_entrypoint_overwrite</span> <span class="token punctuation">=</span> <span class="token boolean">false</span></span>
<span class="line">    <span class="token key property">oom_kill_disable</span> <span class="token punctuation">=</span> <span class="token boolean">false</span></span>
<span class="line">    <span class="token key property">disable_cache</span> <span class="token punctuation">=</span> <span class="token boolean">false</span></span>
<span class="line">    <span class="token key property">volumes</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"/cache"</span><span class="token punctuation">]</span></span>
<span class="line">    <span class="token key property">shm_size</span> <span class="token punctuation">=</span> <span class="token number">0</span></span>
<span class="line highlighted">    <span class="token key property">privileged</span> <span class="token punctuation">=</span> <span class="token boolean">true</span></span>
<span class="line highlighted">    <span class="token key property">pull_policy</span> <span class="token punctuation">=</span> <span class="token string">"if-not-present"</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token table class-name">runners.cache</span><span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">[</span><span class="token table class-name">runners.cache.s3</span><span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">[</span><span class="token table class-name">runners.cache.gcs</span><span class="token punctuation">]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>privileged</code> will set the container to run in privileged mode which is needed to run docker-in-docker.</li>
<li><code v-pre>pull_policy</code> is optional setting which tells the docker runner to pull docker images or not.  There are 3 options:
<ul>
<li><code v-pre>never</code> will never pull docker images and only use local pulled images</li>
<li><code v-pre>if-not-present</code> will pull images if the desired image is not exist in local</li>
<li><code v-pre>always</code> will always pull docker images everytime</li>
</ul>
</li>
</ul>
<p>I suggest <code v-pre>if-not-present</code> to save the network bandwidth and the pulling time.  For more details please read the <a href="https://docs.gitlab.com/runner/executors/docker.html#how-pull-policies-work" target="_blank" rel="noopener noreferrer">offcial document</a>.</p>
<p>For more configs instruction please read the <a href="https://docs.gitlab.com/runner/configuration/advanced-configuration.html" target="_blank" rel="noopener noreferrer">official document</a>.</p>
<p>After setting the config, you need to restart the container to apply the settings.</p>
<div class="hint-container warning">
<p class="hint-container-title">Warning</p>
<p>Since it's impossible to bind the system path to docker container from Synology Docker GUI, do not edit the container settings in Synology Docker GUI which will remove your volume bindings you set with command line before.</p>
</div>
<p>And now your GitLab runner is all set and ready to run jobs in docker mode.</p>
<h3 id="unregister-the-gitlab-runner" tabindex="-1"><a class="header-anchor" href="#unregister-the-gitlab-runner"><span>Unregister the GitLab Runner</span></a></h3>
<p>You can unregister a GitLab runner from runner-side so that you don't need to go to GitLab and find the runners by yourself.  The unregister command will automatically unregister the runner and remove related setting on GitLab.</p>
<p>All you need to do is one command with <code v-pre>url</code> and <code v-pre>token</code> parameters:</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">root@gitlab-runner-docker:/# gitlab-runner unregister --url https://gitlab.com/ --token An0therExamp1eT0ken</span>
<span class="line">Runtime platform                                    arch=amd64 os=linux pid=80 revision=4745a6f3 version=11.8.0</span>
<span class="line">Running in system-mode.</span>
<span class="line"></span>
<span class="line">Unregistering runner from GitLab succeeded          runner=An0therExamp1eT0ken</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning">
<p class="hint-container-title">Warning</p>
<p>The token is not the token we used while registering the runner.  You can find the runner token in runner detail page on GitLab:</p>
<p><a href="https://gitlab.com/user-name/project-name/runners/runner-id" target="_blank" rel="noopener noreferrer">https://gitlab.com/user-name/project-name/runners/runner-id</a></p>
<p>Replace <code v-pre>user-name</code>, <code v-pre>project-name</code> and <code v-pre>runner-id</code> for your own.  Or click the runner in <code v-pre>Runners</code> section in <code v-pre>GitLab project &gt; Settings &gt; CI/CD</code>.</p>
</div>
<h2 id="references" tabindex="-1"><a class="header-anchor" href="#references"><span>References</span></a></h2>
<p><a href="https://stackoverflow.com/questions/45051723/changing-gitlab-ci-multirunner-executor-after-initial-configuration" target="_blank" rel="noopener noreferrer">https://stackoverflow.com/questions/45051723/changing-gitlab-ci-multirunner-executor-after-initial-configuration</a>
<a href="http://phase2.github.io/devtools/common-tasks/ssh-into-a-container/" target="_blank" rel="noopener noreferrer">http://phase2.github.io/devtools/common-tasks/ssh-into-a-container/</a>
<a href="https://docs.docker.com/v17.09/engine/userguide/networking/" target="_blank" rel="noopener noreferrer">https://docs.docker.com/v17.09/engine/userguide/networking/</a>
<a href="https://docs.docker.com/network/proxy/" target="_blank" rel="noopener noreferrer">https://docs.docker.com/network/proxy/</a>
<a href="https://forums.docker.com/t/how-can-i-run-docker-command-inside-a-docker-container/337/8" target="_blank" rel="noopener noreferrer">https://forums.docker.com/t/how-can-i-run-docker-command-inside-a-docker-container/337/8</a>
<a href="https://docs.gitlab.com/ee/ci/docker/using_docker_images.html" target="_blank" rel="noopener noreferrer">https://docs.gitlab.com/ee/ci/docker/using_docker_images.html</a>
<a href="https://gitlab.com/gitlab-examples/docker" target="_blank" rel="noopener noreferrer">https://gitlab.com/gitlab-examples/docker</a>
<a href="http://blog.chengweichen.com/2016/04/docker-gitlab-cigitlab-runner.html" target="_blank" rel="noopener noreferrer">http://blog.chengweichen.com/2016/04/docker-gitlab-cigitlab-runner.html</a></p>
</div></template>


