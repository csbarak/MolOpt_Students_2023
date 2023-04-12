import * as React from 'react'
import { useState } from 'react'
import { Button, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import FAQCard from 'src/components/faq-card'

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

const Statistics = () => {
  const [isAnswer, setIsAnswer] = useState([false, false, false, false])
  const [answers, setAnswers] = useState({
    visitorsCount: 10,
    registeredCount: 5,
    AdminsCount: 2,
    AlgosRunsCount: 100
  })
  const colors = ['#4f86f7', '#6ed34c', '#FFD700', '#b66dff', '#ff5353', '#ff9d00', '#7a7a7a', '#8dd7cf']

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
    { name: 'Jan', Fail: 4000, Skipped: 2400, Pass: 2400 },
    { name: 'Feb', Fail: 3000, Skipped: 2210, Pass: 1398 },
    { name: 'Mar', Fail: 2000, Skipped: 2290, Pass: 9800 },
    { name: 'Apr', Fail: 2780, Skipped: 2000, Pass: 3908 },
    { name: 'May', Fail: 1890, Skipped: 2181, Pass: 4800 },
    { name: 'Jun', Fail: 2390, Skipped: 2500, Pass: 3800 },
    { name: 'Jul', Fail: 3490, Skipped: 2100, Pass: 4300 },
    { name: 'Aug', Fail: 4000, Skipped: 2400, Pass: 6400 },
    { name: 'Sep', Fail: 3000, Skipped: 2210, Pass: 3398 },
    { name: 'Oct', Fail: 2000, Skipped: 2290, Pass: 9800 },
    { name: 'Nov', Fail: 2780, Skipped: 2000, Pass: 3908 },
    { name: 'Dec', Fail: 1890, Skipped: 2181, Pass: 4800 }
  ]

  const dataPie = [
    { name: 'Alignmnet', value: 100 },
    { name: 'Feature Extraction', value: 200 },
    { name: 'XGBoost', value: 300 },
    { name: 'Decision Tree Regression', value: 400 },
    { name: 'Lasso Regressor', value: 500 },
    { name: 'Binding Score', value: 600 },
    { name: 'Auto Proccess', value: 700 }
  ]

  return (
    <>
      <br />
      <div className='container'>
        <div className='table'>
          <div className='row'>
            <div className='col-sm'>
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

              {/* Line Graph */}
              <h4 className='text-decoration-underline fw-lighter'>Success/Failure Runs Of Algorithms</h4>
              <ResponsiveContainer width='95%' height={400}>
                <LineChart data={dataLine} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <XAxis dataKey='name' />
                  <YAxis />
                  <CartesianGrid stroke='#eee' strokeDasharray='5 5' />
                  <Tooltip />
                  <Legend />
                  <Line type='monotone' dataKey='Fail' stroke='#8884d8' />
                  <Line type='monotone' dataKey='Skipped' stroke='#FFD700' />
                  <Line type='monotone' dataKey='Pass' stroke='#82ca9d' />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className='col-sm'>
              {/* Users Info */}
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant='body1' sx={{ fontSize: '20px' }}>
                    visitors visited MolOpt : {answers.visitorsCount}
                  </Typography>
                </Grid>
                <Divider />
                <Grid item xs={12}>
                  <Typography variant='body2'>Registers users in MolOpt : {answers.registeredCount}</Typography>
                </Grid>
                <Divider />
                <Grid item xs={12}>
                  <Typography variant='body2'>Admin users in MolOpt : {answers.AdminsCount}</Typography>
                </Grid>
                <Divider />
                <Grid item xs={12}>
                  <Typography variant='body2'>Run of Algorithm in MolOpt : {answers.AlgosRunsCount}</Typography>
                </Grid>
              </Grid>

              {/* Google Analytics */}
            </div>
          </div>
          <div className='row'>
            <div className='col-sm'>
              {/* Pie Graph */}
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
    </>
  )
}

export default Statistics
