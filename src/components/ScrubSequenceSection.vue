<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  photos: {
    type: Array,
    required: true,
  },
})

const sectionElement = ref(null)
const currentIndex = ref(0)
const loadedFrames = ref(new Set())
let animationFrame = 0

const frames = computed(() =>
  props.photos.map((photo) => ({
    id: photo.id,
    image: photo.image,
    thumb: photo.thumb || photo.image,
    title: photo.title,
    phrase: photo.phrase,
    alt: photo.alt || photo.title,
    objectFit: photo.objectFit || 'contain',
    objectPosition: photo.objectPosition || 'center center',
  })),
)

const activeFrame = computed(() => frames.value[currentIndex.value] || frames.value[0])
const progress = computed(() => {
  if (frames.value.length <= 1) return 0
  return currentIndex.value / (frames.value.length - 1)
})

const setIndexFromProgress = (value) => {
  if (!frames.value.length) return

  const clamped = Math.min(Math.max(value, 0), 1)
  currentIndex.value = Math.round(clamped * (frames.value.length - 1))
}

const updateFromScroll = () => {
  const element = sectionElement.value
  if (!element) return

  const rect = element.getBoundingClientRect()
  const scrollableDistance = Math.max(element.offsetHeight - window.innerHeight, 1)
  setIndexFromProgress(Math.min(Math.max(-rect.top / scrollableDistance, 0), 1))
}

const requestScrollUpdate = () => {
  if (animationFrame) return

  animationFrame = window.requestAnimationFrame(() => {
    animationFrame = 0
    updateFromScroll()
  })
}

const handleSliderInput = (event) => {
  setIndexFromProgress(Number(event.target.value) / 100)
}

const markFrameLoaded = (id) => {
  loadedFrames.value = new Set([...loadedFrames.value, id])
}

const preloadFrames = () => {
  frames.value.forEach((frame) => {
    const image = new Image()
    image.src = frame.image
  })
}

onMounted(async () => {
  await nextTick()
  preloadFrames()
  updateFromScroll()
  window.addEventListener('scroll', requestScrollUpdate, { passive: true })
  window.addEventListener('resize', requestScrollUpdate)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', requestScrollUpdate)
  window.removeEventListener('resize', requestScrollUpdate)
  if (animationFrame) window.cancelAnimationFrame(animationFrame)
})
</script>

<template>
  <section
    ref="sectionElement"
    class="scrub-section"
    aria-labelledby="scrub-title"
  >
    <div class="scrub-sticky">
      <div class="section-inner scrub-layout">
        <div class="scrub-copy" data-reveal>
          <span class="eyebrow">Película de recuerdos</span>
          <h2 id="scrub-title">Deslizá para recorrer nuestra historia</h2>
          <p>
            Cada movimiento del scroll cambia el cuadro, como pasar despacito
            por esos momentos que vale la pena mirar otra vez.
          </p>
        </div>

        <figure class="scrub-stage" data-reveal>
          <div
            class="scrub-frame"
            :class="{ 'is-loaded': loadedFrames.has(activeFrame?.id) }"
            :style="{
              '--scrub-bg': `url(${activeFrame?.thumb || activeFrame?.image})`,
            }"
          >
            <img
              v-if="activeFrame"
              :key="activeFrame.id"
              :src="activeFrame.image"
              :alt="activeFrame.alt"
              :style="{
                objectFit: activeFrame.objectFit,
                objectPosition: activeFrame.objectPosition,
              }"
              @load="markFrameLoaded(activeFrame.id)"
            />
          </div>

          <figcaption>
            <span class="scrub-counter">
              {{ currentIndex + 1 }} / {{ frames.length }}
            </span>
            <strong>{{ activeFrame?.title }}</strong>
            <span>{{ activeFrame?.phrase }}</span>
          </figcaption>

          <label class="scrub-control">
            <span class="sr-only">Avanzar recuerdos</span>
            <input
              type="range"
              min="0"
              max="100"
              :value="Math.round(progress * 100)"
              aria-label="Avanzar recuerdos"
              @input="handleSliderInput"
            />
          </label>
        </figure>
      </div>
    </div>
  </section>
</template>
