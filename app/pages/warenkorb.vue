<script setup lang="ts">
const cart = useCart()
const toast = useToast()

const FREE_SHIPPING = 79
const shipping = computed(() => (cart.total.value >= FREE_SHIPPING || cart.total.value === 0 ? 0 : 5.95))
const missingForFree = computed(() => Math.max(0, FREE_SHIPPING - cart.total.value))

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
          <dt class="summary__total">Gesamt</dt><dd class="summary__total">{{ formatEuro(cart.total.value + shipping) }}</dd>
        </dl>
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
