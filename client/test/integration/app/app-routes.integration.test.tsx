import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../../../src/App'
import AppRoutes from '../../../src/routes'
import PrivateRoute from '../../../src/routes/PrivateRoute'

const useAuthMock = vi.fn()

vi.mock('../../../src/hooks/useAuth', () => ({
  useAuth: () => useAuthMock(),
}))

vi.mock('../../../src/templates', () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('app and routes integration', () => {
  it('renders App wrapper', () => {
    useAuthMock.mockReturnValue({ isAuthenticated: false })

    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText('Create Account')).toBeInTheDocument()
  })

  it('routes to auth page when logged out', () => {
    useAuthMock.mockReturnValue({ isAuthenticated: false })

    render(
      <MemoryRouter initialEntries={['/login']}>
        <AppRoutes />
      </MemoryRouter>
    )

    expect(screen.getByText('Create Account')).toBeInTheDocument()
  })

  it('guards private route when unauthenticated', () => {
    useAuthMock.mockReturnValue({ isAuthenticated: false })

    render(
      <MemoryRouter initialEntries={['/']}>
        <PrivateRoute />
      </MemoryRouter>
    )

    expect(screen.queryByText('Main Content')).not.toBeInTheDocument()
  })
})
