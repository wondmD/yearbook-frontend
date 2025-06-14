"use client"

import { Navigation } from "@/components/navigation"
import { ProjectsPage } from "@/components/projects-page"
import { AuthRequiredModal } from "@/components/auth-required-modal"
import { CodeDecorations } from "@/components/code-decorations"
import { FloatingCode } from "@/components/floating-code"
import { useSession } from "next-auth/react"
import { useState } from "react"

export default function ProjectsPageRoute() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { data: session } = useSession()

  const handleAddProject = () => {
    if (!session) {
      setShowAuthModal(true)
    } else {
      console.log("Adding project for user:", session.user?.name)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <CodeDecorations />
      <FloatingCode />
      <Navigation />
      <div className="relative z-10">
        <ProjectsPage onAddProject={handleAddProject} />
      </div>
      {showAuthModal && <AuthRequiredModal onClose={() => setShowAuthModal(false)} action="submit your project" />}
    </div>
  )
}
