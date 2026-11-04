<template>
  <nav class="catnav" aria-label="Kategorien">
    <ul class="container catnav__list">
      <li v-for="cat in shopCategories" :key="cat.slug">
        <NuxtLink
          :to="`/kategorie/${cat.slug}`"
          class="catnav__link"
          :class="{ 'catnav__link--sale': cat.slug === 'sale' }"
          active-class="catnav__link--active"
        >
          {{ cat.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.catnav__list {
  display: flex;
  gap: 4px;
  list-style: none;
  margin-block: 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.catnav__link {
  display: block;
  padding: 10px 12px;
  font-size: 15px;
  white-space: nowrap;
  border-bottom: 3px solid transparent;
}

.catnav__link:hover,
.catnav__link--active {
  border-bottom-color: var(--otto-ink);
}

.catnav__link--sale {
  color: var(--otto-red);
  font-weight: 700;
}

.catnav__link--sale.catnav__link--active,
.catnav__link--sale:hover {
  border-bottom-color: var(--otto-red);
}
</style>
