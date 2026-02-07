export const readLocalStorage = (key: string): string | null => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(key)
}

export const writeLocalStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, value)
}

export const readBooleanStorage = (key: string, fallback = false): boolean => {
  const value = readLocalStorage(key)
  if (value === null) {
    return fallback
  }

  return value === 'true'
}
