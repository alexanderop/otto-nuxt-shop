<script setup lang="ts">
const cart = useCart()
const wishlist = useWishlist()

const links = computed(() => [
  { to: '/service', label: 'Service', icon: 'b2b_icon-service-info', badge: 0 },
  { to: '/konto', label: 'Mein Konto', icon: 'b2b_icon-person', badge: 0 },
  { to: '/merkzettel', label: 'Merkzettel', icon: 'b2b_icon-wishlist', badge: wishlist.count.value },
  { to: '/warenkorb', label: 'Warenkorb', icon: 'b2b_icon-basket', badge: cart.count.value },
])
</script>

<template>
  <header class="header">
    <div class="container header__main">
      <NuxtLink to="/" class="logo" aria-label="Zur Startseite">OTTO</NuxtLink>

      <SearchBox class="header__search" />

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
  position: sticky;
  top: 0;
  z-index: 50;
}

.header__main {
  display: grid;
  grid-template-columns: auto minmax(0, 480px) 1fr;
  align-items: center;
  gap: 36px;
  padding-block: 24px 8px;
}

.logo {
  font-size: 52px;
  font-weight: 700;
  font-style: italic;
  letter-spacing: -3px;
  color: var(--otto-red);
  line-height: 1;
  transform: skewX(-6deg);
}

.header__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 64px;
  font-size: 12px;
  color: var(--otto-muted);
}

.action:hover {
  color: var(--otto-ink);
}

.action__icon {
  position: relative;
}

.action__badge {
  position: absolute;
  top: -4px;
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
    padding-block: 12px 8px;
  }

  .logo {
    font-size: 36px;
  }

  .header__search {
    grid-column: 1 / -1;
    grid-row: 2;
  }

  .action {
    min-width: 40px;
  }

  .action__label {
    display: none;
  }
}
</style>
