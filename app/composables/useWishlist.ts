export function useWishlist() {
  const ids = useCookie<number[]>('otto-wishlist', { default: () => [] })

  const count = computed(() => ids.value.length)

  function has(id: number) {
    return ids.value.includes(id)
  }

  function toggle(id: number) {
    ids.value = has(id) ? ids.value.filter(x => x !== id) : [...ids.value, id]
  }

  return { ids, count, has, toggle }
}
