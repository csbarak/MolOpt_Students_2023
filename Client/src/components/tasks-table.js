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
  TablePagination
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/HighlightOff'
import api from './api'
import { useCookies } from 'react-cookie'
import { saveAs } from 'file-saver'
import Notification from './notification'

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
  const [cookies, setCookie, removeCookie] = useCookies()

  useEffect(async () => {
    return await api
      .post('get_user_runs/', { email: cookies.email }, { headers: { Authorization: `Token ${cookies.token}` } })
      .then(res => setTasks(res.data?.reverse()))
      .catch(err => Notification('Failed to get tasks', 'error').apply())
  }, [])

  const handleChangePage = (e, newpage) => {
    setPage(newpage)
  }

  const handleChangeRowsPerPage = e => {
    setRowPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  const handleTaskDelete = async e => {
    e.preventDefault()
    const id = e.currentTarget.id
    return await api
      .post('remove_run/', { id: id })
      .then(res => {
        if (res.status >= 200 && res.status < 300) {
          setTasks(tasks.filter(task => task.id !== parseInt(id)))
          return Notification('Task deleted successfully', 'success').apply()
        }
      })
      .catch(err => Notification('Failed to delete task', 'error').apply())
  }

  const handleDownload = async e => {
    e.preventDefault()
    try {
      const response = await fetch('https://molopt.online/api/download_result/', {
        method: 'POST',
        body: JSON.stringify({ id: e.target.id }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const blob = await response.blob()
      return saveAs(blob, 'result.zip')
    } catch (error) {
      return Notification('Failed to download result', 'error').apply()
    }
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
            {tasks.slice(page * rowPage, page * rowPage + rowPage).map(row => (
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
                <TableCell sx={{ m: 0 }}>
                  <a
                    href='#'
                    className={row.status !== 'finished' ? 'disabled-link' : ''}
                    onClick={handleDownload}
                    id={row.id}
                    sx={{ m: 0 }}
                  >
                    Download
                  </a>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={handleTaskDelete}
                    id={row.id}
                    aria-label='delete'
                    sx={{ display: row.status === 'failed' || row.status === 'finished' ? '' : 'none' }}
                  >
                    <DeleteIcon />
                  </IconButton>
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
