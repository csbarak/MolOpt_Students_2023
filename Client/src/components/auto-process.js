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
import { useCookies } from 'react-cookie'

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
  const [isAutoXGBoost, setIsAutoXGBoost] = useState(false)
  const [isAutoDTR, setIsAutoDTR] = useState(false)
  const [isAutoLasso, setIsAutoLasso] = useState(false)
  const [xgboostValue, setXGBoostValues] = useState({
    learningRate: '',
    lambda: '',
    dropRate: '',
    maxDepth: '',
    alpha: ''
  })
  const [xgboostNumFeatures, setXGBoostNumFeatures] = useState('')
  const [dtrNumFeatures, setDTRNumFeatures] = useState('')
  const [dtrValue, setDTRValues] = useState({
    maxDepth: '',
    minSample: '',
    minSampleLeaf: '',
    minWeightFraction: ''
  })
  const [lassoValue, setLassoValues] = useState(null)
  const [numberOfFeaturesLasso, setNumberOfFeaturesLasso] = useState('')
  const [xgboostSelection, setXgboostSelection] = useState([])
  const [dtrSelection, setDtrSelection] = useState([])
  const [lassoSelection, setLassoSelection] = useState([])
  const [bindingSelection, setBindingSelection] = useState(null)
  const [multipleAlgoSelection, setMultipleAlgoSelection] = useState([])
  const [cookies, setCookie, removeCookie] = useCookies(['id', 'token'])

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
      setDtrSelection,
      setNumberOfFeaturesLasso
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
      setMultipleAlgoSelection,
      setNumberOfFeaturesLasso
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
    numberOfFeatures: 'Number of features must be a number between [0.0-1.0]',
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
      if (isAutoXGBoost && xgboostNumFeatures === '') {
        console.log('2')
        return false
      }
      if (
        !isAutoXGBoost &&
        (Object.values(xgboostValue).some(x => x === '') ||
          xgboostSelection.length === 0 ||
          Object.values(xgboostValue).some(x => !x.match(/^(0(\.\d+)?|1(\.0+)?)$/)))
      ) {
        console.log(xgboostValue, xgboostSelection)
        return false
      }
    }
    if (isDTR) {
      if (isAutoDTR && dtrNumFeatures === '') {
        console.log('4')
        return false
      }
      if (
        !isAutoDTR &&
        (Object.values(dtrValue).some(x => x === '') ||
          dtrSelection.length === 0 ||
          Object.values(dtrValue).some(x => !x.match(/^(0(\.\d+)?|1(\.0+)?)$/)))
      ) {
        console.log('5')
        return false
      }
    }
    if (isLasso) {
      if (isAutoLasso && numberOfFeaturesLasso === '') {
        console.log('6')
        return false
      }
      if (
        (!isAutoLasso && (lassoSelection.length === 0 || lassoValue === null)) ||
        lassoSelection.length !== lassoValue
      ) {
        console.log('7')
        return false
      }
    }
    return true
  }

  const handleOnSubmit = async e => {
    e.preventDefault()
    if (value === '1') {
      const formData = new FormData()
      formData.append('ref', selectedRefFile)
      formData.append('ligand', selectedLigandFile)
      formData.append('binding', bindingSelection)
      formData.append('xgboost', {
        numberOfFeatures: xgboostNumFeatures,
        isXGBoost: isXGBoostAlgo,
        isAuto: isAutoXGBoost,
        xgboostValue: xgboostValue,
        features: xgboostSelection
      })
      formData.append('dtr', {
        isDTR: isDTR,
        isAuto: isAutoDTR,
        dtrValue: dtrValue,
        features: dtrSelection,
        numberOfFeatures: dtrNumFeatures
      })
      formData.append('lasso', {
        isLasso: isLasso,
        isAuto: isAutoLasso,
        lassoValue: lassoValue,
        features: lassoSelection,
        numberOfFeatures: numberOfFeaturesLasso
      })
      return await api
        .post('run_auto_process/', formData)
        .then(res => {
          if (200 <= res.status && res.status < 300) {
            return Notification('Task started successfully', 'success').apply()
          }
        })
        .catch(err => {
          return Notification('Task could not started , please try again', 'error').apply()
        })
    }
    if (value === '2') {
      if (isRDKit || isMordred) {
        const formData = new FormData()
        formData.append('mol', selectedAlignmentFile)
        formData.append('email', cookies.id)
        formData.append('RDKit', isRDKit)
        formData.append('Mordred', isMordred)
        return await api
          .post('run_feature/', formData)
          .then(res => {
            if (200 <= res.status && res.status < 300) {
              return Notification('Task started successfully', 'success').apply()
            }
          })
          .catch(err => {
            return Notification('Task could not started , please try again', 'error').apply()
          })
      }
    }
    const formData = new FormData()
    formData.append('csv', selectedDatasetFile)
    formData.append('email', cookies.id)
    formData.append('xgboost', {
      numberOfFeatures: xgboostNumFeatures,
      isXGBoost: isXGBoostAlgo,
      isAuto: isAutoXGBoost,
      xgboostValue: xgboostValue,
      features: xgboostSelection
    })
    formData.append('dtr', {
      isDTR: isDTR,
      isAuto: isAutoDTR,
      dtrValue: dtrValue,
      features: dtrSelection,
      numberOfFeatures: dtrNumFeatures
    })
    formData.append('lasso', {
      isLasso: isLasso,
      isAuto: isAutoLasso,
      lassoValue: lassoValue,
      features: lassoSelection,
      numberOfFeatures: numberOfFeaturesLasso
    })
    return await api
      .post('run_ML_algorithms/', formData)
      .then(res => {
        if (200 <= res.status && res.status < 300) {
          return Notification('Task started successfully', 'success').apply()
        }
      })
      .catch(err => {
        return Notification('Task could not started , please try again', 'error').apply()
      })
  }

  const isDisabled = value => {
    return value === '1'
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

            <Grid item xs={12} hidden={value === '2' || !multipleAlgoSelection.includes('XGBoost') || !isXGBoostAlgo}>
              <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'center', fontSize: 16 }}>
                <Switch onChange={() => setIsAutoXGBoost(!isAutoXGBoost)} checked={isAutoXGBoost} />
                Auto Mode
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isXGBoostAlgo || !multipleAlgoSelection.includes('XGBoost') || !isAutoXGBoost}
            >
              <Tooltip title='Click Me!' placement='left' arrow>
                <TextField
                  fullWidth
                  value={xgboostNumFeatures}
                  error={xgboostNumFeatures !== '' && !xgboostNumFeatures.match(/^(0(\.\d+)?|1(\.0+)?)$/)}
                  helperText={
                    xgboostNumFeatures !== '' && !xgboostNumFeatures.match(/^(0(\.\d+)?|1(\.0+)?)$/)
                      ? errors.numberOfFeatures
                      : null
                  }
                  label='Number of Features'
                  type='text'
                  onChange={e => setXGBoostNumFeatures(e.target.value)}
                />
              </Tooltip>
            </Grid>

            <Grid item xs={12} hidden={value === '2' || !multipleAlgoSelection.includes('XGBoost') || !isXGBoostAlgo}>
              <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'center', fontSize: 16 }}>
                <Switch onChange={() => setIsAutoXGBoost(!isAutoXGBoost)} checked={!isAutoXGBoost} />
                Manual Mode
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isXGBoostAlgo || !multipleAlgoSelection.includes('XGBoost') || isAutoXGBoost}
            >
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
            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isXGBoostAlgo || !multipleAlgoSelection.includes('XGBoost') || isAutoXGBoost}
            >
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
            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isXGBoostAlgo || !multipleAlgoSelection.includes('XGBoost') || isAutoXGBoost}
            >
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
            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isXGBoostAlgo || !multipleAlgoSelection.includes('XGBoost') || isAutoXGBoost}
            >
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
            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isXGBoostAlgo || !multipleAlgoSelection.includes('XGBoost') || isAutoXGBoost}
            >
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
            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isXGBoostAlgo || !multipleAlgoSelection.includes('XGBoost') || isAutoXGBoost}
            >
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
            <Grid
              item
              xs={12}
              hidden={value === '2' || !multipleAlgoSelection.includes('Lasso Regression') || !isLasso}
            >
              <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'center', fontSize: 16 }}>
                <Switch onChange={() => setIsAutoLasso(!isAutoLasso)} checked={isAutoLasso} />
                Auto Mode
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isLasso || !multipleAlgoSelection.includes('Lasso Regression') || !isAutoLasso}
            >
              <Tooltip title='Click Me!' placement='left' arrow>
                <TextField
                  fullWidth
                  value={numberOfFeaturesLasso}
                  error={numberOfFeaturesLasso !== '' && !numberOfFeaturesLasso.match(/^(0(\.\d+)?|1(\.0+)?)$/)}
                  helperText={
                    numberOfFeaturesLasso !== '' && !numberOfFeaturesLasso.match(/^(0(\.\d+)?|1(\.0+)?)$/)
                      ? errors.learningRate
                      : null
                  }
                  label='Number Of Features'
                  type='text'
                  onChange={e => setNumberOfFeaturesLasso(e.target.value)}
                />
              </Tooltip>
            </Grid>
            <Grid
              item
              xs={12}
              hidden={value === '2' || !multipleAlgoSelection.includes('Lasso Regression') || !isLasso}
            >
              <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'center', fontSize: 16 }}>
                <Switch onChange={() => setIsAutoLasso(!isAutoLasso)} checked={!isAutoLasso} />
                Manual Mode
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isLasso || !multipleAlgoSelection.includes('Lasso Regression') || isAutoLasso}
            >
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
            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isLasso || !multipleAlgoSelection.includes('Lasso Regression') || isAutoLasso}
            >
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
            <Grid
              item
              xs={12}
              hidden={value === '2' || !multipleAlgoSelection.includes('Decision Tree Regressor') || !isDTR}
            >
              <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'center', fontSize: 16 }}>
                <Switch onChange={() => setIsAutoDTR(!isAutoDTR)} checked={isAutoDTR} />
                Auto Mode
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isDTR || !multipleAlgoSelection.includes('Decision Tree Regressor') || !isAutoDTR}
            >
              <Tooltip title='Click Me!' placement='left' arrow>
                <TextField
                  fullWidth
                  value={dtrNumFeatures}
                  error={dtrNumFeatures !== '' && !dtrNumFeatures.match(/^(0(\.\d+)?|1(\.0+)?)$/)}
                  helperText={
                    dtrNumFeatures !== '' && !dtrNumFeatures.match(/^(0(\.\d+)?|1(\.0+)?)$/)
                      ? errors.numberOfFeatures
                      : null
                  }
                  label='Number Of Features'
                  type='text'
                  onChange={e => setDTRNumFeatures(e.target.value)}
                />
              </Tooltip>
            </Grid>
            <Grid
              item
              xs={12}
              hidden={value === '2' || !multipleAlgoSelection.includes('Decision Tree Regressor') || !isDTR}
            >
              <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'center', fontSize: 16 }}>
                <Switch onChange={() => setIsAutoDTR(!isAutoDTR)} checked={!isAutoDTR} />
                Expert Mode
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isDTR || !multipleAlgoSelection.includes('Decision Tree Regressor') || isAutoDTR}
            >
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
            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isDTR || !multipleAlgoSelection.includes('Decision Tree Regressor') || isAutoDTR}
            >
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
            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isDTR || !multipleAlgoSelection.includes('Decision Tree Regressor') || isAutoDTR}
            >
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
            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isDTR || !multipleAlgoSelection.includes('Decision Tree Regressor') || isAutoDTR}
            >
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
            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isDTR || !multipleAlgoSelection.includes('Decision Tree Regressor') || isAutoDTR}
            >
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
            color={isDisabled ? 'success' : 'primary'}
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
