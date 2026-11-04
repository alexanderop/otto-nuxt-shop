<script setup lang="ts">
const wishlist = useWishlist()

const { data } = await useFetch('/api/products', { query: { pageSize: 200 }, key: 'all-products' })
const saved = computed(() => data.value?.items.filter(p => wishlist.has(p.id)) ?? [])

useHead({ title: 'Merkzettel | OTTO Demo' })
</script>

<template>
  <div class="container page">
    <h1 class="page-title">Merkzettel</h1>

    <ul v-if="saved.length" class="product-grid list">
      <li v-for="product in saved" :key="product.id">
        <ProductCard :product="product" />
      </li>
    </ul>

    <b2b-background-box v-else class="empty">
      <h2 class="h2">Noch nichts gemerkt</h2>
      <b2b-paragraph>Tippe auf das Herz bei einem Artikel, um ihn hier zu speichern.</b2b-paragraph>
    </b2b-background-box>
  </div>
</template>

<style scoped>
.page {
  padding-top: 24px;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.empty {
  display: block;
}
</style>
