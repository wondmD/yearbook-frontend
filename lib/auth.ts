import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"

// Extend the built-in session types
declare module "next-auth" {
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
      image?: string | null
    }
    accessToken: string
    error?: string
  }

  interface User {
    id: string
    username: string
    email: string
    is_approved: boolean
    is_admin: boolean
    access: string
    refresh: string
    accessTokenExpires: number
    name?: string
    studentId?: string
    batch?: string
    role?: string
    image?: string
  }
}

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
    user: {
      id: string
      username: string
      email: string
      isApproved: boolean
      isAdmin: boolean
      name?: string
      studentId?: string | null
      batch?: string | null
      role?: string
      image?: string | null
    }
    error?: string
  }
}

// Use the deployed backend URL for authentication
const API_BASE_URL = 'https://yearbook.ethioace.com/api/auth'

// Ensure we have a secret for JWT
if (!process.env.NEXTAUTH_SECRET) {
  console.warn('NEXTAUTH_SECRET is not set. Using a temporary secret for development.')
  process.env.NEXTAUTH_SECRET = 'dev-secret-change-in-production'
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        email: { 
          label: "Email", 
          type: "email", 
          placeholder: "email@example.com" 
        },
        password: { 
          label: "Password", 
          type: "password" 
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            throw new Error('Missing credentials')
          }
          
          const tokenUrl = `${API_BASE_URL}/token/`;
          console.log('Making authentication request to:', tokenUrl);
          
          // Prepare the request body
          const requestBody = {
            username: credentials.username.trim(),
            password: credentials.password,
          };

          console.log('Sending request to:', tokenUrl);
          console.log('Request body:', { ...requestBody, password: '[REDACTED]' });
          
          const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(requestBody),
          })

          console.log('Response status:', response.status);
          
          // First, get the response text to help with debugging
          const responseText = await response.text();
          console.log('Raw response text:', responseText);
          
          let responseData;
          try {
            responseData = JSON.parse(responseText);
          } catch (e) {
            console.error('Failed to parse JSON response:', e);
            throw new Error('Invalid server response format');
          }
          
          if (!response.ok) {
            console.error('Authentication error - Status:', response.status);
            console.error('Response data:', responseData);
            
            // Handle different types of error responses
            if (response.status === 400) {
              if (responseData.detail) {
                throw new Error(`Bad request: ${responseData.detail}`);
              } else if (responseData.non_field_errors) {
                throw new Error(responseData.non_field_errors.join(', '));
              } else {
                throw new Error('Invalid email or password');
              }
            } else if (response.status === 401) {
              throw new Error('Authentication failed. Please check your credentials.');
            } else {
              throw new Error(`Server error: ${response.status} - ${response.statusText}`);
            }
          }
          
          console.log('Token response received:', Object.keys(responseData).join(', '));
          
          // Use the user data from the response
          const userData = responseData.user || {};
          
          // Check if user is approved
          if (!userData.is_approved) {
            console.log('Login attempt by unapproved user:', userData.email);
            // Return null with error message to be handled by the signin page
            throw new Error('Your account is pending approval. Please contact the administrator.');
          }
          
          return {
            id: userData.id || '',
            username: userData.username || '',
            email: userData.email || '',
            is_approved: userData.is_approved || false,
            is_admin: userData.is_admin || false,
            name: userData.name || userData.username || '',
            studentId: userData.student_id || null,
            batch: userData.batch || null,
            image: userData.image || null,
            access: responseData.access,
            refresh: responseData.refresh,
            accessTokenExpires: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
          }
        } catch (error) {
          console.error('Authentication error:', error)
          // Re-throw the error to be caught by NextAuth
          throw error
        }
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user && 'access' in user) {
        // Create a new token with user data
        const newToken = {
          ...token,
          accessToken: user.access,
          refreshToken: user.refresh,
          accessTokenExpires: user.accessTokenExpires,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            isApproved: user.is_approved,
            isAdmin: user.is_admin,
            name: user.name || user.username,
            studentId: user.studentId || null,
            batch: user.batch || null,
            role: (user as any).role || 'user',
            image: user.image || null,
          },
        };
        return newToken;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token?.user) {
        // Safely assign user data from token to session
        session.user = {
          ...session.user,
          id: token.user.id || '',
          username: token.user.username || '',
          email: token.user.email || '',
          isApproved: token.user.isApproved || false,
          isAdmin: token.user.isAdmin || false,
          name: token.user.name || token.user.username || '',
          studentId: token.user.studentId || undefined,
          batch: token.user.batch || undefined,
          role: token.user.role || 'user',
          image: token.user.image || undefined,
        };
      }
      
      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }
      
      if (token?.error) {
        session.error = token.error;
      }
      
      return session;
    },
  },
  // Session configuration
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Enable debug logging in development
  debug: process.env.NODE_ENV === 'development',
  // Custom pages
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error"
  },
  // Security
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
}
