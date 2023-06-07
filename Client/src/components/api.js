import axios from 'axios'

const dev = 'http://localhost:8000/api/'
const prod = 'https://132.72.8.188:8000/api/'

// Note: use 'dev' to run MolOpt locally
//       use 'prod' to run MolOpt remotely

const api = axios.create({
  baseURL: dev 
  // baseURL: prod
})

export default api
