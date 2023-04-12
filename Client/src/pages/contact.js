import React from 'react'
import Grid from '@mui/material/Grid'
import ContactForm from 'src/components/contact-form'

const Contact = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ContactForm />
      </Grid>
    </Grid>
  )
}

export default Contact
