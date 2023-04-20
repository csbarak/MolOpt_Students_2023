import React from 'react'
// ** MUI Imports
import { Box, IconButton, useMediaQuery } from '@mui/material'

// ** Icons Imports
import Menu from 'mdi-material-ui/Menu'

// ** Components
import DarkMode from './dark-mode'
import UserDropdown from './user-dropdown'

const AppBarContent = props => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  // ** Hook
  const hiddenSm = useMediaQuery(theme => theme.breakpoints.down('sm'))

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton
            color='inherit'
            onClick={toggleNavVisibility}
            sx={{ ml: -2.75, ...(hiddenSm ? {} : { mr: 3.5 }) }}
          >
            <Menu />
          </IconButton>
        ) : null}
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        <DarkMode settings={settings} saveSettings={saveSettings} />
        <UserDropdown />
      </Box>
    </Box>
  )
}

export default AppBarContent
