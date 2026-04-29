import { computed, ref } from 'vue'

const MUSIC_SRC = `${import.meta.env.BASE_URL}audio/coincidir.webm`

export function useMusic() {
  const isPlaying = ref(false)
  const audioElement = ref(null)

  const toggle = async () => {
    const audio = audioElement.value
    if (!audio) return

    audio.volume = 0.72

    if (audio.paused) {
      await audio.play()
      isPlaying.value = true
      return
    }

    audio.pause()
    isPlaying.value = false
  }

  const handleEnded = () => {
    isPlaying.value = false
  }

  const handlePause = () => {
    isPlaying.value = false
  }

  const handlePlay = () => {
    isPlaying.value = true
  }

  const label = computed(() =>
    isPlaying.value ? 'Desactivar música' : 'Activar música',
  )

  return {
    audioElement,
    handleEnded,
    handlePause,
    handlePlay,
    isPlaying,
    label,
    musicSrc: MUSIC_SRC,
    toggle,
  }
}
