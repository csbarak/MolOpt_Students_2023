// ** React Imports
import { useState, Fragment } from 'react'
import React from 'react'
// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'
// ** Axios Imports
import api from '../components/api'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/components/blank-layout'
import PrivacyDoc from 'src/components/privacy-doc'
import Notification from 'src/components/notification'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const RegisterPage = () => {
  // ** States
  const [values, setValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    showPassword: false
  })
  const [modal, setModal] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const errors = {
    email: 'Please enter a valid email',
    password: `
    \u2022\tPassword must be at least 8 characters long\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0
    \u2022\tPassword must contain at least 1 lowercase characters
    \u2022\tPassword must contain at least 1 uppercase characters`,
    confirmPassword: 'Confirm password does not match password',
    firstName: 'First name must include alphabetic characters only',
    lastName: 'Last name must include alphabetic characters only'
  }
  const handlePrivacy = e => {
    e.preventDefault()
    return setModal(true)
  }

  const onClickRegister = async e => {
    e.preventDefault()
    const body = {
      email: values.email,
      password: values.password,
      first_name: values.firstName,
      last_name: values.lastName,
      affiliation: 'None',
      position: 'None'
    }
    return await api
      .post('users/', body)
      .then(res => {
        if (200 <= res.status && res.status < 300) {
          return Notification('Registered successfully', 'success', () => {
            router.push('/')
          }).apply()
        }
      })
      .catch(err => {
        return Notification('Failed to register', 'error').apply()
      })
  }

  // ** Hook
  const theme = useTheme()
  const router = useRouter()

  const validateFields = () => {
    return (
      values.email.match(/^[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}$/) &&
      values.password.match(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/) &&
      values.confirmPassword === values.password &&
      values.firstName.match(/^[a-zA-Z]+$/) &&
      values.lastName.match(/^[a-zA-Z]+$/)
    )
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg
              width={35}
              height={29}
              version='1.1'
              viewBox='0 0 30 23'
              xmlns='http://www.w3.org/2000/svg'
              xmlnsXlink='http://www.w3.org/1999/xlink'
            >
              <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                <g id='Artboard' transform='translate(-95.000000, -51.000000)'>
                  <g id='logo' transform='translate(95.000000, 50.000000)'>
                    <path
                      id='Combined-Shape'
                      fill={theme.palette.primary.main}
                      d='M30,21.3918362 C30,21.7535219 29.9019196,22.1084381 29.7162004,22.4188007 C29.1490236,23.366632 27.9208668,23.6752135 26.9730355,23.1080366 L26.9730355,23.1080366 L23.714971,21.1584295 C23.1114106,20.7972624 22.7419355,20.1455972 22.7419355,19.4422291 L22.7419355,19.4422291 L22.741,12.7425689 L15,17.1774194 L7.258,12.7425689 L7.25806452,19.4422291 C7.25806452,20.1455972 6.88858935,20.7972624 6.28502902,21.1584295 L3.0269645,23.1080366 C2.07913318,23.6752135 0.850976404,23.366632 0.283799571,22.4188007 C0.0980803893,22.1084381 2.0190442e-15,21.7535219 0,21.3918362 L0,3.58469444 L0.00548573643,3.43543209 L0.00548573643,3.43543209 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 L15,9.19354839 L26.9548759,1.86636639 C27.2693965,1.67359571 27.6311047,1.5715689 28,1.5715689 C29.1045695,1.5715689 30,2.4669994 30,3.5715689 L30,3.5715689 Z'
                    />
                    <polygon
                      id='Rectangle'
                      opacity='0.077704'
                      fill={theme.palette.common.black}
                      points='0 8.58870968 7.25806452 12.7505183 7.25806452 16.8305646'
                    />
                    <polygon
                      id='Rectangle'
                      opacity='0.077704'
                      fill={theme.palette.common.black}
                      points='0 8.58870968 7.25806452 12.6445567 7.25806452 15.1370162'
                    />
                    <polygon
                      id='Rectangle'
                      opacity='0.077704'
                      fill={theme.palette.common.black}
                      points='22.7419355 8.58870968 30 12.7417372 30 16.9537453'
                      transform='translate(26.370968, 12.771227) scale(-1, 1) translate(-26.370968, -12.771227) '
                    />
                    <polygon
                      id='Rectangle'
                      opacity='0.077704'
                      fill={theme.palette.common.black}
                      points='22.7419355 8.58870968 30 12.6409734 30 15.2601969'
                      transform='translate(26.370968, 11.924453) scale(-1, 1) translate(-26.370968, -11.924453) '
                    />
                    <path
                      id='Rectangle'
                      fillOpacity='0.15'
                      fill={theme.palette.common.white}
                      d='M3.04512412,1.86636639 L15,9.19354839 L15,9.19354839 L15,17.1774194 L0,8.58649679 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 Z'
                    />
                    <path
                      id='Rectangle'
                      fillOpacity='0.35'
                      fill={theme.palette.common.white}
                      transform='translate(22.500000, 8.588710) scale(-1, 1) translate(-22.500000, -8.588710) '
                      d='M18.0451241,1.86636639 L30,9.19354839 L30,9.19354839 L30,17.1774194 L15,8.58649679 L15,3.5715689 C15,2.4669994 15.8954305,1.5715689 17,1.5715689 C17.3688953,1.5715689 17.7306035,1.67359571 18.0451241,1.86636639 Z'
                    />
                  </g>
                </g>
              </g>
            </svg>
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
            <TextField
              fullWidth
              required
              id='email'
              type='email'
              label='Email'
              error={values.email !== '' && !values.email.match(/^[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}$/)}
              helperText={
                values.email !== '' && !values.email.match(/^[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}$/) ? errors.email : null
              }
              sx={{ marginBottom: 4 }}
              onChange={e => setValues(prevState => ({ ...prevState, email: e.target.value }))}
            />
            <TextField
              fullWidth
              required
              id='password'
              type='password'
              label='Password'
              error={values.password !== '' && !values.password.match(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/)}
              helperText={
                values.password !== '' && !values.password.match(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
                  ? errors.password
                  : null
              }
              sx={{ marginBottom: 4 }}
              onChange={e => setValues(prevState => ({ ...prevState, password: e.target.value }))}
            />

            <TextField
              fullWidth
              required
              id='confirm-password'
              type='password'
              label='Confirm Password'
              error={values.confirmPassword !== '' && !(values.confirmPassword === values.password)}
              helperText={
                values.confirmPassword !== '' && !(values.confirmPassword === values.password)
                  ? errors.confirmPassword
                  : null
              }
              sx={{ marginBottom: 4 }}
              onChange={e => setValues(prevState => ({ ...prevState, confirmPassword: e.target.value }))}
            />
            <TextField
              fullWidth
              required
              id='first-name'
              type='text'
              label='First Name'
              error={values.firstName !== '' && !values.firstName.match(/^[a-zA-Z]+$/)}
              helperText={values.firstName !== '' && !values.firstName.match(/^[a-zA-Z]+$/) ? errors.firstName : null}
              sx={{ marginBottom: 4 }}
              onChange={e => setValues(prevState => ({ ...prevState, firstName: e.target.value }))}
            />
            <TextField
              fullWidth
              required
              id='last-name'
              type='text'
              label='Last Name'
              error={values.lastName !== '' && !values.lastName.match(/^[a-zA-Z]+$/)}
              helperText={values.lastName !== '' && !values.lastName.match(/^[a-zA-Z]+$/) ? errors.lastName : null}
              sx={{ marginBottom: 4 }}
              onChange={e => setValues(prevState => ({ ...prevState, lastName: e.target.value }))}
            />
            <FormControlLabel
              control={<Checkbox id='policy' onChange={e => setAcceptTerms(!acceptTerms)} checked={acceptTerms} />}
              label={
                <>
                  <span>I agree to </span>
                  <Link href='#'>
                    <LinkStyled onClick={e => handlePrivacy(e)}>privacy policy & terms</LinkStyled>
                  </Link>
                </>
              }
            />
            <Button
              fullWidth
              id='register'
              size='large'
              type='submit'
              variant='contained'
              sx={{ marginBottom: 7 }}
              disabled={!acceptTerms || !validateFields()}
              onClick={e => onClickRegister(e)}
            >
              Sign up
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                Already have an account?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/'>
                  <LinkStyled>Sign in instead</LinkStyled>
                </Link>
              </Typography>
              <PrivacyDoc value={modal} setValue={setModal} />
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
RegisterPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default RegisterPage
