<template>
    <div class="dynamic-footer">
        @ {{ currentYear }} Howar31. All rights reserved.
    </div>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.dynamic-footer {
    text-align: center;
    padding: 2rem 0;
    color: var(--c-text-lighter, #999);
    font-size: 0.9em;
}
</style>
