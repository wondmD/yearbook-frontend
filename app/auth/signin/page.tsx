"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, User, Lock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })

      // Handle the result from signIn
      if (result) {
        if (result.error) {
          // Handle error on client side only
          if (typeof window !== 'undefined') {
            // Extract the error message from the URL if it exists
            const url = new URL(result.url || '', window.location.origin)
            const errorParam = url.searchParams.get('error')
            
            if (errorParam) {
              // Decode the error message from the URL
              const errorMessage = decodeURIComponent(errorParam)
              setError(errorMessage)
            } else if (result.error.includes('pending approval')) {
              setError("Your account is pending approval. Please contact the administrator.")
            } else {
              setError("Invalid credentials. Please check your email and password.")
            }
          } else {
            // Default error message during SSR/SSG
            setError("An authentication error occurred. Please try again.")
          }
        } else if (result.ok) {
          // Successful login
          router.push("/")
          router.refresh()
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } catch (error: any) {
      console.error('Sign in error:', error)
      setError(error.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Code Decorations */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 text-blue-200/20 text-6xl font-mono animate-bounce">{"{"}</div>
        <div className="absolute top-32 right-20 text-purple-200/20 text-6xl font-mono animate-bounce delay-1000">
          {"}"}
        </div>
        <div className="absolute bottom-40 left-16 text-green-200/20 text-5xl font-mono animate-pulse">{"["}</div>
        <div className="absolute bottom-52 right-12 text-yellow-200/20 text-5xl font-mono animate-pulse delay-500">
          {"]"}
        </div>
        <div className="absolute top-1/3 left-1/4 text-red-200/20 text-4xl font-mono animate-ping">;</div>
        <div className="absolute top-2/3 right-1/4 text-indigo-200/20 text-4xl font-mono animate-ping delay-700">;</div>
      </div>

      <Card className="w-full max-w-md bg-white shadow-2xl relative z-10">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 rounded-full p-3">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-gray-800">Welcome Back</CardTitle>
          <p className="text-gray-600">Sign in to access the ASTU Yearbook</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="text-right">
              <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot your password?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center space-y-2">
            

            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-blue-600 hover:underline font-medium">
                Sign up here
              </Link>
            </p>
          </div>

          <div className="text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
