import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  id: number
  userName: string
  roles: string[]
}

interface AuthContextType {
  user: User | null
  login: (u: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {}
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  function login(u: User) {
    setUser(u)
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
