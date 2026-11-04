<script setup lang="ts">
const props = defineProps<{ category?: string, q?: string }>()

const route = useRoute()
const router = useRouter()

const sortOptions = [
  { value: 'relevance', label: 'Beliebtheit' },
  { value: 'price-asc', label: 'Preis aufsteigend' },
  { value: 'price-desc', label: 'Preis absteigend' },
  { value: 'rating', label: 'Beste Bewertung' },
  { value: 'discount', label: 'Höchster Rabatt' },
]

const sort = computed(() => (route.query.sort as string) || 'relevance')
const sale = computed(() => route.query.sale === 'true')
const topRated = computed(() => route.query.minRating === '4')
const page = computed(() => Number(route.query.page) || 1)

const query = computed(() => ({
  category: props.category,
  q: props.q,
  sort: sort.value,
  sale: sale.value ? 'true' : undefined,
  minRating: topRated.value ? 4 : undefined,
  page: page.value,
  pageSize: 12,
}))

const { data, status } = await useFetch('/api/products', { query })

function updateQuery(patch: Record<string, string | undefined>) {
  router.push({ query: { ...route.query, page: undefined, ...patch } })
}

function onSort(event: CustomEvent<string>) {
  updateQuery({ sort: event.detail === 'relevance' ? undefined : event.detail })
}

function onFilter(event: CustomEvent<{ value: string, isActive: boolean }>) {
  const { value, isActive } = event.detail
  if (value === 'sale') updateQuery({ sale: isActive ? 'true' : undefined })
  if (value === 'top') updateQuery({ minRating: isActive ? '4' : undefined })
}

function onPage(event: CustomEvent<{ currentPage: number }>) {
  router.push({ query: { ...route.query, page: String(event.detail.currentPage) } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div>
    <div class="toolbar">
      <div class="toolbar__filters">
        <b2b-toggle-chip label="Nur Sale" value="sale" name="filter" :active.prop="sale" @b2b-selected="onFilter" />
        <b2b-toggle-chip label="4 Sterne & mehr" value="top" name="filter" :active.prop="topRated" @b2b-selected="onFilter" />
      </div>
      <b2b-dropdown class="toolbar__sort" label="Sortieren nach" @b2b-change="onSort">
        <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value" :selected="opt.value === sort">
          {{ opt.label }}
        </option>
      </b2b-dropdown>
    </div>

    <b2b-paragraph v-if="data" size="50" variant="grey-400">{{ data.total }} Artikel</b2b-paragraph>

    <div v-if="status === 'pending' && !data" class="loading">
      <b2b-spinner />
    </div>

    <ul v-else-if="data?.items.length" class="product-grid list" :class="{ 'list--pending': status === 'pending' }">
      <li v-for="product in data.items" :key="product.id">
        <ProductCard :product="product" />
      </li>
    </ul>

    <b2b-background-box v-else class="empty">
      <b2b-headline size="100">Keine Treffer</b2b-headline>
      <b2b-paragraph>Versuch es mit weniger Filtern oder einem anderen Suchbegriff.</b2b-paragraph>
    </b2b-background-box>

    <div v-if="data && data.totalPages > 1" class="pager">
      <b2b-pagination :key="`${data.page}-${data.totalPages}`" :total-pages="data.totalPages" :active-page="data.page" @b2b-page-change="onPage" />
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.toolbar__filters {
  display: flex;
  gap: 8px;
}

.toolbar__sort {
  width: 240px;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  transition: opacity 0.15s;
}

.list--pending {
  opacity: 0.5;
}

.loading {
  display: grid;
  place-items: center;
  padding: 80px 0;
}

.pager {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
</style>
