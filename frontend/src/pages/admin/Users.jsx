import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { Users as UsersIcon } from 'lucide-react'

const roleBadge = (role) => {
  const map = { ADMIN: 'badge-admin', CONDUCTOR: 'badge-conductor', APODERADO: 'badge-apoderado' }
  const label = { ADMIN: 'Administrador', CONDUCTOR: 'Conductor', APODERADO: 'Apoderado' }
  return <span className={map[role] || ''}>{label[role] || role}</span>
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/users').then(r => setUsers(r.data)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} usuarios en el sistema</p>
      </div>

      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Cargando...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Nombre', 'Correo', 'Teléfono', 'Rol', 'Estado'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      {u.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3 text-gray-500">{u.phone || '-'}</td>
                  <td className="px-4 py-3">{roleBadge(u.role)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
