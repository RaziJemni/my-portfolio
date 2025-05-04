"use client"

import type React from "react"
import { useState, useEffect } from "react"
import ParticleBackground from "@/components/particle-background"

export default function Home() {
  const [activeSection, setActiveSection] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "projects", "contact"]
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })

      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Skills data - can be easily modified to add or remove cards
  const skills = [
    {
      title: "Frontend",
      description: "React, Next.js, TypeScript, Tailwind CSS",
    },
    {
      title: "Backend",
      description: "Node.js, Express, MongoDB, PostgreSQL",
    },
    {
      title: "Mobile",
      description: "React Native, Flutter, iOS, Android",
    },
    {
      title: "Other",
      description: "Git, Docker, AWS, CI/CD",
    },
  ]

  // Projects data - can be easily modified to add or remove projects
  const projects = [
    {
      title: "E-Commerce Platform",
      technologies: "React, Node.js, MongoDB",
      repoUrl: "https://github.com/RaziJemni/ecommerce-platform",
    },
    {
      title: "AI Chat Application",
      technologies: "Next.js, TypeScript, OpenAI",
      repoUrl: "https://github.com/RaziJemni/ai-chat-app",
    },
    {
      title: "Mobile Fitness Tracker",
      technologies: "React Native, Firebase",
      repoUrl: "https://github.com/RaziJemni/fitness-tracker",
    },
  ]

  return (
    <main className="min-h-screen bg-[#121212] text-white font-poppins">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Rest of your component remains the same */}
      {/* ... */}
    </main>
  )
}
