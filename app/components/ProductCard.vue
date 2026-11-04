<script setup lang="ts">
const props = defineProps<{ product: Product }>()

const wishlist = useWishlist()
const saved = computed(() => wishlist.has(props.product.id))
</script>

<template>
  <b2b-card class="card">
    <div class="card__inner">
      <button
        class="card__wish"
        type="button"
        :aria-pressed="saved"
        :aria-label="saved ? 'Vom Merkzettel entfernen' : 'Auf den Merkzettel'"
        @click="wishlist.toggle(product.id)"
      >
        <b2b-icon-100 :icon="saved ? 'b2b_icon-wishlist-active' : 'b2b_icon-wishlist'" :size="24" />
      </button>

      <NuxtLink :to="`/p/${product.id}`" class="card__link">
        <div class="card__image">
          <img :src="product.thumbnail" :alt="product.title" loading="lazy" width="300" height="300">
        </div>
        <span v-if="product.brand" class="card__brand">{{ product.brand }}</span>
        <h3 class="card__title">{{ product.title }}</h3>
        <ProductPrice :product="product" />
        <RatingStars :rating="product.rating" :count="product.reviewCount" />
        <span class="card__delivery" :class="{ 'card__delivery--low': product.stock <= 10 }">
          {{ stockText(product.stock) }}
        </span>
      </NuxtLink>
    </div>
  </b2b-card>
</template>

<style scoped>
.card {
  display: block;
  height: 100%;
}

.card__inner {
  position: relative;
  height: 100%;
}

.card__link {
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 100%;
}

.card__image {
  aspect-ratio: 1;
  background: var(--otto-bg);
  display: grid;
  place-items: center;
  margin-bottom: 6px;
}

.card__image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  mix-blend-mode: multiply;
}

.card__brand {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--otto-muted);
}

.card__title {
  font-size: 14px;
  font-weight: 400;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__link:hover .card__title {
  text-decoration: underline;
}

.card__delivery {
  margin-top: auto;
  font-size: 12px;
  color: var(--otto-green);
}

.card__delivery--low {
  color: var(--otto-red);
}

.card__wish {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: #fff;
  color: var(--otto-red);
  cursor: pointer;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.15);
}
</style>
