import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import AdminDashboard from './pages/admin/AdminDashboard'
import Students from './pages/admin/Students'
import Routes_ from './pages/admin/Routes'
import Vehicles from './pages/admin/Vehicles'
import Users from './pages/admin/Users'
import DriverDashboard from './pages/driver/DriverDashboard'
import ParentDashboard from './pages/parent/ParentDashboard'
import AdminLayout from './components/AdminLayout'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/admin" element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="routes" element={<Routes_ />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="users" element={<Users />} />
          </Route>

          <Route path="/conductor" element={
            <ProtectedRoute allowedRole="CONDUCTOR">
              <DriverDashboard />
            </ProtectedRoute>
          } />

          <Route path="/apoderado" element={
            <ProtectedRoute allowedRole="APODERADO">
              <ParentDashboard />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
