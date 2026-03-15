import { useContext } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthContext, AuthProvider } from '../../../src/context/AuthContext'

const authServiceMocks = vi.hoisted(() => ({
  loginMock: vi.fn().mockResolvedValue({
    data: {
      data: {
        token: 'token-1',
        user: { userId: '1', name: 'Tina', email: 'tina@example.com' },
      },
    },
  }),
  getProfileMock: vi.fn().mockResolvedValue({
    data: { data: { userId: '1', name: 'Tina', email: 'tina@example.com' } },
  }),
  registerMock: vi.fn().mockResolvedValue({}),
  updateProfileMock: vi.fn().mockResolvedValue({
    data: { data: { userId: '1', name: 'Tina', email: 'tina@example.com' } },
  }),
  changePasswordMock: vi.fn().mockResolvedValue({}),
}))

vi.mock('../../../src/services/auth.service', () => ({
  authService: {
    login: authServiceMocks.loginMock,
    register: authServiceMocks.registerMock,
    getProfile: authServiceMocks.getProfileMock,
    updateProfile: authServiceMocks.updateProfileMock,
    changePassword: authServiceMocks.changePasswordMock,
  },
}))

const Consumer = () => {
  const context = useContext(AuthContext)
  if (!context) {
    return <div>No context</div>
  }

  return (
    <div>
      <button onClick={() => context.login({ email: 'tina@example.com', password: 'secret123' })}>
        do-login
      </button>
      <span>{context.isAuthenticated ? 'yes' : 'no'}</span>
    </div>
  )
}

describe('AuthContext integration', () => {
  it('hydrates and updates auth state via provider actions', async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    expect(screen.getByText('no')).toBeInTheDocument()
    screen.getByRole('button', { name: 'do-login' }).click()

    await waitFor(() => {
      expect(authServiceMocks.loginMock).toHaveBeenCalled()
      expect(screen.getByText('yes')).toBeInTheDocument()
    })
  })
})
