import { dockApps } from "@constants"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

import { Tooltip } from 'react-tooltip'

const Dock = () => {

  const dockRef = useRef(null)
  const dockLeftRef = useRef(0)
  const iconCentersRef = useRef([])
  const mouseXRef = useRef(0)
  const rafRef = useRef(null)

  const { contextSafe } = useGSAP(() => {
    const dock = dockRef.current
    if(!dock) return

    const icons = Array.from(dock.querySelectorAll('.dock-icon'))

    const measureLayout = () => {
      const dockRect = dock.getBoundingClientRect()
      dockLeftRef.current = dockRect.left

      iconCentersRef.current = icons.map((icon) => {
        const { left, width } = icon.getBoundingClientRect()
        return left - dockRect.left + width / 2
      })
    }

    const animateIcons = (mouseX) => {
      icons.forEach((icon, index) => {
        const center = iconCentersRef.current[index]
        if (center == null) return

        const distance = Math.abs(mouseX - center)
        const intensity = Math.exp(-(distance ** 2.5) / 20000)

        gsap.to(icon, {
          scale: 1 + 0.25 * intensity,
          y: -15 * intensity,
          duration: 0.2,
          ease: 'power1.out',
          overwrite: 'auto',
        })
      })
    }

    const runAnimation = () => {
      if (rafRef.current) return

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        animateIcons(mouseXRef.current)
      })
    }

    const handleMouseEnter = () => {
      measureLayout()
    }

    const handleMouseMove = (e) => {
      mouseXRef.current = e.clientX - dockLeftRef.current
      runAnimation()
    }

    // eslint-disable-next-line react-hooks/immutability
    const resetIcons = contextSafe(() => {
      icons.forEach((icon) => gsap.to(icon, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: 'power1.out',
        overwrite: 'auto',
      }))
    })

    const handleResize = () => {
      measureLayout()
    }

    measureLayout()
    dock.addEventListener('mouseenter', handleMouseEnter)
    dock.addEventListener('mousemove', handleMouseMove)
    dock.addEventListener('mouseleave', resetIcons)
    window.addEventListener('resize', handleResize)

    return () => {
      dock.removeEventListener('mouseenter', handleMouseEnter)
      dock.removeEventListener('mousemove', handleMouseMove)
      dock.removeEventListener('mouseleave', resetIcons)
      window.removeEventListener('resize', handleResize)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      gsap.killTweensOf(icons)
    }
  }, { scope: dockRef })

  const toogleApp = (app) => {}

  return (
    <section id="dock">
      <div ref={dockRef} className="dock-container">
        {dockApps.map(({  id, name, icon, canOpen}) =>(
          <div key={id} className="relative flex justify-center">
            <button
              type="button"
              className="dock-icon"
              aria-label={name}
              data-tooltip-id="dock-tooltip"
              data-tooltip-content={name}
              data-tooltip-delay-show={150}
              disabled={!canOpen}
              onClick={() => toogleApp({ id, canOpen })}
            >
              <img
                src={`/images/${icon}`}
                alt={name}
                loading="lazy"
                className={canOpen ? '' : 'opacity-60'}
              />
            </button>
          </div>
        ))}

        <Tooltip id="dock-tooltip" place="top" className="tooltip" />
      </div>
    </section>
  )
}

export default Dock