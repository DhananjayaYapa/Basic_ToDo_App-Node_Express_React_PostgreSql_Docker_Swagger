import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AppLayout from '../../../src/templates/AppLayout/AppLayout'
import AppLayoutHeader from '../../../src/templates/AppLayoutHeader/AppLayoutHeader'

vi.mock('../../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { name: 'Test User', email: 'test@example.com' },
    logout: vi.fn(),
  }),
}))

describe('template components unit', () => {
  it('renders app layout header metadata', () => {
    render(
      <MemoryRouter initialEntries={['/reports']}>
        <AppLayoutHeader />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Reports' })).toBeInTheDocument()
  })

  it('renders app layout shell with children', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppLayout>
          <div>Main Content</div>
        </AppLayout>
      </MemoryRouter>
    )

    expect(screen.getByText('Main Content')).toBeInTheDocument()
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0)
  })
})
