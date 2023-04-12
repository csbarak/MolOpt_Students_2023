import IconButton from '@mui/material/IconButton'
import React from 'react'
// ** Icons Imports
import { WeatherNight, WeatherSunny } from 'mdi-material-ui'

const DarkMode = props => {
  // ** Props
  const { settings, saveSettings } = props

  const handleModeChange = mode => {
    saveSettings({ ...settings, mode })
  }

  const handleModeToggle = () => {
    if (settings.mode === 'light') {
      handleModeChange('dark')
    } else {
      handleModeChange('light')
    }
  }

  return (
    <IconButton color='inherit' aria-haspopup='true' onClick={handleModeToggle}>
      {settings.mode === 'dark' ? <WeatherSunny /> : <WeatherNight />}
    </IconButton>
  )
}

export default DarkMode
