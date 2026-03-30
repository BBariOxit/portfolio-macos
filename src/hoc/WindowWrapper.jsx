import useWindowStore from "@store/window"
import { Component, useRef } from "react"

const WindowWrapper = (component, windowKey) => {
  const Wrapped = (props) => {
    const { focusWindow, windows } = useWindowStore
    const { isOpen, zIndex } = windows[windowKey]
    const ref = useRef(null)

    return <section id={windowKey} ref={ref} style={{zIndex}} className="absolute">
      <Component {...props} />
    </section>
  }

  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || 'Component'})`

  return (
    <div>WindowWrapper</div>
  )
}

export default WindowWrapper