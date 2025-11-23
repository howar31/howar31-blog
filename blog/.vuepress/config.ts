import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import customTheme from "./theme/index.js";
import { googleAnalyticsPlugin } from "@vuepress/plugin-google-analytics";
import { pwaPlugin } from "@vuepress/plugin-pwa";
import { searchPlugin } from "@vuepress/plugin-search";

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
        ["meta", { name: "msapplication-TileColor", content: "#000000" }],
        ["meta", { name: "theme-color", content: "#000000" }],
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
    bundler: viteBundler({
        viteOptions: {
            build: {
                rollupOptions: {
                    output: {
                        manualChunks: (id: string) => {
                            // Consolidate all vendor code into a single chunk to reduce requests
                            if (id.includes("node_modules")) {
                                return "vendor";
                            }
                        },
                    },
                },
                chunkSizeWarningLimit: 1000,
            },
        },
    }),
    title: "Howar31 Blog",
    description: "Dev Notes and Idea Sharing with ❤",
    dest: "public",
    theme: customTheme({
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
        sidebarDepth: 2,
        sidebar: false,
        lastUpdated: true,
        lastUpdatedText: "Last Updated",
    }),
    plugins: [
        searchPlugin({
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
            updatePopup: true,
        }),
    ],
});
