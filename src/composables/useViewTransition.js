import { nextTick } from 'vue'

let activeTransition = null

export function useViewTransition() {
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const runWithoutTransition = async (mutation) => {
    mutation()
    await nextTick()
  }

  const transition = async (mutation, name = 'soft') => {
    if (!document.startViewTransition || prefersReducedMotion()) {
      await runWithoutTransition(mutation)
      return
    }

    if (activeTransition) {
      await runWithoutTransition(mutation)
      return
    }

    document.documentElement.dataset.transition = name

    let viewTransition

    try {
      viewTransition = document.startViewTransition(() => runWithoutTransition(mutation))
      activeTransition = viewTransition.finished.catch(() => {})
      await viewTransition.finished
    } catch {
      // Browsers can abort view transitions during rapid clicks, resizes, or duplicate snapshots.
      if (!viewTransition) {
        await runWithoutTransition(mutation)
      }
    } finally {
      activeTransition = null
      delete document.documentElement.dataset.transition
    }
  }

  return { transition }
}
