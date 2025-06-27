"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  email: string
  full_name: string
  avatar_url?: string
  created_at?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (userData: User) => void
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: 'include' // Important for cookies
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    setLoading(false)
  }

  // Also add a method to handle login API call directly
  const loginWithCredentials = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        return { success: true, user: data.user }
      } else {
        const errorData = await response.json()
        return { success: false, error: errorData.error }
      }
    } catch (error) {
      console.error("Login failed:", error)
      return { success: false, error: "Network error" }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { 
        method: "POST",
        credentials: 'include'
      })
      if (response.ok) {
        setUser(null)
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const refreshAuth = async () => {
    await checkAuth()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithCredentials, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}