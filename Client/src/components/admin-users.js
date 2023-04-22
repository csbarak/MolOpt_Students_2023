import React from 'react'
import { useState, useEffect } from 'react'
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  Select,
  MenuItem
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import axios from 'axios'
import api from './api'
import Notification from './notification'

const Row = props => {
  const { row } = props
  const [open, setOpen] = useState(false)
  const [select, setSelect] = useState(['User', 'Admin'])
  const [selected, setSelected] = useState('User')

  const handleChange = async event => {
    if (selected === 'User')
    {
      return await api
      .post('/remove_admin/', { "user_id": row.id })
      .then(res => {
        if (200 <= res.status && res.status < 300) {
          return Notification('Role changed to USER successfully', 'success').apply()
        }
      })
      .catch(err => {
        console.log(err)
        return Notification('Failed to change role to USER', 'error').apply()
      })
    }
    else if (selected === 'Admin')
    {
      return await api
      .post('/create_admin/', { "user_id": row.id })
      .then(res => {
        if (200 <= res.status && res.status < 300) {
          return Notification('Role changed to ADMIN successfully', 'success').apply()
        }
      })
      .catch(err => {
        console.log(err)
        return Notification('Failed to change role to ADMIN', 'error').apply()
      })
    }
    else
    {
      // Do nothing
    }
  }

  const handleDelete = async event => {
    const emailToDelete = row.email
    return await api
      .post('delete-user/', { "user_id": emailToDelete })
      .then(res => {
        if (200 <= res.status && res.status < 300) {
          return Notification(`${emailToDelete} was deleted successfully`, 'success').apply()
        }
      })
      .catch(err => {
        console.log(err)
        return Notification(`Failed to delete the user ${emailToDelete}`, 'error').apply()
      })
  }

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row'>{row.id}</TableCell>
        <TableCell align='right'>{row.first_name + " " + row.last_name}</TableCell>
        <TableCell align='right'>{row.email}</TableCell>
        <TableCell align='right'>{row.affiliation}</TableCell>
        <TableCell align='right'>{row.position}</TableCell>
        {/* <TableCell align='right'>{row.isAdmin}</TableCell> */}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size='small'>
                <TableHead>
                  <TableRow />
                </TableHead>
                <br />
                <TableBody align='center' sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                  <Button variant='outlined' color="error" onClick={handleDelete}>
                    Delete user
                  </Button>
                  <Select
                    variant='outlined'
                    label={`Train/Predict with top features`}
                    id='form-layouts-separator-select'
                    labelId='form-layouts-separator-select-label'
                    defaultValue={selected}
                    value={selected}
                    onChange={e => setSelected(e.target.value)}
                  >
                    {select.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                  <Button variant='outlined' onClick={handleChange}>
                    Save Changes
                  </Button>
                </TableBody>
                <br />
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(0)
  const [rowPage, setRowPage] = useState(5)

  useEffect(async () => {
    return await api
      .get('/users/')
      .then(res => {
        if (res.status >= 200 && res.status < 300) {
          setUsers(res.data)
        }
      })
      .catch(err => console.log(err))
  }, [])

  const handleChangePage = (event, newpage) => {
    setPage(newpage)
  }

  const handleChangeRowsPerPage = event => {
    setRowPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  return (
    <TableContainer component={Paper}>
      <Table aria-label='collapsible table'>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>ID</TableCell>
            <TableCell align='right'>Name</TableCell>
            <TableCell align='right'>Email</TableCell>
            <TableCell align='right'>Affiliation</TableCell>
            <TableCell align='right'>Position</TableCell>
            {/* <TableCell align='right'>Admin/User</TableCell>             */}
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.slice(page * rowPage, page * rowPage + rowPage).map(user => {
            console.log(user)
            return <Row key={user.id} row={user} />
          })}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={users.length}
        rowsPerPage={rowPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  )
}

export default AdminUsers
