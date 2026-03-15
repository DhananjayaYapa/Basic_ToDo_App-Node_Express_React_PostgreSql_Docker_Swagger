import React from 'react'
import { Box, Card, Typography, Chip, IconButton } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as DoneIcon,
} from '@mui/icons-material'
import { TASK_STATUS } from '../../../utilities/constants'
import type { Task, PaginatedResponse } from '../../../utilities/models'

interface TaskTableProps {
  taskData: PaginatedResponse<Task> | undefined
  page: number
  pageSize: number
  onPaginationChange: (page: number, pageSize: number) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onMarkDone: (id: number) => void
}

const TaskTable: React.FC<TaskTableProps> = ({
  taskData,
  page,
  pageSize,
  onPaginationChange,
  onEdit,
  onDelete,
  onMarkDone,
}) => {
  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1.5,
      minWidth: 250,
      renderCell: (params) => (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {params.value || '—'}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value === 'COMPLETED' ? 'Completed' : 'Pending'}
          size="small"
          sx={{
            bgcolor:
              params.value === 'COMPLETED'
                ? 'rgba(34, 197, 94, 0.15)'
                : 'rgba(245, 158, 11, 0.15)',
            color: params.value === 'COMPLETED' ? '#22c55e' : '#f59e0b',
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 160,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(params.value).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 160,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {params.row.status === TASK_STATUS.PENDING && (
            <IconButton
              size="small"
              color="success"
              onClick={() => onMarkDone(params.row.id)}
              title="Mark as done"
            >
              <DoneIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit(params.row as Task)}
            title="Edit"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(params.row as Task)}
            title="Delete"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ]

  const rows = taskData?.data || []
  const totalRows = taskData?.pagination?.total || 0

  return (
    <Card>
      <DataGrid
        rows={rows}
        columns={columns}
        rowCount={totalRows}
        pageSizeOptions={[5, 10, 25]}
        paginationModel={{ page: page - 1, pageSize }}
        onPaginationModelChange={(model) => onPaginationChange(model.page + 1, model.pageSize)}
        paginationMode="server"
        disableRowSelectionOnClick
        autoHeight
        sx={{
          border: 'none',
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          },
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: 'rgba(255,255,255,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
    </Card>
  )
}

export default TaskTable
