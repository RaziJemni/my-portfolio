"use client"

import type React from "react"

import Link from "next/link"
import { Github, Linkedin, Mail, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import ParticleSphere from "@/components/particle-sphere"

export default function Home() {
  const [activeSection, setActiveSection] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formStatus, setFormStatus] = useState("") // To display success or error messages
  const [isCooldown, setIsCooldown] = useState(false) // Cooldown state
  const [cooldownTime, setCooldownTime] = useState(0) // Remaining cooldown time

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (isCooldown) return; // Prevent submission during cooldown

    try {
      // Include the hidden `_subject` field in the form data
      const submissionData = {
        ...formData,
        _subject: "New Contact Submission", // Add the subject field
      };

      const response = await fetch("https://formspree.io/f/xnndpejg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", message: "" }); // Reset form fields

        // Start cooldown
        setIsCooldown(true);
        setCooldownTime(30); // Set cooldown to 30 seconds

        const interval = setInterval(() => {
          setCooldownTime((prev) => {
            if (prev <= 1) {
              clearInterval(interval); // Clear interval when cooldown ends
              setIsCooldown(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000); // Decrease cooldown time every second
      } else {
        setFormStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setFormStatus("error");
    }
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
      title: "General-purpose Languages",
      description: "Python, C",
    },
    {
      title: "Mobile",
      description: "React Native",
    },
    {
      title: "Other",
      description: "Git, SQL, PHP",
    },
  ]

  // Projects data - can be easily modified to add or remove projects
  const projects = [
    {
      title: "This Portfolio",
      technologies: "Next.js, Tailwind CSS, Three.js",
      repoUrl: "https://github.com/RaziJemni/my-portfolio",
      target: "_blank",
      imgUrl: "myportfolio.png",
    },
    {
      title: "Blank",
      technologies: "Work In Progress",
      repoUrl: "",
      imgUrl: "loading.png",
    },
    {
      title: "Blank",
      technologies: "Work In Progress",
      repoUrl: "",
      imgUrl: "loading.png",
    },
  ]

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <main className="min-h-screen text-white font-poppins">
      {/* Background glow effect */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        {/* Intense neon blue glow in the top-left corner */}
        <div className="absolute top-0 left-0 w-[60vw] h-[60vh] bg-gradient-to-br from-primary/100 via-primary/10 to-transparent rounded-full blur-[120px] animate-pulse-slow" />
        {/* Intense neon orange glow in the bottom-right corner */}
        <div className="absolute bottom-0 right-0 w-[60vw] h-[60vh] bg-gradient-to-tl from-secondary/100 via-secondary/10 to-transparent rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center">
          <Link href="#hero" className="font-medium text-lg hover:opacity-80 transition-opacity">
            <span className="font-bold text-primary">Razi Jemni</span> / Portfolio
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="#about"
              className={`hover:text-secondary transition-colors duration-300 relative ${activeSection === "about" ? "text-secondary" : ""}`}
            >
              About Me
              {activeSection === "about" && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-secondary rounded-full"></span>
              )}
            </Link>
            <Link
              href="#projects"
              className={`hover:text-primary transition-colors duration-300 relative ${activeSection === "projects" ? "text-primary" : ""}`}
            >
              Projects
              {activeSection === "projects" && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"></span>
              )}
            </Link>
            <Link
              href="#contact"
              className={`hover:text-secondary transition-colors duration-300 relative ${activeSection === "contact" ? "text-secondary" : ""}`}
            >
              Contact
              {activeSection === "contact" && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-secondary rounded-full"></span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1a1a1a]/95 backdrop-blur-md">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link
                href="#about"
                className={`py-2 px-4 ${activeSection === "about" ? "text-primary" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About Me
              </Link>
              <Link
                href="#projects"
                className={`py-2 px-4 ${activeSection === "projects" ? "text-primary" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Projects
              </Link>
              <Link
                href="#contact"
                className={`py-2 px-4 ${activeSection === "contact" ? "text-secondary" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="container mx-auto px-4 pt-32 pb-20">
        <div className="bg-[#1a1a1a]/80 rounded-3xl p-6 md:p-12 shadow-lg shadow-primary/10 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Hey I'm <span className="text-primary">Razi!</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300">
                I'm a Computer Science student passionate about exploring different areas of tech
              </p>
              <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex gap-4 w-full sm:w-auto">
                  <Link
                    href="#"
                    className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto text-center"
                  >
                    Resume
                  </Link>
                  <Link
                    href="#about"
                    className="bg-[#2a2a2a] border border-secondary/20 text-white px-6 py-3 rounded-full font-medium hover:bg-secondary/10 transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto text-center"
                  >
                    More About Me
                  </Link>
                </div>
                <div className="flex gap-4 mt-4 sm:mt-0">
                  <Link
                    href="https://github.com/RaziJemni"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#2a2a2a] p-3 rounded-full flex items-center justify-center hover:bg-secondary/20 transition-all duration-300 transform hover:scale-110"
                  >
                    <Github className="h-5 w-5 text-white" />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/razi-jemni"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#2a2a2a] p-3 rounded-full flex items-center justify-center hover:bg-secondary/20 transition-all duration-300 transform hover:scale-110"
                  >
                    <Linkedin className="h-5 w-5 text-white" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center md:pl-16">
              <div className="relative w-full max-w-sm aspect-square">
                <ParticleSphere />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="container mx-auto px-4 py-20">
        <div className="bg-[#1a1a1a]/80 rounded-3xl p-6 md:p-12 shadow-lg shadow-secondary/10 backdrop-blur-md">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 inline-block relative">
            About Me
            <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-secondary rounded-full"></span>
          </h2>
          <div className="space-y-6 text-base md:text-lg">
            <p className="leading-relaxed">
              I'm a Computer Science student passionate about exploring different areas of tech — from web and mobile
              development to cybersecurity and algorithms. I enjoy learning new languages, building real projects, and
              growing my skills across the stack.
            </p>
            <p className="leading-relaxed">
              Currently working with <span className="text-primary font-medium">React</span>,
              <span className="text-primary font-medium"> React Native</span>, and
              <span className="text-primary font-medium"> JavaScript</span>, while experimenting with
              <span className="text-secondary font-medium"> Python</span>,
              <span className="text-secondary font-medium"> C</span>, and more. Always learning, always building — and
              open to new opportunities and collaborations!
            </p>

            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className={`bg-[#2a2a2a] p-6 rounded-xl hover:bg-[#2a2a2a]/80 hover:shadow-md ${index % 2 === 0 ? "hover:shadow-primary/10" : "hover:shadow-secondary/10"} transition-all duration-300 transform hover:-translate-y-1`}
                >
                  <h3 className={`text-xl font-semibold mb-2 ${index % 2 === 0 ? "text-primary" : "text-secondary"}`}>
                    {skill.title}
                  </h3>
                  <p className="text-gray-300 text-sm">{skill.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="container mx-auto px-4 py-20">
        <div className="bg-[#1a1a1a]/80 rounded-3xl p-6 md:p-12 shadow-lg shadow-primary/10 backdrop-blur-md">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 inline-block relative">
            Some Of My Projects
            <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-primary rounded-full"></span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Link href={project.repoUrl} key={index} className="group block cursor-pointer" target={project.target} rel="noopener noreferrer">
                {/* Project Card */}
                <div className={`bg-[#2a2a2a] rounded-xl overflow-hidden aspect-video relative shadow-md hover:shadow-lg ${index % 2 === 0 ? "hover:shadow-primary/20" : "hover:shadow-secondary/20"} transition-all duration-300 transform group-hover:-translate-y-2`}>
                  <img
                    src={project.imgUrl}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 ${index % 2 === 0 ? "bg-gradient-to-br from-primary/10 to-secondary/10" : "bg-gradient-to-br from-secondary/10 to-primary/10"} group-hover:opacity-70 transition-opacity duration-300`}></div>
                </div>
                <div className="mt-4">
                  <h3 className={`text-xl font-semibold ${index % 2 === 0 ? "group-hover:text-primary" : "group-hover:text-secondary"} transition-colors duration-300`}>
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">{project.technologies}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link
              href="https://github.com/RaziJemni"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#2a2a2a] border border-secondary/20 text-white px-8 py-3 rounded-full font-medium hover:bg-secondary/10 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-secondary/10"
            >
              See more in my Github Profile
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-4 py-20">
        <div className="bg-[#1a1a1a]/80 rounded-3xl p-6 md:p-12 shadow-lg shadow-secondary/10 backdrop-blur-md">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 inline-block relative">
            Contact Me
            <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-secondary rounded-full"></span>
          </h2>
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b-2 border-gray-600 py-2 px-1 focus:outline-none focus:border-secondary transition-colors duration-300 peer"
                    required
                  />
                  <label
                    htmlFor="name"
                    className={`absolute left-1 transition-all duration-300 ${
                      formData.name
                        ? "text-xs text-secondary -top-5"
                        : "text-gray-400 top-2 peer-focus:text-xs peer-focus:text-secondary peer-focus:-top-5"
                    }`}
                  >
                    Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b-2 border-gray-600 py-2 px-1 focus:outline-none focus:border-secondary transition-colors duration-300 peer"
                    required
                  />
                  <label
                    htmlFor="email"
                    className={`absolute left-1 transition-all duration-300 ${
                      formData.email
                        ? "text-xs text-secondary -top-5"
                        : "text-gray-400 top-2 peer-focus:text-xs peer-focus:text-secondary peer-focus:-top-5"
                    }`}
                  >
                    Email
                  </label>
                </div>
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-transparent border-b-2 border-gray-600 py-2 px-1 focus:outline-none focus:border-secondary transition-colors duration-300 resize-none peer"
                    required
                  ></textarea>
                  <label
                    htmlFor="message"
                    className={`absolute left-1 transition-all duration-300 ${
                      formData.message
                        ? "text-xs text-secondary -top-5"
                        : "text-gray-400 top-2 peer-focus:text-xs peer-focus:text-secondary peer-focus:-top-5"
                    }`}
                  >
                    Message
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    className={`bg-secondary text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:-translate-y-1 ${
                      isCooldown
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-secondary/90 hover:shadow-lg hover:shadow-secondary/20"
                    }`}
                    disabled={isCooldown} // Disable button during cooldown
                  >
                    {isCooldown ? `Wait ${cooldownTime}s` : "Send"}
                  </button>
                  <button
                    type="reset"
                    className="bg-[#2a2a2a] border border-secondary/20 text-white px-8 py-3 rounded-full font-medium hover:bg-secondary/10 transition-all duration-300 transform hover:-translate-y-1"
                    onClick={() => setFormData({ name: "", email: "", message: "" })}
                  >
                    Reset
                  </button>
                </div>
              </form>
              {formStatus === "success" && (
                <p className="text-green-500 mt-4">Your message has been sent successfully!</p>
              )}
              {formStatus === "error" && (
                <p className="text-red-500 mt-4">There was an error sending your message. Please try again.</p>
              )}
            </div>
            <div className="md:w-1/2 space-y-8 mt-8 md:mt-0 md:pl-16">
              <div className="group flex items-center gap-4">
                <a
                  href="mailto:razi.jemni1@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#2a2a2a] p-4 rounded-full group-hover:bg-secondary/20 transition-all duration-300 transform group-hover:scale-110"
                >
                  <Mail className="h-6 w-6 text-secondary" />
                </a>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <a
                    href="mailto:razi.jemni1@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg "
                  >
                    razi.jemni1@gmail.com
                  </a>
                </div>
              </div>

              <div className="pt-8 flex flex-col gap-6">
                <p className="text-xl font-semibold">Find me on</p>
                <div className="flex flex-col gap-4">
                  <div className="group flex items-center gap-4">
                    <div className="bg-[#2a2a2a] p-4 rounded-full group-hover:bg-primary/20 transition-all duration-300 transform group-hover:scale-110">
                      <Link
                        href="https://www.linkedin.com/in/razi-jemni"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-6 w-6 text-primary" />
                      </Link>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">LinkedIn</p>
                      <p className="text-lg">Razi Jemni</p>
                    </div>
                  </div>
                  <div className="group flex items-center gap-4">
                    <div className="bg-[#2a2a2a] p-4 rounded-full group-hover:bg-secondary/20 transition-all duration-300 transform group-hover:scale-110">
                      <Link
                        href="https://github.com/RaziJemni"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-6 w-6 text-secondary" />
                      </Link>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">GitHub</p>
                      <p className="text-lg">RaziJemni</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center">
        <div className="py-6 border-t border-gray-800">
          <p className="text-gray-400">© {new Date().getFullYear()} Razi Jemni. All rights reserved.</p>
          <p className="text-gray-500 text-sm mt-2">Thanks for visiting!</p>
        </div>
      </footer>
    </main>
  )
}
