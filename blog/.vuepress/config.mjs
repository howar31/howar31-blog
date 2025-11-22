import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { googleAnalyticsPlugin } from "@vuepress/plugin-google-analytics";
import { pwaPlugin } from "@vuepress/plugin-pwa";
import { searchPlugin } from "@vuepress/plugin-search";

// const glob = require('glob');
// const fs = require('fs');
// const moment = require('moment');
// const grayMatter = require('gray-matter');

// const basePath = 'blog';  // VuePress generated path default is 'docs'
// const sortDelimiter = ';';

// /**
//  * Generate sidebar array
//  * @param {array} markdownPaths contains an array list of file paths
//  * @param {bool} sort sort the output array by 'date' in YAML header descendantly or not
//  * @param {int} limit limit the returned results, 0 will return all results
//  */
// function generateSidebar(markdownPaths, sort = true, limit = 0) {
//     let renderedPosts = new Array();

//     if (sort) {
//         markdownPaths.forEach(filePath => {
//             fileContents = fs.readFileSync(filePath, 'utf8').toString();
//             fileMeta = grayMatter(fileContents);
//             if (fileMeta.data.blog_index == true) return;
//             fileTimestamp = moment(fileMeta.date);
//             renderedPosts.push(fileTimestamp + sortDelimiter + filePath);
//         });
//         renderedPosts = renderedPosts.sort().reverse();
//         if (limit > 0) {
//             renderedPosts = renderedPosts.slice(0, limit);
//         }
//         renderedPosts.forEach((sortedPath, index, array) => {
//             array[index] = sortedPath.substring(sortedPath.indexOf(sortDelimiter) + sortDelimiter.length + basePath.length, sortedPath.lastIndexOf('/')) + '/';
//         });
//     } else {
//         renderedPosts = markdownPaths.map(filePath => filePath.substring(basePath.length, filePath.lastIndexOf('/')) + '/');
//     }

//     return renderedPosts;
// }

// // Generate blog post sidebar
// let blogPaths = glob.sync(basePath + '/*/*.md');
// let blogPosts = generateSidebar(blogPaths, true, 5);

// // Generate archived Wordpress post sidebar
// let wordpressPaths = glob.sync(basePath + '/wordpress/*/*.md');
// let wordpressPosts = generateSidebar(wordpressPaths, true, 5);

// let generalSidebar = [
//     '/',
// ];

export default defineUserConfig({
    shouldPrefetch: false,
    head: [
        ["link", { rel: "manifest", href: "/manifest.json" }],
        ["link", { rel: "icon", href: "/logo/Howar31_Avatar_2015_140px.png" }],
        [
            "link",
            {
                rel: "apple-touch-icon",
                href: "/logo/Howar31_Avatar_2015_140px.png",
            },
        ],
        [
            "link",
            {
                rel: "stylesheet",
                href: "https://use.fontawesome.com/releases/v5.8.1/css/all.css",
                integrity:
                    "sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf",
                crossorigin: "anonymous",
            },
        ],
        [
            "meta",
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
        ],
        ["meta", { name: "mobile-web-app-capable", content: "yes" }],
        ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
        [
            "meta",
            { name: "apple-mobile-web-app-status-bar-style", content: "black" },
        ],
        [
            "meta",
            {
                name: "msapplication-TileImage",
                content: "/logo/Howar31_Avatar_2015_140px.png",
            },
        ],
        ["meta", { name: "msapplication-TileColor", content: "#272822" }],
        ["meta", { name: "theme-color", content: "#272822" }],
        [
            "meta",
            {
                prefix: "og: http://ogp.me/ns#",
                property: "og:type",
                content: "article",
            },
        ],
        [
            "meta",
            {
                prefix: "og: http://ogp.me/ns#",
                property: "og:image",
                content:
                    "http://blog.howar31.com/logo/Howar31_Avatar_2015_background.png",
            },
        ],
    ],
    bundler: viteBundler(),
    title: "Howar31 Blog",
    description: "Dev Notes and Idea Sharing with ❤",
    dest: "public",
    theme: defaultTheme({
        logo: "/logo/Howar31_Avatar_2015_140px.png",
        navbar: [
            { text: "Home", link: "/" },
            { text: "All Posts", link: "/all-post.md" },
            { text: "Archives", link: "/wordpress/" },
            {
                text: "About",
                children: [
                    {
                        text: "Author",
                        children: [
                            {
                                text: "howar31.com",
                                link: "https://howar31.com",
                            },
                            {
                                text: "GitHub",
                                link: "https://github.com/howar31",
                            },
                        ],
                    },
                    {
                        text: "Blog",
                        children: [
                            {
                                text: "Source Code",
                                link: "https://github.com/howar31/howar31-blog-vuepress/",
                            },
                        ],
                    },
                ],
            },
        ],
        sidebarDepth: 2, // extract to h3
        sidebar: "auto",
        lastUpdated: true,
        lastUpdatedText: "Last Updated",
    }),
    plugins: [
        searchPlugin({
            // Search options
            locales: {
                "/": {
                    placeholder: "Search",
                },
            },
        }),
        googleAnalyticsPlugin({
            id: "UA-8779590-7",
        }),
        pwaPlugin({
            serviceWorker: true,
            updatePopup: true,
        }),
    ],
});
