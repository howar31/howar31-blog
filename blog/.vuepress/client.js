import { defineClientConfig } from '@vuepress/client'
import BlogIndex from './components/BlogIndex.vue'
import DynamicFooter from './components/DynamicFooter.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.component('BlogIndex', BlogIndex)
    app.component('DynamicFooter', DynamicFooter)
  },
})
