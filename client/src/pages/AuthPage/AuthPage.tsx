import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { Visibility, VisibilityOff, TaskAlt as TaskAltIcon } from '@mui/icons-material'
import { Loader } from 'react-loaders'
import { useAuth } from '../../hooks/useAuth'
import { validateControlledFormData } from '../../utilities/helpers'
import {
  INITIAL_LOGIN_FORM_STATE,
  INITIAL_REGISTER_FORM_STATE,
} from '../../utilities/models'
import type { LoginFormDto, RegisterFormDto } from '../../utilities/models'
import { APP_ROUTES, APP_NAME } from '../../utilities/constants'
import styles from './AuthPage.module.scss'

const AuthPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isLoading, login, register: registerUser } = useAuth()

  const [rightPanelActive, setRightPanelActive] = useState(
    location.pathname === APP_ROUTES.REGISTER
  )
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  // Controlled form state
  const [loginFormData, setLoginFormData] = useState<LoginFormDto>(INITIAL_LOGIN_FORM_STATE())
  const [registerFormData, setRegisterFormData] = useState<RegisterFormDto>(
    INITIAL_REGISTER_FORM_STATE()
  )
  const [isShowLoginHelperText, setIsShowLoginHelperText] = useState(false)
  const [isShowRegisterHelperText, setIsShowRegisterHelperText] = useState(false)

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(APP_ROUTES.DASHBOARD, { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Handle registration success
  useEffect(() => {
    if (registrationSuccess) {
      setRightPanelActive(false)
      navigate(APP_ROUTES.LOGIN, { replace: true })
    }
  }, [registrationSuccess, navigate])

  // Sync panel state with URL
  useEffect(() => {
    setRightPanelActive(location.pathname === APP_ROUTES.REGISTER)
  }, [location.pathname])

  // ─── Form Handlers ─────────────────────────────────────────────────────────
  const handleLoginInputChange = (property: string, value: string) => {
    setLoginFormData((prev) => ({
      ...prev,
      [property]: { ...prev[property as keyof LoginFormDto], value },
    }))
  }

  const handleLoginInputFocus = (property: string) => {
    setLoginFormData((prev) => ({
      ...prev,
      [property]: { ...prev[property as keyof LoginFormDto], error: null },
    }))
  }

  const handleRegisterInputChange = (property: string, value: string) => {
    setRegisterFormData((prev) => ({
      ...prev,
      [property]: { ...prev[property as keyof RegisterFormDto], value },
    }))
  }

  const handleRegisterInputFocus = (property: string) => {
    setRegisterFormData((prev) => ({
      ...prev,
      [property]: { ...prev[property as keyof RegisterFormDto], error: null },
    }))
  }

  const handleSwitchPanel = (toRegister: boolean) => {
    setError(null)
    setLoginFormData(INITIAL_LOGIN_FORM_STATE())
    setRegisterFormData(INITIAL_REGISTER_FORM_STATE())
    setIsShowLoginHelperText(false)
    setIsShowRegisterHelperText(false)
    setShowLoginPassword(false)
    setShowRegisterPassword(false)
    setShowConfirmPassword(false)
    setRightPanelActive(toRegister)
    navigate(toRegister ? APP_ROUTES.REGISTER : APP_ROUTES.LOGIN, { replace: true })
  }

  const onLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsShowLoginHelperText(true)
    setError(null)

    const [validatedData, isValid] = await validateControlledFormData(loginFormData)
    setLoginFormData(validatedData)

    if (!isValid) return

    try {
      await login({
        email: loginFormData.email.value.trim(),
        password: loginFormData.password.value,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
    }
  }

  const onRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsShowRegisterHelperText(true)
    setError(null)

    const [validatedData, isValid] = await validateControlledFormData(registerFormData)
    setRegisterFormData(validatedData)

    if (!isValid) return

    try {
      await registerUser({
        name: registerFormData.name.value.trim(),
        email: registerFormData.email.value.trim(),
        password: registerFormData.password.value,
      })
      setRegistrationSuccess(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setError(message)
    }
  }

  return (
    <Box className={styles.authPageWrapper}>
      <Box className={`${styles.container} ${rightPanelActive ? styles.rightPanelActive : ''}`}>
        {/* Sign Up Form Container */}
        <Box className={`${styles.formContainer} ${styles.signUpContainer}`}>
          <form onSubmit={onRegisterSubmit} noValidate>
            <Box className={styles.logoContainer}>
              <TaskAltIcon className={styles.logo} />
            </Box>
            <Typography variant="h4" className={styles.title}>
              Create Account
            </Typography>

            {error && rightPanelActive && (
              <Alert severity="error" className={styles.alert}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              size="small"
              value={registerFormData.name.value}
              onChange={(e) => handleRegisterInputChange('name', e.target.value)}
              onFocus={() => handleRegisterInputFocus('name')}
              error={isShowRegisterHelperText && !!registerFormData.name.error}
              helperText={
                isShowRegisterHelperText && registerFormData.name.error
                  ? registerFormData.name.error
                  : ''
              }
              required={registerFormData.name.isRequired}
              disabled={registerFormData.name.disable || isLoading}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              size="small"
              value={registerFormData.email.value}
              onChange={(e) => handleRegisterInputChange('email', e.target.value)}
              onFocus={() => handleRegisterInputFocus('email')}
              error={isShowRegisterHelperText && !!registerFormData.email.error}
              helperText={
                isShowRegisterHelperText && registerFormData.email.error
                  ? registerFormData.email.error
                  : ''
              }
              required={registerFormData.email.isRequired}
              disabled={registerFormData.email.disable || isLoading}
            />

            <TextField
              fullWidth
              label="Password"
              type={showRegisterPassword ? 'text' : 'password'}
              margin="normal"
              size="small"
              value={registerFormData.password.value}
              onChange={(e) => handleRegisterInputChange('password', e.target.value)}
              onFocus={() => handleRegisterInputFocus('password')}
              error={isShowRegisterHelperText && !!registerFormData.password.error}
              helperText={
                isShowRegisterHelperText && registerFormData.password.error
                  ? registerFormData.password.error
                  : ''
              }
              required={registerFormData.password.isRequired}
              disabled={registerFormData.password.disable || isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      edge="end"
                      size="small"
                      disabled={isLoading}
                    >
                      {showRegisterPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              margin="normal"
              size="small"
              value={registerFormData.confirmPassword.value}
              onChange={(e) => handleRegisterInputChange('confirmPassword', e.target.value)}
              onFocus={() => handleRegisterInputFocus('confirmPassword')}
              error={isShowRegisterHelperText && !!registerFormData.confirmPassword.error}
              helperText={
                isShowRegisterHelperText && registerFormData.confirmPassword.error
                  ? registerFormData.confirmPassword.error
                  : ''
              }
              required={registerFormData.confirmPassword.isRequired}
              disabled={registerFormData.confirmPassword.disable || isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      size="small"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading && rightPanelActive ? (
                <Box className="pacman-sm">
                  <Loader type="pacman" active />
                </Box>
              ) : (
                'Sign Up'
              )}
            </Button>

            <Typography className={styles.mobileToggle}>
              Already have an account? <span onClick={() => handleSwitchPanel(false)}>Sign In</span>
            </Typography>
          </form>
        </Box>

        {/* Sign In Form Container */}
        <Box className={`${styles.formContainer} ${styles.signInContainer}`}>
          <form onSubmit={onLoginSubmit} noValidate>
            <Box className={styles.logoContainer}>
              <TaskAltIcon className={styles.logo} />
            </Box>
            <Typography variant="h4" className={styles.title}>
              Sign In
            </Typography>

            {error && !rightPanelActive && (
              <Alert severity="error" className={styles.alert}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              size="small"
              value={loginFormData.email.value}
              onChange={(e) => handleLoginInputChange('email', e.target.value)}
              onFocus={() => handleLoginInputFocus('email')}
              error={isShowLoginHelperText && !!loginFormData.email.error}
              helperText={
                isShowLoginHelperText && loginFormData.email.error
                  ? loginFormData.email.error
                  : ''
              }
              required={loginFormData.email.isRequired}
              disabled={loginFormData.email.disable || isLoading}
            />

            <TextField
              fullWidth
              label="Password"
              type={showLoginPassword ? 'text' : 'password'}
              margin="normal"
              size="small"
              value={loginFormData.password.value}
              onChange={(e) => handleLoginInputChange('password', e.target.value)}
              onFocus={() => handleLoginInputFocus('password')}
              error={isShowLoginHelperText && !!loginFormData.password.error}
              helperText={
                isShowLoginHelperText && loginFormData.password.error
                  ? loginFormData.password.error
                  : ''
              }
              required={loginFormData.password.isRequired}
              disabled={loginFormData.password.disable || isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      edge="end"
                      size="small"
                      disabled={isLoading}
                    >
                      {showLoginPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading && !rightPanelActive ? (
                <Box className="pacman-sm">
                  <Loader type="pacman" active />
                </Box>
              ) : (
                'Sign In'
              )}
            </Button>

            <Typography className={styles.mobileToggle}>
              Don't have an account?{' '}
              <span onClick={() => handleSwitchPanel(true)}>Sign Up</span>
            </Typography>
          </form>
        </Box>

        {/* Overlay Container */}
        <Box className={styles.overlayContainer}>
          <Box className={styles.overlay}>
            <Box className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <TaskAltIcon className={styles.overlayLogo} />
              <Typography variant="h4" className={styles.overlayTitle}>
                Welcome Back!
              </Typography>
              <Typography className={styles.overlayText}>
                Sign in with your credentials to access {APP_NAME} and manage your tasks
              </Typography>
              <Button
                variant="outlined"
                className={styles.ghostButton}
                onClick={() => handleSwitchPanel(false)}
              >
                Sign In
              </Button>
            </Box>

            <Box className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <TaskAltIcon className={styles.overlayLogo} />
              <Typography variant="h4" className={styles.overlayTitle}>
                Hello, Friend!
              </Typography>
              <Typography className={styles.overlayText}>
                Create an account to start your journey with {APP_NAME} and stay organized
              </Typography>
              <Button
                variant="outlined"
                className={styles.ghostButton}
                onClick={() => handleSwitchPanel(true)}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default AuthPage
