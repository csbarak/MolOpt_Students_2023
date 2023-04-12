import React from 'react'
// ** MUI Imports
import { Box, Card, Avatar, IconButton, Typography, CardContent } from '@mui/material'

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical'

const CardStatsVertical = props => {
  // ** Props
  const { title, subtitle, color, icon, stats, trend, trendNumber } = props

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', marginBottom: 5.5, alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Avatar sx={{ boxShadow: 3, marginRight: 4, color: 'common.white', backgroundColor: `${color}.main` }}>
            {icon}
          </Avatar>
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        </Box>
        <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{title}</Typography>
        <Box sx={{ marginTop: 1.5, display: 'flex', flexWrap: 'wrap', marginBottom: 1.5, alignItems: 'flex-start' }}>
          <Typography variant='h6' sx={{ mr: 2 }}>
            {stats}
          </Typography>
          <Typography
            component='sup'
            variant='caption'
            sx={{ color: trend === 'positive' ? 'success.main' : 'error.main' }}
          >
            {trendNumber}
          </Typography>
        </Box>
        <Typography variant='caption'>{subtitle}</Typography>
      </CardContent>
    </Card>
  )
}

export default CardStatsVertical

CardStatsVertical.defaultProps = {
  color: 'primary',
  trend: 'positive'
}
