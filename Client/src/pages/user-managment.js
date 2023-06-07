// ** React Imports
import { useEffect, useState } from 'react'
import React from 'react'
// ** MUI Imports
import { Card, CardContent } from '@mui/material'
import { TabPanel, TabContext } from '@mui/lab'
import AdminUsers from 'src/components/admin-users'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/router'

const UserManagment = () => {
  // ** State
  const [value, setValue] = useState('1')
  const [cookies, setCookie, removeCookie] = useCookies()
  const router = useRouter()

  useEffect(() => {
    if (
      cookies === undefined ||
      cookies.email === undefined ||
      cookies.token === undefined ||
      cookies.email === '' ||
      cookies.token === '' ||
      cookies.email === null ||
      cookies.token === null
    ) {
      alert('You are not logged in')
      return window.location.replace('/login')
    }
  }, [])

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
