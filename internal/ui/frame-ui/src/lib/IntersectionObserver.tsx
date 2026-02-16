import type { JSXElement, ParentComponent } from 'solid-js'
import {
  createContext,
  createSignal,
  onCleanup,
  onMount,
  useContext,
} from 'solid-js'

type IntersectionObserverObserveCallback = (isIntersecting: boolean) => void
type IntersectionObserverContextValue = (
  element: Element,
  callback: IntersectionObserverObserveCallback,
) => void

const IntersectionContext = createContext<IntersectionObserverContextValue>()

function IsomorphicIntersectionObserver(
  callback: IntersectionObserverCallback,
  init?: IntersectionObserverInit,
) {
  if (typeof IntersectionObserver === 'undefined') {
    console.warn(
      'IntersectionObserver is not supported in this environment. IntersectionObserverContainer will not work.',
    )

    return {
      observe() {},
      unobserve() {},
      disconnect() {},
    }
  } else {
    return new IntersectionObserver(callback, init)
  }
}

export const IntersectionObserverContainer: ParentComponent<{
  options?: IntersectionObserverInit
}> = (props) => {
  const callbacks = new WeakMap<Element, IntersectionObserverObserveCallback>()

  const observer = IsomorphicIntersectionObserver((entries) => {
    for (const entry of entries) {
      const callback = callbacks.get(entry.target)
      if (callback) {
        callback(entry.isIntersecting)
      }
    }
  }, props.options)

  const addElement: IntersectionObserverContextValue = (element, callback) => {
    callbacks.set(element, callback)
    observer.observe(element)

    onCleanup(() => {
      observer.unobserve(element)
      callbacks.delete(element)
    })
  }

  onCleanup(() => {
    observer.disconnect()
  })

  return (
    <IntersectionContext.Provider value={addElement}>
      {props.children}
    </IntersectionContext.Provider>
  )
}

export const IntersectionObserverItem: ParentComponent<{
  fallback?: JSXElement
}> = (props) => {
  const [isVisible, setIsVisible] = createSignal(false)
  let element: HTMLDivElement | undefined
  const observe = useContext(IntersectionContext)

  onMount(() => {
    if (!observe) {
      return
    }

    if (!element) {
      return
    }

    observe(element, (isIntersecting) => {
      setIsVisible(isIntersecting)
    })
  })

  return (
    <div ref={element} style={{ height: '100%', width: '100%' }}>
      {isVisible() ? props.children : props.fallback}
    </div>
  )
}
