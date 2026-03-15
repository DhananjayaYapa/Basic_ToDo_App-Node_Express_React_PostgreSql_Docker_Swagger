import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Card, CardContent, Typography, Chip, Button } from '@mui/material'
import { ArrowForward as ArrowIcon } from '@mui/icons-material'
import { APP_ROUTES } from '../../../utilities/constants'
import type { Task } from '../../../utilities/models'

interface RecentTaskCardsProps {
  tasks: Task[]
}

const RecentTaskCards: React.FC<RecentTaskCardsProps> = ({ tasks }) => {
  const navigate = useNavigate()

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        {/* Header with "All Todos" button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Recent Pending Tasks
          </Typography>
          <Button
            size="small"
            variant="text"
            endIcon={<ArrowIcon />}
            onClick={() => navigate(APP_ROUTES.MANAGE_TODOS)}
            sx={{ textTransform: 'none' }}
          >
            All Todos
          </Button>
        </Box>

        {tasks.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No pending tasks. Create one to get started!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {tasks.map((task) => (
              <Box
                key={task.id}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.08)',
                    transform: 'translateX(4px)',
                    borderColor: 'rgba(34, 197, 94, 0.3)',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ flex: 1, mr: 2 }}>
                    <Typography variant="body1" fontWeight={500}>
                      {task.title}
                    </Typography>
                    {task.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '300px',
                        }}
                      >
                        {task.description}
                      </Typography>
                    )}
                  </Box>
                  <Chip
                    label="Pending"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(245, 158, 11, 0.15)',
                      color: '#f59e0b',
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentTaskCards
