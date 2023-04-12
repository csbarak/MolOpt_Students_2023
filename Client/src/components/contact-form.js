import React, { useState } from 'react'
// ** MUI Imports
import { Card, Grid, Button, TextField, CardHeader, CardContent, InputAdornment, Select ,MenuItem , FormControl , InputLabel} from '@mui/material'

// ** Icons Imports
import MessageOutline from 'mdi-material-ui/MessageOutline'

const ContactForm = () => {
  const [selection , setSelection] = useState('')
  const [message , setMessage] = useState('')
  const options = ['Report a bug' , 'Report a problem' , 'Suggestion']
  return (
    <Card>
      {console.log('select' , selection , 'message' , message)}
      <CardHeader title='Send Message' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
            <FormControl fullWidth>
            <InputLabel id='select-contact'>{`Select an option`}</InputLabel>
            <Select
             defaultValue={selection}
             id='select-contact'
             labelId='select-contact'
             value={selection}
             onChange={e => setSelection(e.target.value)}
            >
              {options.map(option => <MenuItem defaultValue='' value={option} key={options.indexOf(option)}>{option}</MenuItem>)}
            </Select>
            </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                value={message}
                onChange={e => setMessage(e.target.value)}
                minRows={3}
                label='Message'
                placeholder='Please write here...'
                sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <MessageOutline />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type='submit' variant='contained' size='large' sx={{ display: 'flex', justifyContent: 'center' }} disabled={message === '' || selection === ''}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ContactForm
