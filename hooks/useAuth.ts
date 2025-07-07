"use client"

import { useState, useEffect } from "react"
import { authService, type User } from "@/lib/api/auth"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    // Check authentication status on mount
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
  }, [])

  const login = (userData: User) => {
    setAuthState({
      user: userData,
      isAuthenticated: true,
      isLoading: false,
    })
  }

  const logout = () => {
    authService.logout()
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  return {
    ...authState,
    login,
    logout,
  }
}
