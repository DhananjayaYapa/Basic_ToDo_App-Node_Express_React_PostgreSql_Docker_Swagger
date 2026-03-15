import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Add } from '@mui/icons-material'
import {
  INITIAL_CREATE_TASK_FORM_STATE,
  type StatusBreakdownItem,
  type TasksByDayItem,
} from '../../../src/utilities/models'
import CreateTaskForm from '../../../src/components/dashboard/CreateTaskForm/CreateTaskForm'
import DashboardStatCards from '../../../src/components/dashboard/DashboardStatCards/DashboardStatCards'
import RecentTaskCards from '../../../src/components/dashboard/RecentTaskCards/RecentTaskCards'
import StatCard from '../../../src/components/dashboard/StatCard/StatCard'
import StatusPieChart from '../../../src/components/dashboard/StatusPieChart/StatusPieChart'
import TasksByDayChart from '../../../src/components/dashboard/TasksByDayChart/TasksByDayChart'
import WelcomeMessage from '../../../src/components/dashboard/WelcomeMessage/WelcomeMessage'
import { mockTaskList } from '../../fixtures/mockData'

describe('dashboard components unit', () => {
  it('renders CreateTaskForm and triggers callbacks', () => {
    const onInputChange = vi.fn()
    const onInputFocus = vi.fn()
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault())

    render(
      <CreateTaskForm
        isShowHelperText={false}
        formData={INITIAL_CREATE_TASK_FORM_STATE()}
        isPending={false}
        successMsg=""
        formError=""
        onInputChange={onInputChange}
        onInputFocus={onInputFocus}
        onSubmit={onSubmit}
      />
    )

    fireEvent.change(screen.getByRole('textbox', { name: /task title/i }), {
      target: { value: 'Task A' },
    })
    fireEvent.focus(screen.getByRole('textbox', { name: /task title/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Add Task' }))

    expect(onInputChange).toHaveBeenCalled()
    expect(onInputFocus).toHaveBeenCalledWith('title')
    expect(onSubmit).toHaveBeenCalled()
  })

  it('renders stat cards variants', () => {
    render(
      <>
        <StatCard title="Total" amount={10} icon={<Add />} color="#3b82f6" />
        <DashboardStatCards
          stats={[
            { title: 'Total Tasks', value: 20, icon: <Add />, color: '#3b82f6' },
            { title: 'Pending', value: 5, icon: <Add />, color: '#f59e0b' },
          ]}
        />
      </>
    )

    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getByText('Total Tasks')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('renders recent tasks and no-data state', () => {
    const { rerender } = render(
      <MemoryRouter>
        <RecentTaskCards tasks={mockTaskList} />
      </MemoryRouter>
    )

    expect(screen.getByText('Recent Pending Tasks')).toBeInTheDocument()
    expect(screen.getByText('All Todos')).toBeInTheDocument()

    rerender(
      <MemoryRouter>
        <RecentTaskCards tasks={[]} />
      </MemoryRouter>
    )

    expect(screen.getByText('No pending tasks. Create one to get started!')).toBeInTheDocument()
  })

  it('renders chart wrappers and welcome message', () => {
    const statusData: StatusBreakdownItem[] = [
      { status: 'PENDING', count: 2 },
      { status: 'COMPLETED', count: 8 },
    ]
    const dayData: TasksByDayItem[] = [{ date: '2026-03-10', count: 3 }]

    render(
      <>
        <StatusPieChart data={statusData} />
        <TasksByDayChart data={dayData} />
        <WelcomeMessage userName="Priya" />
      </>
    )

    expect(screen.getByText('Status Breakdown')).toBeInTheDocument()
    expect(screen.getByText('Tasks Created (Last 30 Days)')).toBeInTheDocument()
    expect(screen.getByText('Welcome back, Priya!')).toBeInTheDocument()
  })
})
