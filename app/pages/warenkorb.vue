<script setup lang="ts">
const cart = useCart()
const toast = useToast()

const FREE_SHIPPING = 79
const shipping = computed(() => (cart.total.value >= FREE_SHIPPING || cart.total.value === 0 ? 0 : 5.95))
const missingForFree = computed(() => Math.max(0, FREE_SHIPPING - cart.total.value))

const coupon = useCoupon(cart.total)
const couponInput = ref('')
const couponError = ref('')

function redeemCoupon() {
  if (coupon.redeem(couponInput.value)) {
    couponInput.value = ''
    couponError.value = ''
    return
  }
  couponError.value = 'Dieser Gutschein ist ungültig'
}

useHead({ title: 'Warenkorb | OTTO Demo' })
</script>

<template>
  <div class="container page">
    <h1 class="page-title">Warenkorb</h1>

    <b2b-background-box v-if="!cart.lines.value.length" class="empty">
      <h2 class="h2">Dein Warenkorb ist leer</h2>
      <b2b-paragraph>Stöbere in unseren Kategorien und finde etwas Schönes.</b2b-paragraph>
      <b2b-button variant="primary" href="/">Weiter einkaufen</b2b-button>
    </b2b-background-box>

    <div v-else class="cart">
      <ul class="lines panel">
        <li v-for="line in cart.lines.value" :key="line.id" class="line">
          <NuxtLink :to="`/p/${line.id}`" class="line__image">
            <img :src="line.thumbnail" :alt="line.title" width="120" height="120">
          </NuxtLink>
          <div class="line__info">
            <NuxtLink :to="`/p/${line.id}`" class="line__title">{{ line.title }}</NuxtLink>
            <span class="line__delivery">lieferbar – in 2-3 Werktagen bei dir</span>
            <div class="line__qty">
              <b2b-button size="50" aria-label="Menge verringern" @click="cart.setQuantity(line.id, line.quantity - 1)">−</b2b-button>
              <span aria-live="polite">{{ line.quantity }}</span>
              <b2b-button size="50" aria-label="Menge erhöhen" @click="cart.setQuantity(line.id, line.quantity + 1)">+</b2b-button>
              <button type="button" class="line__remove" @click="cart.setQuantity(line.id, 0); toast.show('Artikel entfernt')">
                Entfernen
              </button>
            </div>
          </div>
          <strong class="line__price">{{ formatEuro(line.unitPrice * line.quantity) }}</strong>
        </li>
      </ul>

      <b2b-background-box class="summary">
        <h2 class="h2">Zusammenfassung</h2>
        <dl class="summary__rows">
          <dt>Zwischensumme</dt><dd>{{ formatEuro(cart.total.value) }}</dd>
          <dt>Versand</dt><dd>{{ shipping ? formatEuro(shipping) : 'kostenlos' }}</dd>
          <template v-if="coupon.code.value">
            <dt class="summary__discount">Gutschein ({{ coupon.code.value }})</dt>
            <dd class="summary__discount">−{{ formatEuro(coupon.discount.value) }}</dd>
          </template>
          <dt class="summary__total">Gesamt</dt><dd class="summary__total">{{ formatEuro(cart.total.value - coupon.discount.value + shipping) }}</dd>
        </dl>
        <div v-if="coupon.code.value" class="coupon coupon--applied">
          <span>Gutschein <strong>{{ coupon.code.value }}</strong> eingelöst</span>
          <button type="button" class="coupon__remove" @click="coupon.remove()">Gutschein entfernen</button>
        </div>
        <form v-else class="coupon" @submit.prevent="redeemCoupon">
          <label for="coupon-code" class="coupon__label">Gutscheincode</label>
          <div class="coupon__row">
            <input
              id="coupon-code"
              v-model="couponInput"
              class="coupon__input"
              type="text"
              autocomplete="off"
              :aria-invalid="couponError ? 'true' : undefined"
              aria-describedby="coupon-error"
              @input="couponError = ''"
            >
            <button type="submit" class="coupon__submit">Einlösen</button>
          </div>
          <p id="coupon-error" class="coupon__error" role="alert">{{ couponError }}</p>
        </form>
        <b2b-progress-bar
          v-if="missingForFree > 0"
          :progress="Math.round((cart.total.value / FREE_SHIPPING) * 100)"
          :label="`Noch ${formatEuro(missingForFree)} bis zum kostenlosen Versand`"
        />
        <b2b-button variant="primary" width="fit-container" @click="toast.show('Demo: Kein echter Checkout 🙂')">
          Zur Kasse
        </b2b-button>
      </b2b-background-box>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding-top: 24px;
}

.empty {
  display: block;
}

.cart {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  gap: 32px;
  align-items: start;
}

.lines {
  list-style: none;
  padding: 0;
  margin: 0;
}

.line:last-child {
  border-bottom: 0;
}

.line {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr) auto;
  gap: 16px;
  padding-block: 16px;
  border-bottom: 1px solid var(--otto-line);
}

.line__image {
  background: var(--otto-image-bg);
}

.line__image img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
  mix-blend-mode: multiply;
}

.line__info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.line__title:hover {
  text-decoration: underline;
}

.line__delivery {
  font-size: 12px;
  color: var(--otto-green);
}

.line__qty {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
}

.line__remove {
  border: 0;
  background: none;
  text-decoration: underline;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  color: var(--otto-muted);
}

.summary {
  display: block;
  position: sticky;
  top: 160px;
}

.summary__rows {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  margin: 0 0 16px;
}

.summary__rows dd {
  margin: 0;
  text-align: right;
}

.summary__total {
  font-weight: 700;
  font-size: 18px;
  padding-top: 8px;
  border-top: 1px solid var(--otto-line);
}

.summary__discount {
  color: var(--otto-green);
}

.coupon {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.coupon--applied {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.coupon__label {
  font-size: 14px;
  font-weight: 700;
}

.coupon__row {
  display: flex;
  gap: 8px;
}

.coupon__input {
  flex: 1;
  min-width: 0;
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--otto-line);
  border-radius: 8px;
  font: inherit;
  text-transform: uppercase;
}

.coupon__input[aria-invalid='true'] {
  border-color: #c00;
}

.coupon__submit {
  height: 40px;
  padding: 0 16px;
  border: 1px solid var(--otto-ink);
  border-radius: 8px;
  background: #fff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.coupon__error {
  margin: 0;
  min-height: 1em;
  font-size: 13px;
  color: #c00;
}

.coupon__remove {
  white-space: nowrap;
  border: 0;
  background: none;
  text-decoration: underline;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  color: var(--otto-muted);
}

.summary b2b-progress-bar {
  display: block;
  margin-bottom: 16px;
}

@media (max-width: 760px) {
  .cart {
    grid-template-columns: 1fr;
  }

  .line {
    grid-template-columns: 80px minmax(0, 1fr);
  }

  .line__price {
    grid-column: 2;
  }
}
</style>
