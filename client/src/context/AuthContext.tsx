import React, { createContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/auth.service'
import type {
  User,
  LoginRequestDto,
  RegisterRequestDto,
  UpdateProfileRequestDto,
  ChangePasswordRequestDto,
} from '../utilities/models'
import { TOKEN_KEY } from '../utilities/constants'

// ─── Context Shape ──────────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginRequestDto) => Promise<void>
  register: (data: RegisterRequestDto) => Promise<void>
  logout: () => void
  updateProfile: (data: UpdateProfileRequestDto) => Promise<void>
  changePassword: (data: ChangePasswordRequestDto) => Promise<void>
  fetchProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

// ─── Provider ────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [isLoading, setIsLoading] = useState(false)

  const isAuthenticated = !!token

  // Fetch profile on mount if token exists
  const fetchProfile = useCallback(async () => {
    if (!token) return
    try {
      setIsLoading(true)
      const response = await authService.getProfile()
      setUser(response.data.data)
    } catch {
      // Token invalid — clear auth
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token && !user) {
      fetchProfile()
    }
  }, [token, user, fetchProfile])

  // Login
  const login = async (data: LoginRequestDto) => {
    setIsLoading(true)
    try {
      const response = await authService.login(data)
      const result = response.data.data
      localStorage.setItem(TOKEN_KEY, result.token)
      setToken(result.token)
      setUser(result.user)
    } finally {
      setIsLoading(false)
    }
  }

  // Register
  const register = async (data: RegisterRequestDto) => {
    setIsLoading(true)
    try {
      await authService.register(data)
    } finally {
      setIsLoading(false)
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  // Update Profile
  const updateProfile = async (data: UpdateProfileRequestDto) => {
    setIsLoading(true)
    try {
      const response = await authService.updateProfile(data)
      setUser(response.data.data)
    } finally {
      setIsLoading(false)
    }
  }

  // Change Password
  const changePassword = async (data: ChangePasswordRequestDto) => {
    setIsLoading(true)
    try {
      await authService.changePassword(data)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
