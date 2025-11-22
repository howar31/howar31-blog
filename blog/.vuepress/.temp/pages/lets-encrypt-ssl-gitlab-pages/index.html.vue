<template><div><h1 id="secure-gitlab-pages-with-let-s-encrypt-certificate" tabindex="-1"><a class="header-anchor" href="#secure-gitlab-pages-with-let-s-encrypt-certificate"><span>Secure GitLab Pages with Let's Encrypt Certificate</span></a></h1>
<div class="hint-container tip">
<p class="hint-container-title">Edit - 2019.06.25</p>
<ul>
<li>Add <a href="#automatically-renew-and-deploy-certificate-on-gitlab-pages">About Getting Certificates on Let's Encrypt</a> section.</li>
<li>Add <a href="#automatically-renew-and-deploy-certificate-on-gitlab-pages">Automatically Renew and Deploy Certificate on GitLab Pages</a> section.</li>
<li>Add <a href="#references">References</a> section.</li>
<li>Fix typo.</li>
</ul>
</div>
<p>Using SSL to secure your website is not only for safety, but also <a href="https://blog.chromium.org/2017/04/next-steps-toward-more-connection.html" target="_blank" rel="noopener noreferrer">tell browser not show your website as not secure</a>.  <strong>Let's Encrypt</strong> provides free SSL/TSL cerfiticates as long as you remember to renew them once in a while.  And wildcard certificates can be applied to all the subdomains.</p>
<p>In this article, I will show you how to apply for a certificate on Let's Encrypt, and set it on GitLab Pages.</p>
<h2 id="environment-requirements" tabindex="-1"><a class="header-anchor" href="#environment-requirements"><span>Environment &amp; Requirements</span></a></h2>
<p>Environment for following instructions:</p>
<ul>
<li>macOS Mojave, 10.14.3</li>
<li>Homebrew 2.0.5
<ul>
<li>Homebrew/homebrew-core (git revision 528fa; last commit 2019-03-22)</li>
<li>Homebrew/homebrew-cask (git revision f9c58; last commit 2019-03-16)</li>
</ul>
</li>
<li>certbot 0.32.0</li>
</ul>
<p>Of course, you will have to own a domain before you can apply a certificate on it.</p>
<h2 id="about-getting-certificates-on-let-s-encrypt" tabindex="-1"><a class="header-anchor" href="#about-getting-certificates-on-let-s-encrypt"><span>About Getting Certificates on Let's Encrypt</span></a></h2>
<h3 id="certificate-types" tabindex="-1"><a class="header-anchor" href="#certificate-types"><span>Certificate Types</span></a></h3>
<p>There are 2 types of SSL certificate, regular and wildcard.</p>
<h4 id="regular-ssl-certificates" tabindex="-1"><a class="header-anchor" href="#regular-ssl-certificates"><span>Regular SSL Certificates</span></a></h4>
<p>The regular ssl certificate will issue to your specific domain.  And you may only use the certificate on that specific domain.  For example: <code v-pre>blog.example.com</code>.</p>
<h4 id="wildcard-certificate" tabindex="-1"><a class="header-anchor" href="#wildcard-certificate"><span>Wildcard Certificate</span></a></h4>
<p>While wildcard certificate will allow you to use the certificate on all subdomains you have.  For example: <code v-pre>*.example.com</code>.</p>
<h3 id="challenges" tabindex="-1"><a class="header-anchor" href="#challenges"><span>Challenges</span></a></h3>
<p>Let's Encrypt needs you to prove that the website/domain is owned by you before issuing the certificates, the verification process is called <strong>Challenge</strong>.  There are currently 2 types of challenges are commonly used as of the time of writing.</p>
<p>For more detail about challenges, please visit <a href="https://letsencrypt.org/docs/challenge-types/" target="_blank" rel="noopener noreferrer">the official Let's Encrypt document</a>.</p>
<h4 id="http-01" tabindex="-1"><a class="header-anchor" href="#http-01"><span>HTTP-01</span></a></h4>
<p><code v-pre>HTTP-01</code> is used to verify that the website is under your control.  You will need to upload a specific file with specific content to the specific path on your website.  Let's Encrypt (certbot) will tell you what to put and where to put, and after that it will check if you have fulfill the challenge or not.</p>
<p>This method is easy to be done since you only need to put file on the web server.  You don't need to deal with complicated server configurations.  But note that this challenge can only be done on port 80 for security reason.</p>
<h4 id="dns-01" tabindex="-1"><a class="header-anchor" href="#dns-01"><span>DNS-01</span></a></h4>
<p><code v-pre>DNS-01</code> is usually used while you want to get a wildcard certificate.  This challenge will ask you to prove that the DNS for your domain is under your control by putting a specific TXT record on the domain.</p>
<p>This method is more complicated since you have to config the DNS settings.  But it can offer you a wildcard certificate.  Please note that you must pass this challenge if you want to get a wildcard certificate, since HTTP-01 cannot prove you own the domain.</p>
<h3 id="modes" tabindex="-1"><a class="header-anchor" href="#modes"><span>Modes</span></a></h3>
<p>We will use <strong>certbot</strong>, a tool provided by Let's Encrypt, to request a certificate.  There are 2 modes for certbot to get the certificates: Manual Mode and Auto Mode.</p>
<h4 id="manual-mode" tabindex="-1"><a class="header-anchor" href="#manual-mode"><span>Manual Mode</span></a></h4>
<p>The Manual Mode is simple.  You apply the certificate with interactive shell to get pass the challenge.  But the certificates issued by Let's Encrypt expire after 3 months.  Which means you will need to renew the certificates every 3 months.  So you might want to use Auto Mode to get the certificates.</p>
<h4 id="auto-mode" tabindex="-1"><a class="header-anchor" href="#auto-mode"><span>Auto Mode</span></a></h4>
<p>By using <a href="https://certbot.eff.org/docs/using.html#getting-certificates-and-choosing-plugins" target="_blank" rel="noopener noreferrer">certbot plugins</a>, you may pass the challenges automatically and also update the certificates on your Apache/Nginx servers.  To get certificates by Auto Mode, you will need plugin support (or host support) to auto fulfill the challenges and update your certificates.</p>
<h2 id="obtaining-a-wildcard-certificate-with-manual-mode" tabindex="-1"><a class="header-anchor" href="#obtaining-a-wildcard-certificate-with-manual-mode"><span>Obtaining a Wildcard Certificate with Manual Mode</span></a></h2>
<p>In the following tutorial, I will show you how to get a wildcard certificate and set it on GitLab Pages with manual mode.</p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>I haven't find a way to <strong>automatically</strong> renew the <strong>wildcard</strong> certificate and deploy it on GitLab Pages.  If you know how to do it please tell me!</p>
</div>
<h3 id="get-wildcard-certificate-from-let-s-encrypt" tabindex="-1"><a class="header-anchor" href="#get-wildcard-certificate-from-let-s-encrypt"><span>Get Wildcard Certificate from Let's Encrypt</span></a></h3>
<p>First, install certbot:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">brew <span class="token function">install</span> certbot</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>and request a certificate:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">sudo</span> certbot certonly <span class="token parameter variable">-a</span> manual <span class="token parameter variable">-d</span> *.example.com <span class="token parameter variable">--email</span> your@email.com</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>remember to change the <code v-pre>*.example.com</code> and <code v-pre>your@email.com</code> to your own.  Note that <code v-pre>*.</code> before your domain is <strong>required</strong> for requesting a wildcard certificate.</p>
<p>Now the certbot will ask you soome question and provide the verification instruction:</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">Saving debug log to /var/log/letsencrypt/letsencrypt.log</span>
<span class="line">Plugins selected: Authenticator manual, Installer None</span>
<span class="line"></span>
<span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line">Please read the Terms of Service at</span>
<span class="line">https://letsencrypt.org/documents/LE-SA-v1.2-November-15-2017.pdf. You must</span>
<span class="line">agree in order to register with the ACME server at</span>
<span class="line">https://acme-v02.api.letsencrypt.org/directory</span>
<span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line">(A)gree/(C)ancel: a</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>press <code v-pre>a</code> to agree the terms.</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line">Would you be willing to share your email address with the Electronic Frontier</span>
<span class="line">Foundation, a founding partner of the Let's Encrypt project and the non-profit</span>
<span class="line">organization that develops Certbot? We'd like to send you email about our work</span>
<span class="line">encrypting the web, EFF news, campaigns, and ways to support digital freedom.</span>
<span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line">(Y)es/(N)o: n</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>press <code v-pre>n</code> if you don't want to subscribe the EFF news letter.</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">Obtaining a new certificate</span>
<span class="line">Performing the following challenges:</span>
<span class="line">http-01 challenge for example.com</span>
<span class="line"></span>
<span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line">NOTE: The IP of this machine will be publicly logged as having requested this</span>
<span class="line">certificate. If you're running certbot in manual mode on a machine that is not</span>
<span class="line">your server, please ensure you're okay with that.</span>
<span class="line"></span>
<span class="line">Are you OK with your IP being logged?</span>
<span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line">(Y)es/(N)o: y</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>press <code v-pre>y</code> to agree the IP logging.</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line">Please deploy a DNS TXT record under the name</span>
<span class="line">_acme-challenge.example.com with the following value:</span>
<span class="line"></span>
<span class="line">sdfa81NrRvsI3afw8jFeULwefi81723n98FHEfwf813elwf</span>
<span class="line"></span>
<span class="line">Before continuing, verify the record is deployed.</span>
<span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line">Press Enter to Continue</span>
<span class="line">Waiting for verification...</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>DO NOT PRESS ENTER</strong> for now, Let's Encrypt will have to verify you own the domain.  So you have to create a <code v-pre>TXT</code> record with name <code v-pre>_acme-challenge.example.com</code> and value <code v-pre>sdfa81NrRvsI3afw8jFeULwefi81723n98FHEfwf813elwf</code> (your value may vary) in your DNS. (I assume you know how to do that since you own a domain)</p>
<p>After creating the record, you may use some online tools to see the <code v-pre>TXT</code> record is properly set or not.  Then get back to your terminal and press <strong>ENTER</strong> to continue.</p>
<p>If Let's Encrypt successfully verified your record, the certbot will say:</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">Cleaning up challenges</span>
<span class="line"></span>
<span class="line">IMPORTANT NOTES:</span>
<span class="line"> - Congratulations! Your certificate and chain have been saved at:</span>
<span class="line">   /etc/letsencrypt/live/example.com-0001/fullchain.pem</span>
<span class="line">   Your key file has been saved at:</span>
<span class="line">   /etc/letsencrypt/live/example.com-0001/privkey.pem</span>
<span class="line">   Your cert will expire on 20xx-xx-xx. To obtain a new or tweaked</span>
<span class="line">   version of this certificate in the future, simply run certbot</span>
<span class="line">   again. To non-interactively renew *all* of your certificates, run</span>
<span class="line">   "certbot renew"</span>
<span class="line"> - If you like Certbot, please consider supporting our work by:</span>
<span class="line"></span>
<span class="line">   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate</span>
<span class="line">   Donating to EFF:                    https://eff.org/donate-le</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>as the message said, your wildcard certificate is now stored as <code v-pre>fullchain.pem</code> and <code v-pre>privkey.pem</code>.  Please keep the files if you need to put it on your own web server.</p>
<p>For setting the certificate on GitLab Pages, please read on.</p>
<h3 id="set-the-certificate-on-gitlab-pages" tabindex="-1"><a class="header-anchor" href="#set-the-certificate-on-gitlab-pages"><span>Set the Certificate on GitLab Pages</span></a></h3>
<p>Open your GitLab project and go to <strong>Settings &gt; Pages</strong>.  Find your own domain and click <strong>Details &gt; Edit</strong>.</p>
<p><img src="@source/lets-encrypt-ssl-gitlab-pages/images/setup_certificate.png" alt=""></p>
<p>Copy your <code v-pre>fillchain.pem</code> to clipboard:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">sudo</span> <span class="token function">cat</span> /etc/letsencrypt/live/example.com-0001/fullchain.pem <span class="token operator">|</span> pbcopy</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>and paste it into the first field <strong>Certificate (PEM)</strong>.</p>
<p>Then copy your <code v-pre>privkey.pem</code> to clipboard:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">sudo</span> <span class="token function">cat</span> /etc/letsencrypt/live/example.com-0001/privkey.pem <span class="token operator">|</span> pbcopy</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>and paste it into the second field <strong>Key (PEM)</strong>.</p>
<p>Click <strong>Save Changes</strong>, and wait for about 10 minutes for DNS propagation.</p>
<p>You may also enable <strong>Force domains with SSL certificates to use HTTPS</strong> in <strong>Settings &gt; Pages</strong>.</p>
<h2 id="automatically-renew-and-deploy-certificate-on-gitlab-pages" tabindex="-1"><a class="header-anchor" href="#automatically-renew-and-deploy-certificate-on-gitlab-pages"><span>Automatically Renew and Deploy Certificate on GitLab Pages</span></a></h2>
<p>With the above tutorial,  you can apply a wildcard certificate on GitLab Pages.  But renew it every 3 months will drive you crazy eventually.  So we do need a automatic solution.</p>
<p>As I said previously, I haven't find a way to <em>automatically</em> renew the <em>wildcard</em> certificate and deploy it on GitLab Pages.  But I do find a way to automatically renew a <strong>regulay certificate</strong> and update it on GitLab Pages with the help of <strong>GitLab CI/CD</strong> and npm package <strong>gitlab-letsencrypt</strong>!</p>
<h3 id="npm-package-gitlab-letsencrypt" tabindex="-1"><a class="header-anchor" href="#npm-package-gitlab-letsencrypt"><span>NPM Package gitlab-letsencrypt</span></a></h3>
<p><a href="https://www.npmjs.com/package/gitlab-letsencrypt" target="_blank" rel="noopener noreferrer">gitlab-letsencrypt</a> is a npm package which can help you to renew the certificate and apply it on GitLab Pages automatically.  It use GitLab CI to pass HTTP-01 challenges, and use GitLab API to update your GitLab Pages' certificate.</p>
<p>How it works detail is described in <a href="https://www.npmjs.com/package/gitlab-letsencrypt#how-it-works" target="_blank" rel="noopener noreferrer">package document</a>:</p>
<ol>
<li>Requests a challenge from Let's Encrypt using the provided email address for the specified domains. One challenge file is generated per domain</li>
<li>Each challenge file is uploaded to your GitLab repository using GitLab's API, which commits to your repository</li>
<li>The challenge URL is repeatedly polled until the challenge file is made available. GitLab Pages take a while to update after changes are committed</li>
<li>If Let's Encrypt was able to verify the challenge file, a certificate for that domain is issued</li>
<li>Each challenge file is removed from your GitLab repository by committing to it through the GitLab API</li>
<li>If --production was set, your GitLab page is configured to use the issued certificate</li>
</ol>
<p>In summary, the gitlab-letsencrypt will trigger the HTTP-01 challenge, and upload the file for verification, and delete the file after challenge passed.  And then use GitLab API to update the certificate for your GitLab Pages.</p>
<h3 id="setup-gitlab-ci" tabindex="-1"><a class="header-anchor" href="#setup-gitlab-ci"><span>Setup GitLab CI</span></a></h3>
<p>We first need modify your CI file.  As you might already have CI for GitLab Pages, append the new job to the CI file.</p>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code class="language-yaml"><span class="line"><span class="token key atrule">pages</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">stage</span><span class="token punctuation">:</span> deploy</span>
<span class="line">  <span class="token key atrule">script</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> mkdir .public</span>
<span class="line">    <span class="token punctuation">-</span> cp <span class="token punctuation">-</span>r * .public</span>
<span class="line">    <span class="token punctuation">-</span> mv .public public</span>
<span class="line">  <span class="token key atrule">artifacts</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">paths</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> public</span>
<span class="line">  <span class="token key atrule">only</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> master</span>
<span class="line highlighted">  <span class="token key atrule">except</span><span class="token punctuation">:</span></span>
<span class="line highlighted">    <span class="token punctuation">-</span> schedules</span>
<span class="line highlighted"></span>
<span class="line highlighted"><span class="token key atrule">lets-encrypt</span><span class="token punctuation">:</span></span>
<span class="line highlighted">  <span class="token key atrule">stage</span><span class="token punctuation">:</span> deploy</span>
<span class="line highlighted">  <span class="token key atrule">image</span><span class="token punctuation">:</span> node<span class="token punctuation">:</span><span class="token number">8</span></span>
<span class="line highlighted">  <span class="token key atrule">script</span><span class="token punctuation">:</span></span>
<span class="line highlighted">    <span class="token punctuation">-</span> npm install <span class="token punctuation">-</span>g gitlab<span class="token punctuation">-</span>letsencrypt</span>
<span class="line highlighted">    <span class="token punctuation">-</span> gitlab<span class="token punctuation">-</span>le <span class="token punctuation">-</span><span class="token punctuation">-</span>production <span class="token punctuation">-</span><span class="token punctuation">-</span>email $LE_EMAIL <span class="token punctuation">-</span><span class="token punctuation">-</span>domain $LE_DOMAIN <span class="token punctuation">-</span><span class="token punctuation">-</span>repository $GL_REPOSITORY <span class="token punctuation">-</span><span class="token punctuation">-</span>token $GL_TOKEN</span>
<span class="line highlighted">  <span class="token key atrule">only</span><span class="token punctuation">:</span></span>
<span class="line highlighted">    <span class="token punctuation">-</span> schedules</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Add a new job <code v-pre>lets-encrypt</code> to your <code v-pre>.gitlab-ci.yml</code> file.  The <code v-pre>except</code> in <code v-pre>pages</code> and <code v-pre>only</code> in <code v-pre>lets-encrypt</code> is set to <code v-pre>schedules</code> which means the job will only be execute on <code v-pre>schedules</code> and won't be executed in <code v-pre>master</code>.</p>
<p>In the script above, we use GitLab variables (<code v-pre>$LE_EMAIL</code>, <code v-pre>$LE_DOMAIN</code>, <code v-pre>$GL_REPOSITORY</code>, <code v-pre>$GL_TOKEN</code>) to keep those config values private.  Go to project <code v-pre>Settings &gt; CI/CD &gt; Variables</code> to fill up the values.</p>
<p><img src="@source/lets-encrypt-ssl-gitlab-pages/images/setup_variables.png" alt=""></p>
<p>And thejn go to project <code v-pre>CI/CD &gt; Schedules</code> to setup a schedule for this job.  Set it to run once per month will be enough since Let's Encrypt certificate expire in 3 months.</p>
<p><img src="@source/lets-encrypt-ssl-gitlab-pages/images/setup_schedules.png" alt=""></p>
<p>And that's all, save the pipeline schedule and everything is done.  You may run the schedule manually to verify the job is set correctly.  And the schedule will also be triggered once a month to automatically renew your certificate.</p>
<h2 id="references" tabindex="-1"><a class="header-anchor" href="#references"><span>References</span></a></h2>
<h3 id="official-docs" tabindex="-1"><a class="header-anchor" href="#official-docs"><span>Official Docs</span></a></h3>
<ul>
<li><a href="https://docs.gitlab.com/ee/user/project/pages/lets_encrypt_for_gitlab_pages.html" target="_blank" rel="noopener noreferrer">Let's Encrypt for GitLab Pages</a></li>
<li><a href="https://certbot.eff.org/docs/" target="_blank" rel="noopener noreferrer">Certbot documentation</a></li>
</ul>
<h3 id="community-posts" tabindex="-1"><a class="header-anchor" href="#community-posts"><span>Community Posts</span></a></h3>
<ul>
<li><a href="https://arothuis.nl/posts/lets-encrypt-gitlab-pages/" target="_blank" rel="noopener noreferrer">Let's Encrypt GitLab Pages And automate the process</a></li>
</ul>
</div></template>


