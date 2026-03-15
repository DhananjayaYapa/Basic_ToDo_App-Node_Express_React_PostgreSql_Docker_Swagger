import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useDashboardSummary,
  useTasksByDay,
  useCompletionOverTime,
  useStatusBreakdown,
} from '../../../src/hooks/useDashboard'

vi.mock('../../../src/services/dashboard.service', () => ({
  dashboardService: {
    getSummary: vi
      .fn()
      .mockResolvedValue({ total: 1, completed: 0, pending: 1, completionRate: 0 }),
    getTasksByDay: vi.fn().mockResolvedValue([{ date: '2026-03-10', count: 2 }]),
    getCompletionOverTime: vi.fn().mockResolvedValue([{ date: '2026-03-10', count: 1 }]),
    getStatusBreakdown: vi.fn().mockResolvedValue([{ status: 'PENDING', count: 1 }]),
  },
}))

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useDashboard hooks integration', () => {
  it('resolves dashboard data hooks', async () => {
    const summary = renderHook(() => useDashboardSummary(), { wrapper })
    const byDay = renderHook(() => useTasksByDay({ days: 7 }), { wrapper })
    const completion = renderHook(() => useCompletionOverTime({ days: 7 }), { wrapper })
    const status = renderHook(() => useStatusBreakdown(), { wrapper })

    await waitFor(() => {
      expect(summary.result.current.data?.total).toBe(1)
      expect(byDay.result.current.data?.[0].count).toBe(2)
      expect(completion.result.current.data?.[0].count).toBe(1)
      expect(status.result.current.data?.[0].status).toBe('PENDING')
    })
  })
})
