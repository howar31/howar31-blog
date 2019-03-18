<template>
<div>
    aaa
</template>

<script>
import moment from "moment"
export default {
    methods: {
        formateDate(date, format = 'YYYY-MM-DD') {
            return moment(date).format(format)
        },
    },
    computed: {
        posts() {
            return this.$site.pages
                .filter(x => !x.path.startsWith('/wordpress/') && !x.frontmatter.blog_index)
                .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
        }
    }
}
</script>