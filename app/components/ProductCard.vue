<script setup lang="ts">
const props = defineProps<{ product: Product, showRating?: boolean }>()

const wishlist = useWishlist()
const saved = computed(() => wishlist.has(props.product.id))
const popular = computed(() => props.product.rating >= 4.5)
</script>

<template>
  <article class="card">
    <NuxtLink :to="`/p/${product.id}`" class="card__link">
      <div class="card__image">
        <img :src="product.thumbnail" :alt="product.title" loading="lazy" width="300" height="400">
        <span v-if="popular" class="card__flag">Sehr beliebt</span>
      </div>
      <span class="card__brand">{{ product.brand ?? 'OTTO' }}</span>
      <h3 class="card__title">{{ product.title }}</h3>
      <ProductPrice :product="product" />
      <RatingStars v-if="showRating" :rating="product.rating" :count="product.reviewCount" />
      <span v-if="product.stock === 0" class="card__soldout">Leider ausverkauft</span>
    </NuxtLink>

    <button
      class="card__wish"
      type="button"
      :aria-pressed="saved"
      :aria-label="saved ? 'Vom Merkzettel entfernen' : 'Auf den Merkzettel'"
      @click="wishlist.toggle(product.id)"
    >
      <b2b-icon-100 :icon="saved ? 'b2b_icon-wishlist-active' : 'b2b_icon-wishlist'" :size="24" />
    </button>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  height: 100%;
}

.card__link {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card__image {
  position: relative;
  aspect-ratio: 3 / 4;
  background: #fff;
  border-radius: var(--otto-radius);
  overflow: hidden;
  margin-bottom: 12px;
}

.card__image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
}

.card__flag {
  position: absolute;
  left: 12px;
  bottom: 12px;
  padding: 2px 6px;
  background: var(--otto-ink);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.card__brand {
  font-size: 12px;
  text-transform: uppercase;
}

.card__title {
  margin: 2px 0 8px;
  font-size: 14px;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card__link:hover .card__title {
  text-decoration: underline;
}

.card__soldout {
  margin-top: 4px;
  font-size: 12px;
  color: var(--otto-red);
}

.card__wish {
  position: absolute;
  top: 8px;
  right: 8px;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.85);
  color: var(--otto-ink);
  cursor: pointer;
}

.card__wish[aria-pressed='true'] {
  color: var(--otto-red);
}
</style>
