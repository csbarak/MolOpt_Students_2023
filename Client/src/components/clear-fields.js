export const clearFields = (
  multipleAlgoSelection,
  setXGBoostValues,
  setDTRValues,
  setLassoValues,
  setXgboostSelection,
  setLassoSelection,
  setDtrSelection
) => {
  if (!multipleAlgoSelection.includes('XGBoost')) {
    setXGBoostValues({
      learningRate: '',
      lambda: '',
      dropRate: '',
      maxDepth: '',
      alpha: ''
    })
    setXgboostSelection([])
  }
  if (!multipleAlgoSelection.includes('Lasso Regression')) {
    setLassoValues('')
    setLassoSelection([])
  }
  if (!multipleAlgoSelection.includes('Decision Tree Regressor')) {
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
  multipleAlgoSelection,
  setXGBoostValues,
  setDTRValues,
  setLassoValues,
  setXgboostSelection,
  setLassoSelection,
  setDtrSelection,
  setAuto,
  setIsRDKit,
  setIsMordred,
  setBindingSelection
) => {
  setAuto(false)
  setIsRDKit(false)
  setIsMordred(false)
  setBindingSelection(null)
  clearFields(
    multipleAlgoSelection,
    setXGBoostValues,
    setDTRValues,
    setLassoValues,
    setXgboostSelection,
    setLassoSelection,
    setDtrSelection
  )
}
