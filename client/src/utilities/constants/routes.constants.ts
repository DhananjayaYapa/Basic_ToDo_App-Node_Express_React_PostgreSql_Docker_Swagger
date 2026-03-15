// API Routes - matching backend endpoints
export const API_ROUTES = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/auth/profile',
  CHANGE_PASSWORD: '/auth/change-password',

  // Tasks
  TASKS: '/tasks',
  TASKS_RECENT: '/tasks/recent',
  TASK_BY_ID: (id: number) => `/tasks/${id}`,
  TASK_DONE: (id: number) => `/tasks/${id}/done`,
  TASKS_EXPORT_CSV: '/tasks/export/csv',
  TASKS_EXPORT_JSON: '/tasks/export/json',

  // Dashboard
  DASHBOARD_SUMMARY: '/dashboard/summary',
  DASHBOARD_TASKS_BY_DAY: '/dashboard/tasks-by-day',
  DASHBOARD_COMPLETION: '/dashboard/completion-over-time',
  DASHBOARD_STATUS: '/dashboard/status-breakdown',
}

// Application Routes
export const APP_ROUTES = {
  // Public
  LOGIN: '/login',
  REGISTER: '/register',

  // Private
  DASHBOARD: '/',
  MANAGE_TODOS: '/manage-todos',
  REPORTS: '/reports',
  PROFILE: '/profile',
}
