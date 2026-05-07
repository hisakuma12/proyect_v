<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  photos: {
    type: Array,
    required: true,
  },
})

const sectionElement = ref(null)
const sliderElement = ref(null)
const currentIndex = ref(0)
const loadedFrames = ref(new Set())
let animationFrame = 0
let gsapContext

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

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const animateCards = (immediate = false) => {
  const slider = sliderElement.value
  if (!slider) return

  const cards = gsap.utils.toArray(slider.querySelectorAll('.scrub-card'))
  const active = currentIndex.value
  const cardWidth = cards[0]?.getBoundingClientRect().width || 1
  const viewportWidth = window.innerWidth
  const spread = viewportWidth <= 640 ? cardWidth * 0.34 : cardWidth * 0.42

  cards.forEach((card, index) => {
    const offset = index - active
    const absOffset = Math.abs(offset)
    const isVisible = absOffset <= 3
    const depth = Math.min(absOffset, 3)

    gsap.to(card, {
      x: offset * spread,
      y: depth * (viewportWidth <= 640 ? 10 : 14),
      scale: 1 - depth * 0.075,
      rotate: offset * (viewportWidth <= 640 ? 4.2 : 5.5),
      autoAlpha: isVisible ? 1 - depth * 0.18 : 0,
      zIndex: 20 - absOffset,
      duration: immediate || prefersReducedMotion() ? 0 : 0.66,
      ease: 'power3.out',
      overwrite: true,
    })
  })
}

const requestScrollUpdate = () => {
  if (animationFrame) return

  animationFrame = window.requestAnimationFrame(() => {
    animationFrame = 0
    updateFromScroll()
  })
}

const handleResize = () => {
  requestScrollUpdate()
  animateCards(true)
}

const handleSliderInput = (event) => {
  setIndexFromProgress(Number(event.target.value) / 100)
}

const showPrevious = () => {
  currentIndex.value = Math.max(currentIndex.value - 1, 0)
}

const showNext = () => {
  currentIndex.value = Math.min(currentIndex.value + 1, frames.value.length - 1)
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
  gsapContext = gsap.context(() => animateCards(true), sliderElement.value)
  preloadFrames()
  updateFromScroll()
  window.addEventListener('scroll', requestScrollUpdate, { passive: true })
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  gsapContext?.revert()
  window.removeEventListener('scroll', requestScrollUpdate)
  window.removeEventListener('resize', handleResize)
  if (animationFrame) window.cancelAnimationFrame(animationFrame)
})

watch(currentIndex, () => {
  animateCards()
})

watch(frames, async () => {
  await nextTick()
  animateCards(true)
})
</script>

<template>
  <section
    ref="sectionElement"
    id="recuerdos"
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
          <span class="scrub-hint">Scroll o deslizador para avanzar</span>
        </div>

        <figure class="scrub-stage" data-reveal>
          <div
            ref="sliderElement"
            class="scrub-card-slider"
            aria-live="polite"
          >
            <article
              v-for="(frame, index) in frames"
              :key="frame.id"
              class="scrub-card"
              :class="{
                'is-active': index === currentIndex,
                'is-loaded': loadedFrames.has(frame.id),
              }"
              :aria-hidden="index !== currentIndex"
              :style="{
                '--scrub-bg': `url(${frame.thumb || frame.image})`,
              }"
            >
              <div class="scrub-card-photo">
                <img
                  :src="frame.image"
                  :alt="frame.alt"
                  :style="{
                    objectFit: frame.objectFit,
                    objectPosition: frame.objectPosition,
                  }"
                  @load="markFrameLoaded(frame.id)"
                />
              </div>
            </article>
          </div>

          <figcaption>
            <span class="scrub-counter">
              {{ currentIndex + 1 }} / {{ frames.length }}
            </span>
            <strong>{{ activeFrame?.title }}</strong>
            <span>{{ activeFrame?.phrase }}</span>
          </figcaption>

          <div class="scrub-actions" aria-label="Controles de recuerdos">
            <button
              type="button"
              class="scrub-action"
              :disabled="currentIndex === 0"
              aria-label="Recuerdo anterior"
              @click="showPrevious"
            >
              ‹
            </button>
            <button
              type="button"
              class="scrub-action"
              :disabled="currentIndex === frames.length - 1"
              aria-label="Recuerdo siguiente"
              @click="showNext"
            >
              ›
            </button>
          </div>

          <label class="scrub-control">
            <span class="sr-only">Avanzar recuerdos</span>
            <span class="scrub-control-caption" aria-hidden="true">
              Inicio
            </span>
            <input
              type="range"
              min="0"
              max="100"
              :value="Math.round(progress * 100)"
              aria-label="Avanzar recuerdos"
              :style="{ '--scrub-progress': `${Math.round(progress * 100)}%` }"
              @input="handleSliderInput"
            />
            <span class="scrub-control-caption" aria-hidden="true">
              Ahora
            </span>
          </label>
        </figure>
      </div>
    </div>
  </section>
</template>
