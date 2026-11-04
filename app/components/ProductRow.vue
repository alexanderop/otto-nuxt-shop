<script setup lang="ts">
defineProps<{ title: string, products: Product[], moreLink?: string }>()
</script>

<template>
  <section class="section">
    <div class="section__head">
      <b2b-headline size="200" no-margin>{{ title }}</b2b-headline>
      <NuxtLink v-if="moreLink" :to="moreLink" class="section__link">Alle anzeigen</NuxtLink>
    </div>
    <ul class="row">
      <li v-for="product in products" :key="product.id" class="row__item">
        <ProductCard :product="product" />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.row {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(200px, 1fr);
  gap: 16px;
  overflow-x: auto;
  list-style: none;
  padding: 0 0 8px;
  margin: 0;
  scroll-snap-type: x mandatory;
}

.row__item {
  scroll-snap-align: start;
}

@media (max-width: 600px) {
  .row {
    grid-auto-columns: 46%;
    gap: 8px;
  }
}
</style>
