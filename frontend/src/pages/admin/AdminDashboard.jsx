import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { Users, BookOpen, MapPin, Truck, TrendingUp, Activity } from 'lucide-react'

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, students: 0, routes: 0, vehicles: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/users'),
      api.get('/students'),
      api.get('/routes'),
      api.get('/vehicles')
    ]).then(([users, students, routes, vehicles]) => {
      setStats({
        users: users.data.length,
        students: students.data.length,
        routes: routes.data.length,
        vehicles: vehicles.data.length
      })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
        <p className="text-gray-500 mt-1">Resumen del sistema ViaKids</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse h-24 bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Usuarios" value={stats.users} icon={Users} color="bg-purple-500" />
          <StatCard label="Estudiantes" value={stats.students} icon={BookOpen} color="bg-blue-500" />
          <StatCard label="Rutas activas" value={stats.routes} icon={MapPin} color="bg-green-500" />
          <StatCard label="Vehículos" value={stats.vehicles} icon={Truck} color="bg-orange-500" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={20} className="text-blue-600" />
            <h3 className="font-semibold text-gray-800">Información del sistema</h3>
          </div>
          <div className="space-y-3 text-sm">
            {[
              ['Backend', 'Spring Boot 3 + Java 21', 'text-green-600'],
              ['Frontend', 'React 18 + Vite + Tailwind', 'text-blue-600'],
              ['Base de datos', 'PostgreSQL', 'text-indigo-600'],
              ['Mensajería', 'RabbitMQ', 'text-orange-600'],
              ['Autenticación', 'JWT + Spring Security', 'text-purple-600'],
            ].map(([k, v, c]) => (
              <div key={k} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <span className="text-gray-500">{k}</span>
                <span className={`font-medium ${c}`}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-green-600" />
            <h3 className="font-semibold text-gray-800">Módulos implementados</h3>
          </div>
          <div className="space-y-2">
            {[
              ['Autenticación con roles (JWT)', true],
              ['Gestión de estudiantes + QR', true],
              ['Gestión de rutas y vehículos', true],
              ['Monitoreo GPS en tiempo real', true],
              ['Gestión de ausencias', true],
              ['Registro de incidentes', true],
              ['Notificaciones (Firebase FCM)', false],
            ].map(([label, done]) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${done ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={done ? 'text-gray-700' : 'text-gray-400'}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
