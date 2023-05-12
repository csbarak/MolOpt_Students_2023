// ** React Imports
import { React, useState } from 'react'
// ** Next Imports
import { useRouter } from 'next/router'
// ** Axios Imports
import api from '../components/api'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/components/blank-layout'
import Notification from 'src/components/notification'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const ResetPasswordPage = () => {
  // ** Hook
  const theme = useTheme()
  const router = useRouter()
  
  // ** State
  const [values, setValues] = useState({
    token: '',
    new_password: '',
    confirm_new_password: '',
  })

  const errors = {
    token: '',
    new_password: `
    \u2022\tPassword must be at least 8 characters long\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0
    \u2022\tPassword must contain at least 1 lowercase characters
    \u2022\tPassword must contain at least 1 uppercase characters`,
    confirm_new_password: 'Confirm password does not match the new password',
  }

  const validateFields = () => {
    return (values.token !== '' &&
            values.new_password.match(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/) &&
            values.confirm_new_password === values.new_password)
  }

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleSetNewPassword = async e => {
    e.preventDefault()

    if (values.token === '') {
      // This should never happen - just for extra verification!
      return Notification('Token must be filled in - Check your email for the token', 'error').apply()
    }

    const body = {
      token: values.token,
      password: values.new_password
    }
    return await api
      .post('reset-password/', body)
      .then(res => {
        if (200 <= res.status && res.status < 300) {
          return Notification('Password reset was done successfully', 'success', () => {
            router.push('/')  // Back to Login page
          }).apply()
        }
      })
      .catch(err => {
        return Notification('Failed to reset password', 'error').apply()
      })
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
            <Typography variant='body1' sx={{ fontSize: '25px', mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Reset Password
            </Typography>
            <TextField
              autoFocus
              fullWidth
              required
              id='Token'
              label='Token'
              value={values.token}
              sx={{ marginBottom: 4 }}
              onChange={handleChange('token')}
              error={values.token === ''}
              helperText={
                values.token === '' ? errors.token : null
              }
            />
            <TextField
              fullWidth
              required
              id='New Password'
              label='New Password'
              type='password'
              value={values.new_password}
              sx={{ marginBottom: 4 }}
              onChange={handleChange('new_password')}
              error={values.new_password !== '' && !values.new_password.match(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/)}
              helperText={
                values.new_password !== '' && !values.new_password.match(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
                  ? errors.new_password
                  : null
              }
            />
            <TextField
              fullWidth
              required
              id='Confirm New Password'
              label='Confirm New Password'
              type='password'
              sx={{ marginBottom: 4 }}
              onChange={handleChange('confirm_new_password')}
              error={values.confirm_new_password !== '' && !(values.confirm_new_password === values.new_password)}
              helperText={
                values.confirm_new_password !== '' && !(values.confirm_new_password === values.new_password)
                  ? errors.confirm_new_password
                  : null
              }
            />

            <Button 
              fullWidth 
              size='large' 
              variant='contained' 
              sx={{ marginBottom: 7, marginTop: 3}} 
              onClick={e => handleSetNewPassword(e)}
              disabled={!validateFields()}
            >
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
ResetPasswordPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default ResetPasswordPage
