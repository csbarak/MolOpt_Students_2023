import React from 'react'
import Carousel from 'react-material-ui-carousel'
import { Paper } from '@mui/material'
import Image from 'next/image'

const ImageCarusel = ({ props }) => {
  const Item = ({ item }) => {
    return (
      <Paper>
        <Image layout='fill' src={item} />
      </Paper>
    )
  }
  return (
    <Carousel height={600} fullHeightHover sx={{ width: '100%' }}>
      {props?.map((image, index) => (
        <Item key={index} item={image}></Item>
      ))}
    </Carousel>
  )
}

export default ImageCarusel
