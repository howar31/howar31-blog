<template>
    <div class="blog-index-list">
        <div class="list-item" v-for="post in posts">
            <div class="list-item-title">
                <span class="post-title"
                    ><router-link :to="post.path">{{
                        post.title || post.path || "Untitled"
                    }}</router-link></span
                >
            </div>
            <div class="list-item-meta" v-if="post.date">
                <span class="post-date">
                    <i class="far fa-clock"></i>
                    {{ formateDate(post.date) }}</span
                >
                <span class="post-categories" v-if="post.categories">
                    <i class="fas fa-cat"></i>
                    {{
                        Array.isArray(post.categories)
                            ? post.categories.join(", ")
                            : post.categories
                    }}</span
                >
                <span class="post-tags" v-if="post.tags">
                    <i class="fas fa-hashtag"></i>
                    {{
                        Array.isArray(post.tags)
                            ? post.tags.join(", ")
                            : post.tags
                    }}</span
                >
            </div>
            <div class="list-item-content" v-if="post.description">
                <span class="post-description">{{ post.description }}</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use "sass:color";

.blog-index-list {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;

    .list-item {
        transition: 0.3s;
        border-radius: 5px;
        padding: 20px;

        &:nth-child(2n) {
            background-color: var(--c-bg-soft, #f5f5f5);
        }
        &:hover {
            transition: 0.3s;
            background-color: var(--c-bg-active, #e8f0fe);
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
            color: var(--c-text-lighter, #666);
            font-size: 0.8em;

            & > * {
                padding-right: 10px;
            }
        }
        .list-item-content {
            color: var(--c-text-light, #999);
        }
    }

    // Dark mode support
    [data-theme="dark"] & {
        .list-item {
            &:nth-child(2n) {
                background-color: var(--c-bg-soft, rgba(255, 255, 255, 0.05));
            }
            &:hover {
                background-color: var(--c-bg-active, rgba(15, 84, 192, 0.2));
            }
        }
        .list-item-meta {
            color: var(--c-text-lighter, rgba(255, 255, 255, 0.6));
        }
        .list-item-content {
            color: var(--c-text-light, rgba(255, 255, 255, 0.7));
        }
    }

    @media (max-width: 719px) {
        .list-item {
            padding: 15px 5px;
        }
    }
}
</style>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoutes } from "@vuepress/client";
import moment from "moment";

const props = defineProps({
    type: {
        type: String,
        default: "current",
    },
    limit: {
        type: [Number, String],
        default: 0,
    },
});

const routes = useRoutes();
const allPages = ref([]);

// Fetch all page data on client side
onMounted(async () => {
    if (!routes.value) {
        console.warn("Routes not available");
        return;
    }

    // Get all page data from routes
    const pagesData = [];
    const routeEntries = Object.entries(routes.value);

    for (const [path, route] of routeEntries) {
        try {
            // Skip homepage, 404 and all-post pages
            if (
                path === "/" ||
                path.includes("404") ||
                path === "/all-post.html"
            ) {
                continue;
            }

            // Dynamically load page data
            if (route.loader) {
                const module = await route.loader();
                if (module.data) {
                    const data = module.data;
                    const frontmatter = data.frontmatter || {};

                    // Skip pages with blog_index set to true
                    if (frontmatter.blog_index) {
                        continue;
                    }

                    pagesData.push({
                        path: data.path || path,
                        title: frontmatter.title || data.title || "",
                        date: frontmatter.date || "",
                        description: frontmatter.description || "",
                        categories: frontmatter.categories || [],
                        tags: frontmatter.tags || [],
                    });
                }
            }
        } catch (e) {
            console.warn("Error loading page:", path, e);
        }
    }

    allPages.value = pagesData;
    console.log("Loaded pages:", allPages.value.length);
});

const formateDate = (date, format = "YYYY-MM-DD") => {
    if (!date) return "";
    return moment(date).format(format);
};

const posts = computed(() => {
    if (allPages.value.length === 0) {
        return [];
    }

    // Filter by type
    let filteredPosts = [...allPages.value];

    switch (props.type) {
        case "wordpress":
            filteredPosts = filteredPosts.filter((post) => {
                const path = post.path || "";
                return path.startsWith("/wordpress/");
            });
            break;

        case "current":
            filteredPosts = filteredPosts.filter((post) => {
                const path = post.path || "";
                return !path.startsWith("/wordpress/");
            });
            break;

        default:
            break;
    }

    // Sort by date
    filteredPosts = filteredPosts.sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(0);
        const dateB = b.date ? new Date(b.date) : new Date(0);
        return dateB - dateA;
    });

    const limit =
        typeof props.limit === "string"
            ? parseInt(props.limit, 10)
            : props.limit;
    if (limit > 0) {
        filteredPosts = filteredPosts.slice(0, limit);
    }

    return filteredPosts;
});
</script>
