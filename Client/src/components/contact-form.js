import React, { useEffect, useState } from 'react'
// ** MUI Imports
import {
  Card,
  Grid,
  Button,
  TextField,
  CardHeader,
  CardContent,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'

// ** Icons Imports
import MessageOutline from 'mdi-material-ui/MessageOutline'
import api from './api'
import Notification from './notification'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'

const ContactForm = () => {
  const router = useRouter()
  const [cookies, setCookie, removeCookie] = useCookies()

  const [selection, setSelection] = useState('')
  const [message, setMessage] = useState('')
  const options = ['Report a bug', 'Report a problem', 'Suggestion']

  const handleOnClick = async () => {
    const body = {
      subject: selection,
      email: cookies.email,
      message: message
    }

    return await api
      .post('/contact-admin/', body, { headers: { Authorization: `Token ${cookies.token}` } })
      .then(res => {
        if (200 <= res.status && res.status < 300)
          return Notification('Message send successfully', 'success', () => {
            router.push('/dashboard')
          }).apply()
      })
      .catch(err => {
        return Notification('Failed to send message', 'error').apply()
      })
  }

  return (
    <Card>
      <CardHeader title='Send Message' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='select-contact'>{`Select an option`}</InputLabel>
                <Select
                  defaultValue={selection}
                  id='select-contact'
                  labelId='select-contact'
                  value={selection}
                  onChange={e => setSelection(e.target.value)}
                >
                  {options.map(option => (
                    <MenuItem defaultValue='' value={option} key={options.indexOf(option)}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                value={message}
                onChange={e => setMessage(e.target.value)}
                minRows={3}
                label='Message'
                placeholder='Please write here...'
                sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <MessageOutline />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type='submit'
                variant='contained'
                size='large'
                sx={{ display: 'flex', justifyContent: 'center' }}
                disabled={message === '' || selection === ''}
                onClick={handleOnClick}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ContactForm
