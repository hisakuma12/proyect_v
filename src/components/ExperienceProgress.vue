<script setup>
import { BookOpen, Camera, Film, Gift, Heart, Landmark, Sparkles } from 'lucide-vue-next'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const activeId = ref(props.items[0]?.id || '')
const scrollProgress = ref(0)
let animationFrame = 0

const icons = {
  hero: Gift,
  timeline: Landmark,
  recuerdos: Film,
  galeria: Camera,
  carta: BookOpen,
  contador: Heart,
  final: Sparkles,
}

const progress = computed(() => {
  return scrollProgress.value
})

const scrollToSection = (id) => {
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth'

  document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' })
}

const updateProgress = () => {
  const documentElement = document.documentElement
  const maxScroll = Math.max(documentElement.scrollHeight - window.innerHeight, 1)
  const currentScroll = window.scrollY || documentElement.scrollTop || 0
  const probeY = currentScroll + window.innerHeight * 0.42

  scrollProgress.value = Math.min(Math.max(currentScroll / maxScroll, 0), 1)

  const sections = props.items
    .map((item) => {
      const element = document.getElementById(item.id)
      if (!element) return null

      return {
        id: item.id,
        top: element.offsetTop,
        bottom: element.offsetTop + Math.max(element.offsetHeight, window.innerHeight * 0.5),
      }
    })
    .filter(Boolean)

  const activeSection =
    sections.find((section, index) => {
      const nextSection = sections[index + 1]
      const sectionEnd = nextSection ? nextSection.top : section.bottom
      return probeY >= section.top && probeY < sectionEnd
    }) || sections[sections.length - 1]

  if (activeSection) activeId.value = activeSection.id
}

const requestProgressUpdate = () => {
  if (animationFrame) return

  animationFrame = window.requestAnimationFrame(() => {
    animationFrame = 0
    updateProgress()
  })
}

onMounted(() => {
  updateProgress()

  window.addEventListener('scroll', requestProgressUpdate, { passive: true })
  window.addEventListener('resize', requestProgressUpdate)
  window.addEventListener('load', requestProgressUpdate)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', requestProgressUpdate)
  window.removeEventListener('resize', requestProgressUpdate)
  window.removeEventListener('load', requestProgressUpdate)
  if (animationFrame) window.cancelAnimationFrame(animationFrame)
})
</script>

<template>
  <nav
    class="experience-progress"
    aria-label="Progreso de la sorpresa"
    :style="{ '--experience-progress': progress }"
  >
    <div class="experience-progress-track" aria-hidden="true">
      <span />
    </div>

    <button
      v-for="item in items"
      :key="item.id"
      class="progress-dot"
      :class="{ 'is-active': activeId === item.id }"
      type="button"
      :aria-label="`Ir a ${item.label}`"
      :aria-current="activeId === item.id ? 'step' : undefined"
      :title="item.label"
      @click="scrollToSection(item.id)"
    >
      <component :is="icons[item.id]" :size="16" aria-hidden="true" />
      <span>{{ item.label }}</span>
    </button>
  </nav>
</template>
