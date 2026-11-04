<script setup lang="ts">
const route = useRoute()
const cart = useCart()
const wishlist = useWishlist()

const initialTerm = typeof route.query.q === 'string' ? route.query.q : ''
const searchTerm = ref(initialTerm)
const suggestions = ref<string[]>([])

let suggestTimer: ReturnType<typeof setTimeout> | undefined
function onInput(event: CustomEvent<{ value: string }>) {
  const value = event.detail?.value ?? ''
  searchTerm.value = value
  clearTimeout(suggestTimer)
  if (value.trim().length < 2) {
    suggestions.value = []
    return
  }
  suggestTimer = setTimeout(async () => {
    const result = await $fetch('/api/products', { query: { q: value, pageSize: 6 } })
    suggestions.value = result.items.map(p => p.title)
  }, 150)
}

function onSearch(event: CustomEvent<{ searchTerm: string }>) {
  const term = (event.detail.searchTerm || searchTerm.value).trim()
  if (term) navigateTo({ path: '/suche', query: { q: term } })
}

const links = computed(() => [
  { to: '/service', label: 'Service', icon: 'b2b_icon-service-info', badge: 0 },
  { to: '/konto', label: 'Mein Konto', icon: 'b2b_icon-person', badge: 0 },
  { to: '/merkzettel', label: 'Merkzettel', icon: 'b2b_icon-wishlist', badge: wishlist.count.value },
  { to: '/warenkorb', label: 'Warenkorb', icon: 'b2b_icon-basket', badge: cart.count.value },
])
</script>

<template>
  <header class="header">
    <div class="topbar">
      <div class="container topbar__inner">
        <span>Kostenloser Versand ab 79 € Bestellwert</span>
        <span class="topbar__hide-sm">30 Tage Rückgabe</span>
        <span class="topbar__hide-sm">Kauf auf Rechnung</span>
      </div>
    </div>

    <div class="container header__main">
      <NuxtLink to="/" class="logo" aria-label="Zur Startseite">OTTO</NuxtLink>

      <b2b-search
        class="header__search"
        placeholder="Wonach suchst du?"
        :value="initialTerm"
        :optionsList.prop="suggestions"
        @b2b-input="onInput"
        @b2b-search="onSearch"
      />

      <nav class="header__actions" aria-label="Kundenbereich">
        <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="action">
          <span class="action__icon">
            <b2b-icon-100 :icon="link.icon" :size="24" />
            <ClientOnly>
              <span v-if="link.badge" class="action__badge">{{ link.badge }}</span>
            </ClientOnly>
          </span>
          <span class="action__label">{{ link.label }}</span>
        </NuxtLink>
      </nav>
    </div>

    <CategoryNav />
  </header>
</template>

<style scoped>
.header {
  background: #fff;
  border-bottom: 1px solid var(--otto-line);
  position: sticky;
  top: 0;
  z-index: 50;
}

.topbar {
  background: var(--otto-bg);
  font-size: 12px;
  color: var(--otto-ink);
}

.topbar__inner {
  display: flex;
  gap: 32px;
  justify-content: center;
  padding-block: 6px;
}

.header__main {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 32px;
  padding-block: 12px;
}

.logo {
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -1px;
  color: var(--otto-red);
  line-height: 1;
}

.header__search {
  max-width: 640px;
  width: 100%;
}

.header__actions {
  display: flex;
  gap: 20px;
}

.action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 12px;
}

.action:hover .action__label {
  text-decoration: underline;
}

.action__icon {
  position: relative;
}

.action__badge {
  position: absolute;
  top: -6px;
  right: -10px;
  min-width: 18px;
  height: 18px;
  padding-inline: 4px;
  border-radius: 9px;
  background: var(--otto-red);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: grid;
  place-items: center;
}

@media (max-width: 900px) {
  .header__main {
    grid-template-columns: auto 1fr;
    gap: 12px 16px;
  }

  .header__search {
    grid-column: 1 / -1;
    grid-row: 2;
    max-width: none;
  }

  .header__actions {
    justify-self: end;
  }

  .action__label,
  .topbar__hide-sm {
    display: none;
  }
}
</style>
