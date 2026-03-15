import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '../../../src/services/auth.service'

const serviceMocks = vi.hoisted(() => ({
  postMock: vi.fn(),
  getMock: vi.fn(),
  putMock: vi.fn(),
}))

vi.mock('../../../src/services/index', () => ({
  axiosPublicInstance: { post: serviceMocks.postMock },
  axiosPrivateInstance: { get: serviceMocks.getMock, put: serviceMocks.putMock },
}))

describe('authService integration', () => {
  beforeEach(() => {
    serviceMocks.postMock.mockResolvedValue({ data: { data: {} } })
    serviceMocks.getMock.mockResolvedValue({ data: { data: {} } })
    serviceMocks.putMock.mockResolvedValue({ data: { data: {} } })
  })

  it('calls auth endpoints and localStorage helpers', async () => {
    await authService.login({ email: 'e@e.com', password: 'secret' })
    await authService.register({ name: 'R', email: 'e@e.com', password: 'secret' })
    await authService.getProfile()
    await authService.updateProfile({ name: 'R', email: 'e@e.com' })
    await authService.changePassword({ currentPassword: 'old123', newPassword: 'new123' })

    await authService.setToken('token-1')
    expect(authService.getToken()).toBe('token-1')
    expect(authService.isAuthenticated()).toBe(true)
    await authService.logout()
    expect(authService.isAuthenticated()).toBe(false)

    expect(serviceMocks.postMock).toHaveBeenCalledTimes(2)
    expect(serviceMocks.getMock).toHaveBeenCalledTimes(1)
    expect(serviceMocks.putMock).toHaveBeenCalledTimes(2)
  })
})
