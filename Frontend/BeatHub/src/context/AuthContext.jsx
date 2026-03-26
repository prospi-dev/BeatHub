import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

// Decode the JWT payload and check if it's expired
function isTokenExpired(token) {
  if (!token) return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    // exp is in seconds, Date.now() is in milliseconds
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

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

  // Periodically check if the token has expired (every minute)
  useEffect(() => {
    if (!token) return
    const interval = setInterval(() => {
      if (isTokenExpired(token)) {
        logout()
      }
    }, 60 * 1000)
    return () => clearInterval(interval)
  }, [token])

  const login = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({
      name: data.name,
      email: data.email
    }))
    setToken(data.token)
    setUser({ name: data.name, email: data.email })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isTokenExpired }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}