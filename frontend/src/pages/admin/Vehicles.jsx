import { useEffect, useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Truck } from 'lucide-react'

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

const emptyForm = { plate: '', brand: '', model: '', year: '', capacity: '', conductorId: '' }

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [conductors, setConductors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const load = () => {
    Promise.all([api.get('/vehicles'), api.get('/users')]).then(([v, u]) => {
      setVehicles(v.data)
      setConductors(u.data.filter(u => u.role === 'CONDUCTOR'))
    }).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (v) => {
    setEditing(v)
    setForm({ plate: v.plate, brand: v.brand, model: v.model, year: v.year || '', capacity: v.capacity || '', conductorId: v.conductor?.id || '' })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, year: form.year ? parseInt(form.year) : null, capacity: form.capacity ? parseInt(form.capacity) : null }
    try {
      if (editing) { await api.put(`/vehicles/${editing.id}`, payload); toast.success('Vehículo actualizado') }
      else { await api.post('/vehicles', payload); toast.success('Vehículo creado') }
      setShowModal(false); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Error al guardar') }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este vehículo?')) return
    try { await api.delete(`/vehicles/${id}`); toast.success('Vehículo eliminado'); load() }
    catch { toast.error('Error al eliminar') }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehículos</h1>
          <p className="text-gray-500 text-sm mt-1">{vehicles.length} vehículos registrados</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Nuevo vehículo
        </button>
      </div>

      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Cargando...</div>
        ) : vehicles.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No hay vehículos registrados</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Patente', 'Marca/Modelo', 'Año', 'Capacidad', 'Conductor', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vehicles.map(v => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-bold text-gray-800">{v.plate}</td>
                  <td className="px-4 py-3 text-gray-700">{v.brand} {v.model}</td>
                  <td className="px-4 py-3 text-gray-500">{v.year || '-'}</td>
                  <td className="px-4 py-3 text-gray-500">{v.capacity ? `${v.capacity} pasajeros` : '-'}</td>
                  <td className="px-4 py-3 text-gray-500">{v.conductor?.name || 'Sin asignar'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(v)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(v.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal title={editing ? 'Editar vehículo' : 'Nuevo vehículo'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patente</label>
              <input className="input-field font-mono uppercase" value={form.plate} onChange={e => setForm({...form, plate: e.target.value.toUpperCase()})} required placeholder="ABCD12" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                <input className="input-field" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                <input className="input-field" value={form.model} onChange={e => setForm({...form, model: e.target.value})} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                <input type="number" className="input-field" value={form.year} onChange={e => setForm({...form, year: e.target.value})} placeholder="2020" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
                <input type="number" className="input-field" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} placeholder="20" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Conductor</label>
              <select className="input-field" value={form.conductorId} onChange={e => setForm({...form, conductorId: e.target.value})}>
                <option value="">Sin asignar</option>
                {conductors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
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
