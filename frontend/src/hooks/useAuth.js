import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const { token, user, setToken, setUser, logout } = useAuthStore()
  const navigate = useNavigate()

  const login = async (email, password) => {
    const res = await authService.login({ email, password })
    setToken(res.data.access_token)
    navigate('/')
  }

  const signOut = () => {
    logout()
    navigate('/login')
  }

  return { token, user, login, logout: signOut }
}
