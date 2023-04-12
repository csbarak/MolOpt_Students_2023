// ** React Imports
import { useState } from 'react'
import React from 'react'
// ** MUI Imports
import { Tab, Card, CardContent } from '@mui/material'
import { TabList, TabPanel, TabContext } from '@mui/lab'
import AdminUsers from 'src/components/admin-users'

const UserManagment = () => {
  // ** State
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Card>
      <TabContext value={value}>
        {/* <TabList centered onChange={handleChange} aria-label='card navigation example'>
          <Tab value='1' label='View Users' />
          <Tab value='2' label='Delete Users' />
          <Tab value='3' label='Add Users' />
          <Tab value='4' label='Promote Users' />
        </TabList> */}
        <CardContent sx={{ textAlign: 'center' }}>
          <TabPanel value='1' sx={{ p: 0 }}>
            <AdminUsers />
          </TabPanel>
          {/* <TabPanel value='2' sx={{ p: 0 }}></TabPanel>
          <TabPanel value='3' sx={{ p: 0 }}></TabPanel>
          <TabPanel value='4' sx={{ p: 0 }}></TabPanel> */}
        </CardContent>
      </TabContext>
    </Card>
  )
}

export default UserManagment
