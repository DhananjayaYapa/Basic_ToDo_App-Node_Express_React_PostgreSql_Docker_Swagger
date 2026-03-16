import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Profile from '../../../src/pages/Profile/Profile'

vi.mock('../../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { name: 'Rita', email: 'rita@example.com' },
    isLoading: false,
    updateProfile: vi.fn(),
    changePassword: vi.fn(),
  }),
}))

describe('Profile integration', () => {
  it('renders profile page and forms', () => {
    render(<Profile />)

    expect(screen.getByText('My Profile')).toBeInTheDocument()
    expect(screen.getByText('Profile Information')).toBeInTheDocument()
    expect(screen.getByText('Change Password')).toBeInTheDocument()
  })
})
