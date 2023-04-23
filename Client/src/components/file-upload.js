import React from 'react'
// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import { Tab, Card, Button, Typography, CardContent, IconButton, Tooltip } from '@mui/material'
import { TabList, TabPanel, TabContext } from '@mui/lab'
import DeleteIcon from '@mui/icons-material/Delete'
import Fade from '@mui/material/Fade'
import { clearOnNavi } from './clear-fields'
import AutoProcess from './auto-process'
import { validate } from './validate-file-type'
import api from './api'
import Notification from 'src/components/notification'
import { useCookies } from 'react-cookie'

const FileUpload = () => {
  const [value, setValue] = useState('1')
  const [selectedRefFile, setSelectedRefFile] = useState(null)
  const [selectedLigandFile, setSelectedLigandFile] = useState(null)
  const [selectedAlignmentFile, setSelectedAlignmentFile] = useState(null)
  const [selectedDatasetFile, setSelectedDatasetFile] = useState(null)
  const [autoController, setAutoController] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(['id', 'token'])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleUploadRef = e => {
    e.preventDefault()
    if (!validate(e.target.files[0], 'alignment')) {
      return
    }
    setSelectedRefFile(e.target.files[0])
  }
  const handleUploadLigand = e => {
    e.preventDefault()
    if (!validate(e.target.files[0], 'alignment')) {
      return
    }
    setSelectedLigandFile(e.target.files[0])
  }

  const handleUploadAlignment = e => {
    e.preventDefault()
    if (!validate(e.target.files[0], 'feature')) {
      return
    }
    setSelectedAlignmentFile(e.target.files[0])
  }

  const handleUploadDataset = e => {
    e.preventDefault()
    if (!validate(e.target.files[0], 'dataset')) {
      return
    }
    setSelectedDatasetFile(e.target.files[0])
  }

  const handleOnSubmit = async e => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('ref', selectedRefFile)
    formData.append('ligand', selectedLigandFile)
    formData.append('email', cookies.id)
    return await api
      .post('run_alignment/', formData)
      .then(res => {
        if (200 <= res.status && res.status < 300) {
          return Notification('Task started successfully', 'success').apply()
        }
      })
      .catch(err => {
        return Notification('Task could not started , please try again', 'error').apply()
      })
  }

  useEffect(() => {
    return clearOnNavi(
      value,
      setSelectedRefFile,
      setSelectedLigandFile,
      setSelectedAlignmentFile,
      setSelectedDatasetFile
    )
  }, [value])

  return (
    <>
      <Card>
        <TabContext value={value}>
          <TabList centered onChange={handleChange} aria-label='card navigation example'>
            <Tab value='1' label='Molecules Alignment' />
            <Tab value='2' label='Feature Extraction' />
            <Tab value='3' label='Machine Learning Algorithms' />
          </TabList>
          <CardContent sx={{ textAlign: 'center' }}>
            <TabPanel value='1' sx={{ p: 0 }}>
              <Typography variant='body2' sx={{ marginBottom: 4 }}>
                <Typography variant='body2' sx={{ mb: 4 }}>
                  Alignment of molecules is done using RDKit Most Common Substructure (MCS Module)
                </Typography>
                <Tooltip
                  title={
                    <Typography fontSize={15} variant='body1' color={'#fff'}>
                      File that contains the 3D coordinates of a reference molecule , need to be in .sdf format
                    </Typography>
                  }
                  TransitionComponent={Fade}
                  placement='left'
                  arrow
                >
                  <Button
                    variant='contained'
                    component='label'
                    color={selectedRefFile === null ? 'secondary' : 'primary'}
                    sx={{ mr: 2 }}
                  >
                    {selectedRefFile ? selectedRefFile.name : 'Upload reference molecule file'}
                    <input accept='.sdf' type='file' hidden onChange={e => handleUploadRef(e)} />
                  </Button>
                </Tooltip>
                <IconButton
                  aria-label='delete'
                  onClick={e => setSelectedRefFile(null)}
                  sx={{ display: selectedRefFile === null ? 'none' : '' }}
                >
                  <DeleteIcon />
                </IconButton>
                <Tooltip
                  title={
                    <Typography fontSize={15} variant='body1' color={'#fff'}>
                      File that contains the 3D coordinates of a small molecule compound that is being studied in
                      relation to the reference molecule , need to be in .sdf format
                    </Typography>
                  }
                  TransitionComponent={Fade}
                  placement='right'
                  arrow
                >
                  <Button
                    variant='contained'
                    component='label'
                    color={selectedLigandFile === null ? 'secondary' : 'primary'}
                  >
                    {selectedLigandFile ? selectedLigandFile.name : 'Upload ligand database file'}
                    <input accept='.sdf' type='file' hidden onChange={e => handleUploadLigand(e)} />
                  </Button>
                </Tooltip>
                <IconButton
                  aria-label='delete'
                  onClick={e => setSelectedLigandFile(null)}
                  sx={{ display: selectedLigandFile === null ? 'none' : '' }}
                >
                  <DeleteIcon />
                </IconButton>
              </Typography>
              <Button
                variant='contained'
                disabled={!selectedRefFile || !selectedLigandFile}
                color={selectedRefFile && selectedLigandFile ? 'success' : 'secondary'}
                onClick={e => handleOnSubmit(e)}
                sx={{ display: `${autoController === true ? 'none' : ''}`, ml: 2 }}
              >
                Submit
              </Button>
            </TabPanel>
            <TabPanel value='2' sx={{ p: 0 }}>
              <Typography variant='body2' sx={{ marginBottom: 4 }}>
                <Typography variant='body2' sx={{ mb: 4 }}>
                  Features extracted are from rdkit and Mordred libraries you are free to choose the features which you
                  wish to extract
                </Typography>
                <Tooltip
                  title={
                    <Typography fontSize={15} variant='body1' color={'#fff'}>
                      File format that represents the structure of a molecule in a text format. It contains information
                      such as the atoms, bonds, and 3D coordinates of the molecule , need to be in .mol2 format
                    </Typography>
                  }
                  TransitionComponent={Fade}
                  placement='left'
                  arrow
                >
                  <Button
                    variant='contained'
                    component='label'
                    color={selectedAlignmentFile === null ? 'secondary' : 'primary'}
                    sx={{ mr: 2 }}
                  >
                    {selectedAlignmentFile ? selectedAlignmentFile.name : 'Upload molecule file'}
                    <input accept='.mol2' type='file' hidden onChange={e => handleUploadAlignment(e)} />
                  </Button>
                </Tooltip>
                <IconButton
                  aria-label='delete'
                  onClick={e => setSelectedAlignmentFile(null)}
                  sx={{ display: selectedAlignmentFile === null ? 'none' : '' }}
                >
                  <DeleteIcon />
                </IconButton>
              </Typography>
            </TabPanel>
            <TabPanel value='3' sx={{ p: 0 }}>
              <Typography variant='body2' sx={{ marginBottom: 4 }}>
                <Typography variant='body2' sx={{ mb: 4 }}>
                  Execution of multiple algorithms using selected dataset
                </Typography>
                <Tooltip
                  title={
                    <Typography fontSize={15} variant='body1' color={'#fff'}>
                      File that contains a collection of molecules along with some associated properties or activities,
                      such as binding affinity or biological activity , need to be in .csv format
                    </Typography>
                  }
                  TransitionComponent={Fade}
                  placement='left'
                  arrow
                >
                  <Button
                    variant='contained'
                    component='label'
                    color={selectedDatasetFile === null ? 'secondary' : 'primary'}
                    sx={{ mr: 2 }}
                  >
                    {selectedDatasetFile ? selectedDatasetFile.name : 'Upload dataset file'}
                    <input accept='.csv' type='file' hidden onChange={e => handleUploadDataset(e)} />
                  </Button>
                </Tooltip>
                <IconButton
                  aria-label='delete'
                  onClick={e => setSelectedDatasetFile(null)}
                  sx={{ display: selectedDatasetFile === null ? 'none' : '' }}
                >
                  <DeleteIcon />
                </IconButton>
              </Typography>
            </TabPanel>
          </CardContent>
        </TabContext>
      </Card>
      <AutoProcess
        setAutoController={setAutoController}
        value={value}
        selectedAlignmentFile={selectedAlignmentFile}
        selectedLigandFile={selectedLigandFile}
        selectedRefFile={selectedRefFile}
        selectedDatasetFile={selectedDatasetFile}
      />
    </>
  )
}

export default FileUpload
