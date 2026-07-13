import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - only redirect if not already on login page and user data is cleared
      const currentPath = window.location.pathname
      const hasUserData = localStorage.getItem('user')
      
      if (currentPath !== '/login' && currentPath !== '/' && !hasUserData) {
        // Only redirect if there's no user data
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
