<script setup lang="ts">
defineProps<{ items: { label: string, to: string }[] }>()

function onSelected(event: CustomEvent<{ value: string }>) {
  navigateTo(event.detail.value)
}
</script>

<template>
  <b2b-breadcrumb :padding-bottom="8" @b2b-selected="onSelected">
    <b2b-breadcrumb-item
      v-for="(item, index) in items"
      :key="item.to"
      :value="item.to"
      :active="index === items.length - 1"
    >
      {{ item.label }}
    </b2b-breadcrumb-item>
  </b2b-breadcrumb>
</template>
