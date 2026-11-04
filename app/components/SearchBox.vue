<script setup lang="ts">
const route = useRoute()

const term = ref(typeof route.query.q === 'string' ? route.query.q : '')
const suggestions = ref<Product[]>([])
const open = ref(false)
const activeIndex = ref(-1)

watch(() => route.query.q, (q) => {
  term.value = typeof q === 'string' ? q : ''
})

let timer: ReturnType<typeof setTimeout> | undefined
watch(term, (value) => {
  clearTimeout(timer)
  activeIndex.value = -1
  if (value.trim().length < 2) {
    suggestions.value = []
    return
  }
  timer = setTimeout(async () => {
    const result = await $fetch('/api/products', { query: { q: value, pageSize: 6 } })
    suggestions.value = result.items
  }, 150)
})

function submit() {
  const active = suggestions.value[activeIndex.value]
  open.value = false
  if (active) return navigateTo(`/p/${active.id}`)
  const q = term.value.trim()
  if (q) return navigateTo({ path: '/suche', query: { q } })
}

function move(step: number) {
  if (!suggestions.value.length) return
  open.value = true
  const count = suggestions.value.length
  activeIndex.value = (activeIndex.value + step + count + 1) % (count + 1) - 1
}
</script>

<template>
  <form class="search" role="search" @submit.prevent="submit">
    <label for="site-search" class="visually-hidden">Suche</label>
    <input
      id="site-search"
      v-model="term"
      class="search__input"
      type="search"
      placeholder="Wonach suchst du?"
      autocomplete="off"
      role="combobox"
      aria-controls="search-suggestions"
      :aria-expanded="open && suggestions.length > 0"
      @focus="open = true"
      @blur="open = false"
      @keydown.down.prevent="move(1)"
      @keydown.up.prevent="move(-1)"
      @keydown.esc="open = false"
    >
    <button type="submit" class="search__button" aria-label="Suchen">
      <b2b-icon-100 icon="b2b_icon-search" :size="24" />
    </button>

    <ul v-if="open && suggestions.length" id="search-suggestions" class="search__list" role="listbox">
      <li
        v-for="(item, i) in suggestions"
        :key="item.id"
        role="option"
        :aria-selected="i === activeIndex"
        class="search__option"
        :class="{ 'search__option--active': i === activeIndex }"
        @mousedown.prevent="navigateTo(`/p/${item.id}`); open = false"
      >
        <img :src="item.thumbnail" alt="" width="40" height="40">
        <span>{{ item.title }}</span>
      </li>
    </ul>
  </form>
</template>

<style scoped>
.search {
  position: relative;
  display: flex;
  align-items: center;
  height: 48px;
  background: var(--otto-bg);
  border-radius: 24px;
}

.search:focus-within {
  outline: 2px solid var(--otto-ink);
}

.search__input {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0 0 0 16px;
  border: 0;
  background: transparent;
  font: inherit;
  font-size: 16px;
  color: var(--otto-ink);
  outline: none;
}

.search__input::-webkit-search-cancel-button {
  display: none;
}

.search__button {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 0;
  background: none;
  cursor: pointer;
  color: var(--otto-ink);
}

.search__list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 60;
  margin: 0;
  padding: 8px 0;
  list-style: none;
  background: #fff;
  border-radius: var(--otto-radius);
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.15);
}

.search__option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 16px;
  cursor: pointer;
  font-size: 14px;
}

.search__option img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  background: var(--otto-image-bg);
  border-radius: 4px;
}

.search__option:hover,
.search__option--active {
  background: var(--otto-bg);
}
</style>
