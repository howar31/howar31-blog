<template>
    <div class="blog-index-list">
        <div class="list-item" v-for="post in posts" :key="post.path">
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
    overflow: visible;
    padding-top: 4px;
    margin-top: -4px;

    .list-item {
        transition: all 0.3s ease;
        border-radius: 0.75rem;
        padding: 1.5rem;
        margin-bottom: 1rem;
        border: 1px solid var(--c-border, #e2e8f0);
        background-color: var(--c-bg, #ffffff);
        backdrop-filter: blur(10px);

        &:nth-child(2n) {
            background-color: var(--c-bg-soft, #f8fafc);
        }

        &:hover {
            transition: all 0.3s ease;
            background-color: var(--c-bg-active, #eff6ff);
            border-color: var(--c-brand, #3b82f6);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(96, 165, 250, 0.15);
        }

        .list-item-title {
            margin-bottom: 0.5rem;

            .post-title {
                a {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--c-text, #1e293b);
                    transition: color 0.2s ease;
                    text-decoration: none;

                    &:hover {
                        color: var(--blue-400, #60a5fa);
                    }
                }
            }
        }

        .list-item-meta {
            margin-bottom: 0.75rem;
            color: var(--c-text-lighter, #94a3b8);
            font-size: 0.875rem;
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;

            & > * {
                display: inline-flex;
                align-items: center;
                gap: 0.25rem;

                i {
                    opacity: 0.7;
                }
            }
        }

        .list-item-content {
            color: var(--c-text-light, #64748b);
            line-height: 1.6;
        }
    }

    [data-theme="dark"] & {
        .list-item {
            background-color: rgba(255, 255, 255, 0.03);
            border-color: rgba(255, 255, 255, 0.1);

            &:nth-child(2n) {
                background-color: rgba(255, 255, 255, 0.05);
            }

            &:hover {
                background-color: rgba(96, 165, 250, 0.15);
                border-color: rgba(96, 165, 250, 0.3);
                box-shadow: 0 4px 12px rgba(96, 165, 250, 0.2);
            }

            .list-item-title .post-title a {
                color: rgb(241, 245, 249);

                &:hover {
                    color: rgb(96, 165, 250);
                }
            }
        }

        .list-item-meta {
            color: rgba(255, 255, 255, 0.6);
        }

        .list-item-content {
            color: rgba(255, 255, 255, 0.7);
        }
    }

    @media (max-width: 719px) {
        .list-item {
            padding: 1rem;
            border-radius: 0.5rem;
        }

        .list-item-title .post-title a {
            font-size: 1.1rem;
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

let routes;
try {
    routes = useRoutes();
} catch (e) {
    console.warn("useRoutes() failed:", e);
    routes = { value: null };
}

const allPages = ref([]);

onMounted(async () => {
    if (!routes || !routes.value) {
        console.warn("Routes not available");
        return;
    }

    const pagesData = [];
    const routeEntries = Object.entries(routes.value);

    const validRoutes = routeEntries.filter(([path]) => {
        return (
            path !== "/" && !path.includes("404") && path !== "/all-post.html"
        );
    });

    const batchSize = 5;
    for (let i = 0; i < validRoutes.length; i += batchSize) {
        const batch = validRoutes.slice(i, i + batchSize);

        const batchPromises = batch.map(async ([path, route]) => {
            try {
                if (!route.loader) {
                    return null;
                }

                const module = await route.loader();
                if (module.data) {
                    const data = module.data;
                    const frontmatter = data.frontmatter || {};

                    if (frontmatter.blog_index) {
                        return null;
                    }

                    return {
                        path: data.path || path,
                        title: frontmatter.title || data.title || "",
                        date: frontmatter.date || "",
                        description: frontmatter.description || "",
                        categories: frontmatter.categories || [],
                        tags: frontmatter.tags || [],
                    };
                }
            } catch (e) {
                console.warn("Error loading page:", path, e);
                return null;
            }
        });

        const batchResults = await Promise.all(batchPromises);
        const validResults = batchResults.filter((item) => item !== null);
        pagesData.push(...validResults);

        if (pagesData.length > 0) {
            allPages.value = [...pagesData];
        }

        if (i + batchSize < validRoutes.length) {
            await new Promise((resolve) => setTimeout(resolve, 50));
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
