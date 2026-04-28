<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  paragraphs: {
    type: Array,
    required: true,
  },
})

const letter = ref(null)
const typedText = ref('')
const started = ref(false)
let observer
let timer

const fullText = computed(() => props.paragraphs.join('\n\n'))
const typedParagraphs = computed(() => typedText.value.split('\n\n').filter(Boolean))
const isComplete = computed(() => typedText.value.length >= fullText.value.length)

const startTyping = () => {
  if (started.value) return
  started.value = true

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typedText.value = fullText.value
    return
  }

  timer = window.setInterval(() => {
    typedText.value = fullText.value.slice(0, typedText.value.length + 2)

    if (typedText.value.length >= fullText.value.length) {
      window.clearInterval(timer)
    }
  }, 28)
}

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        startTyping()
        observer.disconnect()
      }
    },
    { threshold: 0.35 },
  )

  if (letter.value) observer.observe(letter.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.clearInterval(timer)
})
</script>

<template>
  <section id="carta" class="section-block letter-section">
    <div class="section-inner">
      <div class="section-heading" data-reveal>
        <span class="eyebrow">Para ti</span>
        <h2>Una carta desde mi corazón</h2>
      </div>

      <article ref="letter" class="letter-paper" data-reveal>
        <div class="letter-mark" aria-hidden="true" />
        <p v-for="(paragraph, index) in typedParagraphs" :key="index">
          {{ paragraph }}
          <span
            v-if="index === typedParagraphs.length - 1 && !isComplete"
            class="typing-cursor"
            aria-hidden="true"
          />
        </p>
      </article>
    </div>
  </section>
</template>
