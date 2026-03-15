import { beforeEach, describe, it, expect, vi } from 'vitest'

const rootMocks = vi.hoisted(() => ({
  renderMock: vi.fn(),
  createRootMock: vi.fn(() => ({ render: vi.fn() })),
}))

rootMocks.createRootMock.mockImplementation(() => ({ render: rootMocks.renderMock }))

vi.mock('react-dom/client', () => ({
  createRoot: rootMocks.createRootMock,
}))

describe('index bootstrap integration', () => {
  beforeEach(() => {
    vi.resetModules()
    rootMocks.renderMock.mockClear()
    rootMocks.createRootMock.mockClear()
    document.body.innerHTML = '<div id="root"></div>'
  })

  it('mounts application tree with createRoot', async () => {
    await import('../../../src/index.tsx')

    expect(rootMocks.createRootMock).toHaveBeenCalledWith(document.getElementById('root'))
    expect(rootMocks.renderMock).toHaveBeenCalled()
  }, 20000)
})
