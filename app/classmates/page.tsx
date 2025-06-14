"use client"

import { Navigation } from "@/components/navigation"
import { ClassmatesPage } from "@/components/classmates-page"
import { AuthRequiredModal } from "@/components/auth-required-modal"
import { CodeDecorations } from "@/components/code-decorations"
import { FloatingCode } from "@/components/floating-code"
import { useSession } from "next-auth/react"
import { useState } from "react"

export default function ClassmatesPageRoute() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { data: session } = useSession()

  const handleAddProfile = () => {
    if (!session) {
      setShowAuthModal(true)
    } else {
      console.log("Adding profile for user:", session.user?.name)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <CodeDecorations />
      <FloatingCode />
      <Navigation />
      <div className="relative z-10">
        <ClassmatesPage onAddProfile={handleAddProfile} />
      </div>
      {showAuthModal && <AuthRequiredModal onClose={() => setShowAuthModal(false)} action="add your profile" />}
    </div>
  )
}
