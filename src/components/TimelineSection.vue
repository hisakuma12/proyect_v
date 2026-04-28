<script setup>
defineProps({
  moments: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <section id="timeline" class="section-block timeline-section">
    <div class="section-inner">
      <div class="section-heading" data-reveal>
        <span class="eyebrow">Nuestra historia</span>
        <h2>Momentos que viven en mí</h2>
      </div>

      <div class="timeline-track">
        <article
          v-for="(moment, index) in moments"
          :key="moment.id"
          class="timeline-card glass-card"
          data-reveal
          :style="{ '--delay': `${index * 90}ms` }"
        >
          <div
            class="timeline-photo-frame photo-frame"
            :class="{
              'has-soft-frame': moment.frame,
              'is-portrait': moment.frame === 'portrait',
            }"
            :style="{ '--photo-bg': `url(${moment.image})` }"
          >
            <img
              :src="moment.image"
              :alt="moment.title"
              loading="lazy"
              :style="{
                objectFit: moment.objectFit || 'cover',
                objectPosition: moment.objectPosition || 'center',
              }"
            />
          </div>
          <div class="timeline-copy">
            <span>{{ moment.date }}</span>
            <h3>{{ moment.title }}</h3>
            <p>{{ moment.comment }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
