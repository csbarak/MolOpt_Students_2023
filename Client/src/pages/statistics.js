import * as React from 'react'
import { useState, useEffect } from 'react'
import { Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import api from '../components/api'

import 'bootstrap/dist/css/bootstrap.min.css'
import { 
  PieChart, Pie, BarChart, Bar, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const GetNumberOfAdmins = (usersList) => {
  const numOfAdmins = usersList.reduce((acc, user) => {
    if (user.isAdmin) {
      return acc + 1;
    } else {
      return acc;
    }
  }, 0);

  return numOfAdmins;
}

const GetNumberOfAlgoRuns = (tasksList, algoName) => {
  const numOfRuns = tasksList.reduce((acc, task) => {
    if (task.algorithm_name === algoName)
      return acc + 1;
    else
    return acc;
  }, 0);

  return numOfRuns;   
}

const CreateAlgosData = (tasks, algoName) => {
  const data = {};
  tasks.forEach(task => {
    if (task.algorithm_name === algoName)
    {
      const date = new Date(task.time).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!data[date]) {
        data[date] = { name: date, Fail: 0, Pending: 0, Pass: 0 };
      }
      if (task.status === 'failed') {
        data[date].Fail += 1;
      } else if (task.status === 'running') {
        data[date].Pending += 1;
      } else { // finished
        data[date].Pass += 1;
      }
    }
  });
  return Object.values(data);
};



const Statistics = () => {
  const colors = ['#4f86f7', '#8dd1e1', '#ff9d00', '#b66dff']
  // const [users, setUsers] = useState([])
  // const [tasks, setTasks] = useState([])

  const [dataBar, setDataBar] = useState([])
  const [dataLineAlignment, setDataLineAlignment] = useState([])
  const [dataLineFeatureExtraction, setDataLineFeatureExtraction] = useState([])
  const [dataLineMachineLearning, setDataLineMachineLearning] = useState([])
  const [dataLineAutoProcess, setDataLineAutoProcess] = useState([])
  const [dataPie, setDataPie] = useState([])

  // Get all users:
  useEffect(async () => {
    return await api
      .get('/users/')
      .then(res => {
        if (res.status >= 200 && res.status < 300) {
          //setUsers(res.data)
          setDataBar([
            // { name: 'Number Of Visitors',   value: 10 },
            { name: 'Users',  Counter: res.data.length },
            { name: 'Admins', Counter: 2 /* GetNumberOfAdmins(users) */ },
            { name: 'Owners', Counter: 1 }    /* Barak Only! */
          ])    
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
          //setTasks(res.data)
          setDataPie([
            { name: 'Alignmnet',          value: GetNumberOfAlgoRuns(res.data, 'Alignment') },
            { name: 'Feature Extraction', value: GetNumberOfAlgoRuns(res.data, 'Feature Extraction') },
            { name: 'Machine Learnings',  value: GetNumberOfAlgoRuns(res.data, 'Machine Learning') },
            { name: 'Auto Proccess',      value: GetNumberOfAlgoRuns(res.data, 'Auto Process') }
          ])
          setDataLineAlignment(CreateAlgosData(res.data, 'Alignment'))
          setDataLineFeatureExtraction(CreateAlgosData(res.data, 'Feature Extraction'))
          setDataLineMachineLearning(CreateAlgosData(res.data, 'Machine Learning'))
          setDataLineAutoProcess([CreateAlgosData(res.data, 'Auto Process')])
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
                  {/* Pie Graph */}
                  <Typography variant='body1' sx={{ fontSize: '25px' }}> Split Of Types Of Algorithm Runs </Typography>
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
                  <Typography variant='body1' sx={{ fontSize: '25px' }}> Number Of Users\Admins In MolOpt </Typography>
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
                <Typography variant='body1' sx={{ fontSize: '25px' }}> Runs Status - Alignment Algorithm </Typography>
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
                <Typography variant='body1' sx={{ fontSize: '25px' }}> Runs Status - Feature Extraction Algorithm </Typography>
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
                <Typography variant='body1' sx={{ fontSize: '25px' }}> Runs Status - Machine Learning Algorithms </Typography>
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
                <Typography variant='body1' sx={{ fontSize: '25px' }}> Runs Status - Auto Process Algorithms </Typography>
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
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  )
}

export default Statistics
