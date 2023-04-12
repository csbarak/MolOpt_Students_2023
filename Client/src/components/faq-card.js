import React from 'react'
// ** MUI Imports
import { Box, Card, Divider, Collapse, Typography, IconButton, CardContent, CardActions } from '@mui/material'

// ** Icons Imports
import ChevronUp from 'mdi-material-ui/ChevronUp'
import ChevronDown from 'mdi-material-ui/ChevronDown'

const FAQCard = ({ question, answer, isAnswer, setIsAnswer, index }) => {
  const handleClick = e => {
    e.preventDefault()
    const newItems = [...isAnswer]
    newItems[index] = !isAnswer[index]
    setIsAnswer(newItems)
  }
  return (
    <Card>
      <CardContent>
        <Typography variant='body2' fontSize={15}>
          {question}
        </Typography>
      </CardContent>

      <CardActions className='card-action-dense'>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <IconButton size='small' onClick={e => handleClick(e)}>
            {isAnswer[index] ? (
              <ChevronUp sx={{ fontSize: '1.875rem' }} />
            ) : (
              <ChevronDown sx={{ fontSize: '1.875rem' }} />
            )}
          </IconButton>
        </Box>
      </CardActions>
      <Collapse in={isAnswer[index]}>
        <Divider sx={{ margin: 0 }} />
        <CardContent>
          <Typography variant='body2' fontSize={15}>
            {answer}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default FAQCard
