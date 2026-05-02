import { useEffect, useState, useCallback } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { MapPin, Navigation, Users, AlertTriangle, LogOut, Bus, QrCode } from 'lucide-react'

export default function DriverDashboard() {
  const { user, logout } = useAuth()
  const [routes, setRoutes] = useState([])
  const [absences, setAbsences] = useState([])
  const [tracking, setTracking] = useState(false)
  const [lastPos, setLastPos] = useState(null)
  const [incidentForm, setIncidentForm] = useState({ description: '', severity: 'MEDIA', routeId: '' })
  const [showIncident, setShowIncident] = useState(false)
  let watchId = null

  useEffect(() => {
    api.get('/routes').then(r => setRoutes(r.data)).catch(() => {})
    api.get('/absences/today').then(r => setAbsences(r.data)).catch(() => {})
  }, [])

  const startTracking = () => {
    if (!navigator.geolocation) { toast.error('Geolocalización no disponible'); return }
    setTracking(true)
    toast.success('Rastreo GPS iniciado')
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setLastPos({ latitude, longitude })
        api.post('/gps/update', { latitude, longitude, routeId: routes[0]?.id || null })
          .catch(() => {})
      },
      () => toast.error('Error obteniendo ubicación'),
      { enableHighAccuracy: true, maximumAge: 10000 }
    )
    window._vkWatchId = watchId
  }

  const stopTracking = () => {
    if (window._vkWatchId) {
      navigator.geolocation.clearWatch(window._vkWatchId)
    }
    setTracking(false)
    toast('Rastreo GPS detenido')
  }

  const handleIncident = async (e) => {
    e.preventDefault()
    try {
      await api.post('/incidents', incidentForm)
      toast.success('Incidente registrado')
      setShowIncident(false)
      setIncidentForm({ description: '', severity: 'MEDIA', routeId: '' })
    } catch { toast.error('Error al registrar incidente') }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bus size={24} />
          <div>
            <h1 className="font-bold text-lg">ViaKids — Conductor</h1>
            <p className="text-blue-300 text-sm">{user?.name}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-blue-200 hover:text-white">
          <LogOut size={18} /> Salir
        </button>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* GPS Tracking */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Navigation size={20} className="text-blue-600" />
            <h2 className="font-semibold text-gray-800">Rastreo GPS</h2>
          </div>
          {lastPos && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm">
              <p className="text-green-700 font-medium">Última posición enviada</p>
              <p className="text-green-600">Lat: {lastPos.latitude.toFixed(6)}, Lng: {lastPos.longitude.toFixed(6)}</p>
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={tracking ? stopTracking : startTracking}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                tracking ? 'bg-red-600 hover:bg-red-700 text-white' : 'btn-primary'
              }`}
            >
              <MapPin size={16} />
              {tracking ? 'Detener rastreo' : 'Iniciar rastreo GPS'}
            </button>
            {tracking && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Transmitiendo ubicación...
              </div>
            )}
          </div>
        </div>

        {/* Routes */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={20} className="text-blue-600" />
            <h2 className="font-semibold text-gray-800">Mis Rutas</h2>
          </div>
          {routes.length === 0 ? (
            <p className="text-gray-400 text-sm">No tienes rutas asignadas</p>
          ) : (
            <div className="space-y-3">
              {routes.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{r.name}</p>
                    {r.startPoint && <p className="text-sm text-gray-500">{r.startPoint} → {r.endPoint}</p>}
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Activa</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Absences today */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Users size={20} className="text-orange-500" />
            <h2 className="font-semibold text-gray-800">Ausencias de Hoy</h2>
            <span className="ml-auto text-sm text-gray-500">{absences.length} reportadas</span>
          </div>
          {absences.length === 0 ? (
            <p className="text-gray-400 text-sm">Sin ausencias reportadas para hoy</p>
          ) : (
            <div className="space-y-2">
              {absences.map(a => (
                <div key={a.id} className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-100 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{a.student?.name}</p>
                    <p className="text-xs text-gray-500">{a.reason || 'Sin motivo especificado'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Incident */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-500" />
              <h2 className="font-semibold text-gray-800">Registrar Incidente</h2>
            </div>
            <button
              onClick={() => setShowIncident(!showIncident)}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              {showIncident ? 'Cancelar' : 'Nuevo incidente'}
            </button>
          </div>
          {showIncident && (
            <form onSubmit={handleIncident} className="space-y-3">
              <select
                className="input-field"
                value={incidentForm.routeId}
                onChange={e => setIncidentForm({...incidentForm, routeId: e.target.value})}
              >
                <option value="">Seleccionar ruta...</option>
                {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              <select
                className="input-field"
                value={incidentForm.severity}
                onChange={e => setIncidentForm({...incidentForm, severity: e.target.value})}
              >
                <option value="BAJA">Baja severidad</option>
                <option value="MEDIA">Severidad media</option>
                <option value="ALTA">Alta severidad</option>
              </select>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Describe el incidente..."
                value={incidentForm.description}
                onChange={e => setIncidentForm({...incidentForm, description: e.target.value})}
                required
              />
              <button type="submit" className="btn-danger w-full">Registrar incidente</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
