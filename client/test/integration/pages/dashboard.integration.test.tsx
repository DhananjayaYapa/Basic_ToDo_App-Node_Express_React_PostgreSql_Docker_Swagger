import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../../../src/pages/Dashboard/Dashboard'

vi.mock('../../../src/hooks/useAuth', () => ({
  useAuth: () => ({ user: { name: 'Rita' } }),
}))

vi.mock('../../../src/hooks/useTasks', () => ({
  useRecentTasks: () => ({ data: [], isLoading: false }),
  useCreateTask: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

vi.mock('../../../src/hooks/useDashboard', () => ({
  useDashboardSummary: () => ({
    data: { total: 1, completed: 0, pending: 1, completionRate: 0 },
    isLoading: false,
  }),
  useTasksByDay: () => ({ data: [{ date: '2026-03-10', count: 1 }], isLoading: false }),
  useStatusBreakdown: () => ({ data: [{ status: 'PENDING', count: 1 }] }),
}))

describe('Dashboard integration', () => {
  it('renders dashboard composition and stats', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    expect(screen.getByText(/Welcome back, Rita/i)).toBeInTheDocument()
    expect(screen.getByText('Create New Task')).toBeInTheDocument()
    expect(screen.getByText('Recent Pending Tasks')).toBeInTheDocument()
  })
})
