import React from 'react'
// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import { useEffect } from 'react'
import api from './api'
import Notification from './notification'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'

const TabAccount = () => {
  const [info, setInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    affiliation: '',
    position: '',
    is_staff: false
  })
  const [cookies, setCookie, removeCookie] = useCookies()
  const [disabled, setDisabled] = useState(true)

  const router = useRouter()

  const body = {
    email: cookies.email
  }

  useEffect(async () => {
    return await api
      .post('/get_user/', body, { headers: { Authorization: `Token ${cookies.token}` } })
      .then(res => {
        if (200 <= res.status && res.status < 300) {
          setInfo({
            firstName: res.data.first_name,
            lastName: res.data.last_name,
            email: res.data.email,
            affiliation: res.data.affiliation,
            position: res.data.position,
            is_staff: res.data.is_staff
          })
        }
      })
      .catch(err => {
        return Notification('Failed to get user info', 'error').apply()
      })
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    return await api
      .post(`/update_user_info/`, info, { headers: { Authorization: `Token ${cookies.token}` } })
      .then(res => {
        if (200 <= res.status && res.status < 300) {
          return Notification('User info updated', 'success', () => {
            router.push('/dashboard')
          }).apply()
        }
      })
      .catch(err => Notification('Failed to update user info', 'error').apply())
  }

  const setAndValidate = (e, type) => {
    e.preventDefault()
    if (
      e.target.value === '' ||
      Object.values(info).some(value => value === null || value === '' || value === undefined)
    ) {
      setInfo(prev => ({ ...prev, [type]: e.target.value }))
      return setDisabled(true)
    }
    setInfo(prev => ({ ...prev, [type]: e.target.value }))
    return setDisabled(false)
  }

  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='First Name'
              placeholder='John'
              value={info.firstName}
              onChange={e => setAndValidate(e, 'firstName')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Last Name'
              placeholder='Doe'
              value={info.lastName}
              onChange={e => setAndValidate(e, 'lastName')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              disabled={true}
              type='email'
              label='Email'
              placeholder='johnDoe@example.com'
              value={info.email}
              onChange={e => setAndValidate(e, 'email')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select label='Role' value={info.is_staff ? 'Admin' : 'User'} disabled>
                <MenuItem value='Admin'>Admin</MenuItem>
                <MenuItem value='User'>User</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Affiliation'
              placeholder='Ben Gurion University'
              value={info.affiliation}
              onChange={e => setAndValidate(e, 'affiliation')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Position'
              placeholder='Professor'
              value={info.position}
              onChange={e => setAndValidate(e, 'position')}
            />
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant='contained' sx={{ marginRight: 3.5 }} disabled={disabled} onClick={handleSubmit}>
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabAccount
