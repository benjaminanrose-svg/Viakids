import { useEffect, useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, QrCode, Search } from 'lucide-react'

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

const emptyForm = { name: '', rut: '', grade: '', school: '', apoderadoId: '' }

export default function Students() {
  const [students, setStudents] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState('')

  const load = () => {
    Promise.all([api.get('/students'), api.get('/users')]).then(([s, u]) => {
      setStudents(s.data)
      setUsers(u.data.filter(u => u.role === 'APODERADO'))
    }).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (s) => {
    setEditing(s)
    setForm({ name: s.name, rut: s.rut, grade: s.grade || '', school: s.school || '', apoderadoId: s.apoderado?.id || '' })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await api.put(`/students/${editing.id}`, form)
        toast.success('Estudiante actualizado')
      } else {
        await api.post('/students', form)
        toast.success('Estudiante creado')
      }
      setShowModal(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este estudiante?')) return
    try {
      await api.delete(`/students/${id}`)
      toast.success('Estudiante eliminado')
      load()
    } catch { toast.error('Error al eliminar') }
  }

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rut?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estudiantes</h1>
          <p className="text-gray-500 text-sm mt-1">{students.length} estudiantes registrados</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Nuevo estudiante
        </button>
      </div>

      <div className="card mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input-field pl-10"
            placeholder="Buscar por nombre o RUT..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Cargando...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No hay estudiantes</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Nombre', 'RUT', 'Curso', 'Colegio', 'Apoderado', 'QR', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                  <td className="px-4 py-3 text-gray-500">{s.rut}</td>
                  <td className="px-4 py-3 text-gray-500">{s.grade || '-'}</td>
                  <td className="px-4 py-3 text-gray-500">{s.school || '-'}</td>
                  <td className="px-4 py-3 text-gray-500">{s.apoderado?.name || '-'}</td>
                  <td className="px-4 py-3">
                    <span title={s.qrCode} className="flex items-center gap-1 text-blue-600">
                      <QrCode size={14} />
                      <span className="font-mono text-xs">{s.qrCode?.slice(0, 8)}...</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal title={editing ? 'Editar estudiante' : 'Nuevo estudiante'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
              <input className="input-field" value={form.rut} onChange={e => setForm({...form, rut: e.target.value})} required placeholder="12.345.678-9" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
                <input className="input-field" value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} placeholder="5° Básico" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Colegio</label>
                <input className="input-field" value={form.school} onChange={e => setForm({...form, school: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apoderado</label>
              <select className="input-field" value={form.apoderadoId} onChange={e => setForm({...form, apoderadoId: e.target.value})} required>
                <option value="">Seleccionar apoderado...</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
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
