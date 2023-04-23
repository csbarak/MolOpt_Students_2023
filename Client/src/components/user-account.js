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

const TabAccount = () => {
  const [info, setInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    affiliation: '',
    position: '',
    isAdmin: false
  })

  const body = {
    user_id: 'Admin@gmail.com'
  }

  useEffect(async () => {
    return await api
      .post('/get_user/', body)
      .then(res => {
        setInfo({
          firstName: res.data.first_name,
          lastName: res.data.last_name,
          email: res.data.email,
          affiliation: res.data.affiliation,
          position: res.data.position,
          isAdmin: res.data.isAdmin
        })
      })
      .catch(err => {
        return Notification('Failed to get user info', 'error').apply()
      })
  }, [])

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
              onChange={e => setInfo(prev => ({ ...prev, firstName: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Last Name'
              placeholder='Doe'
              value={info.lastName}
              onChange={e => setInfo(prev => ({ ...prev, lastName: e.target.value }))}
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
              onChange={e => setInfo(prev => ({ ...prev, email: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select label='Role' value={info.isAdmin ? 'admin' : 'subscriber'} disabled>
                <MenuItem value='admin'>Admin</MenuItem>
                <MenuItem value='subscriber'>Subscriber</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Affiliation'
              placeholder='Ben Gurion University'
              value={info.affiliation}
              onChange={e => setInfo(prev => ({ ...prev, affiliation: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Position'
              placeholder='Professor'
              value={info.position}
              onChange={e => setInfo(prev => ({ ...prev, position: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant='contained'
              sx={{ marginRight: 3.5 }}
              disabled={Object.values(info).every(value => value === '')}
            >
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabAccount
