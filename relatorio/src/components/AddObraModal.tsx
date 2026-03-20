import { useState } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createObra, supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface AddObraModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export function AddObraModal({ open, onClose, onCreated }: AddObraModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: '',
    endereco: '',
    contratante: '',
    responsavel: '',
    numero_contrato: '',
    prazo_contratual: 365,
    data_inicio: new Date().toISOString().split('T')[0],
    status: 'em_andamento' as const,
  })

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    try {
      const obra = await createObra({ ...form })
      // Add creator as admin
      const { error: ouError } = await supabase.from('obra_users').insert({
        obra_id: obra.id,
        user_id: user.id,
        role: 'admin',
      })
      if (ouError) throw ouError
      toast.success('Obra criada com sucesso!')
      onCreated()
      onClose()
    } catch (err) {
      toast.error('Erro ao criar obra: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Nova Obra</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da obra *</label>
            <input
              required
              value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: POSTO SIENA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
            <input
              value={form.endereco}
              onChange={e => setForm(f => ({ ...f, endereco: e.target.value }))}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Av. Principal, 123 - Rio de Janeiro"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contratante</label>
              <input
                value={form.contratante}
                onChange={e => setForm(f => ({ ...f, contratante: e.target.value }))}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="RR ENGENHARIA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
              <input
                value={form.responsavel}
                onChange={e => setForm(f => ({ ...f, responsavel: e.target.value }))}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do responsável"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">N° do contrato</label>
              <input
                value={form.numero_contrato}
                onChange={e => setForm(f => ({ ...f, numero_contrato: e.target.value }))}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prazo contratual (dias)</label>
              <input
                type="number"
                min={1}
                value={form.prazo_contratual}
                onChange={e => setForm(f => ({ ...f, prazo_contratual: parseInt(e.target.value) }))}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de início</label>
              <input
                type="date"
                value={form.data_inicio}
                onChange={e => setForm(f => ({ ...f, data_inicio: e.target.value }))}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as 'em_andamento' }))}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="em_andamento">Em andamento</option>
                <option value="concluida">Concluída</option>
                <option value="paralisada">Paralisada</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border rounded hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-[#2D2D8F] text-white rounded hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Obra'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
