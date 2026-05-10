import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage     from './pages/auth/LoginPage'
import RegisterPage  from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import ClassifyPage  from './pages/classify/ClassifyPage'
import HistoryPage   from './pages/history/HistoryPage'
import ReportsPage   from './pages/reports/ReportsPage'
import ProfilePage   from './pages/profile/ProfilePage'
import AdminPage     from './pages/admin/AdminPage'
import { useAuthStore } from './store/authStore'

function PrivateRoute({ children }) {
  const token = useAuthStore(s => s.token)
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/"         element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/classify" element={<PrivateRoute><ClassifyPage /></PrivateRoute>} />
      <Route path="/history"  element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
      <Route path="/reports"  element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
      <Route path="/profile"  element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="/admin"    element={<PrivateRoute><AdminPage /></PrivateRoute>} />
    </Routes>
  )
}
