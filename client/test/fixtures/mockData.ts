import type { Task, User } from '../../src/utilities/models'

export const mockUser: User = {
  userId: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
}

export const mockTask: Task = {
  id: 1,
  title: 'Ship tests',
  description: 'Create robust test coverage',
  status: 'PENDING',
  completedAt: null,
  createdAt: '2026-03-10T10:00:00.000Z',
  updatedAt: '2026-03-10T10:00:00.000Z',
}

export const mockTaskList: Task[] = [
  mockTask,
  {
    id: 2,
    title: 'Review pull request',
    description: null,
    status: 'COMPLETED',
    completedAt: '2026-03-11T10:00:00.000Z',
    createdAt: '2026-03-10T12:00:00.000Z',
    updatedAt: '2026-03-11T10:00:00.000Z',
  },
]
