// ** React Imports
import { useState } from 'react'
import React from 'react'
// ** MUI Imports
import { Tab, Card, Typography, CardContent } from '@mui/material'
import { TabList, TabPanel, TabContext } from '@mui/lab'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

import FAQCard from 'src/components/faq-card'
import ImageCarusel from './image-carusel'

const AlgorithmsCard = () => {
  // ** State
  const [value, setValue] = useState('1')
  const [alignmentCards, setAlignmentCards] = useState([false, false, false, false])
  const [featureExtractionCards, setFeatureExtractionCards] = useState([false, false, false, false])
  const [machineLearningCards, setMachineLearningCards] = useState([false, false, false, false])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Card>
      <TabContext value={value}>
        <TabList centered onChange={handleChange} aria-label='card navigation example'>
          <Tab value='1' label='Mol Optimizer' />
          <Tab value='2' label='Alignment' />
          <Tab value='3' label='Feature Extraction' />
          <Tab value='4' label='Training machine learning models' />
        </TabList>
        <CardContent sx={{ textAlign: 'center' }}>
          <TabPanel value='1' sx={{ p: 0 }}>
            <Typography variant='body1'>
              MolOptimizer is designed to serve as a decision-making tool for a general medicinal chemist end-user in
              determining which small molecules had the potential to serve as potential inhibitors without the need to
              run computation and time intensive in-silico docking process.
            </Typography>
            <br />
            <ImageCarusel props={['/images/1.png']} />
          </TabPanel>
          <TabPanel value='2' sx={{ p: 0 }}>
            <Typography variant='body1'>
              The alignment of molecules for virtual screening of large datasets plays a pivotal role in the analysis
              using MolOptimizer. This step preserves the structural orientation of all molecules and obtains structural
              uniformity to the dataset. Alignment of the molecules in MolOptimizer is performed using RDKit's Most
              Common Substructure (MCS) module on the principles of tethered minimization.
              <br />
              <br />{' '}
              <a target='_blank' rel='noopener noreferrer' href='https://www.rdkit.org/docs/source/rdkit.Chem.MCS.html'>
                Link to RDKit MCS module
              </a>
              <br />
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://github.com/Discngine/rdkit_tethered_minimization'
              >
                Link to Tethered Minimization
              </a>

              <br /><br /><br />{' '}
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <FAQCard
                    question='How to run this algorithm in MolOpt?'
                    answer='Go to the Dashboard page, chose the alignment tab, then upload the relevant files and click on "Submit".'
                    isAnswer={alignmentCards}
                    setIsAnswer={setAlignmentCards}
                    index={0}
                  />
                </Grid>
                <Divider />
                <Grid item xs={12}>
                  <FAQCard
                    question='Which files are needed to run this algorithm?'
                    answer='2 .sdf files, one for the reference molecule and one for the required molecules.'
                    isAnswer={alignmentCards}
                    setIsAnswer={setAlignmentCards}
                    index={1}
                  />
                </Grid>
                <Divider />
                <Grid item xs={12}>
                  <FAQCard
                    question='What should be the format of each .sdf file?'
                    answer='First 2 rows will contain the title and name of the file.
                            The third line will be blank to separate the title from the content of the file.
                            The fourth line will contain the headers – separated by tab (\t).
                            From the fifth line and until the end of the file, each line will contain the values for each header mentioned in line 4 – separated by tab (\t) as well.
                            For ending the file/table in the file, just write these two lines: M	END => $$$$'
                    isAnswer={alignmentCards}
                    setIsAnswer={setAlignmentCards}
                    index={2}
                  />
                </Grid>
                <Divider />
                <Grid item xs={12}>
                  <FAQCard
                    question='What should be the output of the algorithm?'
                    answer='The output of this run will be a “.mol2” file – the aligned molecule file.'
                    isAnswer={alignmentCards}
                    setIsAnswer={setAlignmentCards}
                    index={3}
                  />
                </Grid>
                <Divider />
              </Grid>
            </Typography>
          </TabPanel>
          <TabPanel value='3' sx={{ p: 0 }}>
            <Typography variant='body1'>
              MolOptimizer offers extraction of chemical descriptors using two available open resource libraries: RDKit
              and Mordred. Through RDKit and Mordred libraries, a total of 1966 chemical descriptors can be extracted
              (95 from RDKit and 1871 from Mordred. A complete list of chemical descriptors which can be extracted using
              MolOptimizer is available in the supplementary for the paper.
              <br />
              <br />{' '}
              <a target='_blank' rel='noopener noreferrer' href='https://www.rdkit.org/docs/Overview.html'>
                Link to RDKit library{' '}
              </a>
              <br />
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='http://mordred-descriptor.github.io/documentation/master/'
              >
                Link to Mordred library{' '}
              </a>
            </Typography>
            <br />
            <ImageCarusel props={['/images/2.png']} />
            <br /><br /><br />{' '}
            <Grid container spacing={6}>
                <Grid item xs={12}>
                  <FAQCard
                    question='How to run this algorithm in MolOpt?'
                    answer='Go to the Dashboard page, chose the feature extraction tab and the required running type (RDKIT/Mordred), then upload the relevant file and click on "Submit".'
                    isAnswer={featureExtractionCards}
                    setIsAnswer={setFeatureExtractionCards}
                    index={0}
                  />
                </Grid>
                <Divider />
                <Grid item xs={12}>
                  <FAQCard
                    question='Which files are needed to run this algorithm?'
                    answer='Only one file is needed. The file is .mol2 file (most recommended to be aligned).'
                    isAnswer={featureExtractionCards}
                    setIsAnswer={setFeatureExtractionCards}
                    index={1}
                  />
                </Grid>
                <Divider />
                <Grid item xs={12}>
                  <FAQCard
                    question='What should be the format of each .mol2 file?'
                    answer='The .mol2 file is divided into sections (<TRIPOS>), each of them describe the molecule'
                    isAnswer={featureExtractionCards}
                    setIsAnswer={setFeatureExtractionCards}
                    index={2}
                  />
                </Grid>
                <Divider />
                <Grid item xs={12}>
                  <FAQCard
                    question='What should be the output of the algorithm?'
                    answer='The output of this run will be an excel file – which include all the required features of the molecule given by the user.'
                    isAnswer={featureExtractionCards}
                    setIsAnswer={setFeatureExtractionCards}
                    index={3}
                  />
                </Grid>
                <Divider />
              </Grid>
          </TabPanel>
          <TabPanel value='4' sx={{ p: 0 }}>
            <Typography variant='body1'>
              MolOptimizer offers three Machine Learning (ML) algorithms in an easy-to-use user interface: extreme
              gradient boosting regression (XGBoost), lasso regression, and decision tree regressor. Training ML models
              on labelled datasets of small molecules allows predicting the binding score of novel fragment-containing
              small molecules without the need for molecular docking by taking into account chemical features embedded
              in the new molecules that are important for the binding to the target. ML algorithms in MolOptimizer are
              offered in Expert Mode (Figure a) and Manual Mode (Figure b).
              <br />
              <br />
              Expert mode enables the functionality to automatically find the best hyper parameters using GridSearchCV
              and recommend the top ten most influential features to the user. Manual mode enables the user to skip the
              lengthy process of training a primary and a secondary ML model by giving user the ability to enter the
              hyper parameters on which the model is to be trained on and also enables the selection of chemical
              features for training the models.
            </Typography>
            <br />
            <ImageCarusel props={['/images/3.png']} />
            <br /><br /><br />{' '}
            <Grid container spacing={6}>
                <Grid item xs={12}>
                  <FAQCard
                    question='How to run this algorithm in MolOpt?'
                    answer='Go to the Dashboard page, chose the Machine Learning tab and the required running type (chose at least one of XGBoost, Lasso regression, Decision tree regressor), then upload the relevant file and click on "Submit".'
                    isAnswer={machineLearningCards}
                    setIsAnswer={setMachineLearningCards}
                    index={0}
                  />
                </Grid>
                <Divider />
                <Grid item xs={12}>
                  <FAQCard
                    question='Which files are needed to run this algorithm?'
                    answer='Only one file is needed. The file is the excel file that include the characters of the molecule. Note that there is also option to add param values for this algorithm run (This will run the algorithm on manual mode with the input values, otherwise it will run on auto mode with default values)'
                    isAnswer={machineLearningCards}
                    setIsAnswer={setMachineLearningCards}
                    index={1}
                  />
                </Grid>
                <Divider />
                <Grid item xs={12}>
                  <FAQCard
                    question='What should be the format of the Excel file?'
                    answer='First line should contain the headers (each cell will have the name of different character of the molecule).
                    The rest of the lines will contains the values for each character.'
                    isAnswer={machineLearningCards}
                    setIsAnswer={setMachineLearningCards}
                    index={2}
                  />
                </Grid>
                <Divider />
                <Grid item xs={12}>
                  <FAQCard
                    question='What should be the output of the algorithm?'
                    answer='The output of this run will be an excel file – which include the docking level details of the molecule.'
                    isAnswer={machineLearningCards}
                    setIsAnswer={setMachineLearningCards}
                    index={3}
                  />
                </Grid>
                <Divider />
              </Grid>
            <Typography variant='body1'></Typography>
          </TabPanel>
        </CardContent>
      </TabContext>
    </Card>
  )
}

export default AlgorithmsCard
