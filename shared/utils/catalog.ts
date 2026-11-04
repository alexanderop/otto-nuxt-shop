export interface Product {
  id: number
  title: string
  description: string
  category: string
  brand: string | null
  price: number
  discountPercentage: number
  rating: number
  reviewCount: number
  stock: number
  thumbnail: string
  images: string[]
}

export interface ShopCategory {
  slug: string
  label: string
  icon: string
  sources: string[]
}

export const SALE_THRESHOLD = 15

export const shopCategories: ShopCategory[] = [
  { slug: 'damen-mode', label: 'Damen-Mode', icon: 'b2b_icon-dress', sources: ['womens-dresses', 'womens-shoes', 'womens-bags', 'tops'] },
  { slug: 'herren-mode', label: 'Herren-Mode', icon: 'b2b_icon-shirt', sources: ['mens-shirts', 'mens-shoes'] },
  { slug: 'schmuck-uhren', label: 'Schmuck & Uhren', icon: 'b2b_icon-diamond-circle', sources: ['womens-jewellery', 'womens-watches', 'mens-watches', 'sunglasses'] },
  { slug: 'sport', label: 'Sport', icon: 'b2b_icon-basketball', sources: ['sports-accessories'] },
  { slug: 'beauty', label: 'Beauty & Drogerie', icon: 'b2b_icon-cosmetics', sources: ['beauty', 'fragrances', 'skin-care'] },
  { slug: 'lebensmittel', label: 'Lebensmittel', icon: 'b2b_icon-basket', sources: ['groceries'] },
  { slug: 'multimedia', label: 'Multimedia', icon: 'b2b_icon-tv', sources: ['smartphones', 'laptops', 'tablets', 'mobile-accessories'] },
  { slug: 'kueche', label: 'Küche', icon: 'b2b_icon-armchair', sources: ['kitchen-accessories'] },
  { slug: 'deko', label: 'Wohnaccessoires', icon: 'b2b_icon-armchair', sources: ['home-decoration'] },
  { slug: 'moebel', label: 'Möbel', icon: 'b2b_icon-armchair', sources: ['furniture'] },
  { slug: 'sale', label: 'Sale', icon: 'b2b_icon-sale', sources: [] },
]

export function categoryOf(product: Pick<Product, 'category'>) {
  return shopCategories.find(c => c.sources.includes(product.category))
}

export function findCategory(slug: string) {
  return shopCategories.find(c => c.slug === slug)
}

export function salePrice(product: Pick<Product, 'price' | 'discountPercentage'>) {
  return Math.round(product.price * (1 - product.discountPercentage / 100) * 100) / 100
}

export function isOnSale(product: Pick<Product, 'discountPercentage'>) {
  return product.discountPercentage >= SALE_THRESHOLD
}

const euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })

export function formatEuro(value: number) {
  return euro.format(value)
}

export function stockText(stock: number) {
  if (stock === 0) return 'Leider ausverkauft'
  if (stock <= 10) return `Nur noch ${stock} Stück – in 2-3 Werktagen bei dir`
  return 'lieferbar – in 2-3 Werktagen bei dir'
}
