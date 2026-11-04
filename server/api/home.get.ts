function firstOf(category: string, index = 0) {
  return products.filter(p => p.category === category)[index]
}

function link(title: string, category: string, slug: string, index = 0, kicker?: string) {
  const product = firstOf(category, index)
  return { title, kicker, to: `/kategorie/${slug}`, image: product?.thumbnail ?? '' }
}

export default defineEventHandler(() => {
  const teasers = [
    link('Kleider für Damen', 'womens-dresses', 'damen-mode', 1, 'Für den Wow-Effekt'),
    link('Herren-Uhren', 'mens-watches', 'schmuck-uhren', 0, 'Zeit für eine Neue?'),
    link('Wohnaccessoires', 'home-decoration', 'deko', 0, 'Gemütliche Trends'),
    link('Smartphones', 'smartphones', 'multimedia', 4, 'Neu & smart'),
    link('Düfte zum Verschenken', 'fragrances', 'beauty', 0, 'Duftende Geschenke'),
  ]

  const tiles = [
    link('Sofas', 'furniture', 'moebel', 1),
    link('Taschen', 'womens-bags', 'damen-mode', 0),
    link('Laptops', 'laptops', 'multimedia', 0),
    link('Sneaker', 'mens-shoes', 'herren-mode', 0),
    link('Uhren', 'womens-watches', 'schmuck-uhren', 0),
    link('Küchenhelfer', 'kitchen-accessories', 'kueche', 2),
  ]

  const inspiration = [
    link('Sommer-Looks', 'tops', 'damen-mode', 1),
    link('Apple Perfect Match', 'smartphones', 'multimedia', 2),
    link('Sneaker-Liebe', 'womens-shoes', 'damen-mode', 1),
    link('Gemütlich wohnen', 'furniture', 'moebel', 2),
    link('Glow-Routine', 'skin-care', 'beauty', 0),
  ]

  const subTiles = [
    link('Möbel', 'furniture', 'moebel', 0),
    link('Küche', 'kitchen-accessories', 'kueche', 0),
    link('Wohnaccessoires', 'home-decoration', 'deko', 1),
    link('Beauty', 'beauty', 'beauty', 0),
    link('Multimedia', 'laptops', 'multimedia', 1),
    link('Sport', 'sports-accessories', 'sport', 0),
  ]

  const living = products.filter(p => ['furniture', 'home-decoration', 'kitchen-accessories'].includes(p.category))
  const extraSale = living.filter(isOnSale).concat(living.filter(p => !isOnSale(p))).slice(0, 10)
  const topseller = products.toSorted((a, b) => b.rating - a.rating).slice(0, 10)

  return {
    teasers,
    tiles,
    inspiration,
    subTiles,
    extraBanner: living.slice(0, 3).map(p => p.thumbnail),
    extraSale,
    topseller,
  }
})
