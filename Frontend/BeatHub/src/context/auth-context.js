import { createContext, useContext } from "react"

export const AuthContext = createContext(null)

// Decode the JWT payload and check if it's expired
export function isTokenExpired(token) {
  if (!token) return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    // exp is in seconds, Date.now() is in milliseconds
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export function useAuth() {
  return useContext(AuthContext)
}
