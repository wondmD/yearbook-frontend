"use client"

import { Navigation } from "@/components/navigation"
import { ProjectsPage } from "@/components/projects-page"
import { AuthRequiredModal } from "@/components/auth-required-modal"
import { CodeDecorations } from "@/components/code-decorations"
import { FloatingCode } from "@/components/floating-code"
import { signIn, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useProjects } from "@/hooks/useProjects"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function ProjectsPageRoute() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()
  const { projects, loading, error, refetch } = useProjects()

  // Store the JWT token in localStorage when the session is available
  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      localStorage.setItem('access_token', session.accessToken)
    } else if (status === 'unauthenticated') {
      localStorage.removeItem('access_token')
    }
  }, [status, session])

  const handleAddProject = async () => {
    if (!session) {
      // Redirect to sign-in page with a callback URL
      await signIn('keycloak', { callbackUrl: '/projects' })
      return;
    }
    // Add any additional logic for when the user is already signed in
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Projects</h2>
          <p className="text-gray-600 mb-4">{error.toString()}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors mr-2"
          >
            Retry
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <CodeDecorations />
      <FloatingCode />
      <ProjectsPage 
        onAddProject={handleAddProject} 
        projects={Array.isArray(projects) ? projects : []} 
        error={error?.toString()}
      />
      <AuthRequiredModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSignIn={() => signIn('keycloak', { callbackUrl: '/projects' })}
        title="Sign In Required"
        message="You need to be signed in to submit a project."
      />
    </div>
  )
}
