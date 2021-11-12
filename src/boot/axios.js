import axios from 'axios'
const axiosInstance = axios.create({
  // baseURL: 'http://localhost:8081'
  baseURL: 'https://terapiapp...'
  // baseURL: 'https://api.example.com'
})
export default ({ Vue }) => {
  Vue.prototype.$axios = axiosInstance
}
export { axiosInstance }
