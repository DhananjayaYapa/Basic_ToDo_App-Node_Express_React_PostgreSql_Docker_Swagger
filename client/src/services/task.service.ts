import { axiosPrivateInstance } from './index'
import { API_ROUTES } from '../utilities/constants'
import type {
  ApiResponseDto,
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskQuery,
  PaginatedResponse,
} from '../utilities/models'

// ─── Task Service ────────────────────────────────────────────────────────────

const getRecentTasks = async (): Promise<Task[]> => {
  const response = await axiosPrivateInstance.get<ApiResponseDto<Task[]>>(API_ROUTES.TASKS_RECENT)
  return response.data.data
}

const getAllTasks = async (query: TaskQuery): Promise<PaginatedResponse<Task>> => {
  const params = new URLSearchParams()
  if (query.status) params.append('status', query.status)
  if (query.startDate) params.append('startDate', query.startDate)
  if (query.endDate) params.append('endDate', query.endDate)
  if (query.sortBy) params.append('sortBy', query.sortBy)
  if (query.sortOrder) params.append('sortOrder', query.sortOrder)
  if (query.page) params.append('page', String(query.page))
  if (query.limit) params.append('limit', String(query.limit))

  const response = await axiosPrivateInstance.get<
    ApiResponseDto<{ tasks: Task[]; pagination: PaginatedResponse<Task>['pagination'] }>
  >(`${API_ROUTES.TASKS}?${params.toString()}`)

  return {
    data: response.data.data.tasks,
    pagination: response.data.data.pagination,
  }
}

const createTask = async (data: CreateTaskInput): Promise<Task> => {
  const response = await axiosPrivateInstance.post<ApiResponseDto<Task>>(API_ROUTES.TASKS, data)
  return response.data.data
}

const updateTask = async (id: number, data: UpdateTaskInput): Promise<Task> => {
  const response = await axiosPrivateInstance.put<ApiResponseDto<Task>>(
    API_ROUTES.TASK_BY_ID(id),
    data
  )
  return response.data.data
}

const deleteTask = async (id: number): Promise<void> => {
  await axiosPrivateInstance.delete(API_ROUTES.TASK_BY_ID(id))
}

const markDone = async (id: number): Promise<Task> => {
  const response = await axiosPrivateInstance.patch<ApiResponseDto<Task>>(
    API_ROUTES.TASK_DONE(id)
  )
  return response.data.data
}

const exportCSV = async (query?: TaskQuery): Promise<string> => {
  const params = new URLSearchParams()
  if (query?.status) params.append('status', query.status)
  if (query?.startDate) params.append('startDate', query.startDate)
  if (query?.endDate) params.append('endDate', query.endDate)

  const response = await axiosPrivateInstance.get(
    `${API_ROUTES.TASKS_EXPORT_CSV}?${params.toString()}`,
    { responseType: 'text' }
  )
  return response.data
}

const exportJSON = async (query?: TaskQuery): Promise<unknown> => {
  const params = new URLSearchParams()
  if (query?.status) params.append('status', query.status)
  if (query?.startDate) params.append('startDate', query.startDate)
  if (query?.endDate) params.append('endDate', query.endDate)

  const response = await axiosPrivateInstance.get(
    `${API_ROUTES.TASKS_EXPORT_JSON}?${params.toString()}`
  )
  return response.data
}

export const taskService = {
  getRecentTasks,
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  markDone,
  exportCSV,
  exportJSON,
}
