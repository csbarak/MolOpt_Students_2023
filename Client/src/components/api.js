import axios from 'axios'
//chnage 132.72.8.188 to localhost to run locally
const api = axios.create({
  baseURL: `http://132.72.8.188:8000/api/`
})

export default api
