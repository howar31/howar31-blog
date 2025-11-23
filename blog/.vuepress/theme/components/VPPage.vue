<script setup lang="ts">
import VPPageMeta from "@theme/VPPageMeta.vue";
import VPPageNav from "@theme/VPPageNav.vue";
import type { Slot } from "@vuepress/helper/client";
import { Content, usePageFrontmatter, onContentUpdated } from "vuepress/client";
import { computed, onMounted, nextTick, watch } from "vue";
import moment from "moment";

defineSlots<{
    top?: Slot;
    bottom?: Slot;
    "content-top"?: Slot;
    "content-bottom"?: Slot;
}>();

const frontmatter = usePageFrontmatter();

const isBlogPost = computed(() => {
    return (
        frontmatter.value.home !== true &&
        frontmatter.value.blog_index !== true &&
        frontmatter.value.title !== false
    );
});

const shouldShowMeta = computed(() => {
    return (
        isBlogPost.value &&
        (frontmatter.value.date ||
            frontmatter.value.description ||
            frontmatter.value.categories ||
            frontmatter.value.tags)
    );
});

const formatDateLong = (dateString: string | undefined) => {
    if (!dateString) return "";
    return moment(dateString).format("YYYY年MM月DD日");
};

const categories = computed(() => {
    const cats = frontmatter.value.categories;
    if (!cats) return [];
    return Array.isArray(cats) ? cats : [cats];
});

const tags = computed(() => {
    const tgs = frontmatter.value.tags;
    if (!tgs) return [];
    return Array.isArray(tgs) ? tgs : [tgs];
});

const insertMetaAfterTitle = () => {
    if (!shouldShowMeta.value) return;

    // Use setTimeout to ensure DOM is ready after route transition
    setTimeout(() => {
        const content = document.getElementById("content");
        if (!content) return;

        const firstH1 = content.querySelector("h1");
        if (!firstH1) return;

        if (firstH1.nextElementSibling?.classList.contains("blog-post-meta")) {
            return;
        }

        const metaContainer = document.createElement("div");
        metaContainer.className = "blog-post-meta";

        if (frontmatter.value.date) {
            const dateRow = document.createElement("div");
            dateRow.className = "meta-row";
            const dateItem = document.createElement("span");
            dateItem.className = "meta-item";
            const dateStr = formatDateLong(frontmatter.value.date);
            dateItem.innerHTML = `
                <i class="far fa-clock"></i>
                <time datetime="${frontmatter.value.date}">${dateStr}</time>
            `;
            dateRow.appendChild(dateItem);
            metaContainer.appendChild(dateRow);
        }

        if (frontmatter.value.description) {
            const descDiv = document.createElement("div");
            descDiv.className = "meta-description";
            const descP = document.createElement("p");
            descP.textContent = frontmatter.value.description;
            descDiv.appendChild(descP);
            metaContainer.appendChild(descDiv);
        }

        if (categories.value.length > 0 || tags.value.length > 0) {
            const metaRow = document.createElement("div");
            metaRow.className = "meta-row";

            if (categories.value.length > 0) {
                const catItem = document.createElement("span");
                catItem.className = "meta-item";
                catItem.innerHTML = `
                    <i class="fas fa-cat"></i>
                    <span class="meta-label">分類：</span>
                    <span class="meta-value">${categories.value.join(
                        "、"
                    )}</span>
                `;
                metaRow.appendChild(catItem);
            }

            if (tags.value.length > 0) {
                const tagItem = document.createElement("span");
                tagItem.className = "meta-item";
                tagItem.innerHTML = `
                    <i class="fas fa-hashtag"></i>
                    <span class="meta-label">標籤：</span>
                    <span class="meta-value">${tags.value.join("、")}</span>
                `;
                metaRow.appendChild(tagItem);
            }

            metaContainer.appendChild(metaRow);
        }

        firstH1.insertAdjacentElement("afterend", metaContainer);
    }, 100);
};

onMounted(() => {
    insertMetaAfterTitle();
});

watch(
    () => frontmatter.value,
    () => {
        insertMetaAfterTitle();
    },
    { deep: true }
);

onContentUpdated(() => {
    insertMetaAfterTitle();
});
</script>

<template>
    <main class="vp-page">
        <slot name="top" />

        <div vp-content>
            <slot name="content-top" />

            <Content id="content" />

            <slot name="content-bottom" />
        </div>

        <VPPageMeta />

        <VPPageNav />

        <slot name="bottom" />
    </main>
</template>

<style lang="scss">
@use "@vuepress/theme-default/lib/client/styles/mixins";
@use "@vuepress/theme-default/lib/client/styles/variables" as *;

.vp-page {
    display: block;
    padding-top: var(--navbar-height);
    padding-bottom: 2rem;
    padding-inline-start: var(--sidebar-width);

    @media (max-width: $MQNarrow) {
        padding-inline-start: var(--sidebar-width-mobile);
    }

    @media (max-width: $MQMobile) {
        padding-inline-start: 0;
    }

    [vp-content] {
        @include mixins.content-wrapper;

        & {
            padding-top: 0;
        }
    }
}
</style>
