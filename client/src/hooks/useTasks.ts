import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskService } from '../services/task.service'
import { dashboardKeys } from './useDashboard'
import type { CreateTaskInput, UpdateTaskInput, TaskQuery } from '../utilities/models'

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (query: TaskQuery) => [...taskKeys.lists(), query] as const,
  recent: () => [...taskKeys.all, 'recent'] as const,
  detail: (id: number) => [...taskKeys.all, 'detail', id] as const,
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const useRecentTasks = () => {
  return useQuery({
    queryKey: taskKeys.recent(),
    queryFn: taskService.getRecentTasks,
  })
}

export const useAllTasks = (query: TaskQuery) => {
  return useQuery({
    queryKey: taskKeys.list(query),
    queryFn: () => taskService.getAllTasks(query),
  })
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTaskInput) => taskService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskInput }) =>
      taskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
  })
}

export const useMarkDone = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => taskService.markDone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
  })
}
