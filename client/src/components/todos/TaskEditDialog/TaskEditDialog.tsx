import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material'
import type { EditTaskFormDto } from '../../../utilities/models'

interface TaskEditDialogProps {
  open: boolean
  isShowHelperText: boolean
  formData: EditTaskFormDto
  isPending: boolean
  onInputChange: (property: string, value: string) => void
  onInputFocus: (property: string) => void
  onSave: () => void
  onCancel: () => void
}

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({
  open,
  isShowHelperText,
  formData,
  isPending,
  onInputChange,
  onInputFocus,
  onSave,
  onCancel,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave()
  }

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Title"
            value={formData.title.value}
            onChange={(e) => onInputChange('title', e.target.value)}
            onFocus={() => onInputFocus('title')}
            error={isShowHelperText && !!formData.title.error}
            helperText={isShowHelperText && formData.title.error ? formData.title.error : ''}
            required={formData.title.isRequired}
            disabled={formData.title.disable || isPending}
            margin="normal"
            size="small"
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description.value}
            onChange={(e) => onInputChange('description', e.target.value)}
            onFocus={() => onInputFocus('description')}
            error={isShowHelperText && !!formData.description.error}
            helperText={
              isShowHelperText && formData.description.error ? formData.description.error : ''
            }
            required={formData.description.isRequired}
            disabled={formData.description.disable || isPending}
            margin="normal"
            size="small"
            multiline
            rows={3}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onSave} variant="contained" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TaskEditDialog
