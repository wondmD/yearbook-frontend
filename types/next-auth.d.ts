import 'next-auth'

declare module "next-auth" {
  interface User {
    id: string
    username: string
    email: string
    is_approved: boolean
    is_admin: boolean
    access: string
    refresh: string
    accessTokenExpires: number
    studentId?: string
    batch?: string
    name?: string
    role?: string
    image?: string
  }

  interface Session {
    user: {
      id: string
      username: string
      email: string
      isApproved: boolean
      isAdmin: boolean
      name?: string
      studentId?: string
      batch?: string
      role?: string
      image?: string
    }
    accessToken: string
    error?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
    user: {
      id: string
      username: string
      email: string
      is_approved: boolean
      is_admin: boolean
      name?: string
      studentId?: string
      batch?: string
      role?: string
      image?: string
    }
    error?: string
  }
}
