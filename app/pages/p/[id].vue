<script setup lang="ts">
const route = useRoute('p-id')
const { data } = await useFetch(() => `/api/products/${route.params.id}`)

if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Produkt nicht gefunden', fatal: true })
}

const product = computed(() => data.value!.product)
const shopCategory = computed(() => categoryOf(product.value))
const activeImage = ref(0)
watch(() => route.params.id, () => (activeImage.value = 0))

const cart = useCart()
const wishlist = useWishlist()
const toast = useToast()
const saved = computed(() => wishlist.has(product.value.id))

function addToCart() {
  cart.add(product.value)
  toast.show(`„${product.value.title}“ liegt im Warenkorb`)
}

const breadcrumb = computed(() => [
  { label: 'Startseite', to: '/' },
  ...(shopCategory.value ? [{ label: shopCategory.value.label, to: `/kategorie/${shopCategory.value.slug}` }] : []),
  { label: product.value.title, to: route.path },
])

useHead({ title: () => `${product.value.title} | OTTO Demo` })
</script>

<template>
  <div class="container page">
    <AppBreadcrumb :items="breadcrumb" />

    <div class="pdp panel">
      <div class="gallery">
        <ul class="gallery__thumbs">
          <li v-for="(img, i) in product.images" :key="img">
            <button
              type="button"
              class="gallery__thumb"
              :class="{ 'gallery__thumb--active': i === activeImage }"
              :aria-label="`Bild ${i + 1} anzeigen`"
              @click="activeImage = i"
            >
              <img :src="img" alt="" width="72" height="72">
            </button>
          </li>
        </ul>
        <div class="gallery__main">
          <img :src="product.images[activeImage]" :alt="product.title" width="600" height="600">
        </div>
      </div>

      <div class="buybox">
        <span v-if="product.brand" class="buybox__brand">{{ product.brand }}</span>
        <h2 class="h2">{{ product.title }}</h2>
        <RatingStars :rating="product.rating" :count="product.reviewCount" />

        <ProductPrice :product="product" large />
        <b2b-paragraph size="50" variant="grey-400">inkl. MwSt. zzgl. Versandkosten</b2b-paragraph>

        <p class="buybox__stock" :class="{ 'buybox__stock--low': product.stock <= 10 }">
          <b2b-icon-100 icon="b2b_icon-delivery-express" :size="24" />
          {{ stockText(product.stock) }}
        </p>

        <div class="buybox__actions">
          <b2b-button variant="primary" width="fit-container" :disabled="product.stock === 0" @click="addToCart">
            <b2b-icon-100 slot="start" icon="b2b_icon-basket" :size="24" color="inverse" />
            In den Warenkorb
          </b2b-button>
          <b2b-button variant="secondary" :aria-label="saved ? 'Vom Merkzettel entfernen' : 'Auf den Merkzettel'" @click="wishlist.toggle(product.id)">
            <b2b-icon-100 :icon="saved ? 'b2b_icon-wishlist-active' : 'b2b_icon-wishlist'" :size="24" />
          </b2b-button>
        </div>

        <b2b-separator />

        <ul class="buybox__usps">
          <li><b2b-icon-100 icon="b2b_icon-order-return" :size="24" /> 30 Tage kostenlose Rückgabe</li>
          <li><b2b-icon-100 icon="b2b_icon-lock-closed-check" :size="24" /> Kauf auf Rechnung möglich</li>
          <li><b2b-icon-100 icon="b2b_icon-sustainable-delivery" :size="24" /> Klimafreundlicher Versand</li>
        </ul>
      </div>
    </div>

    <section class="section panel">
      <b2b-tab-group>
        <b2b-tab slot="tab" selected>Beschreibung</b2b-tab>
        <b2b-tab-panel slot="panel">
          <b2b-paragraph>{{ product.description }}</b2b-paragraph>
        </b2b-tab-panel>
        <b2b-tab slot="tab">Details</b2b-tab>
        <b2b-tab-panel slot="panel">
          <dl class="details">
            <dt>Artikelnummer</dt><dd>{{ String(product.id).padStart(8, '0') }}</dd>
            <dt>Marke</dt><dd>{{ product.brand ?? '–' }}</dd>
            <dt>Kategorie</dt><dd>{{ shopCategory?.label ?? product.category }}</dd>
            <dt>Lagerbestand</dt><dd>{{ product.stock }}</dd>
          </dl>
        </b2b-tab-panel>
        <b2b-tab slot="tab">Bewertungen ({{ product.reviewCount }})</b2b-tab>
        <b2b-tab-panel slot="panel">
          <div class="reviews">
            <span class="reviews__score">{{ product.rating.toFixed(1) }}</span>
            <RatingStars :rating="product.rating" :count="product.reviewCount" />
          </div>
        </b2b-tab-panel>
      </b2b-tab-group>
    </section>

    <ProductRow v-if="data?.related.length" title="Das könnte dir auch gefallen" :products="data.related" />
  </div>
</template>

<style scoped>
.page {
  padding-top: 16px;
}

.pdp {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  gap: 40px;
  margin-top: 8px;
}

.gallery {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 12px;
}

.gallery__thumbs {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
  align-content: start;
}

.gallery__thumb {
  padding: 0;
  border: 2px solid transparent;
  background: var(--otto-image-bg);
  cursor: pointer;
}

.gallery__thumb img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
  mix-blend-mode: multiply;
}

.gallery__thumb--active {
  border-color: var(--otto-ink);
}

.gallery__main {
  background: var(--otto-image-bg);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
}

.gallery__main img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  mix-blend-mode: multiply;
}

.buybox {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.buybox__brand {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--otto-muted);
}

.buybox__stock {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: var(--otto-green);
  font-size: 14px;
}

.buybox__stock--low {
  color: var(--otto-red);
}

.buybox__actions {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.buybox__usps {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
  font-size: 14px;
}

.buybox__usps li {
  display: flex;
  align-items: center;
  gap: 8px;
}

.details {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 8px 24px;
  margin: 16px 0;
}

.details dt {
  color: var(--otto-muted);
}

.details dd {
  margin: 0;
}

.reviews {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-block: 16px;
}

.reviews__score {
  font-size: 40px;
  font-weight: 700;
}

@media (max-width: 860px) {
  .pdp {
    grid-template-columns: 1fr;
  }

  .gallery {
    grid-template-columns: 1fr;
  }

  .gallery__thumbs {
    grid-row: 2;
    grid-template-columns: repeat(auto-fill, 64px);
  }
}
</style>
