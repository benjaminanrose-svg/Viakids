import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Bus, BookOpen, MapPin, BellOff, LogOut, AlertCircle } from 'lucide-react'
import BusMap from '../../components/Map'
import NotificationBell from '../../components/NotificationBell'

export default function ParentDashboard() {
  const { user, logout } = useAuth()
  const [students, setStudents] = useState([])
  const [conductors, setConductors] = useState([])
  const [gpsLocation, setGpsLocation] = useState(null)
  const [absenceForm, setAbsenceForm] = useState({ studentId: '', reason: '', date: new Date().toISOString().split('T')[0] })
  const [showAbsence, setShowAbsence] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/students')
      .then(r => setStudents(r.data))
      .catch(() => toast.error('Error al cargar estudiantes'))
      .finally(() => setLoading(false))

    api.get('/gps/conductors')
      .then(r => {
        setConductors(r.data)
        if (r.data.length > 0) {
          api.get(`/gps/location/${r.data[0].id}`)
            .then(g => setGpsLocation(g.data))
            .catch(() => {})
        }
      })
      .catch(() => {})
  }, [])

  const refreshGps = () => {
    if (conductors.length === 0) return
    api.get(`/gps/location/${conductors[0].id}`)
      .then(r => { setGpsLocation(r.data); toast.success('Ubicación actualizada') })
      .catch(() => toast.error('Sin datos GPS del conductor'))
  }

  const handleAbsence = async (e) => {
    e.preventDefault()
    try {
      await api.post('/absences', absenceForm)
      toast.success('Ausencia reportada correctamente')
      setShowAbsence(false)
      setAbsenceForm({ studentId: '', reason: '', date: new Date().toISOString().split('T')[0] })
    } catch { toast.error('Error al reportar ausencia') }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bus size={24} />
          <div>
            <h1 className="font-bold text-lg">ViaKids — Apoderado</h1>
            <p className="text-blue-300 text-sm">{user?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <button onClick={logout} className="flex items-center gap-2 text-blue-200 hover:text-white">
            <LogOut size={18} /> Salir
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* GPS Map */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-blue-600" />
              <h2 className="font-semibold text-gray-800">Ubicación del Transporte</h2>
            </div>
            <button onClick={refreshGps} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Actualizar
            </button>
          </div>
          {gpsLocation ? (
            <>
              <BusMap latitude={gpsLocation.latitude} longitude={gpsLocation.longitude} />
              <p className="text-xs text-gray-400 mt-2 text-center">
                Última actualización: {new Date(gpsLocation.timestamp).toLocaleTimeString('es-CL')}
              </p>
            </>
          ) : (
            <div className="h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400">
              <MapPin size={32} className="mb-2" />
              <p className="text-sm">Sin datos GPS disponibles</p>
              <p className="text-xs mt-1">El conductor debe iniciar el rastreo</p>
            </div>
          )}
        </div>

        {/* Students */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={20} className="text-green-600" />
            <h2 className="font-semibold text-gray-800">Mis Estudiantes</h2>
          </div>
          {loading ? (
            <p className="text-gray-400 text-sm">Cargando...</p>
          ) : students.length === 0 ? (
            <p className="text-gray-400 text-sm">No tienes estudiantes registrados</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {students.map(s => (
                <div key={s.id} className="p-3 bg-green-50 border border-green-100 rounded-lg">
                  <p className="font-medium text-gray-800">{s.name}</p>
                  <p className="text-sm text-gray-500">{s.grade} — {s.school}</p>
                  <p className="text-xs text-gray-400 mt-1">RUT: {s.rut}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Report absence */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BellOff size={20} className="text-orange-500" />
              <h2 className="font-semibold text-gray-800">Reportar Ausencia</h2>
            </div>
            <button
              onClick={() => setShowAbsence(!showAbsence)}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              {showAbsence ? 'Cancelar' : 'Reportar ausencia'}
            </button>
          </div>

          {!showAbsence && (
            <div className="flex items-start gap-2 text-sm text-gray-500 bg-orange-50 rounded-lg p-3">
              <AlertCircle size={16} className="text-orange-400 mt-0.5 flex-shrink-0" />
              <p>Si tu hijo/a no asistirá, notifica aquí con anticipación para optimizar la ruta del conductor.</p>
            </div>
          )}

          {showAbsence && (
            <form onSubmit={handleAbsence} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estudiante</label>
                <select className="input-field" value={absenceForm.studentId} onChange={e => setAbsenceForm({...absenceForm, studentId: e.target.value})} required>
                  <option value="">Seleccionar estudiante...</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input type="date" className="input-field" value={absenceForm.date} onChange={e => setAbsenceForm({...absenceForm, date: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo (opcional)</label>
                <input className="input-field" placeholder="Enfermedad, viaje..." value={absenceForm.reason} onChange={e => setAbsenceForm({...absenceForm, reason: e.target.value})} />
              </div>
              <button type="submit" className="btn-primary w-full">Enviar reporte de ausencia</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
