import * as React from 'react'
import { useState, useEffect } from 'react'
import { Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import api from '../components/api'
import { useCookies } from 'react-cookie'
import Notification from 'src/components/notification'

import 'bootstrap/dist/css/bootstrap.min.css'
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const GetNumberOfAdmins = usersList => {
  const numOfAdmins = usersList.reduce((acc, user) => {
    if (user.is_staff) return acc + 1
    else return acc
  }, 0)

  return numOfAdmins
}

const GetNumberOfAlgoRuns = (tasksList, algoName) => {
  const numOfRuns = tasksList.reduce((acc, task) => {
    if (task.algorithm_name === algoName) return acc + 1
    else return acc
  }, 0)

  return numOfRuns
}

const CreateAlgosData = (tasks, algoName) => {
  const data = {}
  tasks.forEach(task => {
    if (task.algorithm_name === algoName) {
      const date = new Date(task.time).toLocaleString('default', { month: 'short', year: 'numeric' })
      if (!data[date]) data[date] = { name: date, Fail: 0, Pending: 0, Pass: 0 }

      if (task.status === 'failed') data[date].Fail += 1
      else if (task.status === 'running') data[date].Pending += 1
      // finished
      else data[date].Pass += 1
    }
  })
  return Object.values(data)
}

const Statistics = () => {
  const colors = ['#4f86f7', '#8dd1e1', '#ff9d00', '#b66dff']

  const [dataBar, setDataBar] = useState([])
  const [dataLineAlignment, setDataLineAlignment] = useState([])
  const [dataLineFeatureExtraction, setDataLineFeatureExtraction] = useState([])
  const [dataLineMachineLearning, setDataLineMachineLearning] = useState([])
  const [dataLineAutoProcess, setDataLineAutoProcess] = useState([])
  const [dataPie, setDataPie] = useState([])
  const [cookies, setCookie, removeCookie] = useCookies()

  useEffect(() => {
    if (
      cookies === undefined ||
      cookies.email === undefined ||
      cookies.token === undefined ||
      cookies.email === '' ||
      cookies.token === '' ||
      cookies.email === null ||
      cookies.token === null
    ) {
      alert('You are not logged in')
      return window.location.replace('/login')
    }
  }, [])

  // Get all users:
  useEffect(async () => {
    return await api
      .post('get_all_users/', { email: cookies.email }, { headers: { Authorization: `Token ${cookies.token}` } })
      .then(res => {
        if (res.status >= 200 && res.status < 300) {
          setDataBar([
            { name: 'Users', Counter: res.data[0].length },
            { name: 'Admins', Counter: GetNumberOfAdmins(res.data[0]) }
          ])
        }
      })
      .catch(err => Notification('Failed to fetch users', 'error').apply())
  }, [])

  // Get all tasks:
  useEffect(async () => {
    return await api
      .post('/get_all_runs/')
      .then(res => {
        if (res.status >= 200 && res.status < 300) {
          //setTasks(res.data)
          setDataPie([
            { name: 'Alignmnet', value: GetNumberOfAlgoRuns(res.data, 'Alignment') },
            { name: 'Feature Extraction', value: GetNumberOfAlgoRuns(res.data, 'Feature Extraction') },
            { name: 'Machine Learnings', value: GetNumberOfAlgoRuns(res.data, 'Machine Learning') },
            { name: 'Auto Proccess', value: GetNumberOfAlgoRuns(res.data, 'Auto Process') }
          ])
          setDataLineAlignment(CreateAlgosData(res.data, 'Alignment'))
          setDataLineFeatureExtraction(CreateAlgosData(res.data, 'Feature Extraction'))
          setDataLineMachineLearning(CreateAlgosData(res.data, 'Machine Learning'))
          setDataLineAutoProcess(CreateAlgosData(res.data, 'Auto Process'))
        }
      })
      .catch(err => Notification('Failed to fetch tasks', 'error').apply())
  }, [])

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <br />
          <div className='container'>
            <div className='table'>
              <div className='row'>
                <div className='col-sm'>
                  {/* Pie Graph */}
                  <Typography variant='body1' sx={{ fontSize: '25px' }}>
                    {' '}
                    Split Of Types Of Algorithm Runs{' '}
                  </Typography>
                  <ResponsiveContainer width='95%' height={350}>
                    <PieChart margin={{ top: 0, right: 5, left: 0, bottom: 5 }}>
                      <Pie
                        dataKey='value'
                        isAnimationActive={false}
                        data={dataPie}
                        cx={200}
                        cy={150}
                        outerRadius={80}
                        label
                      >
                        {dataPie.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className='col-sm'>
                  {/* Bar Graph */}
                  <Typography variant='body1' sx={{ fontSize: '25px' }}>
                    {' '}
                    Number Of Users\Admins In MolOpt{' '}
                  </Typography>
                  <ResponsiveContainer width='95%' height={400}>
                    <BarChart data={dataBar} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='name' />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey='Counter' fill='#8884d8' />
                    </BarChart>
                  </ResponsiveContainer>
                  <Divider />
                </div>
              </div>
              <div className='row'>
                {/* Line Graph - Alignment */}
                <Typography variant='body1' sx={{ fontSize: '25px' }}>
                  {' '}
                  Runs Status - Alignment Algorithm{' '}
                </Typography>
                <ResponsiveContainer width='95%' height={400}>
                  <LineChart data={dataLineAlignment} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <XAxis dataKey='name' />
                    <YAxis />
                    <CartesianGrid stroke='#eee' strokeDasharray='5 5' />
                    <Tooltip />
                    <Legend />
                    <Line type='monotone' dataKey='Fail' stroke='#ff5353' />
                    <Line type='monotone' dataKey='Pending' stroke='#FFD700' />
                    <Line type='monotone' dataKey='Pass' stroke='#82ca9d' />
                  </LineChart>
                </ResponsiveContainer>
                <Divider />

                {/* Line Graph - Feature Extraction */}
                <Typography variant='body1' sx={{ fontSize: '25px' }}>
                  {' '}
                  Runs Status - Feature Extraction Algorithm{' '}
                </Typography>
                <ResponsiveContainer width='95%' height={400}>
                  <LineChart data={dataLineFeatureExtraction} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <XAxis dataKey='name' />
                    <YAxis />
                    <CartesianGrid stroke='#eee' strokeDasharray='5 5' />
                    <Tooltip />
                    <Legend />
                    <Line type='monotone' dataKey='Fail' stroke='#ff5353' />
                    <Line type='monotone' dataKey='Pending' stroke='#FFD700' />
                    <Line type='monotone' dataKey='Pass' stroke='#82ca9d' />
                  </LineChart>
                </ResponsiveContainer>
                <Divider />

                {/* Line Graph - Machine Learning */}
                <Typography variant='body1' sx={{ fontSize: '25px' }}>
                  {' '}
                  Runs Status - Machine Learning Algorithms{' '}
                </Typography>
                <ResponsiveContainer width='95%' height={400}>
                  <LineChart data={dataLineMachineLearning} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <XAxis dataKey='name' />
                    <YAxis />
                    <CartesianGrid stroke='#eee' strokeDasharray='5 5' />
                    <Tooltip />
                    <Legend />
                    <Line type='monotone' dataKey='Fail' stroke='#ff5353' />
                    <Line type='monotone' dataKey='Pending' stroke='#FFD700' />
                    <Line type='monotone' dataKey='Pass' stroke='#82ca9d' />
                  </LineChart>
                </ResponsiveContainer>
                <Divider />

                {/* Line Graph - Auto Process */}
                <Typography variant='body1' sx={{ fontSize: '25px' }}>
                  {' '}
                  Runs Status - Auto Process Algorithms{' '}
                </Typography>
                <ResponsiveContainer width='95%' height={400}>
                  <LineChart data={dataLineAutoProcess} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <XAxis dataKey='name' />
                    <YAxis />
                    <CartesianGrid stroke='#eee' strokeDasharray='5 5' />
                    <Tooltip />
                    <Legend />
                    <Line type='monotone' dataKey='Fail' stroke='#ff5353' />
                    <Line type='monotone' dataKey='Pending' stroke='#FFD700' />
                    <Line type='monotone' dataKey='Pass' stroke='#82ca9d' />
                  </LineChart>
                </ResponsiveContainer>
                <Divider />
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  )
}

export default Statistics
