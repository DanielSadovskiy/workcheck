import axios from 'axios'

const baseURL = process.env.REACT_APP_BASE_URL
console.log('baseURL: ' + baseURL)

export const axiosInstance = axios.create({
  baseURL,
  timeout: 1000 * 60,
  withCredentials: true,
})

