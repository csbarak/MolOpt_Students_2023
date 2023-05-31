import axios from 'axios'

const dev = 'http://localhost:8000/api/'
const prod = 'https://132.72.8.188:8000/api/'

const api = axios.create({
  baseURL: prod
})

export default api
