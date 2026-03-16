import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AuthPage from '../../../src/pages/AuthPage/AuthPage'

const useAuthMock = vi.fn()

vi.mock('../../../src/hooks/useAuth', () => ({
  useAuth: () => useAuthMock(),
}))

describe('AuthPage integration', () => {
  it('renders auth experience for non-authenticated users', () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Create Account')).toBeInTheDocument()
    expect(screen.getAllByText('Email').length).toBeGreaterThan(0)
  })
})
