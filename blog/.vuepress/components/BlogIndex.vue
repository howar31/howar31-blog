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
    table-layout: auto;
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
    width: 1px;
    white-space: nowrap;
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
    props: [
        'category',
        'limit',
    ],
    methods: {
        formateDate(date, format = 'YYYY-MM-DD') {
            return moment(date).format(format)
        },
    },
    computed: {
        posts() {
            let posts = this.$site.pages.filter(post => !post.frontmatter.blog_index);

            switch (this.category) {
                case 'wordpress':
                    posts = posts.filter(post => post.path.startsWith('/wordpress/'));
                    break;

                case 'current':
                    posts = posts.filter(post => !post.path.startsWith('/wordpress/'));
                    break;

                default:
                    break;
            }

            posts = posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));

            if (this.limit > 0) {
                posts = posts.slice(0, this.limit);
            }

            return posts;
        }
    }
}
</script>