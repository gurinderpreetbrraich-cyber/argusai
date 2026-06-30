'use client'

import { useEffect, useRef } from 'react'

export function AuditSpotlight() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: -999, y: -999 })
  const smooth = useRef({ x: -999, y: -999 })
  const rafRef = useRef<number>()

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      mouse.current.x = e.clientX - rect.left
      mouse.current.y = e.clientY - rect.top
    }
    window.addEventListener('mousemove', handleMove)

    const loop = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.12
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.12

      if (overlayRef.current) {
        overlayRef.current.style.maskImage = `radial-gradient(280px circle at ${smooth.current.x}px ${smooth.current.y}px, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,0.6) 60%, rgba(255,255,255,0.25) 80%, rgba(255,255,255,0) 100%)`
        overlayRef.current.style.webkitMaskImage = overlayRef.current.style.maskImage
      }

      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(240,165,0,0.22) 1px, transparent 1px),
            linear-gradient(90deg, rgba(240,165,0,0.22) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          willChange: 'mask-image',
        }}
      />
    </div>
  )
}
