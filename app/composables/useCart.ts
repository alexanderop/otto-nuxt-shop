export interface CartLine {
  id: number
  title: string
  thumbnail: string
  unitPrice: number
  quantity: number
}

export function useCart() {
  const lines = useCookie<CartLine[]>('otto-cart', { default: () => [] })

  const count = computed(() => lines.value.reduce((sum, l) => sum + l.quantity, 0))
  const total = computed(() => lines.value.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0))

  function add(product: Product) {
    const existing = lines.value.find(l => l.id === product.id)
    if (existing) {
      lines.value = lines.value.map(l => l.id === product.id ? { ...l, quantity: l.quantity + 1 } : l)
      return
    }
    lines.value = [...lines.value, {
      id: product.id,
      title: product.title,
      thumbnail: product.thumbnail,
      unitPrice: salePrice(product),
      quantity: 1,
    }]
  }

  function setQuantity(id: number, quantity: number) {
    lines.value = quantity <= 0
      ? lines.value.filter(l => l.id !== id)
      : lines.value.map(l => l.id === id ? { ...l, quantity } : l)
  }

  return { lines, count, total, add, setQuantity }
}
