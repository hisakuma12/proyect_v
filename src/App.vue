<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { RotateCcw, Volume2, VolumeX } from 'lucide-vue-next'
import AmbientEffects from './components/AmbientEffects.vue'
import CountdownSection from './components/CountdownSection.vue'
import FinaleSection from './components/FinaleSection.vue'
import GallerySection from './components/GallerySection.vue'
import HeroSection from './components/HeroSection.vue'
import LetterSection from './components/LetterSection.vue'
import ExperienceProgress from './components/ExperienceProgress.vue'
import ScrubSequenceSection from './components/ScrubSequenceSection.vue'
import TimelineSection from './components/TimelineSection.vue'
import WelcomeGate from './components/WelcomeGate.vue'
import { useMusic } from './composables/useMusic'
import { useScrollReveal } from './composables/useScrollReveal'
import { useViewTransition } from './composables/useViewTransition'
import {
  birthday,
  galleryPhotos,
  hero,
  letterParagraphs,
  letterPhoto,
  timelineMoments,
} from './data/siteContent'
import { getCountdownParts, isBirthdayUnlocked } from './services/birthdayGate'

const OPEN_STORAGE_KEY = 'cumple-romantico-opened'
const now = ref(new Date())
const unlocked = ref(isBirthdayUnlocked(now.value))
const opened = ref(unlocked.value && localStorage.getItem(OPEN_STORAGE_KEY) === 'true')
let gateTimer

const progressItems = [
  { id: 'hero', label: 'Inicio' },
  { id: 'timeline', label: 'Historia' },
  { id: 'recuerdos', label: 'Recuerdos' },
  { id: 'galeria', label: 'Galería' },
  { id: 'carta', label: 'Carta' },
  { id: 'contador', label: 'Cuenta' },
  { id: 'final', label: 'Final' },
]

const { transition } = useViewTransition()
const { observe } = useScrollReveal()
const {
  audioElement,
  handleEnded,
  handlePause,
  handlePlay,
  isPlaying,
  label: musicLabel,
  musicSrc,
  toggle: toggleMusic,
} = useMusic()

const openGift = async () => {
  if (!unlocked.value) return

  await transition(() => {
    opened.value = true
    localStorage.setItem(OPEN_STORAGE_KEY, 'true')
  }, 'gift-unlock')

  await nextTick()
  observe()
}

const resetExperience = async () => {
  await transition(() => {
    opened.value = false
    localStorage.removeItem(OPEN_STORAGE_KEY)
  }, 'gift-close')

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(
  opened,
  async () => {
    await nextTick()
    observe()
  },
  { immediate: true },
)

gateTimer = window.setInterval(() => {
  now.value = new Date()
  unlocked.value = isBirthdayUnlocked(now.value)

  if (!unlocked.value) {
    opened.value = false
    localStorage.removeItem(OPEN_STORAGE_KEY)
  }
}, 1000)

onBeforeUnmount(() => {
  window.clearInterval(gateTimer)
})
</script>

<template>
  <AmbientEffects />

  <button
    v-if="opened && unlocked"
    class="floating-action music-button"
    type="button"
    :aria-label="musicLabel"
    :title="musicLabel"
    @click="toggleMusic"
  >
    <Volume2 v-if="isPlaying" :size="20" aria-hidden="true" />
    <VolumeX v-else :size="20" aria-hidden="true" />
    <span>{{ isPlaying ? 'Música' : 'Silencio' }}</span>
  </button>

  <audio
    v-if="opened && unlocked"
    ref="audioElement"
    class="music-player"
    :src="musicSrc"
    preload="metadata"
    loop
    @ended="handleEnded"
    @pause="handlePause"
    @play="handlePlay"
  />

  <button
    v-if="opened && unlocked"
    class="floating-action replay-button"
    type="button"
    aria-label="Volver a la pantalla inicial"
    title="Volver a la pantalla inicial"
    @click="resetExperience"
  >
    <RotateCcw :size="19" aria-hidden="true" />
  </button>

  <template v-if="!opened || !unlocked">
    <WelcomeGate
      :image="hero.thumb || hero.image"
      :is-locked="!unlocked"
      :countdown="getCountdownParts(now)"
      @open="openGift"
    />
  </template>

  <main v-else id="experiencia" class="experience" tabindex="-1">
    <ExperienceProgress :items="progressItems" />
    <HeroSection :hero="hero" />
    <TimelineSection :moments="timelineMoments" />
    <ScrubSequenceSection :photos="galleryPhotos" />
    <GallerySection :photos="galleryPhotos" />
    <LetterSection :paragraphs="letterParagraphs" :image="letterPhoto" />
    <CountdownSection :birthday="birthday" />
    <FinaleSection @reset="resetExperience" />
  </main>
</template>
