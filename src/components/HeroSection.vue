<script setup>
import { ChevronDown, Heart } from 'lucide-vue-next'
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps({
  hero: {
    type: Object,
    required: true,
  },
})

const section = ref(null)
const parallaxY = ref(0)
let ticking = false

const updateParallax = () => {
  if (!section.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  const rect = section.value.getBoundingClientRect()
  parallaxY.value = Math.round(rect.top * -0.08)
  ticking = false
}

const onScroll = () => {
  if (ticking) return
  ticking = true
  requestAnimationFrame(updateParallax)
}

const scrollToTimeline = () => {
  document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  updateParallax()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <section
    id="hero"
    ref="section"
    class="romantic-hero"
    :style="{
      '--hero-image': `url(${hero.image})`,
      '--parallax-y': `${parallaxY}px`,
      '--hero-position': hero.objectPosition || 'center',
    }"
  >
    <div class="hero-shade" />
    <div class="hero-content" data-reveal>
      <div class="hero-date">
        <Heart :size="17" aria-hidden="true" />
        <span>8 de mayo</span>
      </div>

      <h2>{{ hero.quote }}</h2>
      <p>
        Una sorpresa hecha por Hisao para guardar recuerdos, palabras bonitas y
        todo el cariño que merece tu día.
      </p>

      <button
        class="icon-circle"
        type="button"
        aria-label="Ir a la línea de tiempo"
        title="Ir a la línea de tiempo"
        @click="scrollToTimeline"
      >
        <ChevronDown :size="24" aria-hidden="true" />
      </button>
    </div>
  </section>
</template>
