import React, { useEffect, useState } from 'react'
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
import api from './api'
import { useCookies } from 'react-cookie'

const statusObj = {
  running: { color: 'info' },
  failed: { color: 'error' },
  current: { color: 'primary' },
  rejected: { color: 'warning' },
  finished: { color: 'success' }
}

const TasksTable = () => {
  const [page, setPage] = useState(0)
  const [rowPage, setRowPage] = useState(5)
  const [tasks, setTasks] = useState([])
  const [cookies, setCookie, removeCookie] = useCookies(['id', 'token'])
  const [file, setFile] = useState(null)

  useEffect(async () => {
    return await api
      .post('get_user_runs/', { email: cookies.id })
      .then(res => setTasks(res.data))
      .catch(err => console.log(err))
  }, [])

  const handleChangePage = (e, newpage) => {
    setPage(newpage)
  }

  const handleChangeRowsPerPage = e => {
    setRowPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  const handleDownload = async e => {
    e.preventDefault()
    return await api
      .post('download_result/', { id: e.target.id })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'test.zip')
        document.body.appendChild(link)
        link.click()
      })
      .catch(err => console.log(err))
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
            {tasks
              ?.reverse()
              .slice(page * rowPage, page * rowPage + rowPage)
              .map(row => (
                <TableRow hover key={row.id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                  <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>Task {row.id}</Typography>
                      <Typography variant='caption'>{row.algorithm_name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{row?.time?.split('T')[0]}</TableCell>
                  <TableCell>{row?.time?.split('T')[1].split('.')[0]}</TableCell>
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
                      <a href='#' onClick={e => handleDownload(e)} id={row.id}>
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
          count={tasks.length}
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
