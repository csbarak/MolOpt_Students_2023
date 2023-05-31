import axios from 'axios'
//chnage PROD_URL to DEV_URL to run locally
const api = axios.create({
  baseURL: `http://${process.env.PROD_URL}:8000/api/`
})

export default api
