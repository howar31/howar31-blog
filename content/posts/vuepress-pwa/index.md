---
title: Enable PWA Support for VuePress
date: 2019-03-22
description: Enable progressive web app support for VuePress website
categories:
  - vuepress
tags:
  - vuepress
  - pwa
  - dev-notes
---

PWAs, **Progressive Web Applications** are web applications which is loaded as a website, but can also provide native app functionalities, such as offline mode, push notification, hardware access, and more.  For more info about PWA, please read the articles metioned in [References](./#references).

## Environment

The environment I used:

- macOS Mojave, 10.14.3
- VuePress 0.14.10

I setup [my blog](https://blog.howar31.com/) as a PWA successfully.  You may visit [my blog](https://blog.howar31.com/) on your phone (Chrome on Android recommended) to see how it works.

## Setup

Accroding to [Google's instruction](https://developers.google.com/web/fundamentals/app-install-banners/), to make a website support PWA, it needs to meet the following criteria:

- The web app is not already installed.
  - and `prefer_related_applications` is not `true`.
- Meets a user engagement heuristic (currently, the user has interacted with the domain for at least 30 seconds)
- Includes a web **app manifest** that includes:
  - `short_name` or `name`
  - `icons` must include a 192px and a 512px sized icons
  - `start_url`
  - `display` must be one of: `fullscreen`, `standalone`, or `minimal-ui`
- Served over **HTTPS** (required for service workers)
- Has registered a **service worker** with a `fetch` event handler

While all the criteria above are met, the visitors will see a mini info bar on their screen, click on which will pop a dialog that allow user to install the website as an app.

Let's see how to do this.  It's simple that can be done in minutes with following steps.

### Config Service Worker

To enable the service workder in VuePress, edit `.vuepress/config.js` and add the line:

```javascriptmodule.exports = {
    serviceWorker: true,

    // more configs
}
```

After this config, VuePress will now generate a service worker while building the website.  Please note that the service worker requires **HTTPS** to work.

### Config Manifest

PWA needs manifest and icon to work.  Edit `.vuepress/config.js` and add the line:

```javascript
module.exports = {
    head: [
        ['link', { rel: 'manifest', href: '/manifest.json' }],
        ['link', { rel: 'icon', href: '/icon.png' }],
    ],

    // more configs
```

Then create `manifest.json` under `.vuepress/public/` with content:

```json
{
  "name": "PWA WebSite",
  "short_name": "PWA Site",
  "icons": [
    {
      "src": "icon.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "start_url": "/index.html",
  "display": "standalone",  // or fullscreen, or minimal-ui
  "background_color": "#FFFFFF",
  "theme_color": "#272822"
}
```

You may change the content above based on your website.

And then place your icon image under `.vuepress/public/` also.  Please note that the image must be as least **512px** sized.

## Conclusion

You may verify your PWA by using Chrome dev-tool's Audit tool.  Or manually visit your website on your phone at least twice in 30 seconds to see if the mini info bar shows up.

## References

- [PWA](https://en.wikipedia.org/wiki/Progressive_web_applications) on Wikipeida
- [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/) on Google Developers | Web
