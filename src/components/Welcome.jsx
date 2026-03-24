import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

const FONT_WEIGHT = {
  subtitle: { min: 300, max: 700, default: 300, spread: 9000 },
  title: { min: 400, max: 900, default: 400, spread: 20000 },
}

const renderText = (text, className, baseWeight = 400) => {
  return [...text].map((char, i) => (
    <span key={i} className={className} style={{fontVariationSettings: `'wght' ${baseWeight}`}}>
      {char === ' ' ? '\u00A0' : char}
    </span>
  )) 
}

const setupTextHover = (container, type) => {
  if (!container) return () => {}

  const letters = container.querySelectorAll('span')
  const { min, max, default: base, spread } = FONT_WEIGHT[type]
  let letterCenters = []
  let latestMouseX = 0
  let frameId = null

  const cacheLetterPositions = () => {
    letterCenters = [...letters].map((letter) => {
      const { left, width } = letter.getBoundingClientRect()

      return { letter, center: left + width / 2 }
    })
  }

  const animateLetters = (letter, weight, duration = 0.25) => {
    return gsap.to(letter, {
      duration,
      ease: 'power2.out',
      overwrite: 'auto',
      fontVariationSettings: `'wght' ${weight}`
    })
  }

  const renderFrame = () => {
    frameId = null

    letterCenters.forEach(({ letter, center }) => {
      const distance = Math.abs(latestMouseX - center)
      const intensity = Math.exp(-(distance ** 2) / spread)

      animateLetters(letter, min + (max - min) * intensity)
    })
  }

  const handleMouseMove = (e) => {
    latestMouseX = e.clientX

    if (frameId !== null) return
    frameId = window.requestAnimationFrame(renderFrame)
  }

  const handleMouseEnter = () => cacheLetterPositions()

  const handleMouseLeave = () => {
    if (frameId !== null) {
      window.cancelAnimationFrame(frameId)
      frameId = null
    }

    letters.forEach((letter) => animateLetters(letter, base, 0.3))
  }

  cacheLetterPositions()

  container.addEventListener("mouseenter", handleMouseEnter)
  container.addEventListener("mousemove", handleMouseMove)
  container.addEventListener("mouseleave", handleMouseLeave)
  window.addEventListener("resize", cacheLetterPositions)

  return () => {
    if (frameId !== null) {
      window.cancelAnimationFrame(frameId)
      frameId = null
    }

    container.removeEventListener("mouseenter", handleMouseEnter)
    container.removeEventListener("mousemove", handleMouseMove)
    container.removeEventListener("mouseleave", handleMouseLeave)
    window.removeEventListener("resize", cacheLetterPositions)
  }
}

const Welcome = () => {
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)

  useGSAP(() => {
    const titleCleanup = setupTextHover(titleRef.current, 'title')
    const subtitleCleanup = setupTextHover(subtitleRef.current, 'subtitle')

    return () => {
      titleCleanup()
      subtitleCleanup()
    }
  }, [])

  return (
    <section id="welcome">
      <p ref={subtitleRef}>
        {renderText(
          "I'm Bảo! Welcome to my",
          'text-3xl font-georama',
          300
        )}
      </p>
      <h1 ref={titleRef} className="mt-7">
        {renderText('portfolio', 'text-9xl italic font-georama', 400)}
      </h1>

      <div className="small-screen">
        <p>this portfolio is designed for desktop/tablet screens only</p>
      </div>
    </section>
  )
}

export default Welcome