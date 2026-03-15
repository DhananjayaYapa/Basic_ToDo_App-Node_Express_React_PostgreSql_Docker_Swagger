import React, { useState, useMemo } from 'react'
import {
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material'
import { useAllTasks, useUpdateTask, useDeleteTask, useMarkDone } from '../../hooks/useTasks'
import { PageHeader, LoadingOverlay } from '../../components/shared'
import { TaskFilters, TaskTable, TaskEditDialog } from '../../components/todos'
import {
  INITIAL_EDIT_TASK_FORM_STATE,
} from '../../utilities/models'
import type { Task, TaskQuery, EditTaskFormDto } from '../../utilities/models'
import { validateControlledFormData } from '../../utilities/helpers'

const ManageTodos: React.FC = () => {
  // ─── Query State ───────────────────────────────────────────────────────────
  const [query, setQuery] = useState<TaskQuery>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })
  const [statusFilter, setStatusFilter] = useState<string>('')

  const fullQuery = useMemo(
    () => ({ ...query, status: statusFilter || undefined }),
    [query, statusFilter]
  )

  // ─── Data Hooks ────────────────────────────────────────────────────────────
  const { data: taskData, isLoading } = useAllTasks(fullQuery)
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()
  const markDoneMutation = useMarkDone()

  // ─── Dialog State ──────────────────────────────────────────────────────────
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editFormData, setEditFormData] = useState<EditTaskFormDto>(INITIAL_EDIT_TASK_FORM_STATE())
  const [isShowEditHelperText, setIsShowEditHelperText] = useState(false)
  const [alert, setAlert] = useState<{ message: string; severity: 'success' | 'error' } | null>(
    null
  )

  // ─── Alert Helper ──────────────────────────────────────────────────────────
  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlert({ message, severity })
    setTimeout(() => setAlert(null), 3000)
  }

  // ─── Controlled Form Handlers ─────────────────────────────────────────────
  const handleEditInputChange = (property: string, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [property]: {
        ...prev[property as keyof EditTaskFormDto],
        value,
      },
    }))
  }

  const handleEditInputFocus = (property: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [property]: {
        ...prev[property as keyof EditTaskFormDto],
        error: null,
      },
    }))
  }

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setQuery((prev) => ({ ...prev, page: 1 }))
  }

  const handlePaginationChange = (page: number, pageSize: number) => {
    setQuery((prev) => ({ ...prev, page, limit: pageSize }))
  }

  const handleEditOpen = (task: Task) => {
    setSelectedTask(task)
    setEditFormData(INITIAL_EDIT_TASK_FORM_STATE(task.title, task.description || ''))
    setIsShowEditHelperText(false)
    setEditDialogOpen(true)
  }

  const handleEditSave = async () => {
    if (!selectedTask) return
    setIsShowEditHelperText(true)

    const [validatedData, isValid] = await validateControlledFormData(editFormData)
    setEditFormData(validatedData)

    if (!isValid) return

    try {
      await updateTaskMutation.mutateAsync({
        id: selectedTask.id,
        data: {
          title: editFormData.title.value.trim(),
          description: editFormData.description.value.trim() || null,
        },
      })
      setEditDialogOpen(false)
      showAlert('Task updated successfully', 'success')
    } catch {
      showAlert('Failed to update task', 'error')
    }
  }

  const handleDeleteOpen = (task: Task) => {
    setSelectedTask(task)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedTask) return
    try {
      await deleteTaskMutation.mutateAsync(selectedTask.id)
      setDeleteDialogOpen(false)
      showAlert('Task deleted successfully', 'success')
    } catch {
      showAlert('Failed to delete task', 'error')
    }
  }

  const handleMarkDone = async (id: number) => {
    try {
      await markDoneMutation.mutateAsync(id)
      showAlert('Task marked as completed', 'success')
    } catch {
      showAlert('Failed to mark task as done', 'error')
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ animation: 'fadeIn 0.3s ease' }}>
      <PageHeader title="Manage Todos" subtitle="View, edit, and manage all your tasks" />

      {alert && (
        <Alert severity={alert.severity} onClose={() => setAlert(null)} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      {/* Filters */}
      <TaskFilters statusFilter={statusFilter} onStatusChange={handleStatusFilterChange} />

      {/* Table */}
      <LoadingOverlay loading={isLoading}>
        <TaskTable
          taskData={taskData}
          page={query.page || 1}
          pageSize={query.limit || 10}
          onPaginationChange={handlePaginationChange}
          onEdit={handleEditOpen}
          onDelete={handleDeleteOpen}
          onMarkDone={handleMarkDone}
        />
      </LoadingOverlay>

      {/* Edit Dialog */}
      <TaskEditDialog
        open={editDialogOpen}
        isShowHelperText={isShowEditHelperText}
        formData={editFormData}
        isPending={updateTaskMutation.isPending}
        onInputChange={handleEditInputChange}
        onInputFocus={handleEditInputFocus}
        onSave={handleEditSave}
        onCancel={() => setEditDialogOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{selectedTask?.title}&quot;? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteTaskMutation.isPending}
          >
            {deleteTaskMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ManageTodos
