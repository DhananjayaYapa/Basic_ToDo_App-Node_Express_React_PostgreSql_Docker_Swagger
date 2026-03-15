import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useRecentTasks,
  useAllTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useMarkDone,
} from '../../../src/hooks/useTasks'

const taskServiceMocks = vi.hoisted(() => ({
  createTaskMock: vi.fn().mockResolvedValue({ id: 1 }),
  updateTaskMock: vi.fn().mockResolvedValue({ id: 1 }),
  deleteTaskMock: vi.fn().mockResolvedValue(undefined),
  markDoneMock: vi.fn().mockResolvedValue({ id: 1, status: 'COMPLETED' }),
  getRecentTasksMock: vi.fn().mockResolvedValue([]),
  getAllTasksMock: vi
    .fn()
    .mockResolvedValue({ data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } }),
}))

vi.mock('../../../src/services/task.service', () => ({
  taskService: {
    getRecentTasks: taskServiceMocks.getRecentTasksMock,
    getAllTasks: taskServiceMocks.getAllTasksMock,
    createTask: taskServiceMocks.createTaskMock,
    updateTask: taskServiceMocks.updateTaskMock,
    deleteTask: taskServiceMocks.deleteTaskMock,
    markDone: taskServiceMocks.markDoneMock,
  },
}))

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useTasks hooks integration', () => {
  it('resolves query hooks and mutation hooks', async () => {
    const recent = renderHook(() => useRecentTasks(), { wrapper })
    const list = renderHook(() => useAllTasks({ page: 1, limit: 10 }), { wrapper })
    const create = renderHook(() => useCreateTask(), { wrapper })
    const update = renderHook(() => useUpdateTask(), { wrapper })
    const remove = renderHook(() => useDeleteTask(), { wrapper })
    const done = renderHook(() => useMarkDone(), { wrapper })

    await waitFor(() => {
      expect(recent.result.current.isSuccess).toBe(true)
      expect(list.result.current.isSuccess).toBe(true)
    })

    await create.result.current.mutateAsync({ title: 'Task A' })
    await update.result.current.mutateAsync({ id: 1, data: { title: 'Task B' } })
    await remove.result.current.mutateAsync(1)
    await done.result.current.mutateAsync(1)

    expect(taskServiceMocks.createTaskMock).toHaveBeenCalled()
    expect(taskServiceMocks.updateTaskMock).toHaveBeenCalled()
    expect(taskServiceMocks.deleteTaskMock).toHaveBeenCalledWith(1)
    expect(taskServiceMocks.markDoneMock).toHaveBeenCalledWith(1)
  })
})
