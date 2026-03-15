import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboard.service'
import type { DashboardQuery } from '../utilities/models'

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
  tasksByDay: (query: DashboardQuery) => [...dashboardKeys.all, 'tasks-by-day', query] as const,
  completionOverTime: (query: DashboardQuery) =>
    [...dashboardKeys.all, 'completion-over-time', query] as const,
  statusBreakdown: () => [...dashboardKeys.all, 'status-breakdown'] as const,
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: dashboardService.getSummary,
  })
}

export const useTasksByDay = (query: DashboardQuery = { days: 30 }) => {
  return useQuery({
    queryKey: dashboardKeys.tasksByDay(query),
    queryFn: () => dashboardService.getTasksByDay(query),
  })
}

export const useCompletionOverTime = (query: DashboardQuery = { days: 30 }) => {
  return useQuery({
    queryKey: dashboardKeys.completionOverTime(query),
    queryFn: () => dashboardService.getCompletionOverTime(query),
  })
}

export const useStatusBreakdown = () => {
  return useQuery({
    queryKey: dashboardKeys.statusBreakdown(),
    queryFn: dashboardService.getStatusBreakdown,
  })
}
