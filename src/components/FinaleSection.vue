<script setup>
import { Heart, RotateCcw, Sparkles } from 'lucide-vue-next'

const emit = defineEmits(['reset'])
</script>

<template>
  <section id="final" class="finale-section">
    <div class="finale-content" data-reveal>
      <Sparkles :size="28" aria-hidden="true" />
      <h2>Gracias por existir y por hacer mi vida más bonita.</h2>
      <p>Que esta sorpresa vuelva a abrirse todas las veces que quieras sentirte amada.</p>

      <button class="primary-button" type="button" @click="emit('reset')">
        <RotateCcw :size="18" aria-hidden="true" />
        <span>Volver a ver la sorpresa</span>
      </button>
    </div>

    <div class="finale-hearts" aria-hidden="true">
      <Heart v-for="index in 7" :key="index" :size="18 + index * 2" />
    </div>
  </section>
</template>
