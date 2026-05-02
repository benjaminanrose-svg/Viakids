import { useAuth } from '../context/AuthContext'
import { Bell } from 'lucide-react'

const roleLabels = {
  ADMIN: 'Administrador',
  CONDUCTOR: 'Conductor',
  APODERADO: 'Apoderado',
}

export default function Navbar() {
  const { user } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Panel de Control</h2>
        <p className="text-sm text-gray-500">ViaKids - Transporte Escolar</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500">{roleLabels[user?.role] || user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
