import { defaultTheme } from "@vuepress/theme-default";
import { getDirname, path } from "vuepress/utils";
import type { Theme } from "vuepress/core";

const __dirname = getDirname(import.meta.url);

export default (options: Parameters<typeof defaultTheme>[0] = {}): Theme => {
    const baseTheme = defaultTheme(options);

    return {
        ...baseTheme,
        name: "howar31-theme",
        alias: {
            ...baseTheme.alias,
            // Override VPPage component
            "@theme/VPPage.vue": path.resolve(
                __dirname,
                "./components/VPPage.vue"
            ),
        },
    };
};
