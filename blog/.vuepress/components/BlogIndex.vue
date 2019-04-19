<template>
<div class = "blog-index-list">
    <div class="list-item" v-for="post in posts">
        <div class="list-item-title">
            <span class="post-title"><router-link :to="post.path">{{ post.frontmatter.title }}</router-link></span>
        </div>
        <div class="list-item-meta">
            <span class="post-date"> <i class="far fa-clock"></i> {{ formateDate(post.frontmatter.date) }}</span>
            <span class="post-categories" v-if="post.frontmatter.categories"> <i class="fas fa-cat"></i> {{ post.frontmatter.categories.join(', ') }}</span>
            <span class="post-tags" v-if="post.frontmatter.tags"> <i class="fas fa-hashtag"></i> {{ post.frontmatter.tags.join(', ') }}</span>
        </div>
        <div class="list-item-content">
            <span class="post-description" v-if="post.frontmatter.description">{{ post.frontmatter.description }}</span>
        </div>
    </div>
</div>
</template>

<style lang="scss" scoped>
$color-base: #272822;
$color-accent: #0F54C0;

.blog-index-list {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;

    .list-item {
        transition: 0.3s;
        border-radius: 5px;
        padding: 20px;

        &:nth-child(2n) {
            background-color: lighten($color-base, 83%);
        }
        &:hover {
            transition: 0.3s;
            background-color: lighten($color-accent, 53%);
        }

        .list-item-title {
            margin-bottom: 5px;

            .post-title {
                a {
                    font-size: 1.1em;
                }
            }
        }
        .list-item-meta {
            margin-bottom: 10px;
            color: lighten($color-base, 40%);
            font-size: 0.8em;

            & > * {
                padding-right: 10px;
            }
        }
        .list-item-content {
            color: lighten($color-base, 25%);
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
        'type',
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

            switch (this.type) {
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