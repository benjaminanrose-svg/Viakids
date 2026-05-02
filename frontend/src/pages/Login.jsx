import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Bus, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const redirectMap = { ADMIN: '/admin', CONDUCTOR: '/conductor', APODERADO: '/apoderado' }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await login(email, password)
      toast.success(`Bienvenido, ${data.name}!`)
      navigate(redirectMap[data.role] || '/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (role) => {
    const demos = {
      admin: ['admin@viakids.cl', 'Admin123!'],
      conductor: ['conductor@viakids.cl', 'Conductor123!'],
      apoderado: ['apoderado@viakids.cl', 'Apoderado123!']
    }
    setEmail(demos[role][0])
    setPassword(demos[role][1])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <Bus size={32} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white">ViaKids</h1>
          <p className="text-blue-200 mt-1">Transporte Escolar Inteligente</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
                placeholder="usuario@viakids.cl"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading ? 'Iniciando sesión...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center mb-3">Accesos de demostración:</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { role: 'admin', label: 'Admin', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200' },
                { role: 'conductor', label: 'Conductor', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200' },
                { role: 'apoderado', label: 'Apoderado', color: 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200' }
              ].map(({ role, label, color }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => fillDemo(role)}
                  className={`text-xs py-1.5 px-2 rounded-lg border font-medium transition-colors ${color}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
