import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Users, BookOpen, MapPin, Truck, LogOut, Bus
} from 'lucide-react'

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/students', label: 'Estudiantes', icon: BookOpen },
  { to: '/admin/routes', label: 'Rutas', icon: MapPin },
  { to: '/admin/vehicles', label: 'Vehículos', icon: Truck },
  { to: '/admin/users', label: 'Usuarios', icon: Users },
]

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="flex flex-col w-64 bg-blue-900 text-white min-h-screen">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-blue-800">
        <div className="bg-blue-500 rounded-lg p-2">
          <Bus size={22} />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">ViaKids</h1>
          <p className="text-blue-300 text-xs">Transporte Escolar</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {adminLinks.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-blue-800">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-blue-300 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-blue-200 hover:text-white hover:bg-blue-800 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
