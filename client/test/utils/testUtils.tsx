import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { render, type RenderOptions } from '@testing-library/react'

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

interface WrapperProps {
  children: React.ReactNode
  initialEntries?: string[]
}

export const AppTestWrapper: React.FC<WrapperProps> = ({ children, initialEntries = ['/'] }) => {
  const queryClient = createTestQueryClient()

  return (
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  )
}

export const renderWithApp = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { initialEntries?: string[] }
) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <AppTestWrapper initialEntries={options?.initialEntries}>{children}</AppTestWrapper>
    ),
    ...options,
  })
}
