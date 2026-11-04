import data from '../data/products.json'

export const products = (data as Product[]).filter(p => !['vehicle', 'motorcycle'].includes(p.category))

export type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'discount'

export interface ProductQuery {
  category?: string
  q?: string
  sort?: SortKey
  minRating?: number
  sale?: boolean
  page?: number
  pageSize?: number
}

export function queryProducts(query: ProductQuery) {
  const { category, q, sort = 'relevance', minRating = 0, sale = false, page = 1, pageSize = 12 } = query
  const shopCategory = category ? findCategory(category) : undefined
  const term = q?.trim().toLowerCase()

  let items = products.filter((p) => {
    if (shopCategory?.slug === 'sale' && !isOnSale(p)) return false
    if (shopCategory && shopCategory.slug !== 'sale' && !shopCategory.sources.includes(p.category)) return false
    if (sale && !isOnSale(p)) return false
    if (p.rating < minRating) return false
    if (term && !`${p.title} ${p.brand ?? ''} ${p.category}`.toLowerCase().includes(term)) return false
    return true
  })

  const sorters: Record<SortKey, ((a: Product, b: Product) => number) | undefined> = {
    'relevance': undefined,
    'price-asc': (a, b) => salePrice(a) - salePrice(b),
    'price-desc': (a, b) => salePrice(b) - salePrice(a),
    'rating': (a, b) => b.rating - a.rating,
    'discount': (a, b) => b.discountPercentage - a.discountPercentage,
  }
  const sorter = sorters[sort]
  if (sorter) items = items.toSorted(sorter)

  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(Math.max(1, page), totalPages)

  return {
    items: items.slice((current - 1) * pageSize, current * pageSize),
    total,
    page: current,
    totalPages,
  }
}
