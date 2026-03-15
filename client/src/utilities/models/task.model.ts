// ─── Task Model ──────────────────────────────────────────────────────────────

export interface Task {
  id: number
  title: string
  description: string | null
  status: 'PENDING' | 'COMPLETED'
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

// ─── Task Input DTOs ─────────────────────────────────────────────────────────

export interface CreateTaskInput {
  title: string
  description: string
}

export interface UpdateTaskInput {
  title?: string
  description: string
}

// ─── Task Query ──────────────────────────────────────────────────────────────

export interface TaskQuery {
  status?: string
  startDate?: string
  endDate?: string
  sortBy?: string
  sortOrder?: string
  page?: number
  limit?: number
}

// ─── Dashboard Models ────────────────────────────────────────────────────────

export interface DashboardSummary {
  total: number
  completed: number
  pending: number
  completionRate: number
}

export interface TasksByDayItem {
  date: string
  count: number
}

export interface StatusBreakdownItem {
  status: string
  count: number
}

export interface DashboardQuery {
  days?: number
  startDate?: string
  endDate?: string
}

// ============================================
// CONTROLLED FORM DTOs (Athena Pattern)
// ============================================

// Create Task Form DTO
export interface CreateTaskFormDto {
  title: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  description: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
}

// Edit Task Form DTO
export interface EditTaskFormDto {
  title: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  description: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
}

// Login Form DTO
export interface LoginFormDto {
  email: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  password: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
}

// Register Form DTO
export interface RegisterFormDto {
  name: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  email: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  password: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  confirmPassword: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
}

// ─── Initial States ──────────────────────────────────────────────────────────

export const INITIAL_CREATE_TASK_FORM_STATE = (): CreateTaskFormDto => ({
  title: {
    value: '',
    validator: 'text',
    isRequired: true,
    error: null,
    disable: false,
  },
  description: {
    value: '',
    validator: 'text',
    isRequired: true,
    error: null,
    disable: false,
  },
})

export const INITIAL_EDIT_TASK_FORM_STATE = (
  title: string = '',
  description: string = ''
): EditTaskFormDto => ({
  title: {
    value: title,
    validator: 'text',
    isRequired: true,
    error: null,
    disable: false,
  },
  description: {
    value: description,
    validator: 'text',
    isRequired: true,
    error: null,
    disable: false,
  },
})

export const INITIAL_LOGIN_FORM_STATE = (): LoginFormDto => ({
  email: {
    value: '',
    validator: 'email',
    isRequired: true,
    error: null,
    disable: false,
  },
  password: {
    value: '',
    validator: 'text',
    isRequired: true,
    error: null,
    disable: false,
  },
})

export const INITIAL_REGISTER_FORM_STATE = (): RegisterFormDto => ({
  name: {
    value: '',
    validator: 'text',
    isRequired: true,
    error: null,
    disable: false,
  },
  email: {
    value: '',
    validator: 'email',
    isRequired: true,
    error: null,
    disable: false,
  },
  password: {
    value: '',
    validator: 'password',
    isRequired: true,
    error: null,
    disable: false,
  },
  confirmPassword: {
    value: '',
    validator: 'confirmPassword',
    isRequired: true,
    error: null,
    disable: false,
  },
})
