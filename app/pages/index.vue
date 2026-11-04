<script setup lang="ts">
const { data } = await useFetch('/api/home')

const coupons = [
  { amount: '10 €', kicker: 'Nur für Neukund*innen', title: 'Gutschein für deine erste Bestellung', validUntil: 'morgen 23:59 Uhr' },
  { amount: '20%', extra: true, title: 'Auf ausgewählte Damen-Mode & Taschen', validUntil: 'Fr., 06.11.' },
  { amount: '15%', extra: true, title: 'Auf ausgew. Laptops & Smartphones', validUntil: 'Fr., 06.11.' },
  { amount: '10%', extra: true, title: 'Auf Möbel & Küche', validUntil: 'So., 08.11.' },
]
</script>

<template>
  <div v-if="data" class="container home">
    <HScroller item-width="346px" gap="16px" class="section">
      <CouponCard v-for="c in coupons" :key="c.title" v-bind="c" />
    </HScroller>

    <HScroller item-width="296px" gap="16px" class="section">
      <NuxtLink v-for="t in data.teasers" :key="t.title" :to="t.to" class="teaser">
        <span class="teaser__kicker">{{ t.kicker }}</span>
        <strong class="teaser__title">{{ t.title }}</strong>
        <span class="teaser__image"><img :src="t.image" alt="" width="280" height="210"></span>
      </NuxtLink>
    </HScroller>

    <section class="section">
      <h2 class="h2">Beliebte Kategorien</h2>
      <ul class="tiles">
        <li v-for="tile in data.tiles" :key="tile.title">
          <NuxtLink :to="tile.to" class="tile">
            <strong>{{ tile.title }}</strong>
            <img :src="tile.image" alt="" width="160" height="160">
          </NuxtLink>
        </li>
      </ul>
    </section>

    <NuxtLink to="/kategorie/sale" class="up-banner">
      <span class="up-banner__logo">UP</span>
      <strong>Sichere dir GRATIS Versand und sammle Punkte!</strong>
      <span>Jetzt kostenlos Mitglied werden</span>
    </NuxtLink>

    <section class="section">
      <h2 class="h2">Lass dich inspirieren</h2>
      <HScroller item-width="296px" gap="16px">
        <NuxtLink v-for="item in data.inspiration" :key="item.title" :to="item.to" class="teaser teaser--bottom">
          <span class="teaser__image"><img :src="item.image" alt="" width="280" height="210"></span>
          <strong class="teaser__title">{{ item.title }}</strong>
        </NuxtLink>
      </HScroller>
    </section>

    <section class="section extra">
      <h2 class="extra__title">Jetzt extra sparen</h2>
      <NuxtLink to="/kategorie/moebel" class="extra__banner">
        <span class="teaser__kicker">Bis 10.11. vom Verkäufer OTTO</span>
        <strong class="teaser__title">Living Angebote</strong>
        <span class="extra__stage">
          <span class="extra__bubble"><span>Living</span><b>Outlet</b></span>
          <img v-for="src in data.extraBanner" :key="src" :src="src" alt="" width="200" height="200">
        </span>
      </NuxtLink>
      <ProductRow :products="data.extraSale" />
      <ul class="subtiles">
        <li v-for="s in data.subTiles" :key="s.title">
          <NuxtLink :to="s.to" class="subtile">
            <img :src="s.image" alt="" width="56" height="56">
            <strong>{{ s.title }}</strong>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <ProductRow title="Trending Topseller der letzten Tage" :products="data.topseller" more-link="/kategorie/sale" />
  </div>
</template>

<style scoped>
.home {
  padding-top: 16px;
}

.teaser {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 8px;
  background: #fff;
  border-radius: var(--otto-radius);
}

.teaser__kicker {
  padding: 16px 8px 0;
  font-size: 14px;
}

.teaser__title {
  padding: 2px 8px 16px;
  font-size: 16px;
}

.teaser__image {
  margin-top: auto;
  aspect-ratio: 4 / 3;
  background: var(--otto-image-bg);
  border-radius: 4px;
  overflow: hidden;
}

.teaser__image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.teaser--bottom .teaser__title {
  padding: 16px 8px 8px;
}

.teaser:hover .teaser__title {
  text-decoration: underline;
}

.tiles {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.tile {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 8px;
  background: #fff;
  border-radius: var(--otto-radius);
  font-size: 13px;
}

.tile img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
  margin-top: 8px;
}

.tile:hover strong {
  text-decoration: underline;
}

.up-banner {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px 16px;
  padding: 22px 20px;
  background: var(--otto-red-dark);
  color: #fff;
  border-radius: var(--otto-radius);
  font-size: 14px;
}

.up-banner strong {
  font-size: 20px;
}

.up-banner__logo {
  padding: 0 6px;
  border: 2px solid #fff;
  font-weight: 700;
  font-style: italic;
  font-size: 18px;
}

.extra {
  padding: 24px 16px;
  background: var(--otto-beige);
}

.extra__title {
  margin: 0 0 16px;
  font-size: 40px;
  font-weight: 700;
  color: var(--otto-red-dark);
}

.extra__banner {
  display: flex;
  flex-direction: column;
  padding: 8px;
  background: #fff;
  border-radius: var(--otto-radius);
}

.extra__stage {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 24px;
  height: 320px;
  padding: 24px;
  background: linear-gradient(#f3f3f3, #e6e6e6);
  border-radius: 4px;
}

.extra__stage img {
  height: 85%;
  width: auto;
  object-fit: contain;
}

.extra__bubble {
  position: absolute;
  left: 25%;
  top: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: var(--otto-beige);
  color: var(--otto-red-dark);
  text-align: center;
  font-size: 30px;
  line-height: 1.05;
}

.subtiles {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.subtile {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 80px;
  padding: 8px 16px 8px 8px;
  background: #fff;
  border-radius: var(--otto-radius);
  font-size: 14px;
}

.subtile img {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.subtile:hover strong {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .tiles {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .subtiles {
    grid-template-columns: 1fr 1fr;
  }

  .extra__title {
    font-size: 28px;
  }

  .extra__stage {
    height: 200px;
  }

  .extra__bubble {
    width: 96px;
    height: 96px;
    font-size: 18px;
    left: 8px;
  }
}

@media (max-width: 600px) {
  .tiles {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .subtiles {
    grid-template-columns: 1fr;
  }
}
</style>
