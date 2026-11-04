export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  const product = products.find(p => p.id === id)

  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Produkt nicht gefunden' })
  }

  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 6)

  return { product, related }
})
