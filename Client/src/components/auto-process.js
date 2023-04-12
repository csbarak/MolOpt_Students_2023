// ** React Imports
import { useState } from 'react'
import React from 'react'
// ** MUI Imports
import {
  Checkbox,
  Autocomplete,
  Card,
  Grid,
  Button,
  Switch,
  Divider,
  MenuItem,
  TextField,
  InputLabel,
  FormControlLabel,
  Typography,
  CardContent,
  CardActions,
  Select,
  FormControl,
  IconButton,
  Tooltip
} from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete'
import { getAllFeatures } from './feature-list'
import { useEffect } from 'react'
import { clearFields, clearAll } from './clear-fields'
import { validate } from './validate-file-type'
import api from './api'
import Notification from 'src/components/notification'

const AutoProcess = ({
  setAutoController,
  value,
  selectedAlignmentFile,
  selectedLigandFile,
  selectedRefFile,
  selectedDatasetFile
}) => {
  const [auto, setAuto] = useState(false)
  const [isRDKit, setIsRDKit] = useState(false)
  const [isMordred, setIsMordred] = useState(false)
  const [isXGBoostAlgo, setIsXGBoostAlgo] = useState(false)
  const [isDTR, setIsDTR] = useState(false)
  const [isLasso, setIsLasso] = useState(false)
  const [xgboostValue, setXGBoostValues] = useState({
    learningRate: '',
    lambda: '',
    dropRate: '',
    maxDepth: '',
    alpha: ''
  })
  const [dtrValue, setDTRValues] = useState({
    maxDepth: '',
    minSample: '',
    minSampleLeaf: '',
    minWeightFraction: ''
  })
  const [lassoValue, setLassoValues] = useState(null)
  const [xgboostSelection, setXgboostSelection] = useState([])
  const [dtrSelection, setDtrSelection] = useState([])
  const [lassoSelection, setLassoSelection] = useState([])
  const [bindingSelection, setBindingSelection] = useState(null)
  const [multipleAlgoSelection, setMultipleAlgoSelection] = useState([])

  useEffect(() => {
    return clearFields(
      isXGBoostAlgo,
      isLasso,
      isDTR,
      setXGBoostValues,
      setDTRValues,
      setLassoValues,
      setXgboostSelection,
      setLassoSelection,
      setDtrSelection
    )
  }, [isXGBoostAlgo, isLasso, isDTR])

  useEffect(() => {
    return clearAll(
      isXGBoostAlgo,
      isLasso,
      isDTR,
      setXGBoostValues,
      setDTRValues,
      setLassoValues,
      setXgboostSelection,
      setLassoSelection,
      setDtrSelection,
      setAuto,
      setIsRDKit,
      setIsMordred,
      setIsXGBoostAlgo,
      setIsDTR,
      setIsLasso,
      setBindingSelection,
      setMultipleAlgoSelection
    )
  }, [value])

  const handleUploadBinding = e => {
    e.preventDefault()
    if (!validate(e.target.files[0], 'dataset')) {
      //**need to add error for uploading suffix incorrect
      return
    }
    setBindingSelection(e.target.files[0])
  }

  const errors = {
    learningRate: 'Learning rate must be a number between [0.0-1.0]',
    lambda: 'Lambda must be a number between [0.0-1.0]',
    dropRate: 'Drop rate must be a number between [0.0-1.0]',
    maxDepth: 'Max depth must be a number between [0.0-1.0]',
    alpha: 'Alpha must be a number between [0.0-1.0]',
    minSample: 'Min sample must be a number between [0.0-1.0]',
    minSampleLeaf: 'Min sample leaf must be a number between [0.0-1.0]',
    minWeightFraction: 'Min weight fraction must be a number between [0.0-1.0]'
  }

  const validateFields = () => {
    if (isXGBoostAlgo) {
      if (
        !(
          xgboostValue.learningRate === '' &&
          xgboostValue.lambda === '' &&
          xgboostValue.dropRate === '' &&
          xgboostValue.maxDepth === '' &&
          xgboostValue.alpha === '' &&
          xgboostSelection.length === 0
        ) &&
        (!xgboostValue.learningRate.match(/^(0(\.\d+)?|1(\.0+)?)$/) ||
          !xgboostValue.lambda.match(/^(0(\.\d+)?|1(\.0+)?)$/) ||
          !xgboostValue.dropRate.match(/^(0(\.\d+)?|1(\.0+)?)$/) ||
          !xgboostValue.maxDepth.match(/^(0(\.\d+)?|1(\.0+)?)$/) ||
          !xgboostValue.alpha.match(/^(0(\.\d+)?|1(\.0+)?)$/) ||
          xgboostSelection.length === 0)
      ) {
        return false
      }
    }
    if (isDTR) {
      if (
        !(
          dtrValue.maxDepth === '' &&
          dtrValue.minSample === '' &&
          dtrValue.minSampleLeaf === '' &&
          dtrValue.minWeightFraction === '' &&
          dtrSelection.length === 0
        ) &&
        (!dtrValue.maxDepth.match(/^(0(\.\d+)?|1(\.0+)?)$/) ||
          !dtrValue.minSample.match(/^(0(\.\d+)?|1(\.0+)?)$/) ||
          !dtrValue.minSampleLeaf.match(/^(0(\.\d+)?|1(\.0+)?)$/) ||
          !dtrValue.minWeightFraction.match(/^(0(\.\d+)?|1(\.0+)?)$/) ||
          dtrSelection.length === 0)
      ) {
        return false
      }
    }
    if (isLasso) {
      if (
        (lassoSelection.length !== 0 && lassoValue === null) ||
        (lassoSelection.length === 0 && lassoValue !== null)
      ) {
        return false
      }
    }
    return true
  }

  const handleOnSubmit = async e => {
    e.preventDefault()
    console.log('not good')
    if (value === '1') {
      //need to add auto process api call
      return
    }
    if (value === '2') {
      if (isRDKit) {
        const formData = new FormData()
        formData.append('mol', selectedAlignmentFile)
        return await api
          .post('run_RDKit/', formData)
          .then(res => {
            if (res.status === 200) {
              return Notification('Task started successfully', 'success').apply()
            }
          })
          .catch(err => Notification('Task could not started , please try again', 'error').apply())
      } else {
        const formData = new FormData()
        formData.append('mol', selectedAlignmentFile)
        return await api
          .post('run_Mordred/', formData)
          .then(res => {
            if (res.status === 200) {
              return Notification('Task started successfully', 'success').apply()
            }
          })
          .catch(err => Notification('Task could not started , please try again', 'error').apply())
      }
    }
    const formData = new FormData()
    formData.append('csv', selectedDatasetFile)
    return await api
      .post('run_ML_algorithms/', formData)
      .then(res => {
        if (res.status === 200) {
          return Notification('Task started successfully', 'success').apply()
        }
      })
      .catch(err => Notification('Task could not started , please try again', 'error').apply())
  }

  return (
    <Card sx={{ mt: 5 }}>
      <Typography
        variant='body2'
        sx={{ textAlign: 'center', fontSize: 16, marginTop: 5, marginBottom: 5 }}
        hidden={value === '2' || value === '3'}
      >
        <Switch
          onChange={() => {
            setAuto(!auto)
            return setAutoController(!auto)
          }}
          checked={auto}
        />
        Auto Process
      </Typography>
      <Divider sx={{ margin: 0 }} />
      <form onSubmit={e => e.preventDefault()} hidden={!auto && value === '1'}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12} sx={{ display: value === '3' ? 'none' : `flex`, justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ fontWeight: 600, fontSize: 16 }}>
                Feature Extraction
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ display: value === '3' ? 'none' : `flex`, justifyContent: 'center' }}>
              <FormControlLabel
                control={<Checkbox onChange={() => setIsRDKit(!isRDKit)} checked={isRDKit} />}
                label='RDKit'
              />
              <FormControlLabel
                control={<Checkbox onChange={() => setIsMordred(!isMordred)} checked={isMordred} />}
                label='Mordred'
              />
            </Grid>
            <Grid item xs={12} hidden={value === '2' || value === '3'}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }} hidden={value === '2' || value === '3'}>
              <Typography variant='body2' sx={{ fontWeight: 600, mb: 5, fontSize: 16 }}>
                Binding Score
              </Typography>
              <Tooltip title='Click Me!' placement='left' arrow>
                <Button
                  variant='contained'
                  component='label'
                  color={bindingSelection === null ? 'secondary' : 'primary'}
                  sx={{ mr: 2 }}
                >
                  {bindingSelection ? bindingSelection.name : 'Upload binding file'}
                  <input accept='.csv' type='file' hidden onChange={e => handleUploadBinding(e)} />
                </Button>
              </Tooltip>
              <IconButton
                aria-label='delete'
                onClick={e => setBindingSelection(null)}
                sx={{ display: bindingSelection === null ? 'none' : '' }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12} hidden={value === '2' || value === '3'}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>
            <Grid item xs={12} hidden={value === '2'}>
              <Autocomplete
                multiple={true}
                value={multipleAlgoSelection}
                disablePortal
                id='combo-box-demo'
                options={['XGBoost', 'Lasso Regression', 'Decision Tree Regressor']}
                renderInput={params => <TextField {...params} label='Select machine learning algorithms' />}
                onChange={(e, value) => setMultipleAlgoSelection(value)}
              />
            </Grid>
            <Grid item xs={12} hidden={value === '2' || value === '3' || !multipleAlgoSelection.includes('XGBoost')}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>

            <Grid item xs={12} hidden={value === '2' || !multipleAlgoSelection.includes('XGBoost')}>
              <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'center', fontSize: 16 }}>
                <Switch onChange={() => setIsXGBoostAlgo(!isXGBoostAlgo)} checked={isXGBoostAlgo} />
                XGBoost
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} hidden={!isXGBoostAlgo || !multipleAlgoSelection.includes('XGBoost')}>
              <Tooltip title='Click Me!' placement='left' arrow>
                <TextField
                  fullWidth
                  value={xgboostValue.learningRate}
                  error={xgboostValue.learningRate !== '' && !xgboostValue.learningRate.match(/^(0(\.\d+)?|1(\.0+)?)$/)}
                  helperText={
                    xgboostValue.learningRate !== '' && !xgboostValue.learningRate.match(/^(0(\.\d+)?|1(\.0+)?)$/)
                      ? errors.learningRate
                      : null
                  }
                  label='Learning Rate'
                  type='text'
                  onChange={e => setXGBoostValues(prevState => ({ ...prevState, learningRate: e.target.value }))}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} hidden={!isXGBoostAlgo || !multipleAlgoSelection.includes('XGBoost')}>
              <TextField
                fullWidth
                value={xgboostValue.maxDepth}
                error={xgboostValue.maxDepth !== '' && !xgboostValue.maxDepth.match(/^(0(\.\d+)?|1(\.0+)?)$/)}
                helperText={
                  xgboostValue.maxDepth !== '' && !xgboostValue.maxDepth.match(/^(0(\.\d+)?|1(\.0+)?)$/)
                    ? errors.maxDepth
                    : null
                }
                label='Max Depth'
                type='text'
                onChange={e => setXGBoostValues(prevState => ({ ...prevState, maxDepth: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6} hidden={!isXGBoostAlgo || !multipleAlgoSelection.includes('XGBoost')}>
              <TextField
                fullWidth
                value={xgboostValue.lambda}
                error={xgboostValue.lambda !== '' && !xgboostValue.lambda.match(/^(0(\.\d+)?|1(\.0+)?)$/)}
                helperText={
                  xgboostValue.lambda !== '' && !xgboostValue.lambda.match(/^(0(\.\d+)?|1(\.0+)?)$/)
                    ? errors.lambda
                    : null
                }
                label='Lambda'
                type='text'
                onChange={e => setXGBoostValues(prevState => ({ ...prevState, lambda: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6} hidden={!isXGBoostAlgo || !multipleAlgoSelection.includes('XGBoost')}>
              <TextField
                fullWidth
                value={xgboostValue.alpha}
                error={xgboostValue.alpha !== '' && !xgboostValue.alpha.match(/^(0(\.\d+)?|1(\.0+)?)$/)}
                helperText={
                  xgboostValue.alpha !== '' && !xgboostValue.alpha.match(/^(0(\.\d+)?|1(\.0+)?)$/) ? errors.alpha : null
                }
                label='Alpha'
                type='text'
                onChange={e => setXGBoostValues(prevState => ({ ...prevState, alpha: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6} hidden={!isXGBoostAlgo || !multipleAlgoSelection.includes('XGBoost')}>
              <TextField
                fullWidth
                value={xgboostValue.dropRate}
                error={xgboostValue.dropRate !== '' && !xgboostValue.dropRate.match(/^(0(\.\d+)?|1(\.0+)?)$/)}
                helperText={
                  xgboostValue.dropRate !== '' && !xgboostValue.dropRate.match(/^(0(\.\d+)?|1(\.0+)?)$/)
                    ? errors.dropRate
                    : null
                }
                label='Drop Rate'
                type='text'
                onChange={e => setXGBoostValues(prevState => ({ ...prevState, dropRate: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6} hidden={!isXGBoostAlgo || !multipleAlgoSelection.includes('XGBoost')}>
              <Autocomplete
                multiple={true}
                value={xgboostSelection}
                disablePortal
                id='combo-box-demo'
                options={getAllFeatures()}
                renderInput={params => <TextField {...params} label='Select Features' />}
                onChange={(e, value) => setXgboostSelection(value)}
              />
            </Grid>
            <Grid item xs={12} hidden={value === '2' || !multipleAlgoSelection.includes('Lasso Regression')}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>
            <Grid item xs={12} hidden={value === '2' || !multipleAlgoSelection.includes('Lasso Regression')}>
              <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'center', fontSize: 16 }}>
                <Switch onChange={() => setIsLasso(!isLasso)} checked={isLasso} />
                Lasso Regression
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} hidden={!isLasso || !multipleAlgoSelection.includes('Lasso Regression')}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>{`Train/Predict with top features`}</InputLabel>
                <Select
                  label={`Train/Predict with top features`}
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                  defaultValue=''
                  value={lassoValue === null ? '' : lassoValue}
                  onChange={e => setLassoValues(e.target.value)}
                >
                  {[...Array(8).keys()]
                    .map(val => val + 3)
                    .map(index => (
                      <MenuItem value={index} key={index} defaultValue=''>{`Top ${index} features`}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} hidden={!isLasso || !multipleAlgoSelection.includes('Lasso Regression')}>
              <Autocomplete
                multiple={true}
                value={lassoSelection}
                disablePortal
                id='combo-box-demo'
                options={getAllFeatures()}
                renderInput={params => <TextField {...params} label='Select Features' />}
                onChange={(e, value) => setLassoSelection(value)}
              />
            </Grid>
            <Grid item xs={12} hidden={value === '2' || !multipleAlgoSelection.includes('Decision Tree Regressor')}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>
            <Grid item xs={12} hidden={value === '2' || !multipleAlgoSelection.includes('Decision Tree Regressor')}>
              <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'center', fontSize: 16 }}>
                <Switch onChange={() => setIsDTR(!isDTR)} checked={isDTR} />
                Decision Tree Regressor
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} hidden={!isDTR || !multipleAlgoSelection.includes('Decision Tree Regressor')}>
              <TextField
                fullWidth
                value={dtrValue.maxDepth}
                label='Max Depth'
                error={dtrValue.maxDepth !== '' && !dtrValue.maxDepth.match(/^(0(\.\d+)?|1(\.0+)?)$/)}
                helperText={
                  dtrValue.maxDepth !== '' && !dtrValue.maxDepth.match(/^(0(\.\d+)?|1(\.0+)?)$/)
                    ? errors.maxDepth
                    : null
                }
                type='text'
                onChange={e => setDTRValues(prevState => ({ ...prevState, maxDepth: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6} hidden={!isDTR || !multipleAlgoSelection.includes('Decision Tree Regressor')}>
              <TextField
                fullWidth
                value={dtrValue.minSample}
                label='Min Sample'
                error={dtrValue.minSample !== '' && !dtrValue.minSample.match(/^(0(\.\d+)?|1(\.0+)?)$/)}
                helperText={
                  dtrValue.minSample !== '' && !dtrValue.minSample.match(/^(0(\.\d+)?|1(\.0+)?)$/)
                    ? errors.minSample
                    : null
                }
                type='text'
                onChange={e => setDTRValues(prevState => ({ ...prevState, minSample: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6} hidden={!isDTR || !multipleAlgoSelection.includes('Decision Tree Regressor')}>
              <TextField
                fullWidth
                value={dtrValue.minSampleLeaf}
                label='Min Sample Leaf'
                error={dtrValue.minSampleLeaf !== '' && !dtrValue.minSampleLeaf.match(/^(0(\.\d+)?|1(\.0+)?)$/)}
                helperText={
                  dtrValue.minSampleLeaf !== '' && !dtrValue.minSampleLeaf.match(/^(0(\.\d+)?|1(\.0+)?)$/)
                    ? errors.minSampleLeaf
                    : null
                }
                type='text'
                onChange={e => setDTRValues(prevState => ({ ...prevState, minSampleLeaf: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6} hidden={!isDTR || !multipleAlgoSelection.includes('Decision Tree Regressor')}>
              <TextField
                fullWidth
                value={dtrValue.minWeightFraction}
                label='Min Weight Fraction'
                error={dtrValue.minWeightFraction !== '' && !dtrValue.minWeightFraction.match(/^(0(\.\d+)?|1(\.0+)?)$/)}
                helperText={
                  dtrValue.minWeightFraction !== '' && !dtrValue.minWeightFraction.match(/^(0(\.\d+)?|1(\.0+)?)$/)
                    ? errors.minWeightFraction
                    : null
                }
                type='text'
                onChange={e => setDTRValues(prevState => ({ ...prevState, minWeightFraction: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6} hidden={!isDTR || !multipleAlgoSelection.includes('Decision Tree Regressor')}>
              <Autocomplete
                multiple={true}
                value={dtrSelection}
                disablePortal
                id='combo-box-demo'
                options={getAllFeatures()}
                renderInput={params => <TextField {...params} label='Select Features' />}
                onChange={(e, value) => setDtrSelection(value)}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ margin: 0 }} />
        <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            size='large'
            type='submit'
            sx={{ mr: 2 }}
            variant='contained'
            onClick={e => handleOnSubmit(e)}
            disabled={
              value === '1'
                ? !(
                    (isRDKit || isMordred) &&
                    bindingSelection !== null &&
                    (isXGBoostAlgo || isDTR || isLasso) &&
                    selectedRefFile !== null &&
                    selectedLigandFile !== null &&
                    validateFields() &&
                    multipleAlgoSelection.length > 0
                  )
                : value === '2'
                ? !((isRDKit || isMordred) && selectedAlignmentFile !== null)
                : !(
                    (isXGBoostAlgo || isDTR || isLasso) &&
                    selectedDatasetFile !== null &&
                    validateFields() &&
                    multipleAlgoSelection.length > 0
                  )
            }
          >
            Submit
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default AutoProcess
