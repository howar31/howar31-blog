<template>
<div class = "blog-index-list">
    <div class="list-item" v-for="post in posts">
        <div class="list-item-title">
            <div class="post-title"><router-link :to="post.path">{{ post.frontmatter.title }}</router-link></div>
        </div>
        <div class="list-item-content">
            <span class="post-date">{{ formateDate(post.frontmatter.date) }}</span>
            <span class="post-description" v-if="post.frontmatter.description"> | {{ post.frontmatter.description }}</span>
        </div>
    </div>
</div>
</template>

<style lang="scss" scoped>
.blog-index-list {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;

    .list-item {
        transition: 0.3s;
        border-radius: 5px;
        padding: 20px;

        &:nth-child(2n) {
            background-color: #FAFAFA;
        }
        &:hover {
            transition: 0.3s;
            background-color: #E2ECFC;
        }

        .list-item-title {
            margin-bottom: 10px;

            .post-title {
                a {
                    font-size: 1.1em;
                }
            }
        }
        .list-item-content {
            color: #606354;
        }
    }

    @media (max-width: 719px) {
        .list-item {
            padding: 15px 5px;
        }
    }
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