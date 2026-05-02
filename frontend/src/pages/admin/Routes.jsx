import { useEffect, useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react'

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

const emptyForm = { name: '', description: '', conductorId: '', startPoint: '', endPoint: '' }

export default function Routes() {
  const [routes, setRoutes] = useState([])
  const [conductors, setConductors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const load = () => {
    Promise.all([api.get('/routes'), api.get('/users')]).then(([r, u]) => {
      setRoutes(r.data)
      setConductors(u.data.filter(u => u.role === 'CONDUCTOR'))
    }).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (r) => {
    setEditing(r)
    setForm({ name: r.name, description: r.description || '', conductorId: r.conductor?.id || '', startPoint: r.startPoint || '', endPoint: r.endPoint || '' })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) { await api.put(`/routes/${editing.id}`, form); toast.success('Ruta actualizada') }
      else { await api.post('/routes', form); toast.success('Ruta creada') }
      setShowModal(false); load()
    } catch { toast.error('Error al guardar') }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta ruta?')) return
    try { await api.delete(`/routes/${id}`); toast.success('Ruta eliminada'); load() }
    catch { toast.error('Error al eliminar') }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rutas</h1>
          <p className="text-gray-500 text-sm mt-1">{routes.length} rutas registradas</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Nueva ruta
        </button>
      </div>

      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Cargando...</div>
        ) : routes.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No hay rutas registradas</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Nombre', 'Conductor', 'Origen', 'Destino', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {routes.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-2">
                    <MapPin size={14} className="text-blue-500" />{r.name}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{r.conductor?.name || 'Sin asignar'}</td>
                  <td className="px-4 py-3 text-gray-500">{r.startPoint || '-'}</td>
                  <td className="px-4 py-3 text-gray-500">{r.endPoint || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${r.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {r.active ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(r)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(r.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal title={editing ? 'Editar ruta' : 'Nueva ruta'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la ruta</label>
              <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea className="input-field" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Conductor</label>
              <select className="input-field" value={form.conductorId} onChange={e => setForm({...form, conductorId: e.target.value})}>
                <option value="">Sin asignar</option>
                {conductors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Punto de inicio</label>
                <input className="input-field" value={form.startPoint} onChange={e => setForm({...form, startPoint: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destino final</label>
                <input className="input-field" value={form.endPoint} onChange={e => setForm({...form, endPoint: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary flex-1">{editing ? 'Actualizar' : 'Crear'}</button>
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
