'use client'

import { useEffect, useRef, useState } from 'react'

const SPOTLIGHT_R = 280

export function AuditSpotlight() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -999, y: -999 })
  const smooth = useRef({ x: -999, y: -999 })
  const rafRef = useRef<number>()
  const containerRef = useRef<HTMLDivElement>(null)
  const [maskUrl, setMaskUrl] = useState('')

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container) return
      canvas.width = container.offsetWidth
      canvas.height = container.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

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
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1

      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const gradient = ctx.createRadialGradient(
          smooth.current.x, smooth.current.y, 0,
          smooth.current.x, smooth.current.y, SPOTLIGHT_R
        )
        gradient.addColorStop(0, 'rgba(255,255,255,1)')
        gradient.addColorStop(0.4, 'rgba(255,255,255,1)')
        gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)')
        gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)')
        gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)')
        gradient.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(smooth.current.x, smooth.current.y, SPOTLIGHT_R, 0, Math.PI * 2)
        ctx.fill()
        setMaskUrl(canvas.toDataURL())
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
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(240,165,0,0.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(240,165,0,0.18) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: maskUrl ? `url(${maskUrl})` : undefined,
          WebkitMaskImage: maskUrl ? `url(${maskUrl})` : undefined,
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
        }}
      />
    </div>
  )
}
