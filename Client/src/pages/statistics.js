import * as React from 'react'
import { useState, useEffect } from 'react'
import { Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import api from '../components/api'

import 'bootstrap/dist/css/bootstrap.min.css'
import {
  RadialBarChart, 
  RadialBar,
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

const Statistics = () => {
  const colors = ['#4f86f7', '#8dd1e1', '#ff9d00', '#b66dff']

  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [countersData, setCountersData] = useState({
    visitorsCount: 10,
    registeredCount: 5,
    AdminsCount: 2,
    AlgosRunsCount: 100
  })
  
  //fake data for runs - TODO: Change to real runs data!
  const dataBar = [
    { name: 'Jan', value: 10 },
    { name: 'Feb', value: 20 },
    { name: 'Mar', value: 30 },
    { name: 'Apr', value: 40 },
    { name: 'May', value: 50 },
    { name: 'Jun', value: 30 },
    { name: 'Jul', value: 40 },
    { name: 'Aug', value: 10 },
    { name: 'Sep', value: 30 },
    { name: 'Oct', value: 40 },
    { name: 'Nov', value: 15 },
    { name: 'Dec', value: 20 }
  ]

  const dataLine = [
    { name: 'Jan', Fail: 4000, Pending: 2400, Pass: 2400 },
    { name: 'Feb', Fail: 3000, Pending: 2210, Pass: 1398 },
    { name: 'Mar', Fail: 2000, Pending: 2290, Pass: 9800 },
    { name: 'Apr', Fail: 2780, Pending: 2000, Pass: 3908 },
    { name: 'May', Fail: 1890, Pending: 2181, Pass: 4800 },
    { name: 'Jun', Fail: 2390, Pending: 2500, Pass: 3800 },
    { name: 'Jul', Fail: 3490, Pending: 2100, Pass: 4300 },
    { name: 'Aug', Fail: 4000, Pending: 2400, Pass: 6400 },
    { name: 'Sep', Fail: 3000, Pending: 2210, Pass: 3398 },
    { name: 'Oct', Fail: 2000, Pending: 2290, Pass: 9800 },
    { name: 'Nov', Fail: 2780, Pending: 2000, Pass: 3908 },
    { name: 'Dec', Fail: 1890, Pending: 2181, Pass: 4800 }
  ]

  const dataPie = [
    { name: 'Alignmnet', value: 100 },
    { name: 'Feature Extraction', value: 200 },
    { name: 'Machine Learnings', value: 300 },
    { name: 'Auto Proccess', value: 700 }
  ]

  const dataRadial = [
    { name: '18-24', uv: 31.47, pv: 2400, fill: '#8884d8' },
    { name: '25-29', uv: 26.69, pv: 4567, fill: '#83a6ed' },
    { name: '30-34', uv: 15.69, pv: 1398, fill: '#8dd1e1' },
    { name: '35-39', uv: 8.22, pv: 9800, fill: '#82ca9d' },
    { name: '40-49', uv: 8.63, pv: 3908, fill: '#a4de6c' },
    { name: '50+',    uv: 2.63, pv: 4800, fill: '#d0ed57' },
    { name: 'unknow', uv: 6.67, pv: 4800, fill: '#ffc658' },
  ];  

  // Get all users:
  useEffect(async () => {
    return await api
      .get('/users/')
      .then(res => {
        if (res.status >= 200 && res.status < 300) {
          setUsers(res.data)
          console.log(res.data)
        }
      })
      .catch(err => console.log(err))
  }, [])
  // Get all tasks:
  useEffect(async () => {
    return await api
      .get('/get_all_runs/')
      .then(res => {
        if (res.status >= 200 && res.status < 300) {
          setTasks(res.data)
          console.log(res.data)
        }
      })
      .catch(err => console.log(err))
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
                  <div className='row-sm'>
                    {/* Bar Graph */}
                    <h4 className='text-decoration-underline fw-lighter'>New Users In MolOpt</h4>
                    <ResponsiveContainer width='95%' height={400}>
                      <BarChart data={dataBar} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey='value' fill='#8884d8' />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className='row-sm'>
                    {/* Line Graph */}
                    <h4 className='text-decoration-underline fw-lighter'>Success/Failure Runs Of Algorithms</h4>
                    <ResponsiveContainer width='95%' height={400}>
                      <LineChart data={dataLine} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
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
                  </div>
                </div>
                <div className='col-sm'>
                  <div className='row-sm'>
                    {/* Radial-Bar Chart */}
                    <h4 className='text-decoration-underline fw-lighter'>Important MolOpt's Data</h4>
                    <ResponsiveContainer width="100%" height={400}>
                      <RadialBarChart width={500} height={300} cx={150} cy={150} innerRadius={20} outerRadius={140} barSize={10} data={dataRadial}>
                        <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise dataKey="uv" />
                        <Legend iconSize={10} width={120} height={140} layout="vertical" verticalAlign="middle" align="right" />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    {/* Users Info */}
                    <h4 className='text-decoration-underline fw-lighter'>Important MolOpt's Data</h4>
                    <Grid container spacing={5}>
                      <Grid item xs={20}>
                        <Typography variant='body1' sx={{ fontSize: '20px' }}>
                          Number of visitors visited MolOpt : {countersData.visitorsCount}
                        </Typography>
                      </Grid>
                      <Divider />
                      <Grid item xs={20}>
                        <Typography variant='body1' sx={{ fontSize: '20px' }}>
                          Number of registered users in MolOpt : {countersData.registeredCount}
                        </Typography>
                      </Grid>
                      <Divider />
                      <Grid item xs={20}>
                        <Typography variant='body1' sx={{ fontSize: '20px' }}>
                          Number of admin users in MolOpt : {countersData.AdminsCount}
                        </Typography>
                      </Grid>
                      <Divider />
                      <Grid item xs={20}>
                        <Typography variant='body1' sx={{ fontSize: '20px' }}>
                          Number of algorithm runs in MolOpt : {countersData.AlgosRunsCount}
                        </Typography>
                      </Grid>
                    </Grid>
                  </div>
                  <div className='row-sm'>
                    {/* Pie Graph */}
                    <div style={{ marginTop: '135px' }}>
                      <h4 className='text-decoration-underline fw-lighter'>Split Of Types Of Algorithm Runs</h4>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  )
}

export default Statistics
