import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  BarSeries,
} from '@devexpress/dx-react-chart-material-ui';
import { duration } from '@mui/material';

const Statistics = () => {
  const [open, setOpen] = React.useState(true);
  
  //fake data for runs - TODO: Switch with real runs data!
  const data = [
    { id: 1,    runID: 'Run1',    durationTime: 27,   pass: true },
    { id: 2,    runID: 'Run2',    durationTime: 42,   pass: false },
    { id: 3,    runID: 'Run3',    durationTime: 18,   pass: true },
    { id: 4,    runID: 'Run4',    durationTime: 53,   pass: true },
    { id: 5,    runID: 'Run5',    durationTime: 9,    pass: false },
    { id: 6,    runID: 'Run6',    durationTime: 34,   pass: true },
    { id: 7,    runID: 'Run7',    durationTime: 48,   pass: true },
    { id: 8,    runID: 'Run8',    durationTime: 13,   pass: false },
    { id: 9,    runID: 'Run9',    durationTime: 22,   pass: true },
    { id: 10,   runID: 'Run10',   durationTime: 37,   pass: false },
  ];

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
    <div id="centered"> 
      <h1> Google Analytics - for admin usage </h1>
    </div>

    <Paper>
      <Chart data={data}>
        <ArgumentAxis />
        <ValueAxis />
        <BarSeries valueField="durationTime" argumentField="runID" />
      </Chart>
    </Paper>

    </>
  )
}

export default Statistics
