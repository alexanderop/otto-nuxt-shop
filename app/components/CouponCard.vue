<script setup lang="ts">
defineProps<{ amount: string, extra?: boolean, kicker?: string, title: string, validUntil: string }>()

const activated = ref(false)
const toast = useToast()

function activate() {
  activated.value = true
  toast.show('Gutschein aktiviert – wird im Warenkorb abgezogen')
}
</script>

<template>
  <div class="coupon">
    <div class="coupon__top">
      <span class="coupon__badge">
        {{ amount }}
        <small v-if="extra">Extra</small>
      </span>
      <div>
        <p v-if="kicker" class="coupon__kicker">{{ kicker }}</p>
        <p class="coupon__title">{{ title }}</p>
      </div>
    </div>
    <div class="coupon__bottom">
      <p class="coupon__valid">Gültig bis:<br><strong>{{ validUntil }}</strong></p>
      <button type="button" class="coupon__cta" :disabled="activated" @click="activate">
        {{ activated ? 'Aktiviert ✓' : 'Zur Aktivierung ›' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.coupon {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border-radius: var(--otto-radius);
  padding: 12px;
}

.coupon__top {
  display: flex;
  gap: 8px;
  padding-bottom: 16px;
  border-bottom: 2px dashed var(--otto-bg);
}

.coupon__badge {
  flex: none;
  display: grid;
  place-items: center;
  align-content: center;
  width: 58px;
  height: 58px;
  background: var(--otto-red-dark);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
}

.coupon__badge small {
  font-size: 10px;
}

.coupon__kicker {
  margin: 10px 0 2px;
  font-size: 12px;
  font-weight: 700;
  color: var(--otto-red-dark);
}

.coupon__title {
  margin: 8px 0 0;
  font-size: 14px;
  font-weight: 700;
}

.coupon__kicker + .coupon__title {
  margin-top: 0;
}

.coupon__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 12px;
  margin-top: auto;
}

.coupon__valid {
  margin: 0;
  font-size: 12px;
}

.coupon__cta {
  border: 0;
  border-radius: 4px;
  padding: 8px 14px;
  background: var(--otto-red-dark);
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.coupon__cta:disabled {
  background: var(--otto-green);
  cursor: default;
}
</style>
