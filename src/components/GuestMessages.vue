<script setup>
import { ImagePlus, Send, Trash2, UserRound } from 'lucide-vue-next'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { gsap } from 'gsap'
import {
  createGuestMessage,
  loadGuestMessages,
  saveGuestMessages,
} from '../services/guestMessageStorage'

const props = defineProps({
  initialMessages: {
    type: Array,
    required: true,
  },
})

const fileInput = ref(null)
const messages = ref([])
const form = reactive({
  name: '',
  image: '',
  imageName: '',
  comment: '',
})

const canSubmit = computed(() => form.name.trim() && form.comment.trim())

const initialsFor = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.addEventListener('load', () => {
    form.image = reader.result
    form.imageName = file.name
  })
  reader.readAsDataURL(file)
}

const openFilePicker = () => {
  fileInput.value?.click()
}

const clearSelectedImage = () => {
  form.image = ''
  form.imageName = ''

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const submitMessage = async () => {
  if (!canSubmit.value) return

  const message = await createGuestMessage({
    name: form.name.trim(),
    image: form.image,
    comment: form.comment.trim(),
  })

  messages.value = [message, ...messages.value]
  saveGuestMessages(messages.value)

  form.name = ''
  form.image = ''
  form.imageName = ''
  form.comment = ''

  if (fileInput.value) {
    fileInput.value.value = ''
  }

  await nextTick()
  gsap.fromTo(
    '.guest-card:first-child',
    { autoAlpha: 0, y: -14, scale: 0.96, filter: 'blur(8px)' },
    { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' },
  )
}

onMounted(() => {
  messages.value = loadGuestMessages(props.initialMessages)
})
</script>

<template>
  <section id="mensajes" class="section-block guest-section">
    <div class="section-inner">
      <div class="section-heading" data-reveal>
        <span class="eyebrow">Con cariño</span>
        <h2>Mensajes de quienes te quieren</h2>
      </div>

      <div class="guest-layout">
        <form class="guest-form glass-card" data-reveal @submit.prevent="submitMessage">
          <label>
            <span>Nombre del invitado</span>
            <input v-model="form.name" type="text" autocomplete="name" required />
          </label>

          <div class="guest-form-field">
            <span>Foto del invitado o dedicada</span>
            <input
              ref="fileInput"
              class="sr-only"
              type="file"
              accept="image/*"
              @change="handleFileChange"
            />
            <div class="file-picker">
              <button
                class="file-picker-button"
                type="button"
                aria-label="Seleccionar foto"
                @click="openFilePicker"
              >
                <ImagePlus :size="18" aria-hidden="true" />
                <span>Elegir foto</span>
              </button>
              <span class="file-picker-name">
                {{ form.imageName || 'Sin foto seleccionada' }}
              </span>
              <button
                v-if="form.image"
                class="file-clear-button"
                type="button"
                aria-label="Vaciar foto seleccionada"
                title="Vaciar foto seleccionada"
                @click="clearSelectedImage"
              >
                <Trash2 :size="17" aria-hidden="true" />
              </button>
            </div>
          </div>

          <label>
            <span>Comentario de cumpleaños</span>
            <textarea v-model="form.comment" rows="5" required />
          </label>

          <div
            v-if="form.image"
            class="photo-preview"
            :style="{ '--preview-bg': `url(${form.image})` }"
          >
            <img :src="form.image" alt="Vista previa de la foto subida" />
          </div>

          <button class="primary-button" type="submit" :disabled="!canSubmit">
            <Send :size="18" aria-hidden="true" />
            <span>Agregar mensaje</span>
          </button>
        </form>

        <div class="guest-cards">
          <article
            v-for="(message, index) in messages"
            :key="message.id"
            class="guest-card glass-card"
            data-reveal
            :style="{ '--delay': `${index * 55}ms` }"
          >
            <div class="guest-avatar">
              <img v-if="message.image" :src="message.image" :alt="message.name" loading="lazy" />
              <span v-else>{{ initialsFor(message.name) }}</span>
              <UserRound v-if="!message.image && !initialsFor(message.name)" :size="22" />
            </div>
            <div>
              <h3>{{ message.name }}</h3>
              <p>{{ message.comment }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
