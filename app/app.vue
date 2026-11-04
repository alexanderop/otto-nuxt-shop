<script setup lang="ts">
const { message } = useToast()
</script>

<template>
  <NuxtRouteAnnouncer />
  <AppHeader />
  <main>
    <NuxtPage />
  </main>
  <AppFooter />
  <ClientOnly>
    <b2b-snackbar
      v-if="message"
      :key="message.key"
      class="toast"
      type="success"
      :description="message.text"
      opened
      :duration="3000"
      @b2b-close="message = null"
    />
  </ClientOnly>
</template>

<style scoped>
main {
  min-height: 60vh;
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  z-index: 100;
}
</style>
