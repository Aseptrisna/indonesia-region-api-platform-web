import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api/v1'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-logout on 401 (token expired / invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      // Redirect to login only if not already on auth pages
      const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'].some(
        (path) => window.location.pathname.startsWith(path),
      )
      if (!isAuthPage) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
