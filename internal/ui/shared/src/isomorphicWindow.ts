export function isomorphicWindow() {
  if (typeof window === 'undefined') {
    return undefined
  }

  return window
}
