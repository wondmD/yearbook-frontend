import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    authorized: ({ token }) => {
      // If there's a token, the user is authenticated
      return !!token
    },
  },
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/projects/new',
    '/projects/edit/:path*',
  ]
}
