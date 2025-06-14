"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, Mail, Lock, User, BadgeIcon as IdCard, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",  // Changed from confirmPassword to password2 to match backend
    first_name: "",
    last_name: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Check for registration success message
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess(true)
      // Remove the query param without refreshing
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('registered')
      window.history.replaceState({}, '', newUrl.toString())
    }
  }, [searchParams])
  
  // Check if passwords match in real-time
  const validatePasswords = (currentPassword: string, confirmPassword: string) => {
    if (currentPassword && confirmPassword && currentPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
    } else {
      setPasswordError("")
    }
  }
  
  // Handle password field changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // If either password field changes, validate both
    if (name === 'password') {
      validatePasswords(value, formData.password2)
    } else if (name === 'password2') {
      validatePasswords(formData.password, value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Check if passwords match
    if (formData.password !== formData.password2) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      // Prepare the registration data for the backend
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.password2,  // Add password confirmation
        first_name: formData.first_name,
        last_name: formData.last_name,
      };

      // Send registration request to the backend
      const response = await fetch(`http://localhost:8000/api/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      if (response.ok) {
        setSuccess(true)
        
        try {
          // Auto-login after successful registration
          const loginResult = await signIn('credentials', {
            redirect: false,
            username: formData.username,
            password: formData.password,
            callbackUrl: '/'
          })

          if (loginResult?.error) {
            console.error('Login after registration failed:', loginResult.error)
            // If auto-login fails, redirect to login page with success message
            router.push(`/auth/signin?registered=true`)
          } else if (loginResult?.url) {
            // If login is successful, redirect to the provided URL
            window.location.href = loginResult.url
          }
        } catch (loginError) {
          console.error('Error during login after registration:', loginError)
          // If there's an error, redirect to login page with success message
          router.push(`/auth/signin?registered=true`)
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Registration failed')
      }
    } catch (error) {
      setError("An error occurred during registration. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
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
        </div>

        <Card className="w-full max-w-md bg-white shadow-2xl relative z-10">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to ASTU Yearbook!</h2>
            <p className="text-gray-600 mb-6">
              Your account has been created successfully. You're being signed in automatically...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    )
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
          <CardTitle className="text-2xl text-gray-800">Join ASTU Yearbook</CardTitle>
          <p className="text-gray-600">Create your account to connect with classmates</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}
          {searchParams.get('registered') === 'true' && (
            <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              Registration successful! Please log in with your credentials.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="first_name"
                    type="text"
                    placeholder="First name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="last_name"
                    type="text"
                    placeholder="Last name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@astu.edu.et"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
              <p>Your account will be reviewed by an administrator before activation.</p>
              <p className="mt-1">You'll be able to set up additional profile details after approval.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password (min 8 characters)"
                  name="password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className="pl-10"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password2">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password2"
                  type="password"
                  placeholder="Re-enter your password"
                  name="password2"
                  value={formData.password2}
                  onChange={handlePasswordChange}
                  className={`pl-10 ${passwordError ? 'border-red-500' : formData.password2 && formData.password === formData.password2 ? 'border-green-500' : ''}`}
                  required
                  minLength={8}
                />
                {passwordError && (
                  <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                )}
                {formData.password2 && formData.password === formData.password2 && (
                  <p className="text-green-500 text-xs mt-1">Passwords match!</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-blue-600 hover:underline font-medium">
                Sign in here
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
