import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { INITIAL_EDIT_TASK_FORM_STATE } from '../../../src/utilities/models'
import TaskEditDialog from '../../../src/components/todos/TaskEditDialog/TaskEditDialog'
import TaskFilters from '../../../src/components/todos/TaskFilters/TaskFilters'
import TaskTable from '../../../src/components/todos/TaskTable/TaskTable'
import { mockTaskList } from '../../fixtures/mockData'

describe('todo components unit', () => {
  it('renders TaskFilters and notifies filter changes', () => {
    const onStatusChange = vi.fn()

    render(<TaskFilters statusFilter="" onStatusChange={onStatusChange} />)

    fireEvent.mouseDown(screen.getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: 'Completed' }))

    expect(onStatusChange).toHaveBeenCalledWith('COMPLETED')
  })

  it('renders TaskEditDialog and handles actions', () => {
    const onInputChange = vi.fn()
    const onInputFocus = vi.fn()
    const onSave = vi.fn()
    const onCancel = vi.fn()

    render(
      <TaskEditDialog
        open={true}
        isShowHelperText={false}
        formData={INITIAL_EDIT_TASK_FORM_STATE('Fix bug', 'Add test')}
        isPending={false}
        onInputChange={onInputChange}
        onInputFocus={onInputFocus}
        onSave={onSave}
        onCancel={onCancel}
      />
    )

    fireEvent.change(screen.getByRole('textbox', { name: /title/i }), {
      target: { value: 'Fix bug fast' },
    })
    fireEvent.focus(screen.getByRole('textbox', { name: /title/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(onInputChange).toHaveBeenCalled()
    expect(onInputFocus).toHaveBeenCalledWith('title')
    expect(onSave).toHaveBeenCalled()
  })

  it('renders TaskTable and grid shell', () => {
    render(
      <TaskTable
        taskData={{
          data: mockTaskList,
          pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
        }}
        page={1}
        pageSize={10}
        onPaginationChange={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onMarkDone={vi.fn()}
      />
    )

    expect(screen.getByTestId('data-grid')).toBeInTheDocument()
  })
})
