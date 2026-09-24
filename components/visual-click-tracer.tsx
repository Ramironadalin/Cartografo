"use client"

import { useEffect } from "react"

export function VisualClickTracer() {
  useEffect(() => {
    // Custom cursor container
    const cursor = document.createElement("div")
    cursor.id = "agent-visual-cursor"
    cursor.style.position = "fixed"
    cursor.style.top = "0"
    cursor.style.left = "0"
    cursor.style.pointerEvents = "none"
    cursor.style.zIndex = "9999999"
    cursor.style.transition = "transform 0.05s ease-out"
    cursor.style.display = "block"
    cursor.style.transform = "translate(100px, 100px)"

    // Cursor arrow SVG + glowing target dot
    cursor.innerHTML = `
      <div style="position: relative; width: 32px; height: 32px;">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style="filter: drop-shadow(0 2px 6px rgba(0,0,0,0.9));">
          <path d="M3 2L19 9.5L12 12.5L9 19.5L3 2Z" fill="#38bdf8" stroke="#ffffff" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        </svg>
        <div id="agent-cursor-dot" style="position: absolute; top: 2px; left: 3px; width: 14px; height: 14px; border-radius: 50%; background: rgba(56,189,248,0.35); border: 2px solid #38bdf8; box-shadow: 0 0 10px #38bdf8; transform: translate(-50%, -50%); transition: transform 0.15s ease, background-color 0.15s ease;"></div>
      </div>
    `
    document.body.appendChild(cursor)

    const updatePos = (x: number, y: number) => {
      cursor.style.transform = `translate(${x}px, ${y}px)`
    }

    const handlePointerMove = (e: MouseEvent) => {
      updatePos(e.clientX, e.clientY)
    }

    const triggerClickEffect = (x: number, y: number) => {
      updatePos(x, y)

      // Animate dot recoil
      const dot = document.getElementById("agent-cursor-dot")
      if (dot) {
        dot.style.transform = "translate(-50%, -50%) scale(1.6)"
        dot.style.backgroundColor = "rgba(239, 68, 68, 0.6)"
        dot.style.borderColor = "#ef4444"
        setTimeout(() => {
          if (dot) {
            dot.style.transform = "translate(-50%, -50%) scale(1)"
            dot.style.backgroundColor = "rgba(56,189,248,0.35)"
            dot.style.borderColor = "#38bdf8"
          }
        }, 220)
      }

      // Visual click ripple (expanding ring)
      const ripple = document.createElement("div")
      ripple.style.position = "fixed"
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`
      ripple.style.width = "18px"
      ripple.style.height = "18px"
      ripple.style.borderRadius = "50%"
      ripple.style.backgroundColor = "rgba(239, 68, 68, 0.85)"
      ripple.style.border = "3px solid #ffffff"
      ripple.style.boxShadow = "0 0 25px #ef4444, 0 0 50px #f43f5e"
      ripple.style.pointerEvents = "none"
      ripple.style.zIndex = "9999998"
      ripple.style.transform = "translate(-50%, -50%) scale(1)"
      ripple.style.transition = "transform 0.65s cubic-bezier(0.1, 0.85, 0.25, 1), opacity 0.65s ease-out"
      document.body.appendChild(ripple)

      // Outer wave
      const wave = document.createElement("div")
      wave.style.position = "fixed"
      wave.style.left = `${x}px`
      wave.style.top = `${y}px`
      wave.style.width = "18px"
      wave.style.height = "18px"
      wave.style.borderRadius = "50%"
      wave.style.border = "2.5px solid rgba(244, 63, 94, 0.95)"
      wave.style.pointerEvents = "none"
      wave.style.zIndex = "9999997"
      wave.style.transform = "translate(-50%, -50%) scale(1)"
      wave.style.transition = "transform 0.85s cubic-bezier(0.1, 0.8, 0.25, 1), opacity 0.85s ease-out"
      document.body.appendChild(wave)

      requestAnimationFrame(() => {
        ripple.style.transform = "translate(-50%, -50%) scale(4.2)"
        ripple.style.opacity = "0"
        wave.style.transform = "translate(-50%, -50%) scale(7.5)"
        wave.style.opacity = "0"
      })

      setTimeout(() => {
        ripple.remove()
        wave.remove()
      }, 900)
    }

    const handleMouseDown = (e: MouseEvent) => {
      triggerClickEffect(e.clientX, e.clientY)
    }

    window.addEventListener("mousemove", handlePointerMove)
    window.addEventListener("mousedown", handleMouseDown, true)

    return () => {
      window.removeEventListener("mousemove", handlePointerMove)
      window.removeEventListener("mousedown", handleMouseDown, true)
      cursor.remove()
    }
  }, [])

  return null
}
