<script setup>
const hearts = Array.from({ length: 16 }, (_, index) => ({
  id: `heart-${index}`,
  left: `${6 + ((index * 17) % 88)}%`,
  delay: `${(index % 8) * 0.65}s`,
  duration: `${13 + (index % 5) * 2}s`,
  scale: `${0.58 + (index % 5) * 0.1}`,
}))

const particles = Array.from({ length: 42 }, (_, index) => ({
  id: `spark-${index}`,
  left: `${2 + ((index * 23) % 96)}%`,
  top: `${4 + ((index * 19) % 88)}%`,
  delay: `${(index % 12) * 0.45}s`,
  duration: `${4 + (index % 7) * 0.55}s`,
}))
</script>

<template>
  <div class="ambient-effects" aria-hidden="true">
    <span
      v-for="particle in particles"
      :key="particle.id"
      class="spark-particle"
      :style="{
        '--left': particle.left,
        '--top': particle.top,
        '--delay': particle.delay,
        '--duration': particle.duration,
      }"
    />

    <span
      v-for="heart in hearts"
      :key="heart.id"
      class="floating-heart"
      :style="{
        '--left': heart.left,
        '--delay': heart.delay,
        '--duration': heart.duration,
        '--scale': heart.scale,
      }"
    >
      <span />
    </span>
  </div>
</template>
