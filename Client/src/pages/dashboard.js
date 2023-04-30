import React from 'react'
// ** MUI Imports
import Grid from '@mui/material/Grid'

import FileUpload from 'src/components/file-upload'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Dashboard = () => {
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
      return router.push('/login')
    }
  }, [])
  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <FileUpload />
        </Grid>
      </Grid>
    </>
  )
}

export default Dashboard
