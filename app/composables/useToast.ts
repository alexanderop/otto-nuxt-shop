export function useToast() {
  const message = useState<{ text: string, key: number } | null>('toast', () => null)

  function show(text: string) {
    message.value = { text, key: Date.now() }
  }

  return { message, show }
}
