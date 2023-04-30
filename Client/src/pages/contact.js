import React from 'react'
import Grid from '@mui/material/Grid'
import ContactForm from 'src/components/contact-form'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'

const Contact = () => {
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
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ContactForm />
      </Grid>
    </Grid>
  )
}

export default Contact
