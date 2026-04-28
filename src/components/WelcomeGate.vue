<script setup>
import { Gift, Heart, Sparkles } from 'lucide-vue-next'
import { gsap } from 'gsap'

defineProps({
  image: {
    type: String,
    required: true,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  countdown: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['open'])

const pressButton = (event) => {
  if (event.currentTarget.disabled) return

  gsap.timeline({ defaults: { ease: 'power2.out' } })
    .to(event.currentTarget, {
      scale: 0.96,
      duration: 0.12,
    })
    .to(event.currentTarget, {
      scale: 1,
      duration: 0.28,
    })
}
</script>

<template>
  <section class="welcome-gate" :style="{ '--welcome-image': `url(${image})` }">
    <div class="welcome-overlay" />

    <div class="welcome-content" data-reveal>
      <div class="welcome-kicker">
        <Sparkles :size="18" aria-hidden="true" />
        <span>Para Verónica Benitez, de Hisao Kumagai</span>
      </div>

      <h1>Feliz cumpleaños, Verónica</h1>
      <p v-if="isLocked">
        La sorpresa se abre el 8 de mayo. Mientras tanto, quienes te quieren ya
        pueden dejarte un mensaje.
      </p>
      <p v-else>8 de mayo, un día especial para celebrar tu vida</p>

      <div v-if="isLocked && countdown" class="welcome-countdown" aria-label="Tiempo para abrir la sorpresa">
        <div v-for="(value, label) in countdown" :key="label">
          <strong>{{ String(value).padStart(2, '0') }}</strong>
          <span>{{ label }}</span>
        </div>
      </div>

      <button
        class="primary-button gift-button"
        type="button"
        :disabled="isLocked"
        @pointerdown="pressButton"
        @click="!isLocked && emit('open')"
      >
        <Gift :size="20" aria-hidden="true" />
        <span>{{ isLocked ? 'Disponible el 8 de mayo' : 'Abrir mi regalo' }}</span>
        <Heart :size="18" aria-hidden="true" />
      </button>
    </div>
  </section>
</template>
