import React, { useState } from 'react'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import api from './api'
import Notification from './notification'
import { useCookies } from 'react-cookie'

const ForgotPassword = ({ value, setValue }) => {
  const [email, setEmail] = useState('')
  const [cookies, setCookie, removeCookie] = useCookies()

  const handleClose = () => {
    setValue(!value)
  }

  const handleForgotPassword = async () => {
    return await api
      .post('reset_password/', { email: email })
      .then(res => {
        if (200 <= res.status && res.status < 300) {
          return Notification('Password reset successfully , please check your email.', 'success').apply()
        }
      })
      .catch(err => {
        return Notification('Password reset failed , please check email is exists and valid.', 'error').apply()
      })
  }

  return (
    <div>
      <Dialog open={value} onClose={handleClose}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To reset your password , please enter your email address here. We will send a reset link to email.
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Email Address'
            type='email'
            fullWidth
            variant='standard'
            onChange={e => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleForgotPassword}>Reset Password</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ForgotPassword
