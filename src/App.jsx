import gsap from "gsap"
import { Draggable } from "gsap/draggable"

import { Dock, Navbar, Welcome } from "@components"
import { Resume, Safari, Terminal, Finder } from "@windows"

gsap.registerPlugin(Draggable)

const App = () => {
  return (
    <main>
      <Navbar />
      <Welcome />
      <Dock />
      <Terminal />
      <Safari />
      <Resume />
      <Finder />
    </main>
  )
}

export default App