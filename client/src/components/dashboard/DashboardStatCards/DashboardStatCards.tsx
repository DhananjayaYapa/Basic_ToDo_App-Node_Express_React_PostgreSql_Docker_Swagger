import React from 'react'
import { Box, Card, CardContent, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'

interface StatItem {
  title: string
  value: number | string
  icon: React.ReactNode
  color: string
}

interface DashboardStatCardsProps {
  stats: StatItem[]
}

const DashboardStatCards: React.FC<DashboardStatCardsProps> = ({ stats }) => (
  <Grid container spacing={3} sx={{ mb: 4 }}>
    {stats.map((stat) => (
      <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: { xs: 'row', md: 'column', lg: 'row' },
                gap: { xs: 0, md: 1.5, lg: 0 },
              }}
            >
              <Box
                sx={{
                  order: { xs: 1, md: 2, lg: 1 },
                  textAlign: { xs: 'left', md: 'center', lg: 'left' },
                }}
              >
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="h5" fontWeight={600} sx={{ color: stat.color }}>
                  {stat.value}
                </Typography>
              </Box>
              <Box
                sx={{
                  order: { xs: 2, md: 1, lg: 2 },
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: `${stat.color}20`,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
)

export default DashboardStatCards
