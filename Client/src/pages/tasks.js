import React from 'react'
import Grid from '@mui/material/Grid'
import TasksTable from 'src/components/tasks-table'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Tasks = () => {
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
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TasksTable />
      </Grid>
    </Grid>
  )
}

export default Tasks
