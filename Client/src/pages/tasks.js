import React from 'react'
import Grid from '@mui/material/Grid'
import TasksTable from 'src/components/tasks-table'

const History = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TasksTable />
      </Grid>
    </Grid>
  )
}

export default History
