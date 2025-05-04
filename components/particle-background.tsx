"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface ParticleBackgroundProps {
  color1?: string
  color2?: string
  particleCount?: number
}

export default function ParticleBackground({
  color1 = "#0077FF", // Primary blue
  color2 = "#FF7700", // Secondary orange
  particleCount = 100,
}: ParticleBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCnt = particleCount

    const posArray = new Float32Array(particlesCnt * 3)
    const colorArray = new Float32Array(particlesCnt * 3)

    // Color objects for conversion
    const color1Obj = new THREE.Color(color1)
    const color2Obj = new THREE.Color(color2)

    // Fill positions and colors
    for (let i = 0; i < particlesCnt * 3; i += 3) {
      // Positions - random in a sphere
      posArray[i] = (Math.random() - 0.5) * 5
      posArray[i + 1] = (Math.random() - 0.5) * 5
      posArray[i + 2] = (Math.random() - 0.5) * 5

      // Colors - interpolate between color1 and color2
      const mixRatio = Math.random()
      const mixedColor = new THREE.Color().lerpColors(color1Obj, color2Obj, mixRatio)

      colorArray[i] = mixedColor.r
      colorArray[i + 1] = mixedColor.g
      colorArray[i + 2] = mixedColor.b
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3))

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    })

    // Points
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    // Mouse interaction
    const mouse = {
      x: 0,
      y: 0,
    }

    window.addEventListener("mousemove", (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    })

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)

      // Rotate particles
      particlesMesh.rotation.x += 0.001
      particlesMesh.rotation.y += 0.001

      // Follow mouse
      particlesMesh.rotation.x += mouse.y * 0.001
      particlesMesh.rotation.y += mouse.x * 0.001

      renderer.render(scene, camera)
    }

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", () => {})
      containerRef.current?.removeChild(renderer.domElement)
      particlesGeometry.dispose()
      particlesMaterial.dispose()
    }
  }, [color1, color2, particleCount])

  return <div ref={containerRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />
}
