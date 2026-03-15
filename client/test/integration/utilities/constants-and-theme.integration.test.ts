import { describe, it, expect } from 'vitest'
import {
  APP_NAME,
  TOKEN_KEY,
  APP_ROUTES,
  API_ROUTES,
  TASK_STATUS,
  CHART_COLORS,
} from '../../../src/utilities/constants'
import { glassSurface, theme } from '../../../src/assets/theme/theme'

describe('constants and theme integration', () => {
  it('exposes application constants used by app flows', () => {
    expect(APP_NAME).toBe('Todo App')
    expect(TOKEN_KEY).toBe('todo_token')
    expect(APP_ROUTES.LOGIN).toBe('/login')
    expect(API_ROUTES.TASK_BY_ID(1)).toBe('/tasks/1')
    expect(TASK_STATUS.COMPLETED).toBe('COMPLETED')
    expect(CHART_COLORS.primary).toBeTruthy()
  })

  it('builds theme and helper surface config', () => {
    expect(theme.palette.mode).toBe('dark')
    expect(theme.shape.borderRadius).toBe(12)
    expect(glassSurface.border).toContain('solid')
  })
})
