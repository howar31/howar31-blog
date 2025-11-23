import { defineClientConfig } from "@vuepress/client";
import BlogIndex from "./components/BlogIndex.vue";
import DynamicFooter from "./components/DynamicFooter.vue";
import PostMeta from "./components/PostMeta.vue";

export default defineClientConfig({
    enhance({ app }) {
        app.component("BlogIndex", BlogIndex);
        app.component("DynamicFooter", DynamicFooter);
    },
    rootComponents: [PostMeta],
});
