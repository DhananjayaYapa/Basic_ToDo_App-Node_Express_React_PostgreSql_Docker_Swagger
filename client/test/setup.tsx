import React from 'react'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll, vi } from 'vitest'

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  vi.stubGlobal('ResizeObserver', ResizeObserverMock)
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  localStorage.clear()
})

afterAll(() => {
  vi.unstubAllGlobals()
})

vi.mock('react-loaders', () => ({
  Loader: () => null,
}))

vi.mock('recharts', () => {
  const MockContainer = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>
  return {
    ResponsiveContainer: MockContainer,
    PieChart: MockContainer,
    Pie: MockContainer,
    Cell: MockContainer,
    Tooltip: MockContainer,
    Legend: MockContainer,
    BarChart: MockContainer,
    Bar: MockContainer,
    XAxis: MockContainer,
    YAxis: MockContainer,
    CartesianGrid: MockContainer,
  }
})

vi.mock('@mui/x-data-grid', () => ({
  DataGrid: () => <div data-testid="data-grid" />,
}))
