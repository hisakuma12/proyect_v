const STORAGE_KEY = 'cumple-romantico-guest-messages'

export function loadGuestMessages(fallbackMessages) {
  const stored = localStorage.getItem(STORAGE_KEY)

  if (!stored) {
    return fallbackMessages
  }

  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : fallbackMessages
  } catch {
    return fallbackMessages
  }
}

export function saveGuestMessages(messages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}

export async function createGuestMessage(message) {
  return {
    id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    ...message,
  }
}
