<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { Heart, RotateCcw, Sparkles } from 'lucide-vue-next'

const emit = defineEmits(['reset'])

const sectionElement = ref(null)
const burstHearts = ref([])
const isResetting = ref(false)
let burstId = 0
let resetTimer
let cleanupTimer

const heartColors = ['#c85d83', '#e3bc5f', '#c7b8ff', '#e99ab5']

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const clearBurst = () => {
  burstHearts.value = []
  window.clearTimeout(cleanupTimer)
}

const createHeartBurst = (event) => {
  if (prefersReducedMotion()) return

  const section = sectionElement.value
  const rect = section?.getBoundingClientRect()
  const originX = rect ? event.clientX - rect.left : 0
  const originY = rect ? event.clientY - rect.top : 0

  clearBurst()

  burstHearts.value = Array.from({ length: 18 }, (_, index) => {
    const angle = -160 + index * 18
    const distance = 72 + (index % 5) * 14
    const radians = (angle * Math.PI) / 180

    return {
      id: `${Date.now()}-${burstId++}`,
      x: `${originX}px`,
      y: `${originY}px`,
      dx: `${Math.cos(radians) * distance}px`,
      dy: `${Math.sin(radians) * distance - 42}px`,
      size: 14 + (index % 4) * 3,
      rotate: `${angle / 2}deg`,
      color: heartColors[index % heartColors.length],
      delay: `${(index % 6) * 24}ms`,
    }
  })

  cleanupTimer = window.setTimeout(clearBurst, 1050)
}

const handleResetClick = (event) => {
  if (isResetting.value) return

  isResetting.value = true
  createHeartBurst(event)

  resetTimer = window.setTimeout(
    () => emit('reset'),
    prefersReducedMotion() ? 0 : 430,
  )
}

onBeforeUnmount(() => {
  window.clearTimeout(resetTimer)
  window.clearTimeout(cleanupTimer)
})
</script>

<template>
  <section
    ref="sectionElement"
    id="final"
    class="finale-section"
    @click="createHeartBurst"
  >
    <div class="finale-content" data-reveal>
      <Sparkles :size="28" aria-hidden="true" />
      <h2>Gracias por existir y por hacer mi vida más bonita.</h2>
      <p>Que esta sorpresa vuelva a abrirse todas las veces que quieras sentirte amada.</p>

      <button
        class="primary-button"
        type="button"
        :disabled="isResetting"
        @click.stop="handleResetClick"
      >
        <RotateCcw :size="18" aria-hidden="true" />
        <span>Volver a ver la sorpresa</span>
      </button>
    </div>

    <div v-if="burstHearts.length" class="heart-burst-layer" aria-hidden="true">
      <Heart
        v-for="heart in burstHearts"
        :key="heart.id"
        class="heart-burst-item"
        :size="heart.size"
        :style="{
          '--heart-x': heart.x,
          '--heart-y': heart.y,
          '--heart-dx': heart.dx,
          '--heart-dy': heart.dy,
          '--heart-rotate': heart.rotate,
          '--heart-color': heart.color,
          '--heart-delay': heart.delay,
        }"
        fill="currentColor"
      />
    </div>

    <div class="finale-hearts" aria-hidden="true">
      <Heart v-for="index in 7" :key="index" :size="18 + index * 2" />
    </div>
  </section>
</template>
