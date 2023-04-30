import React from 'react'
import Grid from '@mui/material/Grid'
import AlgorithmsCard from 'src/components/algorithms-card'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'

const Algorithms = () => {
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
        <AlgorithmsCard />
      </Grid>
    </Grid>
  )
}

export default Algorithms
