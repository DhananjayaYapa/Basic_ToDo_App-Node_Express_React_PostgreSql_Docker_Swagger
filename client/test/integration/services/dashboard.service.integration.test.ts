import { describe, it, expect, vi, beforeEach } from 'vitest'
import { dashboardService } from '../../../src/services/dashboard.service'

const serviceMocks = vi.hoisted(() => ({
  getMock: vi.fn(),
}))

vi.mock('../../../src/services/index', () => ({
  axiosPrivateInstance: {
    get: serviceMocks.getMock,
  },
}))

describe('dashboardService integration', () => {
  beforeEach(() => {
    serviceMocks.getMock.mockReset()
  })

  it('fetches summary and chart datasets', async () => {
    serviceMocks.getMock
      .mockResolvedValueOnce({
        data: { data: { total: 1, completed: 0, pending: 1, completionRate: 0 } },
      })
      .mockResolvedValueOnce({ data: { data: [{ date: '2026-03-10', count: 2 }] } })
      .mockResolvedValueOnce({ data: { data: [{ date: '2026-03-10', count: 1 }] } })
      .mockResolvedValueOnce({ data: { data: [{ status: 'PENDING', count: 1 }] } })

    const summary = await dashboardService.getSummary()
    const byDay = await dashboardService.getTasksByDay({ days: 7 })
    const completion = await dashboardService.getCompletionOverTime({ days: 7 })
    const breakdown = await dashboardService.getStatusBreakdown()

    expect(summary.total).toBe(1)
    expect(byDay[0].count).toBe(2)
    expect(completion[0].count).toBe(1)
    expect(breakdown[0].status).toBe('PENDING')
  })
})
