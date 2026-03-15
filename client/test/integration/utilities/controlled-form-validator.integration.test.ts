import { describe, it, expect } from 'vitest'
import {
  clearFieldError,
  resetFormData,
  updateFieldValue,
  validateControlledFormData,
} from '../../../src/utilities/helpers/controlledFormValidator'

describe('controlledFormValidator integration', () => {
  it('validates controlled forms and utility helpers', async () => {
    const formData = {
      email: { value: '', validator: 'email', isRequired: true, error: null, disable: false },
      newPassword: {
        value: 'abcdef',
        validator: 'password',
        isRequired: true,
        error: null,
        disable: false,
      },
      confirmPassword: {
        value: 'abcdef',
        validator: 'confirmPassword',
        isRequired: true,
        error: null,
        disable: false,
      },
    }

    const [validatedData, isValid] = await validateControlledFormData(formData)
    expect(isValid).toBe(false)
    expect(validatedData.email.error).toBe('Email is required.')

    const updated = updateFieldValue(formData, 'email', 'qa@example.com')
    expect(updated.email.value).toBe('qa@example.com')

    const cleared = clearFieldError(
      { ...updated, email: { ...updated.email, error: 'x' } },
      'email'
    )
    expect(cleared.email.error).toBeNull()

    const reset = resetFormData(formData)
    expect(reset).toEqual(formData)
  })
})
