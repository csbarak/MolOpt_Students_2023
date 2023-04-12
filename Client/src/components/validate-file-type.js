export const validate = (file, operation) => {
  if (operation === 'alignment') {
    return file && file.name.split('.').pop() === 'sdf'
  } else if (operation === 'feature') {
    return file && file.name.split('.').pop() === 'mol2'
  } else {
    return file && file.name.split('.').pop() === 'csv'
  }
}
