'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, AlertCircle } from "lucide-react"
import { UserApprovalTab } from "./components/user-approval-tab"
import { ContentApprovalTab } from "./components/content-approval-tab"
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage user registrations and content approvals
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Approvals
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Content Approvals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UserApprovalTab />
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <ContentApprovalTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
