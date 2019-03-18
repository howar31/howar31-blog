<template>
<div>
    <table class = "blog-index-list">
        <tbody>
            <tr v-for="post in posts">
                <td>{{ formateDate(post.frontmatter.date) }}</td>
                <td><router-link :to="post.path">{{ post.frontmatter.title }}</router-link></td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<style scoped>
.blog-index-list {
    display: table;
    width: 100%;
    table-layout: fixed;
}
.blog-index-list tr {
    transition: 0.3s;
    border-top: none;
}
.blog-index-list tr:hover {
    transition: 0.3s;
    background-color: #E2EFFB;
}
.blog-index-list td {
    border: none;
    overflow: hidden;
    text-overflow: ellipsis;
}
.blog-index-list td:first-child {
    width: 90px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}
.blog-index-list td:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
}

</style>


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