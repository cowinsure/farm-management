"use client"

import { useState, useEffect } from "react"
import { authService, type User } from "@/lib/api/auth"
import { useRouter, usePathname } from 'next/navigation';

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname();

  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    // Check authentication status on mount and on route change
    const checkAuth = () => {
      const isAuthenticated = authService.isAuthenticated()
      const user = authService.getCurrentUser()
      setAuthState({
        user,
        isAuthenticated,
        isLoading: false,
      })
    }

    checkAuth()
    // Listen for storage events (cross-tab login/logout)
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [pathname])

  const login = (userData: User) => {
    setAuthState({
      user: userData,
      isAuthenticated: true,
      isLoading: false,
    })
  }

  const logout = () => {
    authService.logout()
     // Redirect to login page after logout
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
    router.push('/auth/login')
  }

  return {
    ...authState,
    login,
    logout,
  }
}
