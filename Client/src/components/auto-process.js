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
  TextField,
  FormControlLabel,
  Typography,
  CardContent,
  CardActions,
  IconButton,
  Tooltip
} from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete'
import Fade from '@mui/material/Fade'
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
  selectedDatasetFile,
  selectedPredictionFile
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
    numberOfFeatures: '',
    features: '',
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
  const [lassoValue, setLassoValues] = useState('')
  const [numberOfFeaturesLasso, setNumberOfFeaturesLasso] = useState('')
  const [xgboostSelection, setXgboostSelection] = useState([])
  const [dtrSelection, setDtrSelection] = useState([])
  const [lassoSelection, setLassoSelection] = useState([])
  const [bindingSelection, setBindingSelection] = useState(null)
  const [multipleAlgoSelection, setMultipleAlgoSelection] = useState([])
  const [cookies, setCookie, removeCookie] = useCookies()

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
      return
    }
    setBindingSelection(e.target.files[0])
  }

  const errors = {
    numberOfFeatures: 'Number of features must be a number between [0-20]',
    lassoValue: 'Number of features must be a number between [3-10]',
    learningRate: 'Learning rate must be a number between [0.0-1.0]',
    lambda: 'Lambda must be a number between [0.0-10.0]',
    dropRate: 'Drop rate must be a number between [0.0-1.0]',
    maxDepth: 'Max depth must be a number between [1-20]',
    alpha: 'Alpha must be a number between [0.0-10.0]',
    minSample: 'Min sample must be a number between [2-100]',
    minSampleLeaf: 'Min sample leaf must be a number between [1-50]',
    minWeightFraction: 'Min weight fraction must be a number between [0.0-0.5]'
  }

  const validateFields = () => {
    if (isXGBoostAlgo) {
      if (isAutoXGBoost && (xgboostNumFeatures === '' || !xgboostNumFeatures.match('^(1?[0-9]|20)$'))) {
        return false
      }
      if (
        !isAutoXGBoost &&
        (Object.values(xgboostValue).some(x => x === '') || xgboostSelection.length === 0 || !validateField('xgboost'))
      ) {
        return false
      }
    }
    if (isDTR) {
      if (isAutoDTR && dtrNumFeatures === '') {
        return false
      }
      if (
        (!isAutoDTR && (Object.values(dtrValue).some(x => x === '') || dtrSelection.length === 0)) ||
        !validateField('dtr')
      ) {
        return false
      }
    }
    if (isLasso) {
      if (isAutoLasso && (numberOfFeaturesLasso === '' || !numberOfFeaturesLasso.match(/^(3|4|5|6|7|8|9|10)$/))) {
        return false
      }
      if (!isAutoLasso && (lassoSelection.length === 0 || !validateField('lasso'))) {
        return false
      }
    }
    return true
  }

  const validateField = type => {
    switch (type) {
      case 'xgboost':
        return (
          xgboostValue.learningRate.match(/^(0\.[0-9]+|[01](\.0)?)$/) &&
          xgboostValue.lambda.match(/^([0-9](\.[0-9]*)?|10(\.0*)?)$/) &&
          xgboostValue.dropRate.match(/^(0\.[0-9]+|[01](\.0)?)$/) &&
          xgboostValue.maxDepth.match(/^([1-9]|1[0-9]|20)$/) &&
          xgboostValue.alpha.match(/^([0-9](\.[0-9]*)?|10(\.0*)?)$/)
        )
      case 'dtr':
        return (
          dtrValue.maxDepth.match(/^([1-9]|1[0-9]|20)$/) &&
          dtrValue.minSample.match(/^([2-9]|[1-9][0-9]|100)$/) &&
          dtrValue.minSampleLeaf.match(/^([1-9]|[1-4][0-9]|50)$/) &&
          dtrValue.minWeightFraction.match(/^(0(\.[0-5]*)?|0\.5)$/)
        )
      case 'lasso':
        return lassoValue.match(/^([0-9](\.[0-9]*)?|10(\.0*)?)$/)
    }
  }

  const handleOnSubmit = async e => {
    e.preventDefault()
    if (value === '1') {
      const formData = new FormData()
      formData.append('ref', selectedRefFile)
      formData.append('ligand', selectedLigandFile)
      formData.append('learning', bindingSelection)
      formData.append('xgboost', {
        isXGBoost: isXGBoostAlgo,
        isAuto: isAutoXGBoost,
        xgboostValue: { ...xgboostValue, numberOfFeatures: xgboostNumFeatures, features: xgboostSelection }
      })
      formData.append('dtr', {
        isDTR: isDTR,
        isAuto: isAutoDTR,
        dtrValue: { ...dtrValue, numberOfFeatures: dtrNumFeatures, features: dtrSelection }
      })
      formData.append('lasso', {
        isLasso: isLasso,
        isAuto: isAutoLasso,
        lassoValue: { alpha: lassoValue, numberOfFeatures: numberOfFeaturesLasso, features: lassoSelection }
      })
      console.log({
        isXGBoost: isXGBoostAlgo,
        isAuto: isAutoXGBoost,
        xgboostValue: { ...xgboostValue, numberOfFeatures: xgboostNumFeatures, features: xgboostSelection }
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
        formData.append('email', cookies.email)
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
    formData.append('learning', selectedDatasetFile)
    formData.append('prediction', selectedPredictionFile)
    formData.append('email', cookies.email)
    formData.append('xgboost', {
      isXGBoost: isXGBoostAlgo,
      isAuto: isAutoXGBoost,
      xgboostValue: { ...xgboostValue, numberOfFeatures: xgboostNumFeatures, features: xgboostSelection }
    })
    formData.append('dtr', {
      isDTR: isDTR,
      isAuto: isAutoDTR,
      dtrValue: { ...dtrValue, numberOfFeatures: dtrNumFeatures, features: dtrSelection }
    })
    formData.append('lasso', {
      isLasso: isLasso,
      isAuto: isAutoLasso,
      lassoValue: { alpha: lassoValue, numberOfFeatures: numberOfFeaturesLasso, features: lassoSelection }
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
          selectedPredictionFile !== null &&
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
              <Tooltip
                title={
                  <Typography fontSize={15} variant='body1' color={'#fff'}>
                    RDKit is a software library for cheminformatics and machine learning. It is a collection of
                    cheminformatics and machine learning algorithms written in C++ and Python.
                  </Typography>
                }
                TransitionComponent={Fade}
                placement='left'
                arrow
              >
                <FormControlLabel
                  control={<Checkbox onChange={() => setIsRDKit(!isRDKit)} checked={isRDKit} />}
                  label='RDKit'
                />
              </Tooltip>
              <Tooltip
                title={
                  <Typography fontSize={15} variant='body1' color={'#fff'}>
                    Mordred is a software library for calculating molecular descriptors in Python. It is a collection of
                    2D and 3D descriptors. It is a collection of 2D and 3D descriptors.
                  </Typography>
                }
                TransitionComponent={Fade}
                placement='right'
                arrow
              >
                <FormControlLabel
                  control={<Checkbox onChange={() => setIsMordred(!isMordred)} checked={isMordred} />}
                  label='Mordred'
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12} hidden={value === '2' || value === '3'}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }} hidden={value === '2' || value === '3'}>
              <Typography variant='body2' sx={{ fontWeight: 600, mb: 5, fontSize: 16 }}>
                Learning Score
              </Typography>
              <Tooltip
                title={
                  <Typography fontSize={15} variant='body1' color={'#fff'}>
                    File that contains the binding affinity or energy values for a set of ligands docked to a reference
                    molecule , the file should be in csv format.
                  </Typography>
                }
                TransitionComponent={Fade}
                placement='left'
                arrow
              >
                <Button
                  variant='contained'
                  component='label'
                  color={bindingSelection === null ? 'secondary' : 'primary'}
                  sx={{ mr: 2 }}
                >
                  {bindingSelection ? bindingSelection.name : 'Upload Learning file'}
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
              <Tooltip
                title={
                  <Typography fontSize={15} variant='body1' color={'#fff'}>
                    Step size at each iteration while moving toward a minimum of the loss function; smaller values
                    result in slower learning and more accurate models.
                  </Typography>
                }
                TransitionComponent={Fade}
                placement='left'
                arrow
              >
                <TextField
                  fullWidth
                  value={xgboostNumFeatures}
                  error={xgboostNumFeatures !== '' && !xgboostNumFeatures.match('^(1?[0-9]|20)$')}
                  helperText={
                    xgboostNumFeatures !== '' && !xgboostNumFeatures.match('^(1?[0-9]|20)$')
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
              <Tooltip
                title={
                  <Typography fontSize={15} variant='body1' color={'#fff'}>
                    Step size at each iteration while moving toward a minimum of the loss function; smaller values
                    result in slower learning and more accurate models.
                  </Typography>
                }
                TransitionComponent={Fade}
                placement='left'
                arrow
              >
                <TextField
                  fullWidth
                  value={xgboostValue.learningRate}
                  error={
                    xgboostValue.learningRate !== '' && !xgboostValue.learningRate.match(/^(0\.[0-9]+|[01](\.0)?)$/)
                  }
                  helperText={
                    xgboostValue.learningRate !== '' && !xgboostValue.learningRate.match(/^(0\.[0-9]+|[01](\.0)?)$/)
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
              <Tooltip
                title={
                  <Typography fontSize={15} variant='body1' color={'#fff'}>
                    Maximum depth of a tree, which affects model complexity and capacity to fit to the training data.
                  </Typography>
                }
                TransitionComponent={Fade}
                placement='right'
                arrow
              >
                <TextField
                  fullWidth
                  value={xgboostValue.maxDepth}
                  error={xgboostValue.maxDepth !== '' && !xgboostValue.maxDepth.match(/^([1-9]|1[0-9]|20)$/)}
                  helperText={
                    xgboostValue.maxDepth !== '' && !xgboostValue.maxDepth.match(/^([1-9]|1[0-9]|20)$/)
                      ? errors.maxDepth
                      : null
                  }
                  label='Max Depth'
                  type='text'
                  onChange={e => setXGBoostValues(prevState => ({ ...prevState, maxDepth: e.target.value }))}
                />
              </Tooltip>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isXGBoostAlgo || !multipleAlgoSelection.includes('XGBoost') || isAutoXGBoost}
            >
              <Tooltip
                title={
                  <Typography fontSize={15} variant='body1' color={'#fff'}>
                    L2 regularization term on weights, which reduces the magnitude of the coefficients and can prevent
                    overfitting.
                  </Typography>
                }
                TransitionComponent={Fade}
                placement='left'
                arrow
              >
                <TextField
                  fullWidth
                  value={xgboostValue.lambda}
                  error={xgboostValue.lambda !== '' && !xgboostValue.lambda.match(/^([0-9](\.[0-9]*)?|10(\.0*)?)$/)}
                  helperText={
                    xgboostValue.lambda !== '' && !xgboostValue.lambda.match(/^([0-9](\.[0-9]*)?|10(\.0*)?)$/)
                      ? errors.lambda
                      : null
                  }
                  label='Lambda'
                  type='text'
                  onChange={e => setXGBoostValues(prevState => ({ ...prevState, lambda: e.target.value }))}
                />
              </Tooltip>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isXGBoostAlgo || !multipleAlgoSelection.includes('XGBoost') || isAutoXGBoost}
            >
              <Tooltip
                title={
                  <Typography fontSize={15} variant='body1' color={'#fff'}>
                    L1 regularization term on weights, resulting in sparse models by shrinking the less important
                    features to zero.
                  </Typography>
                }
                TransitionComponent={Fade}
                placement='right'
                arrow
              >
                <TextField
                  fullWidth
                  value={xgboostValue.alpha}
                  error={xgboostValue.alpha !== '' && !xgboostValue.alpha.match(/^([0-9](\.[0-9]*)?|10(\.0*)?)$/)}
                  helperText={
                    xgboostValue.alpha !== '' && !xgboostValue.alpha.match(/^([0-9](\.[0-9]*)?|10(\.0*)?)$/)
                      ? errors.alpha
                      : null
                  }
                  label='Alpha'
                  type='text'
                  onChange={e => setXGBoostValues(prevState => ({ ...prevState, alpha: e.target.value }))}
                />
              </Tooltip>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isXGBoostAlgo || !multipleAlgoSelection.includes('XGBoost') || isAutoXGBoost}
            >
              <Tooltip
                title={
                  <Typography fontSize={15} variant='body1' color={'#fff'}>
                    Dropout rate, which randomly sets a fraction of the tree nodes to zero, reducing overfitting.
                  </Typography>
                }
                TransitionComponent={Fade}
                placement='left'
                arrow
              >
                <TextField
                  fullWidth
                  value={xgboostValue.dropRate}
                  error={xgboostValue.dropRate !== '' && !xgboostValue.dropRate.match(/^(0\.[0-9]+|[01](\.0)?)$/)}
                  helperText={
                    xgboostValue.dropRate !== '' && !xgboostValue.dropRate.match(/^(0\.[0-9]+|[01](\.0)?)$/)
                      ? errors.dropRate
                      : null
                  }
                  label='Drop Rate'
                  type='text'
                  onChange={e => setXGBoostValues(prevState => ({ ...prevState, dropRate: e.target.value }))}
                />
              </Tooltip>
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
              <Tooltip
                title={
                  <Typography fontSize={15} variant='body1' color={'#fff'}>
                    Step size at each iteration while moving toward a minimum of the loss function; smaller values
                    result in slower learning and more accurate models.
                  </Typography>
                }
                TransitionComponent={Fade}
                placement='left'
                arrow
              >
                <TextField
                  fullWidth
                  value={numberOfFeaturesLasso}
                  error={numberOfFeaturesLasso !== '' && !numberOfFeaturesLasso.match('(?:3|4|5|6|7|8|9|10)$')}
                  helperText={
                    numberOfFeaturesLasso !== '' && !numberOfFeaturesLasso.match('(?:3|4|5|6|7|8|9|10)$')
                      ? errors.lassoValue
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
              <Tooltip
                title={
                  <Typography fontSize={15} variant='body1' color={'#fff'}>
                    L1 regularization term on weights, resulting in sparse models by shrinking the less important
                    features to zero.
                  </Typography>
                }
                TransitionComponent={Fade}
                placement='left'
                arrow
              >
                <TextField
                  fullWidth
                  value={lassoValue}
                  error={lassoValue !== '' && !lassoValue.match(/^([0-9](\.[0-9]*)?|10(\.0*)?)$/)}
                  helperText={
                    lassoValue !== '' && !lassoValue.match(/^([0-9](\.[0-9]*)?|10(\.0*)?)$/) ? errors.alpha : null
                  }
                  label='Alpha'
                  type='text'
                  onChange={e => setLassoValues(e.target.value)}
                />
              </Tooltip>
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
              <Tooltip
                title={
                  <Typography fontSize={15} variant='body1' color={'#fff'}>
                    Step size at each iteration while moving toward a minimum of the loss function; smaller values
                    result in slower learning and more accurate models.
                  </Typography>
                }
                TransitionComponent={Fade}
                placement='left'
                arrow
              >
                <TextField
                  fullWidth
                  value={dtrNumFeatures}
                  error={dtrNumFeatures !== '' && !dtrNumFeatures.match('^(1?[0-9]|20)$')}
                  helperText={
                    dtrNumFeatures !== '' && !dtrNumFeatures.match('^(1?[0-9]|20)$') ? errors.numberOfFeatures : null
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
              <Tooltip
                title={
                  <Typography fontSize={15} variant='body1' color={'#fff'}>
                    Step size at each iteration while moving toward a minimum of the loss function; smaller values
                    result in slower learning and more accurate models.
                  </Typography>
                }
                TransitionComponent={Fade}
                placement='left'
                arrow
              >
                <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'center', fontSize: 16 }}>
                  <Switch onChange={() => setIsAutoDTR(!isAutoDTR)} checked={!isAutoDTR} />
                  Manual Mode
                </Typography>
              </Tooltip>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isDTR || !multipleAlgoSelection.includes('Decision Tree Regressor') || isAutoDTR}
            >
              <Tooltip
                title={
                  <Typography fontSize={15} variant='body1' color={'#fff'}>
                    Maximum depth of a tree, which affects model complexity and capacity to fit to the training data.
                  </Typography>
                }
                TransitionComponent={Fade}
                placement='left'
                arrow
              >
                <TextField
                  fullWidth
                  value={dtrValue.maxDepth}
                  label='Max Depth'
                  error={dtrValue.maxDepth !== '' && !dtrValue.maxDepth.match(/^([1-9]|[1-9][0-9]|20)$/)}
                  helperText={
                    dtrValue.maxDepth !== '' && !dtrValue.maxDepth.match(/^([1-9]|[1-9][0-9]|20)$/)
                      ? errors.maxDepth
                      : null
                  }
                  type='text'
                  onChange={e => setDTRValues(prevState => ({ ...prevState, maxDepth: e.target.value }))}
                />
              </Tooltip>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isDTR || !multipleAlgoSelection.includes('Decision Tree Regressor') || isAutoDTR}
            >
              <Tooltip
                title={
                  <Typography fontSize={15} variant='body1' color={'#fff'}>
                    Minimum number of samples required to split an internal node.
                  </Typography>
                }
                TransitionComponent={Fade}
                placement='right'
                arrow
              >
                <TextField
                  fullWidth
                  value={dtrValue.minSample}
                  label='Min Sample'
                  error={dtrValue.minSample !== '' && !dtrValue.minSample.match(/^([2-9]|[1-9][0-9]|100)$/)}
                  helperText={
                    dtrValue.minSample !== '' && !dtrValue.minSample.match(/^([2-9]|[1-9][0-9]|100)$/)
                      ? errors.minSample
                      : null
                  }
                  type='text'
                  onChange={e => setDTRValues(prevState => ({ ...prevState, minSample: e.target.value }))}
                />
              </Tooltip>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isDTR || !multipleAlgoSelection.includes('Decision Tree Regressor') || isAutoDTR}
            >
              <Tooltip
                title={
                  <Typography fontSize={15} variant='body1' color={'#fff'}>
                    Minimum number of samples required to be at a leaf node.
                  </Typography>
                }
                TransitionComponent={Fade}
                placement='left'
                arrow
              >
                <TextField
                  fullWidth
                  value={dtrValue.minSampleLeaf}
                  label='Min Sample Leaf'
                  error={dtrValue.minSampleLeaf !== '' && !dtrValue.minSampleLeaf.match(/^([1-9]|[1-4][0-9]|50)$/)}
                  helperText={
                    dtrValue.minSampleLeaf !== '' && !dtrValue.minSampleLeaf.match(/^([1-9]|[1-4][0-9]|50)$/)
                      ? errors.minSampleLeaf
                      : null
                  }
                  type='text'
                  onChange={e => setDTRValues(prevState => ({ ...prevState, minSampleLeaf: e.target.value }))}
                />
              </Tooltip>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              hidden={!isDTR || !multipleAlgoSelection.includes('Decision Tree Regressor') || isAutoDTR}
            >
              <Tooltip
                title={
                  <Typography fontSize={15} variant='body1' color={'#fff'}>
                    Minimum weighted fraction of the sum total of weights (of all input samples) required to be at a
                    leaf node.
                  </Typography>
                }
                TransitionComponent={Fade}
                placement='right'
                arrow
              >
                <TextField
                  fullWidth
                  value={dtrValue.minWeightFraction}
                  label='Min Weight Fraction'
                  error={
                    dtrValue.minWeightFraction !== '' && !dtrValue.minWeightFraction.match(/^(0(\.[0-5]*)?|0\.5)$/)
                  }
                  helperText={
                    dtrValue.minWeightFraction !== '' && !dtrValue.minWeightFraction.match(/^(0(\.[0-5]*)?|0\.5)$/)
                      ? errors.minWeightFraction
                      : null
                  }
                  type='text'
                  onChange={e => setDTRValues(prevState => ({ ...prevState, minWeightFraction: e.target.value }))}
                />
              </Tooltip>
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
                    selectedPredictionFile !== null &&
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
