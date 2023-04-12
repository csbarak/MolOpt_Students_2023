import React from 'react'
import Grid from '@mui/material/Grid'
import AlgorithmsCard from 'src/components/algorithms-card'

const Algorithms = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <AlgorithmsCard />
      </Grid>
    </Grid>
  )
}

export default Algorithms
