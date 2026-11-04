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
.catnav {
  padding-bottom: 8px;
}

.catnav__list {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  list-style: none;
  margin-block: 0;
}

.catnav__link {
  display: block;
  padding: 6px 8px;
  font-size: 16px;
  text-align: center;
  color: var(--otto-muted);
  white-space: nowrap;
}

.catnav__link:hover,
.catnav__link--active {
  color: var(--otto-ink);
  text-decoration: underline;
  text-underline-offset: 6px;
}

.catnav__link--sale,
.catnav__link--sale:hover {
  color: var(--otto-red);
}

@media (max-width: 900px) {
  .catnav__list {
    display: flex;
    gap: 4px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .catnav__link {
    font-size: 15px;
  }
}
</style>
