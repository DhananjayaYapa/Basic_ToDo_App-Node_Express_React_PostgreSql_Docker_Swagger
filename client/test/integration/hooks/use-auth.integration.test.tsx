import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderHook } from '@testing-library/react'
import { useAuth } from '../../../src/hooks/useAuth'
import { AuthContext } from '../../../src/context/AuthContext'

describe('useAuth integration', () => {
  it('throws when missing provider', () => {
    const { result } = renderHook(() => {
      try {
        return useAuth()
      } catch (error) {
        return error
      }
    })

    expect(result.current).toBeInstanceOf(Error)
  })

  it('returns context value when provider exists', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider
        value={{
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          login: async () => {},
          register: async () => {},
          logout: () => {},
          updateProfile: async () => {},
          changePassword: async () => {},
          fetchProfile: async () => {},
        }}
      >
        {children}
      </AuthContext.Provider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.isAuthenticated).toBe(false)
  })
})
