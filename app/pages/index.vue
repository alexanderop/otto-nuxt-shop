<script setup lang="ts">
const [{ data: sale }, { data: tech }, { data: fashion }] = await Promise.all([
  useFetch('/api/products', { query: { category: 'sale', sort: 'discount', pageSize: 8 }, key: 'home-sale' }),
  useFetch('/api/products', { query: { category: 'technik', sort: 'rating', pageSize: 8 }, key: 'home-tech' }),
  useFetch('/api/products', { query: { category: 'damen', sort: 'rating', pageSize: 8 }, key: 'home-fashion' }),
])

const tiles = shopCategories.filter(c => c.slug !== 'sale')
</script>

<template>
  <div class="container">
    <section class="hero">
      <div class="hero__copy">
        <p class="hero__kicker">Nur für kurze Zeit</p>
        <h1 class="hero__title">Bis zu 50 % auf Technik, Mode & Wohnen</h1>
        <p class="hero__text">Entdecke tausende reduzierte Artikel – mit kostenloser Rückgabe.</p>
        <b2b-button variant="secondary" href="/kategorie/sale">Zum Sale</b2b-button>
      </div>
      <div class="hero__image" aria-hidden="true">
        <img v-for="p in sale?.items.slice(0, 3)" :key="p.id" :src="p.thumbnail" alt="">
      </div>
    </section>

    <section class="section">
      <b2b-headline size="200">Beliebte Kategorien</b2b-headline>
      <ul class="tiles">
        <li v-for="cat in tiles" :key="cat.slug">
          <NuxtLink :to="`/kategorie/${cat.slug}`" class="tile">
            <span class="tile__icon">
              <b2b-icon-100 :icon="cat.icon" :size="40" />
            </span>
            <span>{{ cat.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <ProductRow v-if="sale" title="Sale-Highlights" :products="sale.items" more-link="/kategorie/sale" />

    <section class="promo">
      <div class="promo__card promo__card--dark">
        <h2>Neu: Smart Home</h2>
        <p>Technik, die mitdenkt.</p>
        <NuxtLink to="/kategorie/technik" class="promo__link">Jetzt entdecken →</NuxtLink>
      </div>
      <div class="promo__card promo__card--light">
        <h2>Wohnträume</h2>
        <p>Möbel & Deko für jeden Raum.</p>
        <NuxtLink to="/kategorie/wohnen" class="promo__link">Inspirieren lassen →</NuxtLink>
      </div>
    </section>

    <ProductRow v-if="tech" title="Top bewertet in Technik" :products="tech.items" more-link="/kategorie/technik" />
    <ProductRow v-if="fashion" title="Damenmode, die begeistert" :products="fashion.items" more-link="/kategorie/damen" />
  </div>
</template>

<style scoped>
.hero {
  margin-top: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 24px;
  padding: 40px;
  background: var(--otto-red);
  color: #fff;
  overflow: hidden;
}

.hero__kicker {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero__title {
  margin: 0 0 12px;
  font-size: clamp(28px, 4vw, 44px);
  line-height: 1.1;
}

.hero__text {
  margin: 0 0 24px;
  font-size: 18px;
}

.hero__image {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.hero__image img {
  aspect-ratio: 3 / 4;
  object-fit: contain;
  background: #fff;
  border-radius: 4px;
  padding: 8px;
}

.hero__image img:nth-child(2) {
  transform: translateY(-16px);
}

.tiles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  font-size: 14px;
}

.tile:hover span {
  text-decoration: underline;
}

.tile__icon {
  display: grid;
  place-items: center;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: var(--otto-bg);
  transition: background 0.15s;
}

.tile:hover .tile__icon {
  background: var(--otto-line);
}

.promo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.promo__card {
  padding: 32px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.promo__card h2 {
  margin: 0 0 4px;
  font-size: 26px;
}

.promo__card p {
  margin: 0 0 12px;
}

.promo__card--dark {
  background: var(--otto-ink);
  color: #fff;
}

.promo__card--light {
  background: #f3e9dc;
}

.promo__link {
  font-weight: 700;
  text-decoration: underline;
}

@media (max-width: 760px) {
  .hero,
  .promo {
    grid-template-columns: 1fr;
  }

  .hero {
    padding: 24px;
  }
}
</style>
