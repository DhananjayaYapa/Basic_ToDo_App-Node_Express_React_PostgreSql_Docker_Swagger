import { describe, it, expect, vi, beforeEach } from 'vitest'
import { taskService } from '../../../src/services/task.service'

const serviceMocks = vi.hoisted(() => ({
  getMock: vi.fn(),
  postMock: vi.fn(),
  putMock: vi.fn(),
  deleteMock: vi.fn(),
  patchMock: vi.fn(),
}))

vi.mock('../../../src/services/index', () => ({
  axiosPrivateInstance: {
    get: serviceMocks.getMock,
    post: serviceMocks.postMock,
    put: serviceMocks.putMock,
    delete: serviceMocks.deleteMock,
    patch: serviceMocks.patchMock,
  },
}))

describe('taskService integration', () => {
  beforeEach(() => {
    serviceMocks.getMock.mockResolvedValue({
      data: { data: { tasks: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } } },
    })
    serviceMocks.postMock.mockResolvedValue({ data: { data: { id: 1, title: 'Task A' } } })
    serviceMocks.putMock.mockResolvedValue({ data: { data: { id: 1, title: 'Task B' } } })
    serviceMocks.deleteMock.mockResolvedValue({})
    serviceMocks.patchMock.mockResolvedValue({ data: { data: { id: 1, status: 'COMPLETED' } } })
  })

  it('handles query and CRUD/export operations', async () => {
    serviceMocks.getMock.mockResolvedValueOnce({ data: { data: [] } })
    await taskService.getRecentTasks()

    serviceMocks.getMock.mockResolvedValueOnce({
      data: { data: { tasks: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } } },
    })
    const all = await taskService.getAllTasks({ page: 1, limit: 10, status: 'PENDING' })
    expect(all.pagination.total).toBe(0)

    await taskService.createTask({ title: 'X' })
    await taskService.updateTask(1, { title: 'Y' })
    await taskService.deleteTask(1)
    await taskService.markDone(1)

    serviceMocks.getMock.mockResolvedValueOnce({ data: 'a,b\n1,2' })
    const csv = await taskService.exportCSV({ status: 'PENDING' })
    expect(csv).toContain('a,b')

    serviceMocks.getMock.mockResolvedValueOnce({ data: { data: [{ id: 1 }] } })
    const json = await taskService.exportJSON({ status: 'COMPLETED' })
    expect(json).toEqual({ data: [{ id: 1 }] })

    expect(serviceMocks.postMock).toHaveBeenCalled()
    expect(serviceMocks.putMock).toHaveBeenCalled()
    expect(serviceMocks.deleteMock).toHaveBeenCalledWith(expect.stringContaining('/tasks/1'))
    expect(serviceMocks.patchMock).toHaveBeenCalledWith(expect.stringContaining('/tasks/1/done'))
  })
})
