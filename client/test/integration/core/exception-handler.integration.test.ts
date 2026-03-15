import { describe, it, expect } from 'vitest'
import { exceptionHandler } from '../../../src/core/exceptionHandler'

describe('exceptionHandler integration', () => {
  it('maps known status errors and fallback', async () => {
    expect(await exceptionHandler({ status: 400, data: { message: 'Bad input' } })).toBe(
      'Bad input'
    )
    expect(await exceptionHandler({ status: 404, data: {} })).toBe('Resource Not Found')
    expect(await exceptionHandler({ status: 999, data: {} })).toBe('Oops! Something went wrong')
    expect(await exceptionHandler(null)).toBe('Oops! Something went wrong.')
  })
})
