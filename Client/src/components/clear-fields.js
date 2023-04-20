export const clearFields = (
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
) => {
  if (!isXGBoostAlgo) {
    setXGBoostValues({
      numberOfFeatures: '',
      learningRate: '',
      lambda: '',
      dropRate: '',
      maxDepth: '',
      alpha: ''
    })
    setXgboostSelection([])
  }
  if (!isLasso) {
    setLassoValues(null)
    setLassoSelection([])
  }
  if (!isDTR) {
    setDTRValues({
      numberOfFeatures: '',
      maxDepth: '',
      minSample: '',
      minSampleLeaf: '',
      minWeightFraction: ''
    })
    setDtrSelection([])
  }
}

export const clearOnNavi = (
  value,
  setSelectedRefFile,
  setSelectedLigandFile,
  setSelectedAlignmentFile,
  setSelectedDatasetFile
) => {
  if (value === '1') {
    setSelectedAlignmentFile(null)
    return setSelectedDatasetFile(null)
  } else if (value === '2') {
    setSelectedRefFile(null)
    setSelectedLigandFile(null)
    return setSelectedDatasetFile(null)
  }
  setSelectedRefFile(null)
  setSelectedLigandFile(null)
  return setSelectedAlignmentFile(null)
}

export const clearAll = (
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
  setNumberOfFeaturesLasso
) => {
  setAuto(false)
  setIsRDKit(false)
  setIsMordred(false)
  setIsXGBoostAlgo(false)
  setIsDTR(false)
  setIsLasso(false)
  setBindingSelection(null)
  clearFields(
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
}
