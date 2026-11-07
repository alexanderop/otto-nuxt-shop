const COUPONS: Record<string, number> = {
  SPAR10: 0.1,
}

export function useCoupon(subtotal: Ref<number>) {
  const code = useCookie<string | null>('otto-coupon', { default: () => null })

  const rate = computed(() => (code.value ? COUPONS[code.value] ?? 0 : 0))
  const discount = computed(() => Math.round(subtotal.value * rate.value * 100) / 100)

  function redeem(input: string): boolean {
    const normalized = input.trim().toUpperCase()
    if (!(normalized in COUPONS)) return false
    code.value = normalized
    return true
  }

  function remove() {
    code.value = null
  }

  return { code, discount, redeem, remove }
}
