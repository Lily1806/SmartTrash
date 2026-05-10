import axios from 'axios'

const api = axios.create({
  baseURL: '/api',   // Vite proxy sẽ chuyển sang http://localhost:8000
  timeout: 30000,
})

// Tự động thêm JWT token vào mọi request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Tự động xử lý lỗi 401 (token hết hạn)
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
