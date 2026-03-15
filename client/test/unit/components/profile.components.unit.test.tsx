import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  INITIAL_PASSWORD_FORM_STATE,
  INITIAL_PROFILE_FORM_STATE,
} from '../../../src/utilities/models'
import PasswordChangeForm from '../../../src/components/profile/PasswordChangeForm/PasswordChangeForm'
import ProfileCard from '../../../src/components/profile/ProfileCard/ProfileCard'
import ProfileForm from '../../../src/components/profile/ProfileForm/ProfileForm'

describe('profile components unit', () => {
  it('renders ProfileCard identity details', () => {
    render(<ProfileCard name="Alex" email="alex@example.com" />)

    expect(screen.getByText('Alex')).toBeInTheDocument()
    expect(screen.getByText('alex@example.com')).toBeInTheDocument()
  })

  it('renders ProfileForm and handles submit', () => {
    const onInputChange = vi.fn()
    const onInputFocus = vi.fn()
    const onSubmit = vi.fn()

    render(
      <ProfileForm
        isShowHelperText={true}
        formData={INITIAL_PROFILE_FORM_STATE('Alex', 'alex@example.com')}
        isLoading={false}
        onInputChange={onInputChange}
        onInputFocus={onInputFocus}
        onSubmit={onSubmit}
      />
    )

    fireEvent.change(screen.getByRole('textbox', { name: /full name/i }), {
      target: { value: 'A' },
    })
    fireEvent.focus(screen.getByRole('textbox', { name: /full name/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Update Profile' }))

    expect(onInputChange).toHaveBeenCalled()
    expect(onInputFocus).toHaveBeenCalledWith('name')
    expect(onSubmit).toHaveBeenCalled()
  })

  it('renders PasswordChangeForm and handles submit', () => {
    const onInputChange = vi.fn()
    const onInputFocus = vi.fn()
    const onSubmit = vi.fn()

    render(
      <PasswordChangeForm
        isShowHelperText={false}
        formData={INITIAL_PASSWORD_FORM_STATE()}
        isLoading={false}
        onInputChange={onInputChange}
        onInputFocus={onInputFocus}
        onSubmit={onSubmit}
      />
    )

    fireEvent.change(screen.getByLabelText(/current password/i), {
      target: { value: 'oldpass' },
    })
    fireEvent.focus(screen.getByLabelText(/current password/i))
    fireEvent.click(screen.getByRole('button', { name: 'Change Password' }))

    expect(onInputChange).toHaveBeenCalled()
    expect(onInputFocus).toHaveBeenCalledWith('currentPassword')
    expect(onSubmit).toHaveBeenCalled()
  })
})
