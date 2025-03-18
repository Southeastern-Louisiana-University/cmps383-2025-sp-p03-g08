import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface Props {
  children: ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const { user } = useAuth()
  if (!user || !user.roles.includes('Admin')) {
    return <Navigate to="/" />
  }
  return <>{children}</>
}
