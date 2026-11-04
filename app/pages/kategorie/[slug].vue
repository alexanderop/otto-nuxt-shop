<script setup lang="ts">
const route = useRoute('kategorie-slug')
const category = computed(() => findCategory(String(route.params.slug)))

if (!category.value) {
  throw createError({ statusCode: 404, statusMessage: 'Kategorie nicht gefunden', fatal: true })
}

useHead({ title: () => `${category.value?.label} online kaufen | OTTO Demo` })
</script>

<template>
  <div v-if="category" class="container page">
    <AppBreadcrumb :items="[{ label: 'Startseite', to: '/' }, { label: category.label, to: route.path }]" />
    <h1 class="page-title">{{ category.label }}</h1>
    <ProductListing :key="category.slug" :category="category.slug" />
  </div>
</template>

<style scoped>
.page {
  padding-top: 16px;
}
</style>
