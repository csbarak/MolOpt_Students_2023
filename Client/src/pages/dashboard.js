import React from 'react'
// ** MUI Imports
import Grid from '@mui/material/Grid'

import FileUpload from 'src/components/file-upload'

const Dashboard = () => {
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
