<script setup lang="ts">
withDefaults(defineProps<{ itemWidth?: string, gap?: string }>(), { itemWidth: '200px', gap: '8px' })

const track = useTemplateRef<HTMLElement>('track')
const atStart = ref(true)
const atEnd = ref(false)

function update() {
  const el = track.value
  if (!el) return
  atStart.value = el.scrollLeft <= 4
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
}

function scroll(direction: 1 | -1) {
  const el = track.value
  if (!el) return
  el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
}

onMounted(update)
</script>

<template>
  <div class="scroller">
    <div ref="track" class="scroller__track" :style="{ '--item': itemWidth, '--gap': gap }" @scroll.passive="update">
      <slot />
    </div>
    <button v-if="!atStart" type="button" class="scroller__arrow scroller__arrow--prev" aria-label="Zurück" @click="scroll(-1)">
      <b2b-icon-100 icon="b2b_icon-arrow-left" :size="24" />
    </button>
    <button v-if="!atEnd" type="button" class="scroller__arrow scroller__arrow--next" aria-label="Weiter" @click="scroll(1)">
      <b2b-icon-100 icon="b2b_icon-arrow-right" :size="24" />
    </button>
  </div>
</template>

<style scoped>
.scroller {
  position: relative;
}

.scroller__track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: var(--item);
  gap: var(--gap);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  list-style: none;
  margin: 0;
  padding: 0;
}

.scroller__track > :deep(*) {
  scroll-snap-align: start;
}

.scroller__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--otto-line);
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 1px 4px rgb(0 0 0 / 0.15);
}

.scroller__arrow--prev {
  left: -12px;
}

.scroller__arrow--next {
  right: -12px;
}

@media (hover: none) {
  .scroller__arrow {
    display: none;
  }
}
</style>
