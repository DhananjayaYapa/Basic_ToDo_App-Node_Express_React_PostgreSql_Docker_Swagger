import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material'

export type ConfirmationDialogType = 'task'

interface ConfirmationDialogProps {
  open: boolean
  type: ConfirmationDialogType
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

const DIALOG_CONFIG: Record<
  ConfirmationDialogType,
  { title: string; message: string; confirmLabel: string }
> = {
  task: {
    title: 'Delete Task',
    message: 'Are you sure you want to delete this task? This action cannot be undone.',
    confirmLabel: 'Delete',
  },
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  type,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const config = DIALOG_CONFIG[type]

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{config.title}</DialogTitle>
      <DialogContent>
        <Typography>{config.message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={isLoading}>
          {config.confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
