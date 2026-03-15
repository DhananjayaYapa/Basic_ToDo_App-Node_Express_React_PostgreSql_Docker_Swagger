import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useExport } from '../../../src/hooks/useExport'

const exportMocks = vi.hoisted(() => ({
  exportCSVMock: vi.fn().mockResolvedValue('a,b\n1,2'),
  exportJSONMock: vi.fn().mockResolvedValue({ data: [1, 2] }),
}))

vi.mock('../../../src/services/task.service', () => ({
  taskService: {
    exportCSV: exportMocks.exportCSVMock,
    exportJSON: exportMocks.exportJSONMock,
  },
}))

describe('useExport integration', () => {
  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
  })

  it('exports csv and json by triggering download flow', async () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild')
    const removeSpy = vi.spyOn(document.body, 'removeChild')

    const { exportCSV, exportJSON } = useExport()

    await exportCSV({ status: 'PENDING' })
    await exportJSON({ status: 'COMPLETED' })

    expect(exportMocks.exportCSVMock).toHaveBeenCalled()
    expect(exportMocks.exportJSONMock).toHaveBeenCalled()
    expect(appendSpy).toHaveBeenCalled()
    expect(removeSpy).toHaveBeenCalled()
  })
})
