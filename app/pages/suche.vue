<script setup lang="ts">
const route = useRoute()
const term = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))

useHead({ title: () => `Suche: ${term.value} | OTTO Demo` })
</script>

<template>
  <div class="container page">
    <AppBreadcrumb :items="[{ label: 'Startseite', to: '/' }, { label: 'Suche', to: route.fullPath }]" />
    <b2b-headline size="400">Ergebnisse für „{{ term }}“</b2b-headline>
    <ProductListing :key="term" :q="term" />
  </div>
</template>

<style scoped>
.page {
  padding-top: 16px;
}
</style>
