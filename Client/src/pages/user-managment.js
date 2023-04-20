// ** React Imports
import { useState } from 'react'
import React from 'react'
// ** MUI Imports
import { Card, CardContent } from '@mui/material'
import { TabPanel, TabContext } from '@mui/lab'
import AdminUsers from 'src/components/admin-users'

const UserManagment = () => {
  // ** State
  const [value, setValue] = useState('1')

  return (
    <Card>
      <TabContext value={value}>
        <CardContent sx={{ textAlign: 'center' }}>
          <TabPanel value='1' sx={{ p: 0 }}>
            <AdminUsers />
          </TabPanel>
        </CardContent>
      </TabContext>
    </Card>
  )
}

export default UserManagment
