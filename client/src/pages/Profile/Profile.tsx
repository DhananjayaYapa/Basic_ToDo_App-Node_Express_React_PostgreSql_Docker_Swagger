import React, { useState, useEffect } from 'react'
import { Box, Alert } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useAuth } from '../../hooks/useAuth'
import type {
  ProfileFormDto,
  PasswordFormDto,
  UpdateProfileRequestDto,
  ChangePasswordRequestDto,
} from '../../utilities/models'
import { INITIAL_PROFILE_FORM_STATE, INITIAL_PASSWORD_FORM_STATE } from '../../utilities/models'
import { PageHeader } from '../../components/shared'
import { ProfileCard, ProfileForm, PasswordChangeForm } from '../../components/profile'
import { validateControlledFormData } from '../../utilities/helpers'
import styles from './Profile.module.scss'

const Profile: React.FC = () => {
  const { user, isLoading, updateProfile, changePassword } = useAuth()

  const [updateProfileAlert, setUpdateProfileAlert] = useState<{
    message: string
    severity: 'success' | 'error'
  } | null>(null)
  const [changePasswordAlert, setChangePasswordAlert] = useState<{
    message: string
    severity: 'success' | 'error'
  } | null>(null)

  // Form states (Athena controlled component pattern)
  const [profileFormData, setProfileFormData] = useState<ProfileFormDto>(
    INITIAL_PROFILE_FORM_STATE()
  )
  const [passwordFormData, setPasswordFormData] = useState<PasswordFormDto>(
    INITIAL_PASSWORD_FORM_STATE()
  )

  // Helper text states
  const [isShowProfileHelperText, setIsShowProfileHelperText] = useState(true)
  const [isShowPasswordHelperText, setIsShowPasswordHelperText] = useState(true)

  // Initialize profile form with user data
  useEffect(() => {
    if (user) {
      setProfileFormData(INITIAL_PROFILE_FORM_STATE(user.name || '', user.email || ''))
    }
  }, [user])

  // Profile form handlers
  const handleProfileInputFocus = (property: string) => {
    setProfileFormData((prev) => ({
      ...prev,
      [property]: {
        ...prev[property as keyof ProfileFormDto],
        error: null,
      },
    }))
  }

  const handleProfileInputChange = (property: string, value: string) => {
    setProfileFormData((prev) => ({
      ...prev,
      [property]: {
        ...prev[property as keyof ProfileFormDto],
        value,
      },
    }))
  }

  // Password form handlers
  const handlePasswordInputFocus = (property: string) => {
    setPasswordFormData((prev) => ({
      ...prev,
      [property]: {
        ...prev[property as keyof PasswordFormDto],
        error: null,
      },
    }))
  }

  const handlePasswordInputChange = (property: string, value: string) => {
    setPasswordFormData((prev) => ({
      ...prev,
      [property]: {
        ...prev[property as keyof PasswordFormDto],
        value,
      },
    }))
  }

  // Profile submit with validation
  const handleProfileSubmit = async () => {
    setIsShowProfileHelperText(true)
    const [validatedData, isValid] = await validateControlledFormData(profileFormData)
    setProfileFormData(validatedData)

    if (isValid) {
      try {
        const updateProfileParams: UpdateProfileRequestDto = {
          name: profileFormData.name.value,
          email: profileFormData.email.value,
        }
        await updateProfile(updateProfileParams)
        setUpdateProfileAlert({ message: 'Profile updated successfully', severity: 'success' })
      } catch {
        setUpdateProfileAlert({ message: 'Failed to update profile', severity: 'error' })
      }
    }
  }

  // Password submit with validation
  const handlePasswordSubmit = async () => {
    setIsShowPasswordHelperText(true)
    const [validatedData, isValid] = await validateControlledFormData(passwordFormData)
    setPasswordFormData(validatedData)

    if (isValid) {
      try {
        const changePasswordParams: ChangePasswordRequestDto = {
          currentPassword: passwordFormData.currentPassword.value,
          newPassword: passwordFormData.newPassword.value,
        }
        await changePassword(changePasswordParams)
        setPasswordFormData(INITIAL_PASSWORD_FORM_STATE())
        setChangePasswordAlert({
          message: 'Password changed successfully',
          severity: 'success',
        })
      } catch {
        setChangePasswordAlert({ message: 'Failed to change password', severity: 'error' })
      }
    }
  }

  // Computed values
  const userName = user?.name || 'User'
  const userEmail = user?.email || ''

  return (
    <Box className={styles.profilePage}>
      <PageHeader title="My Profile" subtitle="Manage your account settings" />

      {/* Alerts */}
      {updateProfileAlert && (
        <Alert
          severity={updateProfileAlert.severity}
          onClose={() => setUpdateProfileAlert(null)}
          sx={{ mb: 2 }}
        >
          {updateProfileAlert.message}
        </Alert>
      )}
      {changePasswordAlert && (
        <Alert
          severity={changePasswordAlert.severity}
          onClose={() => setChangePasswordAlert(null)}
          sx={{ mb: 2 }}
        >
          {changePasswordAlert.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <ProfileCard name={userName} email={userEmail} />
        </Grid>

        {/* Forms */}
        <Grid size={{ xs: 12, md: 8 }}>
          <ProfileForm
            isShowHelperText={isShowProfileHelperText}
            formData={profileFormData}
            isLoading={isLoading}
            onInputChange={handleProfileInputChange}
            onInputFocus={handleProfileInputFocus}
            onSubmit={handleProfileSubmit}
          />

          <PasswordChangeForm
            isShowHelperText={isShowPasswordHelperText}
            formData={passwordFormData}
            isLoading={isLoading}
            onInputChange={handlePasswordInputChange}
            onInputFocus={handlePasswordInputFocus}
            onSubmit={handlePasswordSubmit}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Profile
