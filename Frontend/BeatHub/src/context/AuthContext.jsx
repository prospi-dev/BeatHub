import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext, isTokenExpired } from "./auth-context"

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem('token')
    // If token is expired on load, clear it immediately
    if (isTokenExpired(stored)) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return null
    }
    return stored
  })

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const navigate = useNavigate()

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  // Periodically check if the token has expired (every minute)
  useEffect(() => {
    if (!token) return
    const interval = setInterval(() => {
      if (isTokenExpired(token)) {
        logout()
      }
    }, 60 * 1000)
    return () => clearInterval(interval)
  }, [token, logout])

  // A 401 from any request means the session is invalid: tear it down
  // and send the user to login (dispatched by the axios interceptor).
  useEffect(() => {
    const handleUnauthorized = () => {
      logout()
      navigate('/login')
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [logout, navigate])

  const login = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({
      username: data.username,
      email: data.email,
      avatarUrl: data.avatarUrl || null
    }))
    setToken(data.token)
    setUser({ username: data.username, email: data.email, avatarUrl: data.avatarUrl || null })
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isTokenExpired }}>
      {children}
    </AuthContext.Provider>
  )
}
