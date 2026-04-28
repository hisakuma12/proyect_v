import { onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const revealEase = 'power3.out'

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const animateGroup = (container, selector, stagger) => {
  const items = gsap.utils.toArray(container.querySelectorAll(selector))
  if (!items.length) return []

  gsap.set(items, {
    autoAlpha: 0,
    y: 28,
    scale: 0.985,
    filter: 'blur(10px)',
    willChange: 'transform, opacity, filter',
  })

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 82%',
      once: true,
    },
  })

  timeline.to(items, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    duration: 0.8,
    ease: revealEase,
    stagger,
    clearProps: 'willChange',
  })

  return [timeline, timeline.scrollTrigger]
}

export function useScrollReveal() {
  let animations = []

  const observe = () => {
    animations.forEach((animation) => animation?.kill?.())
    animations = []

    const elements = document.querySelectorAll('[data-reveal]')

    if (prefersReducedMotion()) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }

    const groupedChildren = new Set()
    const staggerGroups = [
      ['.timeline-track', '.timeline-card', 0.13],
      ['.gallery-grid', '.gallery-card', 0.08],
      ['.guest-cards', '.guest-card', 0.08],
      ['.welcome-countdown', 'div', 0.07],
      ['.countdown-notes', 'article', 0.09],
    ]

    staggerGroups.forEach(([containerSelector, itemSelector, stagger]) => {
      document.querySelectorAll(containerSelector).forEach((container) => {
        container.querySelectorAll(itemSelector).forEach((item) => groupedChildren.add(item))
        animations.push(...animateGroup(container, itemSelector, stagger))
      })
    })

    elements.forEach((element) => {
      if (groupedChildren.has(element)) return

      gsap.set(element, {
        autoAlpha: 0,
        y: 26,
        scale: 0.985,
        filter: 'blur(10px)',
        willChange: 'transform, opacity, filter',
      })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: 'top 84%',
          once: true,
        },
      })

      timeline.to(element, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.82,
        ease: revealEase,
        clearProps: 'willChange',
      })

      animations.push(timeline, timeline.scrollTrigger)
    })

    ScrollTrigger.refresh()
  }

  onBeforeUnmount(() => {
    animations.forEach((animation) => animation?.kill?.())
  })

  return { observe }
}
