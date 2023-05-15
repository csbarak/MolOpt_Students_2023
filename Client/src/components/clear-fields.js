export const clearFields = (
  isXGBoostAlgo,
  isLasso,
  isDTR,
  setXGBoostValues,
  setDTRValues,
  setLassoValues,
  setXgboostSelection,
  setLassoSelection,
  setDtrSelection
) => {
  if (!isXGBoostAlgo) {
    setXGBoostValues({
      learningRate: '',
      lambda: '',
      dropRate: '',
      maxDepth: '',
      alpha: ''
    })
    setXgboostSelection([])
  }
  if (!isLasso) {
    setLassoValues('')
    setLassoSelection([])
  }
  if (!isDTR) {
    setDTRValues({
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
  setSelectedDatasetFile,
  setSelectedPredictionFile
) => {
  if (value === '1') {
    setSelectedAlignmentFile(null)
    setSelectedPredictionFile(null)
    return setSelectedDatasetFile(null)
  } else if (value === '2') {
    setSelectedRefFile(null)
    setSelectedLigandFile(null)
    setSelectedPredictionFile(null)
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
  setBindingSelection
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
    setDtrSelection
  )
}
