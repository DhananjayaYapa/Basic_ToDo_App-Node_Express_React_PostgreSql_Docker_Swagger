import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { CHART_COLORS } from '../../../utilities/constants'
import type { StatusBreakdownItem } from '../../../utilities/models'

interface StatusPieChartProps {
  data: StatusBreakdownItem[]
}

const StatusPieChart: React.FC<StatusPieChartProps> = ({ data }) => {
  const pieData = data.map((item) => ({
    name: item.status === 'PENDING' ? 'Pending' : 'Completed',
    value: item.count,
    color: item.status === 'PENDING' ? CHART_COLORS.pending : CHART_COLORS.completed,
  }))

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Status Breakdown
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1445',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 8,
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default StatusPieChart
