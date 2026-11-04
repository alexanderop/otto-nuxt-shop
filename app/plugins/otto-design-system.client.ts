import { defineCustomElements } from '@otto-de/b2b-core-components/dist/loader'

export default defineNuxtPlugin(() => {
  defineCustomElements(window)
})
