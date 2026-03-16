import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Reports from '../../../src/pages/Reports/Reports'
import { mockTaskList } from '../../fixtures/mockData'

const exportCSVMock = vi.fn()
const exportJSONMock = vi.fn()

vi.mock('../../../src/hooks/useExport', () => ({
  useExport: () => ({
    exportCSV: exportCSVMock,
    exportJSON: exportJSONMock,
  }),
}))

vi.mock('../../../src/hooks/useTasks', () => ({
  useAllTasks: () => ({
    data: { data: mockTaskList, pagination: { page: 1, limit: 10, total: 2, totalPages: 1 } },
    isLoading: false,
  }),
}))

describe('Reports integration', () => {
  it('renders report table and triggers exports', () => {
    render(<Reports />)

    fireEvent.click(screen.getByRole('button', { name: 'Export CSV' }))
    fireEvent.click(screen.getByRole('button', { name: 'Export JSON' }))

    expect(exportCSVMock).toHaveBeenCalled()
    expect(exportJSONMock).toHaveBeenCalled()
    expect(screen.getByText('Showing 2 of 2 tasks')).toBeInTheDocument()
  })
})
