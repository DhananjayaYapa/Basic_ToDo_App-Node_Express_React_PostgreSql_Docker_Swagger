import { describe, it, expect, vi } from 'vitest'
import {
  isEmpty,
  validateFormData,
  validationRules,
} from '../../../src/utilities/helpers/formValidator'

describe('formValidator integration', () => {
  it('validates empty checks and rule metadata', () => {
    expect(isEmpty('')).toBe(true)
    expect(isEmpty('value')).toBe(false)
    expect(validationRules.email.required).toBe('Email is required')
  })

  it('executes validateFormData and sets field errors', () => {
    const setError = vi.fn()
    const isValid = validateFormData({ name: '' }, setError, {
      name: (value) => (!value ? 'Name is required' : null),
    })

    expect(isValid).toBe(false)
    expect(setError).toHaveBeenCalled()
  })
})
