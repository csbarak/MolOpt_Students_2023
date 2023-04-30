import React from 'react'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { useState, useEffect } from 'react'
import FAQCard from 'src/components/faq-card'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/router'

const FAQ = () => {
  const [isAnswer, setIsAnswer] = useState([false, false, false, false, false])
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
        <FAQCard
          question='Can MolOpt be used on multiple devices?'
          answer='Yes, MolOpt can be accessed on multiple devices through a web-browser as long as the user is registered in the system.'
          isAnswer={isAnswer}
          setIsAnswer={setIsAnswer}
          index={0}
        />
      </Grid>
      <Divider />
      <Grid item xs={12}>
        <FAQCard
          question='How can I contact MolOpt support?'
          answer='MolOpt support can be reached by submitting a message through the "Report an issue" feature in the application. The message is automatically forwarded to MolOpt administrators and maintainers, who will respond as quickly as possible.'
          isAnswer={isAnswer}
          setIsAnswer={setIsAnswer}
          index={1}
        />
      </Grid>
      <Divider />
      <Grid item xs={12}>
        <FAQCard
          question='What should I do if I forget my MolOpt user credentials?'
          answer='In the case of forgotten user credentials, there are two options available. For a forgotten email address, a new user account can be registered using a known and active email address. For a forgotten password, users can select the "Forgot my password" option on the login page, and either recover or reset their password using their email address.'
          isAnswer={isAnswer}
          setIsAnswer={setIsAnswer}
          index={2}
        />
      </Grid>
      <Divider />
      <Grid item xs={12}>
        <FAQCard
          question='How do I execute an algorithm in MolOpt?'
          answer='Detailed instructions on running an algorithm in MolOpt can be found in the Algorithm page of the application or in section 1.3 of the guide.'
          isAnswer={isAnswer}
          setIsAnswer={setIsAnswer}
          index={3}
        />
      </Grid>
      <Divider />
      <Grid item xs={12}>
        <FAQCard
          question='Where can I access my algorithm runs in MolOpt?'
          answer='Users can access their algorithm runs through the Tasks page of the application.'
          isAnswer={isAnswer}
          setIsAnswer={setIsAnswer}
          index={4}
        />
      </Grid>
      <Divider />
      <Grid item xs={12}>
        <FAQCard
          question='How can I check the status of my algorithm run in MolOpt?'
          answer='Upon initiating an algorithm run, a notification will be displayed confirming that the selected algorithm has been scheduled to run in the system. The status of the algorithm run can also be checked at any time on the Tasks page.'
          isAnswer={isAnswer}
          setIsAnswer={setIsAnswer}
          index={5}
        />
      </Grid>
    </Grid>
  )
}

export default FAQ
