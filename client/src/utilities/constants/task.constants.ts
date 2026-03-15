// Task Status
export const TASK_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
} as const

export type TaskStatusType = (typeof TASK_STATUS)[keyof typeof TASK_STATUS]

// Task Status Options for dropdowns
export const TASK_STATUS_OPTIONS = [
  { value: TASK_STATUS.PENDING, label: 'Pending' },
  { value: TASK_STATUS.COMPLETED, label: 'Completed' },
]

// Chart colors
export const CHART_COLORS = {
  pending: '#f59e0b',
  completed: '#22c55e',
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  palette: [
    '#22c55e',
    '#3b82f6',
    '#8b5cf6',
    '#f59e0b',
    '#ef4444',
    '#06b6d4',
    '#ec4899',
    '#84cc16',
    '#f97316',
    '#6366f1',
  ],
}

// Export formats
export const EXPORT_FORMAT = {
  CSV: 'csv',
  JSON: 'json',
} as const

export type ExportFormat = (typeof EXPORT_FORMAT)[keyof typeof EXPORT_FORMAT]
