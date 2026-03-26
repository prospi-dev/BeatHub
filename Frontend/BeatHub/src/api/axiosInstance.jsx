import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:  import.meta.env.VITE_API_URL || 'https://localhost:7117/api', 
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
})

// Response interceptor — if any request gets a 401,
// clear the session and send the user back to login.
// This handles expired tokens automatically.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance;
