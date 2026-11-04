<script setup lang="ts">
const props = defineProps<{ product: Pick<Product, 'price' | 'discountPercentage'>, large?: boolean }>()

const sale = computed(() => isOnSale(props.product))
const current = computed(() => formatEuro(salePrice(props.product)))
const original = computed(() => formatEuro(props.product.price))
</script>

<template>
  <div class="price" :class="{ 'price--large': large }">
    <span class="price__current" :class="{ 'price__current--sale': sale }">{{ sale ? current : original }}</span>
    <span v-if="sale" class="price__was">
      <span class="price__badge">-{{ Math.round(product.discountPercentage) }}%</span>
      UVP <s>{{ original }}</s>
    </span>
  </div>
</template>

<style scoped>
.price {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.price__current {
  font-size: 16px;
  font-weight: 700;
}

.price__current--sale {
  color: var(--otto-red-dark);
}

.price__was {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.price__badge {
  padding: 1px 4px;
  background: var(--otto-red-dark);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}

.price--large .price__current {
  font-size: 32px;
}

.price--large .price__was {
  font-size: 14px;
}
</style>
