import React, { useState } from 'react'
// ** MUI Imports
import {
  Box,
  Card,
  Table,
  TableRow,
  Chip,
  TableHead,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
  Tooltip
} from '@mui/material'

const rows = [
  {
    age: 27,
    status: 'running',
    date: '09/27/2018',
    name: 'Task1',
    time: '16:20',
    details: 'some sort of details',
    files: 'file 1 file 2'
  },
  {
    age: 61,
    date: '09/23/2016',
    time: '16:20',
    status: 'running',
    name: 'Task2',
    details: 'some sort of details',
    files: 'file 1 file 2'
  },
  {
    age: 59,
    date: '10/15/2017',
    name: 'Task3',
    status: 'rejected',
    time: '16:20',
    details: 'some sort of details',
    files: 'file 1 file 2'
  },
  {
    age: 30,
    date: '06/12/2018',
    status: 'success',
    time: '16:20',
    name: 'Task4',
    details: 'some sort of details',
    files: 'file 1 file 2'
  },
  {
    age: 66,
    status: 'success',
    date: '03/24/2018',
    time: '16:20',
    name: 'Task5',
    files: 'file 1 file 2',
    details: 'some sort of details'
  },
  {
    age: 33,
    date: '08/25/2017',
    time: '16:20',
    name: 'Task6',
    status: 'failed',
    details: 'some sort of details',
    files: 'file 1 file 2'
  },
  {
    age: 61,
    status: 'failed',
    date: '06/01/2017',
    time: '16:20',
    name: 'Task7',
    files: 'file 1 file 2',
    details: 'some sort of details'
  },
  {
    age: 22,
    date: '12/03/2017',
    time: '16:20',
    name: 'Task1',
    status: 'failed',
    files: 'file 1 file 2',
    details: 'some sort of details'
  }
]

const statusObj = {
  running: { color: 'info' },
  failed: { color: 'error' },
  current: { color: 'primary' },
  rejected: { color: 'warning' },
  success: { color: 'success' }
}

const TasksTable = () => {
  const [page, setPage] = useState(0)
  const [rowPage, setRowPage] = useState(5)

  const handleChangePage = (e, newpage) => {
    setPage(newpage)
  }

  const handleChangeRowsPerPage = e => {
    setRowPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  const handleDownload = e => {
    e.preventDefault()
    console.log('click')
  }

  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell align='left'>Name</TableCell>
              <TableCell align='left'>Date</TableCell>
              <TableCell align='left'>Time</TableCell>
              <TableCell align='left'>Status</TableCell>
              <TableCell align='left'>Result</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowPage, page * rowPage + rowPage).map(row => (
              <TableRow hover key={row.name} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.name}</Typography>
                    <Typography variant='caption'>{row.files}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.time}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={statusObj[row.status].color}
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title='Not Implemented yet' placement='left' arrow>
                    <a href='#' onClick={e => handleDownload(e)}>
                      Download
                    </a>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={rows.length}
          rowsPerPage={rowPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Card>
  )
}

export default TasksTable
