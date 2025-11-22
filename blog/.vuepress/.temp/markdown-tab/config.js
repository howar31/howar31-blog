import { CodeTabs } from "/opt/projects/howar31-blog-vuepress/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/CodeTabs.js";
import { Tabs } from "/opt/projects/howar31-blog-vuepress/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/Tabs.js";
import "/opt/projects/howar31-blog-vuepress/node_modules/@vuepress/plugin-markdown-tab/lib/client/styles/vars.css";

export default {
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Tabs", Tabs);
  },
};
