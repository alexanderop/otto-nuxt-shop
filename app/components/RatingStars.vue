<script setup lang="ts">
const props = defineProps<{ rating: number, count?: number }>()

const percent = computed(() => `${(props.rating / 5) * 100}%`)
</script>

<template>
  <div class="rating" :aria-label="`${rating.toFixed(1)} von 5 Sternen`">
    <span class="rating__stars" aria-hidden="true">
      ★★★★★
      <span class="rating__fill" :style="{ width: percent }">★★★★★</span>
    </span>
    <span v-if="count !== undefined" class="rating__count">({{ count }})</span>
  </div>
</template>

<style scoped>
.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
}

.rating__stars {
  position: relative;
  color: #d5d5d5;
  letter-spacing: 1px;
}

.rating__fill {
  position: absolute;
  inset: 0 auto 0 0;
  overflow: hidden;
  color: #f5a623;
  white-space: nowrap;
}

.rating__count {
  color: var(--otto-muted);
}
</style>
