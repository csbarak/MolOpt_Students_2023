import React from 'react'
// ** React Imports
import { useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import api from './api'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import Notification from './notification'

const UserDropdown = () => {
  // ** States
  const [anchorEl, setAnchorEl] = useState(null)
  const [cookies, setCookie, removeCookie] = useCookies()
  const [isAdmin, setIsAdmin] = useState(false)

  // ** Hooks
  const router = useRouter()

  useEffect(async () => {
    return api
      .post('check_permissions/', { email: cookies.email }, { headers: { Authorization: `Token ${cookies.token}` } })
      .then(res => {
        if (res.status >= 200 && res.status < 300) {
          setIsAdmin(res.data.is_admin)
        }
      })
      .catch(err => Notification('Failed to check permissions', 'error').apply())
  }, [])

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }
  const handleLogout = () => {
    api
      .post('logout/', {}, { headers: { Authorization: `Token ${cookies.token}` } })
      .then(res => {
        if (200 <= res.status && res.status < 300) {
          removeCookie('email')
          removeCookie('csrftoken')
          removeCookie('token')
          router.push('/')
        }
      })
      .catch(err => {
        Notification('Could not logout, please try again', 'error').apply()
      })
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary'
    }
  }

  return (
    <>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar alt={cookies.email} onClick={handleDropdownOpen} sx={{ width: 40, height: 40 }} />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge overlap='circular' anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
              <Avatar alt={cookies.email} sx={{ width: '2.5rem', height: '2.5rem' }} />
            </Badge>
            <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{cookies.email}</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {isAdmin ? 'Admin' : 'User'}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/account-settings')}>
          <Box sx={styles}>
            <AccountOutline sx={{ marginRight: 2 }} />
            Profile
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ py: 2 }} onClick={handleLogout}>
          <LogoutVariant sx={{ marginRight: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  )
}

export default UserDropdown
