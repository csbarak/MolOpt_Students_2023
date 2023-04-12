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

const Row = props => {
  const { row } = props
  const [open, setOpen] = useState(false)
  const [select, setSelect] = useState(['Admin', 'User'])
  const [selected, setSelected] = useState('')

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
        <TableCell align='right'>{row.firstName}</TableCell>
        <TableCell align='right'>{row.email}</TableCell>
        <TableCell align='right'>{row.company.name}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size='small'>
                <TableHead>
                  <TableRow />
                </TableHead>
                <TableBody align='center' sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                  <Button variant='outlined'>Delete user</Button>
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
                  <Button variant='outlined'>Save Changes</Button>
                </TableBody>
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
    return await axios.get('https://dummyjson.com/users').then(res => setUsers(res.data.users))
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
            <TableCell align='right'>Company</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.slice(page * rowPage, page * rowPage + rowPage).map(user => {
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
