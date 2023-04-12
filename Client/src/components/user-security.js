// ** React Imports
import { useState } from 'react'
import React from 'react'
// ** MUI Imports
import {
  Grid,
  InputLabel,
  IconButton,
  CardContent,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Button,
  TextField
} from '@mui/material'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

const TabSecurity = () => {
  // ** States
  const [values, setValues] = useState({
    newPassword: '',
    currentPassword: '',
    showNewPassword: false,
    confirmNewPassword: '',
    showCurrentPassword: false,
    showConfirmNewPassword: false
  })

  // Handle Current Password
  const handleCurrentPasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowCurrentPassword = () => {
    setValues({ ...values, showCurrentPassword: !values.showCurrentPassword })
  }

  const handleMouseDownCurrentPassword = event => {
    event.preventDefault()
  }

  // Handle New Password
  const handleNewPasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }

  const handleMouseDownNewPassword = event => {
    event.preventDefault()
  }

  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor='account-settings-current-password'>Current Password</InputLabel>
              <OutlinedInput
                label='Current Password'
                value={values.currentPassword}
                id='account-settings-current-password'
                type={values.showCurrentPassword ? 'text' : 'password'}
                onChange={handleCurrentPasswordChange('currentPassword')}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      aria-label='toggle password visibility'
                      onClick={handleClickShowCurrentPassword}
                      onMouseDown={handleMouseDownCurrentPassword}
                    >
                      {values.showCurrentPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor='account-settings-new-password'>New Password</InputLabel>
              <OutlinedInput
                label='New Password'
                value={values.newPassword}
                id='account-settings-new-password'
                onChange={handleNewPasswordChange('newPassword')}
                type={values.showNewPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowNewPassword}
                      aria-label='toggle password visibility'
                      onMouseDown={handleMouseDownNewPassword}
                    >
                      {values.showNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant='contained' sx={{ marginRight: 3.5 }}>
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabSecurity
