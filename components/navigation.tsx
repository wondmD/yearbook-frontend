"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { GraduationCap, Menu, LogOut, User, Star, CheckCircle, Clock, Mail, Hash, Users, Shield } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/classmates", label: "Our Squad" },
  { href: "/events", label: "Events" },
  { href: "/memories", label: "Memories" },
  { href: "/nominations", label: "Fun Awards" },
  { href: "/projects", label: "Projects" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()
  
  // Debug log to inspect session data
  if (session) {
    console.log('Session data:', JSON.stringify(session, null, 2))
  }

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-full p-2">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">ASTU</div>
              <div className="flex items-center space-x-1 text-xs text-gray-300">
                <Star className="h-3 w-3" />
                <span>YEARBOOK 2025</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                  pathname === item.href ? "text-blue-400 border-b-2 border-blue-400" : "text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-full px-2 hover:bg-white/10">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-10 w-10">
                        {session.user?.image && (
                          <AvatarImage src={session.user.image} alt={session.user.username || 'User'} />
                        )}
                        <AvatarFallback className="bg-blue-600 text-white">
                          {session.user?.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start max-w-[120px] overflow-hidden">
                        <span className="text-sm font-medium text-white truncate w-full">
                          {session.user?.name || 'User'}
                        </span>
                        <span className="text-xs text-gray-400 truncate w-full">
                          {session.user?.email || ''}
                        </span>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 bg-slate-800 border-slate-700 text-white p-0 overflow-hidden" align="end">
                  <div className="p-4 border-b border-slate-700">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar className="h-12 w-12">
                        {session.user?.image && (
                          <AvatarImage src={session.user.image} alt={session.user.username || 'User'} />
                        )}
                        <AvatarFallback className="bg-blue-600 text-white text-lg">
                          {session.user?.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white">
                          {session.user?.name || session.user?.username || 'User'}
                        </h4>
                        <p className="text-xs text-blue-300 font-mono">
                          @{session.user?.username || 'user'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm mt-3 pt-3 border-t border-slate-700">
                      <div className="flex items-center text-gray-300">
                        <Mail className="h-4 w-4 mr-2 text-blue-400" />
                        <span className="truncate">{session.user?.email || 'No email available'}</span>
                      </div>
                      
                      {session.user?.studentId && (
                        <div className="flex items-center text-gray-300">
                          <Hash className="h-4 w-4 mr-2 text-blue-400" />
                          <span>ID: {session.user.studentId}</span>
                        </div>
                      )}
                      
                      {session.user?.batch && (
                        <div className="flex items-center text-gray-300">
                          <Users className="h-4 w-4 mr-2 text-blue-400" />
                          <span>Batch {session.user.batch}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-gray-300">
                        <Shield className="h-4 w-4 mr-2 text-blue-400" />
                        <span className="capitalize">{session.user?.role || 'Student'}</span>
                      </div>
                      
                      <div className="flex items-center mt-2 pt-2 border-t border-slate-700 text-sm">
                        {session.user?.isApproved ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-green-400">Account Verified</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 text-amber-400 mr-2 flex-shrink-0" />
                            <div className="flex-1 flex items-center justify-between">
                              <span className="text-amber-400">Pending Approval</span>
                              <span className="text-xs bg-amber-900/50 text-amber-300 px-2 py-0.5 rounded ml-2">Contact Admin</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-1">
                    <DropdownMenuItem 
                      className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 rounded-md m-1"
                      onClick={() => signOut()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/auth/signin">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-slate-900 text-white border-slate-700">
              <div className="flex flex-col space-y-6 mt-8">
                <div className="text-center pb-6 border-b border-slate-700">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <GraduationCap className="h-6 w-6 text-blue-400" />
                    <span className="text-xl font-bold">ASTU Yearbook</span>
                  </div>
                  <p className="text-sm text-gray-300">Computer Science & Engineering</p>
                </div>

                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-blue-400 py-2 px-4 rounded-lg hover:bg-white/5 ${
                      pathname === item.href ? "text-blue-400 bg-white/5" : "text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="pt-6 border-t border-slate-700">
                  {session ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-full text-left">
                        <div className="flex items-center space-x-3 px-4 py-3 bg-slate-800 rounded-lg mb-4 hover:bg-slate-700 transition-colors">
                          <Avatar className="h-10 w-10">
                            {session.user?.image && (
                              <AvatarImage src={session.user.image} alt={session.user.username || 'User'} />
                            )}
                            <AvatarFallback className="bg-blue-600 text-white">
                              {session.user?.username?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {session.user?.name || session.user?.username || 'User'}
                            </p>
                            <p className="text-xs text-blue-300 font-mono truncate">
                              @{session.user?.username || 'user'}
                            </p>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                            <path d="m6 9 6 6 6-6"/>
                          </svg>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[calc(100vw-4rem)] ml-4 bg-slate-800 border-slate-700 text-white p-0 overflow-hidden">
                        <div className="p-4 border-b border-slate-700">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-300">
                              <Mail className="h-4 w-4 mr-2 text-blue-400 flex-shrink-0" />
                              <span className="truncate">{session.user?.email || 'No email available'}</span>
                            </div>
                            
                            {session.user?.studentId && (
                              <div className="flex items-center text-gray-300">
                                <Hash className="h-4 w-4 mr-2 text-blue-400 flex-shrink-0" />
                                <span>ID: {session.user.studentId}</span>
                              </div>
                            )}
                            
                            {session.user?.batch && (
                              <div className="flex items-center text-gray-300">
                                <Users className="h-4 w-4 mr-2 text-blue-400 flex-shrink-0" />
                                <span>Batch {session.user.batch}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center text-gray-300">
                              <Shield className="h-4 w-4 mr-2 text-blue-400 flex-shrink-0" />
                              <span className="capitalize">{session.user?.role || 'Student'}</span>
                            </div>
                            
                            <div className="flex items-center mt-2 pt-2 border-t border-slate-700 text-sm">
                              {session.user?.isApproved ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                  <span className="text-green-400">Account Verified</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="h-4 w-4 text-amber-400 mr-2 flex-shrink-0" />
                                  <div className="flex-1 flex items-center justify-between">
                                    <span className="text-amber-400">Pending Approval</span>
                                    <span className="text-xs bg-amber-900/50 text-amber-300 px-2 py-0.5 rounded ml-2">Contact Admin</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-1">
                          <DropdownMenuItem 
                            className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 rounded-md m-1"
                            onClick={() => {
                              signOut()
                              setIsOpen(false)
                            }}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign out</span>
                          </DropdownMenuItem>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                        <User className="h-4 w-4 mr-2" />
                        Sign In
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
