<script setup lang="ts">
defineProps<{ title?: string, products: Product[], moreLink?: string }>()
</script>

<template>
  <section class="section">
    <div v-if="title" class="section__head">
      <h2 class="h2">{{ title }}</h2>
      <NuxtLink v-if="moreLink" :to="moreLink" class="section__link">Alle anzeigen</NuxtLink>
    </div>
    <HScroller item-width="199px">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </HScroller>
  </section>
</template>
