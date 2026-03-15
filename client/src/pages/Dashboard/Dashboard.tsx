import React, { useState } from 'react'
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  Assignment as TotalIcon,
  CheckCircle as CompletedIcon,
  PendingActions as PendingIcon,
  TrendingUp as RateIcon,
} from '@mui/icons-material'
import { useAuth } from '../../hooks/useAuth'
import { useRecentTasks, useCreateTask } from '../../hooks/useTasks'
import { useDashboardSummary, useTasksByDay, useStatusBreakdown } from '../../hooks/useDashboard'
import { LoadingOverlay } from '../../components/shared'
import {
  WelcomeMessage,
  CreateTaskForm,
  RecentTaskCards,
  DashboardStatCards,
  TasksByDayChart,
  StatusPieChart,
} from '../../components/dashboard'
import {
  INITIAL_CREATE_TASK_FORM_STATE,
} from '../../utilities/models'
import type { CreateTaskFormDto, Task } from '../../utilities/models'
import { validateControlledFormData } from '../../utilities/helpers'
import styles from './Dashboard.module.scss'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const userName = user?.name || 'User'

  // ─── Data Hooks ────────────────────────────────────────────────────────────
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary()
  const { data: recentTasks, isLoading: recentLoading } = useRecentTasks()
  const { data: tasksByDay, isLoading: chartLoading } = useTasksByDay({ days: 30 })
  const { data: statusBreakdown } = useStatusBreakdown()
  const createTaskMutation = useCreateTask()

  // ─── Controlled Form State ────────────────────────────────────────────────
  const [formData, setFormData] = useState<CreateTaskFormDto>(INITIAL_CREATE_TASK_FORM_STATE())
  const [isShowHelperText, setIsShowHelperText] = useState(false)
  const [formError, setFormError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const isLoading = summaryLoading || recentLoading || chartLoading

  // ─── Form Handlers ─────────────────────────────────────────────────────────
  const handleInputChange = (property: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [property]: {
        ...prev[property as keyof CreateTaskFormDto],
        value,
      },
    }))
  }

  const handleInputFocus = (property: string) => {
    setFormData((prev) => ({
      ...prev,
      [property]: {
        ...prev[property as keyof CreateTaskFormDto],
        error: null,
      },
    }))
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsShowHelperText(true)
    setFormError('')
    setSuccessMsg('')

    const [validatedData, isValid] = await validateControlledFormData(formData)
    setFormData(validatedData)

    if (!isValid) return

    try {
      await createTaskMutation.mutateAsync({
        title: formData.title.value.trim(),
        description: formData.description.value.trim() || null,
      })
      setFormData(INITIAL_CREATE_TASK_FORM_STATE())
      setIsShowHelperText(false)
      setSuccessMsg('Task created successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch {
      setFormError('Failed to create task')
    }
  }

  // ─── Stats Config ──────────────────────────────────────────────────────────
  const stats = [
    {
      title: 'Total Tasks',
      value: summary?.total ?? 0,
      icon: <TotalIcon fontSize="large" />,
      color: '#3b82f6',
    },
    {
      title: 'Completed',
      value: summary?.completed ?? 0,
      icon: <CompletedIcon fontSize="large" />,
      color: '#22c55e',
    },
    {
      title: 'Pending',
      value: summary?.pending ?? 0,
      icon: <PendingIcon fontSize="large" />,
      color: '#f59e0b',
    },
    {
      title: 'Completion Rate',
      value: `${summary?.completionRate ?? 0}%`,
      icon: <RateIcon fontSize="large" />,
      color: '#8b5cf6',
    },
  ]

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <Box className={styles.dashboard}>
      <WelcomeMessage userName={userName} />

      <LoadingOverlay loading={isLoading} minHeight={200}>
        {/* Top Section: Create Form + Recent Tasks */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CreateTaskForm
              isShowHelperText={isShowHelperText}
              formData={formData}
              isPending={createTaskMutation.isPending}
              successMsg={successMsg}
              formError={formError}
              onInputChange={handleInputChange}
              onInputFocus={handleInputFocus}
              onSubmit={handleCreateTask}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <RecentTaskCards tasks={(recentTasks as Task[]) || []} />
          </Grid>
        </Grid>

        {/* Stats Cards */}
        <DashboardStatCards stats={stats} />

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <TasksByDayChart data={tasksByDay || []} />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <StatusPieChart data={statusBreakdown || []} />
          </Grid>
        </Grid>
      </LoadingOverlay>
    </Box>
  )
}

export default Dashboard
