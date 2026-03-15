import React, { useState, useMemo } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import type { SelectChangeEvent } from '@mui/material'
import {
  Assignment as TotalIcon,
  CheckCircle as CompletedIcon,
  PendingActions as PendingIcon,
  GetApp as ExportIcon,
} from '@mui/icons-material'
import { useAllTasks } from '../../hooks/useTasks'
import { useExport } from '../../hooks/useExport'
import { PageHeader, LoadingOverlay } from '../../components/shared'
import type { TaskQuery, Task } from '../../utilities/models'
import styles from './Reports.module.scss'

const Reports: React.FC = () => {
  const { exportCSV, exportJSON } = useExport()

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const query: TaskQuery = useMemo(
    () => ({
      status: statusFilter || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: page + 1,
      limit: rowsPerPage,
    }),
    [statusFilter, startDate, endDate, page, rowsPerPage]
  )

  const { data: taskData, isLoading } = useAllTasks(query)

  const tasks = taskData?.data || []
  const totalCount = taskData?.pagination?.total || 0

  // Stats
  const stats = useMemo(() => {
    return {
      total: totalCount,
      completed: tasks.filter((t: Task) => t.status === 'COMPLETED').length,
      pending: tasks.filter((t: Task) => t.status === 'PENDING').length,
    }
  }, [tasks, totalCount])

  // Export handlers
  const handleExportCSV = () => {
    exportCSV({
      status: statusFilter || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
  }

  const handleExportJSON = () => {
    exportJSON({
      status: statusFilter || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
  }

  return (
    <Box className={styles.reportsPage}>
      <PageHeader title="Reports" subtitle="Export and analyze your task data" />

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e: SelectChangeEvent) => {
                setStatusFilter(e.target.value)
                setPage(0)
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value)
              setPage(0)
            }}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            size="small"
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value)
              setPage(0)
            }}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ExportIcon />}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ExportIcon />}
              onClick={handleExportJSON}
            >
              Export JSON
            </Button>
          </Box>
        </CardContent>
      </Card>

      <LoadingOverlay loading={isLoading}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Tasks
                    </Typography>
                    <Typography variant="h5" fontWeight={600} color="#3b82f6">
                      {stats.total}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: 'rgba(59,130,246,0.15)',
                      color: '#3b82f6',
                    }}
                  >
                    <TotalIcon fontSize="large" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                    <Typography variant="h5" fontWeight={600} color="#22c55e">
                      {stats.completed}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: 'rgba(34,197,94,0.15)',
                      color: '#22c55e',
                    }}
                  >
                    <CompletedIcon fontSize="large" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Pending
                    </Typography>
                    <Typography variant="h5" fontWeight={600} color="#f59e0b">
                      {stats.pending}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: 'rgba(245,158,11,0.15)',
                      color: '#f59e0b',
                    }}
                  >
                    <PendingIcon fontSize="large" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Summary */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Showing {tasks.length} of {totalCount} tasks
        </Typography>

        {/* Task Report Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Completed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task: Task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{ maxWidth: 300 }}
                      >
                        {task.description || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.status === 'COMPLETED' ? 'Completed' : 'Pending'}
                        size="small"
                        sx={{
                          bgcolor:
                            task.status === 'COMPLETED'
                              ? 'rgba(34,197,94,0.15)'
                              : 'rgba(245,158,11,0.15)',
                          color: task.status === 'COMPLETED' ? '#22c55e' : '#f59e0b',
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(task.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      {task.completedAt
                        ? new Date(task.completedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                        : '—'}
                    </TableCell>
                  </TableRow>
                ))}
                {tasks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No tasks found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Card>
      </LoadingOverlay>
    </Box>
  )
}

export default Reports
