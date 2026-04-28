import { computed, ref } from 'vue'

export function useMusic() {
  const isPlaying = ref(false)
  let context
  let gain
  let timer

  const notes = [261.63, 329.63, 392, 523.25, 440, 392, 329.63, 349.23]

  const createContext = () => {
    if (context) return

    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return

    context = new AudioContextClass()
    gain = context.createGain()
    gain.gain.value = 0.035
    gain.connect(context.destination)
  }

  const playNote = (frequency, startAt) => {
    const oscillator = context.createOscillator()
    const noteGain = context.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    noteGain.gain.setValueAtTime(0, startAt)
    noteGain.gain.linearRampToValueAtTime(0.28, startAt + 0.04)
    noteGain.gain.exponentialRampToValueAtTime(0.001, startAt + 1.2)

    oscillator.connect(noteGain)
    noteGain.connect(gain)
    oscillator.start(startAt)
    oscillator.stop(startAt + 1.25)
  }

  const scheduleLoop = () => {
    if (!context || !isPlaying.value) return

    const startAt = context.currentTime + 0.08
    notes.forEach((note, index) => {
      playNote(note, startAt + index * 0.55)
    })

    timer = window.setTimeout(scheduleLoop, 5200)
  }

  const toggle = async () => {
    createContext()
    if (!context) return

    if (context.state === 'suspended') {
      await context.resume()
    }

    isPlaying.value = !isPlaying.value

    if (isPlaying.value) {
      scheduleLoop()
    } else {
      window.clearTimeout(timer)
    }
  }

  const label = computed(() =>
    isPlaying.value ? 'Desactivar música' : 'Activar música',
  )

  return {
    isPlaying,
    label,
    toggle,
  }
}
