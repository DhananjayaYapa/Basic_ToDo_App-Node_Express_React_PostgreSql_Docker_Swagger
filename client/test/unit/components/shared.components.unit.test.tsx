import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AlertSnackbar from '../../../src/components/shared/AlertSnackbar/AlertSnackbar'
import ConfirmationDialog from '../../../src/components/shared/ConfirmationDialog/ConfirmationDialog'
import LoadingOverlay from '../../../src/components/shared/LoadingOverlay/LoadingOverlay'
import PageHeader from '../../../src/components/shared/PageHeader/PageHeader'
import StatusChip from '../../../src/components/shared/StatusChip/StatusChip'

describe('shared components unit', () => {
  it('renders alert and dialog components', () => {
    const onClose = vi.fn()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    render(
      <>
        <AlertSnackbar
          open={true}
          message="Saved"
          severity="success"
          title="Done"
          onClose={onClose}
        />
        <ConfirmationDialog open={true} type="task" onConfirm={onConfirm} onCancel={onCancel} />
      </>
    )

    expect(screen.getByText('Saved')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onConfirm).toHaveBeenCalled()
  })

  it('renders loading overlay children and loading state', () => {
    const { rerender } = render(
      <LoadingOverlay loading={false}>
        <div>Visible content</div>
      </LoadingOverlay>
    )
    expect(screen.getByText('Visible content')).toBeInTheDocument()

    rerender(<LoadingOverlay loading={true} message="Loading data" />)
    expect(screen.getByText('Loading data')).toBeInTheDocument()
  })

  it('renders page header and status chip', () => {
    const onAction = vi.fn()

    render(
      <>
        <PageHeader
          title="Reports"
          subtitle="Export and inspect"
          actionLabel="Export"
          onAction={onAction}
        />
        <StatusChip status="warning" />
      </>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Export' }))
    expect(onAction).toHaveBeenCalled()
    expect(screen.getByText('Warning')).toBeInTheDocument()
  })
})
