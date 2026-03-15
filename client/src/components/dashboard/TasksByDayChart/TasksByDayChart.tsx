import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { CHART_COLORS } from '../../../utilities/constants'
import type { TasksByDayItem } from '../../../utilities/models'

interface TasksByDayChartProps {
  data: TasksByDayItem[]
}

const TasksByDayChart: React.FC<TasksByDayChartProps> = ({ data }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Tasks Created (Last 30 Days)
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="date"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
            tickFormatter={(val) =>
              new Date(val).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            }
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1445',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
            }}
          />
          <Bar
            dataKey="count"
            name="Tasks Created"
            fill={CHART_COLORS.primary}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)

export default TasksByDayChart
