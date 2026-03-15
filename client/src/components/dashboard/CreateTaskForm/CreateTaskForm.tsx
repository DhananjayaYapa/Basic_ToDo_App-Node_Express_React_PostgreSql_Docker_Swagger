import React from 'react'
import { Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import type { CreateTaskFormDto } from '../../../utilities/models'

interface CreateTaskFormProps {
  isShowHelperText: boolean
  formData: CreateTaskFormDto
  isPending: boolean
  successMsg: string
  formError: string
  onInputChange: (property: string, value: string) => void
  onInputFocus: (property: string) => void
  onSubmit: (e: React.FormEvent) => void
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  isShowHelperText,
  formData,
  isPending,
  successMsg,
  formError,
  onInputChange,
  onInputFocus,
  onSubmit,
}) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        <AddIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Create New Task
      </Typography>

      {formError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      )}
      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}

      <form onSubmit={onSubmit} noValidate>
        <TextField
          fullWidth
          label="Task Title"
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
          label="Description (optional)"
          value={formData.description.value}
          onChange={(e) => onInputChange('description', e.target.value)}
          onFocus={() => onInputFocus('description')}
          error={isShowHelperText && !!formData.description.error}
          helperText={
            isShowHelperText && formData.description.error ? formData.description.error : ''
          }
          disabled={formData.description.disable || isPending}
          margin="normal"
          size="small"
          multiline
          rows={3}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={isPending}
          startIcon={<AddIcon />}
        >
          {isPending ? 'Creating...' : 'Add Task'}
        </Button>
      </form>
    </CardContent>
  </Card>
)

export default CreateTaskForm
