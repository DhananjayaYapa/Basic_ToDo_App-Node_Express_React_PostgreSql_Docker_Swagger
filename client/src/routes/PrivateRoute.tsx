import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { APP_ROUTES } from '../utilities/constants'
import { AppLayout } from '../templates'

function PrivateRoute() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

export default PrivateRoute
