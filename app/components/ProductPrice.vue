<script setup lang="ts">
const props = defineProps<{ product: Pick<Product, 'price' | 'discountPercentage'>, large?: boolean }>()

const sale = computed(() => isOnSale(props.product))
const current = computed(() => formatEuro(salePrice(props.product)))
const original = computed(() => formatEuro(props.product.price))
</script>

<template>
  <div class="price" :class="{ 'price--large': large }">
    <template v-if="sale">
      <span class="price__current price__current--sale">{{ current }}</span>
      <span class="price__original"><s>{{ original }}</s></span>
      <span class="price__badge">-{{ Math.round(product.discountPercentage) }}%</span>
    </template>
    <span v-else class="price__current">{{ original }}</span>
  </div>
</template>

<style scoped>
.price {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 8px;
}

.price__current {
  font-size: 18px;
  font-weight: 700;
}

.price__current--sale {
  color: var(--otto-red);
}

.price__original {
  font-size: 13px;
  color: var(--otto-muted);
}

.price__badge {
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  background: var(--otto-red);
  padding: 1px 6px;
  border-radius: 2px;
}

.price--large .price__current {
  font-size: 32px;
}

.price--large .price__original {
  font-size: 16px;
}
</style>
