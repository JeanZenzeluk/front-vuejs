const axios = require('axios')

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:8081'
  baseURL: 'https://terapiapp...'
})

export default axiosInstance
