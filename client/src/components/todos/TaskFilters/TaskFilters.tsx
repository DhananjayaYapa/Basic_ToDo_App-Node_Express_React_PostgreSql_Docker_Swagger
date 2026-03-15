import React from 'react'
import { Card, CardContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'

interface TaskFiltersProps {
  statusFilter: string
  onStatusChange: (value: string) => void
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ statusFilter, onStatusChange }) => (
  <Card sx={{ mb: 3 }}>
    <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          label="Status"
          onChange={(e: SelectChangeEvent) => onStatusChange(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="COMPLETED">Completed</MenuItem>
        </Select>
      </FormControl>
    </CardContent>
  </Card>
)

export default TaskFilters
