<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { getCountdownParts, isBirthdayUnlocked } from '../services/birthdayGate'

const props = defineProps({
  birthday: {
    type: Object,
    required: true,
  },
})

const now = ref(new Date())
let timer

const unlocked = computed(() => isBirthdayUnlocked(now.value))
const timeLeft = computed(() => getCountdownParts(now.value))

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onBeforeUnmount(() => {
  window.clearInterval(timer)
})
</script>

<template>
  <section id="contador" class="section-block countdown-section">
    <div class="section-inner">
      <div class="countdown-panel glass-card" data-reveal>
        <span class="eyebrow">Cuenta regresiva</span>
        <template v-if="unlocked">
          <h2>Hoy es tu día, feliz cumpleaños mi amor</h2>
          <p class="countdown-intro">
            Esta página ya está abierta para celebrar tu vida, tus sueños, nuestra
            familia y todo lo bonito que sos para mí.
          </p>
        </template>
        <template v-else>
          <h2>Falta poquito para el {{ birthday.unlockLabel || birthday.label }}</h2>
          <p class="countdown-intro">
            Estoy guardando esta sorpresa para abrirla en el momento exacto. Mientras
            llega tu día, cada segundo cuenta y los mensajes de quienes te quieren ya
            pueden esperar por vos.
          </p>
          <div class="countdown-grid" aria-label="Tiempo restante">
            <div v-for="(value, label) in timeLeft" :key="label" class="time-box">
              <strong>{{ String(value).padStart(2, '0') }}</strong>
              <span>{{ label }}</span>
            </div>
          </div>
          <div class="countdown-notes">
            <article>
              <strong>Se abre a medianoche</strong>
              <span>8 de mayo de 2026, horario Paraguay</span>
            </article>
            <article>
              <strong>Los mensajes quedan activos</strong>
              <span>Familia y amigos pueden dejar fotos y palabras desde ahora</span>
            </article>
            <article>
              <strong>La sorpresa queda guardada</strong>
              <span>Después del cumpleaños podrás volver a verla todas las veces</span>
            </article>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
