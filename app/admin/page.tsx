'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, User as UserIcon, AlertCircle, Code2 } from "lucide-react"
import { UserApprovalTab } from "./components/user-approval-tab"
import { ContentApprovalTab } from "./components/content-approval-tab"
import { ProfileApprovalTab } from "./components/profile-approval-tab"
import { ProjectApprovalTab } from "./components/project-approval-tab"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
    
    if (status === 'unauthenticated') {
      console.log('User not authenticated, redirecting to signin');
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      console.log('User authenticated, isAdmin:', session?.user?.isAdmin);
      if (!session?.user?.isAdmin) {
        console.log('User is not an admin, redirecting to home');
        router.push('/')
      }
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session?.user?.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Admin Dashboard</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Tabs defaultValue="projects" className="w-full">
            <div className="border-b border-gray-200 px-4 sm:px-6">
              <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1 bg-transparent p-0">
                <TabsTrigger 
                  value="projects" 
                  className="flex items-center justify-center gap-2 py-3 px-2 text-sm sm:text-base transition-colors data-[state=active]:shadow-none"
                >
                  <Code2 className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Projects</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="users" 
                  className="flex items-center justify-center gap-2 py-3 px-2 text-sm sm:text-base transition-colors data-[state=active]:shadow-none"
                >
                  <Users className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Users</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="content" 
                  className="flex items-center justify-center gap-2 py-3 px-2 text-sm sm:text-base transition-colors data-[state=active]:shadow-none"
                >
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Content</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="profiles" 
                  className="flex items-center justify-center gap-2 py-3 px-2 text-sm sm:text-base transition-colors data-[state=active]:shadow-none"
                >
                  <UserIcon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Profiles</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-4 sm:p-6">
              <TabsContent value="projects" className="mt-0">
                <div className="bg-white rounded-lg">
                  <ProjectApprovalTab />
                </div>
              </TabsContent>

              <TabsContent value="users" className="mt-0">
                <div className="bg-white rounded-lg">
                  <UserApprovalTab />
                </div>
              </TabsContent>

              <TabsContent value="content" className="mt-0">
                <div className="bg-white rounded-lg">
                  <ContentApprovalTab />
                </div>
              </TabsContent>

              <TabsContent value="profiles" className="mt-0">
                <div className="bg-white rounded-lg">
                  <ProfileApprovalTab />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
