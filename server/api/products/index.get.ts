export default defineEventHandler((event) => {
  const query = getQuery(event)

  return queryProducts({
    category: typeof query.category === 'string' ? query.category : undefined,
    q: typeof query.q === 'string' ? query.q : undefined,
    sort: typeof query.sort === 'string' ? (query.sort as SortKey) : undefined,
    minRating: Number(query.minRating) || 0,
    sale: query.sale === 'true',
    page: Number(query.page) || 1,
    pageSize: Number(query.pageSize) || 12,
  })
})
