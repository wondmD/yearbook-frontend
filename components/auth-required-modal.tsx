"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Shield, LogIn } from "lucide-react"
import { signIn } from "next-auth/react"

interface AuthRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  onSignIn: () => void
  title?: string
  message?: string
  action?: string
}

export function AuthRequiredModal({ 
  isOpen, 
  onClose, 
  onSignIn,
  title = "Authentication Required",
  message,
  action = "access this content"
}: AuthRequiredModalProps) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardHeader className="text-center pb-4 relative">
          <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 rounded-full p-3">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-gray-800">Authentication Required</CardTitle>
          <p className="text-gray-600">You need to sign in to {action}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center text-gray-600">
            <p>Join the ASTU Yearbook community to contribute content and connect with your classmates.</p>
          </div>

          <div className="space-y-3">
            <Button 
            className="w-full bg-blue-600 hover:bg-blue-700" 
            onClick={onSignIn}
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In to Continue
          </Button>

            <Button variant="outline" className="w-full" onClick={() => signIn("google")}>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          <div className="text-center">
            <Button variant="ghost" onClick={onClose} className="text-gray-500">
              Maybe Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
