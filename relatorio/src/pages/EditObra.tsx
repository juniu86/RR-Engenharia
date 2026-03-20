import { useState } from 'react'
import { Upload } from 'lucide-react'
import { updateObra, uploadFile } from '@/lib/supabase'
import { toast } from 'sonner'
import type { Obra } from '@/types'

interface EditObraProps {
  obra: Obra
  onSaved: (updated: Obra) => void
}

export function EditObra({ obra, onSaved }: EditObraProps) {
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [form, setForm] = useState({
    nome: obra.nome,
    endereco: obra.endereco,
    contratante: obra.contratante,
    responsavel: obra.responsavel,
    numero_contrato: obra.numero_contrato,
    prazo_contratual: obra.prazo_contratual,
    data_inicio: obra.data_inicio,
    status: obra.status,
    logo_url: obra.logo_url ?? '',
  })

  const inputClass = 'border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await updateObra(obra.id, form)
      toast.success('Obra atualizada!')
      onSaved(updated)
    } catch (err) {
      toast.error('Erro ao salvar: ' + (err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function handleLogoUpload(file: File) {
    setUploadingLogo(true)
    try {
      const path = `logos/${obra.id}/${Date.now()}-${file.name}`
      const url = await uploadFile('logos', path, file)
      setForm(f => ({ ...f, logo_url: url }))
      toast.success('Logo atualizado!')
    } catch (err) {
      toast.error('Erro ao fazer upload do logo: ' + (err as Error).message)
    } finally {
      setUploadingLogo(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-lg font-bold text-gray-800 mb-5">Editar Obra</h2>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Logo */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Logo / Imagem da obra</h3>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
              {form.logo_url ? (
                <img src={form.logo_url} alt="Logo" className="w-full h-full object-contain p-1" />
              ) : (
                <Upload size={24} className="text-gray-300" />
              )}
            </div>
            <label className={`flex items-center gap-2 border border-gray-300 rounded px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${uploadingLogo ? 'opacity-50' : ''}`}>
              <Upload size={14} />
              {uploadingLogo ? 'Enviando...' : 'Alterar logo'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingLogo}
                onChange={e => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {/* Fields */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Informações da obra</h3>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nome da obra *</label>
            <input required value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} className={inputClass} />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Endereço</label>
            <input value={form.endereco} onChange={e => setForm(f => ({ ...f, endereco: e.target.value }))} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Contratante</label>
              <input value={form.contratante} onChange={e => setForm(f => ({ ...f, contratante: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Responsável</label>
              <input value={form.responsavel} onChange={e => setForm(f => ({ ...f, responsavel: e.target.value }))} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">N° do contrato</label>
              <input value={form.numero_contrato} onChange={e => setForm(f => ({ ...f, numero_contrato: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Prazo contratual (dias)</label>
              <input type="number" min={1} value={form.prazo_contratual} onChange={e => setForm(f => ({ ...f, prazo_contratual: parseInt(e.target.value) }))} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Data de início</label>
              <input type="date" value={form.data_inicio} onChange={e => setForm(f => ({ ...f, data_inicio: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Obra['status'] }))} className={inputClass}>
                <option value="em_andamento">Em andamento</option>
                <option value="concluida">Concluída</option>
                <option value="paralisada">Paralisada</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button type="submit" disabled={saving} className="px-6 py-2 bg-[#2D2D8F] text-white rounded text-sm hover:bg-blue-800 disabled:opacity-50 font-medium">
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}
