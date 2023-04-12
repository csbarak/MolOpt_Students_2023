import React from 'react'
// ** MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
import VerticalLayout from 'src/components/vertical-layout'

// ** Navigation Imports
import VerticalNavItems from 'src/components/navigation'

// ** Component Import
import VerticalAppBarContent from './app-bar-content'

// ** Hook Import
import { useSettings } from 'src/hooks/useSettings'

const UserLayout = ({ children }) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()

  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))

  return (
    <VerticalLayout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      verticalNavItems={VerticalNavItems()} // Navigation Items
      verticalAppBarContent={(
        props // AppBar Content
      ) => (
        <VerticalAppBarContent
          hidden={hidden}
          settings={settings}
          saveSettings={saveSettings}
          toggleNavVisibility={props.toggleNavVisibility}
        />
      )}
    >
      {children}
    </VerticalLayout>
  )
}

export default UserLayout
