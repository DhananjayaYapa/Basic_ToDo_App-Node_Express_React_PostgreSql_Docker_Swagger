import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ManageTodos from '../../../src/pages/ManageTodos/ManageTodos'
import { mockTaskList } from '../../fixtures/mockData'

vi.mock('../../../src/hooks/useTasks', () => ({
  useAllTasks: () => ({
    data: { data: mockTaskList, pagination: { page: 1, limit: 10, total: 2, totalPages: 1 } },
    isLoading: false,
  }),
  useUpdateTask: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useDeleteTask: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useMarkDone: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

describe('ManageTodos integration', () => {
  it('renders page level task management flow shell', () => {
    render(<ManageTodos />)

    expect(screen.getByText('Manage Todos')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByTestId('data-grid')).toBeInTheDocument()
  })
})
