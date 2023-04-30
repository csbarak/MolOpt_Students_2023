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
import api from './api'
import Notification from './notification'
import { useCookies } from 'react-cookie'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(0)
  const [rowPage, setRowPage] = useState(5)
  const [cookies, setCookie, removeCookie] = useCookies()

  useEffect(async () => {
    return await api
      .post('get_all_users/', { email: cookies.email }, { headers: { Authorization: `Token ${cookies.token}` } })
      .then(res => {
        if (res.status >= 200 && res.status < 300) {
          setUsers(res.data[0])
        }
      })
      .catch(err => Notification('Failed to fetch users', 'error').apply())
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
            <TableCell align='right'>Admin/User</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.slice(page * rowPage, page * rowPage + rowPage).map(user => {
            return <Row key={user.id} row={user} users={users} setUsers={setUsers} />
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

const Row = props => {
  const { row } = props
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState('User')
  const [cookies, setCookie, removeCookie] = useCookies()
  const [users, setUsers] = useState(props.users)
  const [disabled, setDisabled] = useState(true)

  const handleChange = async e => {
    const user = users.filter(user => user.email === e.target.id)[0]
    if (e.target.value === 'User' && !user.is_admin) {
      Notification('You cannot change for the same role', 'success').apply()
      return setDisabled(true)
    }

    if (e.target.value === 'Admin' && user.is_admin) {
      Notification('You cannot change for the same role', 'success').apply()
      return setDisabled(true)
    }

    if (selected === 'User') {
      return await api
        .post('/remove_admin/', { email: e.target.id })
        .then(res => {
          if (200 <= res.status && res.status < 300) {
            return Notification('Role changed to User successfully', 'success').apply()
          }
        })
        .catch(err => {
          return Notification('Failed to change role to User', 'error').apply()
        })
    } else if (selected === 'Admin') {
      return await api
        .post('/create_admin/', { email: e.target.id })
        .then(res => {
          if (200 <= res.status && res.status < 300) {
            return Notification('Role changed to Admin successfully', 'success').apply()
          }
        })
        .catch(err => {
          return Notification('Failed to change role to Admin', 'error').apply()
        })
    }
  }

  const handleDelete = async e => {
    if (e.target.id === cookies.email) {
      return Notification('You cannot delete yourself', 'error').apply()
    }

    const user = users.filter(user => user.email === e.target.id)[0]
    if (user.is_admin) {
      return Notification('You cannot delete an admin', 'error').apply()
    }

    return await api
      .post('delete_user/', { email: e.target.id }, { headers: { Authorization: `Token ${cookies.token}` } })
      .then(res => {
        if (200 <= res.status && res.status < 300) {
          props.setUsers(users.filter(user => user.email !== e.target.id))
          return Notification(`${e.target.id} was deleted successfully`, 'success').apply()
        }
      })
      .catch(err => {
        return Notification(`Failed to delete the user ${e.target.id}`, 'error').apply()
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
        <TableCell component='th' scope='row'>
          {row.id}
        </TableCell>
        <TableCell align='right'>{row.first_name + ' ' + row.last_name}</TableCell>
        <TableCell align='right'>{row.email}</TableCell>
        <TableCell align='right'>{row.affiliation}</TableCell>
        <TableCell align='right'>{row.position}</TableCell>
        <TableCell align='right'>{row.is_staff ? 'Admin' : 'User'}</TableCell>
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
                  <Button variant='outlined' id={row.email} color='error' onClick={e => handleDelete(e)}>
                    Delete user
                  </Button>
                  <Select
                    variant='outlined'
                    id='form-layouts-separator-select'
                    labelId='form-layouts-separator-select-label'
                    defaultValue={selected}
                    value={selected}
                    onChange={e => {
                      setSelected(e.target.value)
                      setDisabled(false)
                    }}
                  >
                    {['User', 'Admin'].map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>

                  <Button variant='outlined' id={row.email} onClick={handleChange} disabled={disabled}>
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

export default AdminUsers
