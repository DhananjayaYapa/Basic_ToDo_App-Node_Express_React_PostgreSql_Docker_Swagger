import { axiosPrivateInstance } from './index'
import { API_ROUTES } from '../utilities/constants'
import type {
  ApiResponseDto,
  DashboardSummary,
  TasksByDayItem,
  StatusBreakdownItem,
  DashboardQuery,
} from '../utilities/models'

// ─── Dashboard Service ───────────────────────────────────────────────────────

const getSummary = async (): Promise<DashboardSummary> => {
  const response = await axiosPrivateInstance.get<ApiResponseDto<DashboardSummary>>(
    API_ROUTES.DASHBOARD_SUMMARY
  )
  return response.data.data
}

const getTasksByDay = async (query: DashboardQuery): Promise<TasksByDayItem[]> => {
  const params = new URLSearchParams()
  if (query.days) params.append('days', String(query.days))
  if (query.startDate) params.append('startDate', query.startDate)
  if (query.endDate) params.append('endDate', query.endDate)

  const response = await axiosPrivateInstance.get<ApiResponseDto<TasksByDayItem[]>>(
    `${API_ROUTES.DASHBOARD_TASKS_BY_DAY}?${params.toString()}`
  )
  return response.data.data
}

const getCompletionOverTime = async (query: DashboardQuery): Promise<TasksByDayItem[]> => {
  const params = new URLSearchParams()
  if (query.days) params.append('days', String(query.days))
  if (query.startDate) params.append('startDate', query.startDate)
  if (query.endDate) params.append('endDate', query.endDate)

  const response = await axiosPrivateInstance.get<ApiResponseDto<TasksByDayItem[]>>(
    `${API_ROUTES.DASHBOARD_COMPLETION}?${params.toString()}`
  )
  return response.data.data
}

const getStatusBreakdown = async (): Promise<StatusBreakdownItem[]> => {
  const response = await axiosPrivateInstance.get<ApiResponseDto<StatusBreakdownItem[]>>(
    API_ROUTES.DASHBOARD_STATUS
  )
  return response.data.data
}

export const dashboardService = {
  getSummary,
  getTasksByDay,
  getCompletionOverTime,
  getStatusBreakdown,
}
