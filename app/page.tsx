"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, ArrowRight, Users, Calendar, Camera, Heart, Star, Code, Trophy } from "lucide-react"
import { useSession } from "next-auth/react"
import { Navigation } from "@/components/navigation"
import { CountdownTimer } from "@/components/countdown-timer"
import { ClassmatesPage } from "@/components/classmates-page"
import { EventsPage } from "@/components/events-page"
import { MemoriesPage } from "@/components/memories-page"
import { NominationsPage } from "@/components/nominations-page"
import { ProjectsPage } from "@/components/projects-page"
import { AuthRequiredModal } from "@/components/auth-required-modal"
import { CodeRain } from "@/components/code-rain"
import { FloatingCode } from "@/components/floating-code"
import { TypingAnimation } from "@/components/typing-animation"
import { GroupPhotos } from "@/components/group-photos"
import { CodeDecorations } from "@/components/code-decorations"

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState("home")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authAction, setAuthAction] = useState("")
  const { data: session } = useSession()

  const handleAddContent = (action: string) => {
    if (!session) {
      setAuthAction(action)
      setShowAuthModal(true)
    } else {
      console.log(`Adding ${action} for user:`, session.user?.name)
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case "classmates":
        return (
          <div className="relative">
            <CodeDecorations />
            <FloatingCode />
            <ClassmatesPage onAddProfile={() => handleAddContent("add your profile")} />
          </div>
        )
      case "events":
        return (
          <div className="relative">
            <CodeDecorations />
            <FloatingCode />
            <EventsPage onAddEvent={() => handleAddContent("add a new event")} />
          </div>
        )
      case "memories":
        return (
          <div className="relative">
            <CodeDecorations />
            <FloatingCode />
            <MemoriesPage onAddMemory={() => handleAddContent("share a memory")} />
          </div>
        )
      case "nominations":
        return (
          <div className="relative">
            <CodeDecorations />
            <FloatingCode />
            <NominationsPage />
          </div>
        )
      case "projects":
        return (
          <div className="relative">
            <CodeDecorations />
            <FloatingCode />
            <ProjectsPage onAddProject={() => handleAddContent("submit your project")} />
          </div>
        )
      default:
        return <HomePage />
    }
  }

  const HomePage = () => (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Code Animations */}
      <CodeRain />
      <FloatingCode />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 text-white px-4 py-20 overflow-hidden">
        <CodeDecorations />
        <GroupPhotos />

        <div className="relative max-w-6xl mx-auto z-10">
          {/* Class Badge */}
          <div className="mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-800/50 backdrop-blur-sm border border-blue-700/50 rounded-full px-6 py-3">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-lg font-medium">Class of 2025 Digital Yearbook</span>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start mb-16">
            {/* Left Side - Main Title */}
            <div>
              <h1 className="text-6xl xl:text-8xl font-bold mb-8 text-white">
                <TypingAnimation text="ASTU" speed={200} />
              </h1>
              <h2 className="text-2xl md:text-4xl font-light text-blue-200 mb-8">
                <TypingAnimation text="YEARBOOK 2025" speed={100} />
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed mb-8">
                Celebrating four incredible years of friendship, innovation, and unforgettable memories in Computer
                Science & Engineering.
              </p>

              {/* CTA Button */}
              <Button
                size="lg"
                className="bg-white text-blue-900 hover:bg-blue-50 text-xl px-12 py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => setCurrentPage("classmates")}
              >
                Explore Your Yearbook <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>

            {/* Right Side - Countdown Timer */}
            <div className="lg:mt-8">
              <CountdownTimer />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden mb-16">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 text-white">
              <TypingAnimation text="ASTU" speed={200} />
            </h1>
            <h2 className="text-2xl md:text-4xl font-light text-blue-200 mb-8">
              <TypingAnimation text="YEARBOOK 2025" speed={100} />
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed mb-12">
              Celebrating four incredible years of friendship, innovation, and unforgettable memories in Computer
              Science & Engineering.
            </p>

            {/* CTA Button */}
            <div className="text-center mb-12">
              <Button
                size="lg"
                className="bg-white text-blue-900 hover:bg-blue-50 text-xl px-12 py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => setCurrentPage("classmates")}
              >
                Explore Your Yearbook <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>

            {/* Countdown Timer for Mobile */}
            <CountdownTimer />
          </div>

          {/* Meet Our Amazing Graduates Section */}
          <div className="mb-16">
            <div className="flex items-center space-x-3 mb-8">
              <Heart className="h-6 w-6 text-pink-400" />
              <h3 className="text-2xl font-semibold">Meet Our Amazing Graduates</h3>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-8 gap-4 max-w-2xl mb-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="relative group">
                  <div className="w-16 h-16 bg-white/20 rounded-full border-2 border-white/30 hover:border-white/50 transition-all duration-300 group-hover:scale-110"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
              ))}
            </div>

            <p className="text-blue-200 text-lg">
              <TypingAnimation text="And 50+ more incredible students waiting to reconnect with you!" speed={50} />
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:rotate-1">
              <CardContent className="p-6 text-center">
                <Users className="h-10 w-10 mx-auto mb-4 text-blue-300 animate-bounce" />
                <h4 className="font-semibold mb-2 text-lg text-white">Connect With</h4>
                <p className="text-3xl font-bold text-white">60+ Classmates</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:-rotate-1">
              <CardContent className="p-6 text-center">
                <Calendar className="h-10 w-10 mx-auto mb-4 text-blue-300 animate-bounce delay-200" />
                <h4 className="font-semibold mb-2 text-lg text-white">Relive</h4>
                <p className="text-3xl font-bold text-white">Epic Events</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:rotate-1">
              <CardContent className="p-6 text-center">
                <Camera className="h-10 w-10 mx-auto mb-4 text-blue-300 animate-bounce delay-400" />
                <h4 className="font-semibold mb-2 text-lg text-white">Browse</h4>
                <p className="text-3xl font-bold text-white">500+ Photos</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:-rotate-1">
              <CardContent className="p-6 text-center">
                <Heart className="h-10 w-10 mx-auto mb-4 text-blue-300 animate-bounce delay-600" />
                <h4 className="font-semibold mb-2 text-lg text-white">Share</h4>
                <p className="text-3xl font-bold text-white">Memories</p>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold mb-2 text-white group-hover:text-yellow-300 transition-colors">
                60+
              </div>
              <div className="text-blue-200 text-lg">Brilliant Students</div>
            </div>
            <div className="group hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold mb-2 text-white group-hover:text-yellow-300 transition-colors">
                500+
              </div>
              <div className="text-blue-200 text-lg">Precious Photos</div>
            </div>
            <div className="group hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold mb-2 text-white group-hover:text-yellow-300 transition-colors">4</div>
              <div className="text-blue-200 text-lg">Amazing Years</div>
            </div>
            <div className="group hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold mb-2 text-white group-hover:text-yellow-300 transition-colors">∞</div>
              <div className="text-blue-200 text-lg">Memories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section className="py-16 px-4 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            <TypingAnimation text="Explore Our Digital Yearbook" speed={80} />
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-blue-300 hover:rotate-1"
              onClick={() => setCurrentPage("classmates")}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors group-hover:animate-spin">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Our Squad</h3>
                <p className="text-gray-600">Meet the legends of CSE 2025</p>
              </CardContent>
            </Card>

            <Card
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-blue-300 hover:-rotate-1"
              onClick={() => setCurrentPage("events")}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors group-hover:animate-bounce">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Epic Events</h3>
                <p className="text-gray-600">Relive our amazing moments</p>
              </CardContent>
            </Card>

            <Card
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-blue-300 hover:rotate-1"
              onClick={() => setCurrentPage("memories")}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors group-hover:animate-pulse">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Memories</h3>
                <p className="text-gray-600">Photos with stories</p>
              </CardContent>
            </Card>

            <Card
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-blue-300 hover:-rotate-1"
              onClick={() => setCurrentPage("nominations")}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors group-hover:animate-spin">
                  <Trophy className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Fun Awards</h3>
                <p className="text-gray-600">Hilarious nominations</p>
              </CardContent>
            </Card>

            <Card
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-blue-300 hover:rotate-1"
              onClick={() => setCurrentPage("projects")}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors group-hover:animate-bounce">
                  <Code className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">GC Projects</h3>
                <p className="text-gray-600">Showcase our work</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">
            <TypingAnimation text="Our Journey in Numbers" speed={80} />
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:animate-bounce">60+</div>
              <div className="text-gray-600">Amazing Students</div>
            </div>
            <div className="text-center group hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:animate-bounce delay-100">15+</div>
              <div className="text-gray-600">Memorable Events</div>
            </div>
            <div className="text-center group hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:animate-bounce delay-200">500+</div>
              <div className="text-gray-600">Photos Captured</div>
            </div>
            <div className="text-center group hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:animate-bounce delay-300">4</div>
              <div className="text-gray-600">Years Together</div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="py-20 px-4 bg-gray-50 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">
            <TypingAnimation text="What's Inside Your Digital Yearbook" speed={60} />
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto text-xl">
            Discover all the amazing content waiting for you in our comprehensive digital yearbook experience.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:rotate-1">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:animate-spin">
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Student Profiles</h3>
                <p className="text-gray-600">Meet every graduate with their stories, achievements, and future plans</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:-rotate-1">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:animate-bounce">
                  <Calendar className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Event Highlights</h3>
                <p className="text-gray-600">Relive all the memorable events, celebrations, and milestones</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:rotate-1">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:animate-pulse">
                  <Camera className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Photo Gallery</h3>
                <p className="text-gray-600">Browse hundreds of photos capturing our journey together</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:-rotate-1">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:animate-spin">
                  <Heart className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Memory Stories</h3>
                <p className="text-gray-600">Share and read personal memories and experiences</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-slate-800 to-blue-900 text-white relative overflow-hidden">
        <CodeDecorations />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Code className="h-16 w-16 mx-auto mb-6 text-blue-200 animate-spin" />
          <h2 className="text-3xl font-bold mb-4">
            <TypingAnimation text="Ready to Explore?" speed={100} />
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Dive into our collection of memories, stories, and the incredible journey we've shared together.
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-900 hover:bg-blue-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() => setCurrentPage("classmates")}
          >
            Start Exploring
          </Button>
        </div>
      </section>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Page Content */}
      <main>{renderPage()}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative">
        <CodeDecorations />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <GraduationCap className="h-8 w-8 text-blue-400 animate-bounce" />
              <span className="text-2xl font-bold">ASTU Yearbook 2025</span>
            </div>
            <p className="text-gray-400 mb-4">Computer Science Engineering Department</p>
            <div className="flex justify-center items-center space-x-1 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-400 fill-current animate-pulse" />
              <span>by the CSE Class of 2025</span>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-800 text-sm text-gray-500">
              <TypingAnimation text="© 2025 ASTU. All memories preserved with love." speed={50} />
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && <AuthRequiredModal onClose={() => setShowAuthModal(false)} action={authAction} />}
    </div>
  )
}
