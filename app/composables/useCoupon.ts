const COUPONS: Record<string, number> = {
  SPAR10: 0.1,
}

export function useCoupon(subtotal: Ref<number>) {
  const code = useCookie<string | null>('otto-coupon', { default: () => null })
  const amount = useCookie<number>('otto-coupon-amount', { default: () => 0 })

  const discount = computed(() => (code.value ? amount.value : 0))

  function redeem(input: string): boolean {
    const normalized = input.trim().toUpperCase()
    if (!(normalized in COUPONS)) return false
    code.value = normalized
    amount.value = Math.round(subtotal.value * COUPONS[normalized]! * 100) / 100
    return true
  }

  function remove() {
    code.value = null
    amount.value = 0
  }

  return { code, discount, redeem, remove }
}
