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
  { slug: 'sale', label: 'Sale', icon: 'b2b_icon-sale', sources: [] },
  { slug: 'damen', label: 'Damen', icon: 'b2b_icon-dress', sources: ['womens-dresses', 'womens-shoes', 'womens-bags', 'womens-jewellery', 'womens-watches', 'tops'] },
  { slug: 'herren', label: 'Herren', icon: 'b2b_icon-shirt', sources: ['mens-shirts', 'mens-shoes', 'mens-watches', 'sunglasses'] },
  { slug: 'technik', label: 'Technik', icon: 'b2b_icon-tv', sources: ['smartphones', 'laptops', 'tablets', 'mobile-accessories'] },
  { slug: 'wohnen', label: 'Möbel & Wohnen', icon: 'b2b_icon-armchair', sources: ['furniture', 'home-decoration', 'kitchen-accessories'] },
  { slug: 'beauty', label: 'Beauty', icon: 'b2b_icon-cosmetics', sources: ['beauty', 'fragrances', 'skin-care'] },
  { slug: 'sport', label: 'Sport', icon: 'b2b_icon-basketball', sources: ['sports-accessories'] },
  { slug: 'lebensmittel', label: 'Lebensmittel', icon: 'b2b_icon-basket', sources: ['groceries'] },
]

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
