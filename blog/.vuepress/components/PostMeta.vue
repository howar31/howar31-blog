<script setup>
import { onMounted, nextTick, watch } from "vue";
import { usePageFrontmatter, useRoute } from "vuepress/client";
import moment from "moment";

const frontmatter = usePageFrontmatter();
const route = useRoute();

const insertMetaAfterTitle = () => {
    // Check if this is a blog post page
    const isBlogPost =
        frontmatter.value.home !== true &&
        frontmatter.value.blog_index !== true &&
        frontmatter.value.title !== false;

    if (!isBlogPost) return;

    // Check if we should show meta info
    const shouldShowMeta =
        frontmatter.value.date ||
        frontmatter.value.description ||
        frontmatter.value.categories ||
        frontmatter.value.tags;

    if (!shouldShowMeta) return;

    nextTick(() => {
        const content = document.getElementById("content");
        if (!content) return;

        const firstH1 = content.querySelector("h1");
        if (!firstH1) return;

        // Check if meta already inserted
        if (firstH1.nextElementSibling?.classList.contains("blog-post-meta")) {
            return;
        }

        // Create meta container
        const metaContainer = document.createElement("div");
        metaContainer.className = "blog-post-meta";

        // Date
        if (frontmatter.value.date) {
            const dateRow = document.createElement("div");
            dateRow.className = "meta-row";
            const dateItem = document.createElement("span");
            dateItem.className = "meta-item";
            const dateStr = moment(frontmatter.value.date).format(
                "YYYY年MM月DD日"
            );
            dateItem.innerHTML = `
        <i class="far fa-clock"></i>
        <time datetime="${frontmatter.value.date}">${dateStr}</time>
      `;
            dateRow.appendChild(dateItem);
            metaContainer.appendChild(dateRow);
        }

        // Description
        if (frontmatter.value.description) {
            const descDiv = document.createElement("div");
            descDiv.className = "meta-description";
            const descP = document.createElement("p");
            descP.textContent = frontmatter.value.description;
            descDiv.appendChild(descP);
            metaContainer.appendChild(descDiv);
        }

        // Categories and Tags
        const categories = Array.isArray(frontmatter.value.categories)
            ? frontmatter.value.categories
            : frontmatter.value.categories
            ? [frontmatter.value.categories]
            : [];
        const tags = Array.isArray(frontmatter.value.tags)
            ? frontmatter.value.tags
            : frontmatter.value.tags
            ? [frontmatter.value.tags]
            : [];

        if (categories.length > 0 || tags.length > 0) {
            const metaRow = document.createElement("div");
            metaRow.className = "meta-row";

            if (categories.length > 0) {
                const catItem = document.createElement("span");
                catItem.className = "meta-item";
                catItem.innerHTML = `
          <i class="fas fa-cat"></i>
          <span class="meta-label">分類：</span>
          <span class="meta-value">${categories.join("、")}</span>
        `;
                metaRow.appendChild(catItem);
            }

            if (tags.length > 0) {
                const tagItem = document.createElement("span");
                tagItem.className = "meta-item";
                tagItem.innerHTML = `
          <i class="fas fa-hashtag"></i>
          <span class="meta-label">標籤：</span>
          <span class="meta-value">${tags.join("、")}</span>
        `;
                metaRow.appendChild(tagItem);
            }

            metaContainer.appendChild(metaRow);
        }

        // Insert after h1
        firstH1.insertAdjacentElement("afterend", metaContainer);
    });
};

onMounted(() => {
    insertMetaAfterTitle();
});

// Watch for route changes
watch(
    () => route.path,
    () => {
        insertMetaAfterTitle();
    }
);
</script>

<template>
    <div style="display: none"></div>
</template>
