import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { Plus, Trash2, Upload } from 'lucide-react'
import { PageLoader } from '@/components/LoadingSpinner'
import { supabase, createRelatorio, updateRelatorio, getNextRelatorioNumber, upsertMaoDeObra, upsertEquipamentos, upsertAtividades, upsertOcorrencias, upsertChecklist, uploadFile } from '@/lib/supabase'
import { toast } from 'sonner'
import type { Obra, Relatorio, MaoDeObra, Equipamento, Atividade, Ocorrencia, ChecklistItem } from '@/types'

interface ReportEditProps {
  obraId: string
  relatorioId?: string
  obra: Obra
  onSaved?: () => void
}

type SectionItem = { id?: string; [key: string]: unknown }

export function ReportEdit({ obraId, relatorioId, obra, onSaved }: ReportEditProps) {
  const [, setLocation] = useLocation()
  const isNew = !relatorioId
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)

  // Form state
  const [form, setForm] = useState({
    data: new Date().toISOString().split('T')[0],
    modelo: 'Relatório Diário de Obra (RDO)',
    clima_manha_tempo: 'claro' as const,
    clima_manha_condicao: 'praticavel' as const,
    clima_tarde_tempo: 'claro' as const,
    clima_tarde_condicao: 'praticavel' as const,
    observacoes: '',
    status: 'preenchendo' as const,
  })

  const [maoDeObra, setMaoDeObra] = useState<Partial<MaoDeObra>[]>([])
  const [equipamentos, setEquipamentos] = useState<Partial<Equipamento>[]>([])
  const [atividades, setAtividades] = useState<Partial<Atividade>[]>([])
  const [ocorrencias, setOcorrencias] = useState<Partial<Ocorrencia>[]>([])
  const [checklist, setChecklist] = useState<Partial<ChecklistItem>[]>([])
  const [uploadingFotos, setUploadingFotos] = useState(false)
  const [uploadingAnexos, setUploadingAnexos] = useState(false)
  const [savedRelatorioId, setSavedRelatorioId] = useState<string | undefined>(relatorioId)

  useEffect(() => {
    if (!isNew && relatorioId) loadRelatorio()
  }, [relatorioId])

  async function loadRelatorio() {
    setLoading(true)
    try {
      const { data: rel } = await supabase.from('relatorios').select('*').eq('id', relatorioId!).single()
      if (rel) {
        setForm({
          data: rel.data,
          modelo: rel.modelo,
          clima_manha_tempo: rel.clima_manha_tempo,
          clima_manha_condicao: rel.clima_manha_condicao,
          clima_tarde_tempo: rel.clima_tarde_tempo,
          clima_tarde_condicao: rel.clima_tarde_condicao,
          observacoes: rel.observacoes ?? '',
          status: rel.status,
        })
        setSavedRelatorioId(rel.id)
      }
      const [{ data: mob }, { data: eq }, { data: atv }, { data: ocr }, { data: chk }] = await Promise.all([
        supabase.from('mao_de_obra').select('*').eq('relatorio_id', relatorioId!),
        supabase.from('equipamentos').select('*').eq('relatorio_id', relatorioId!),
        supabase.from('atividades').select('*').eq('relatorio_id', relatorioId!),
        supabase.from('ocorrencias').select('*').eq('relatorio_id', relatorioId!),
        supabase.from('checklist').select('*').eq('relatorio_id', relatorioId!),
      ])
      setMaoDeObra(mob ?? [])
      setEquipamentos(eq ?? [])
      setAtividades(atv ?? [])
      setOcorrencias(ocr ?? [])
      setChecklist(chk ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      let relId = savedRelatorioId
      if (isNew || !relId) {
        const numero = await getNextRelatorioNumber(obraId)
        const rel = await createRelatorio({ ...form, obra_id: obraId, numero }) as Relatorio
        relId = rel.id
        setSavedRelatorioId(relId)
      } else {
        await updateRelatorio(relId, form)
      }

      await Promise.all([
        upsertMaoDeObra(relId, maoDeObra.map(m => ({ funcao: m.funcao ?? '', quantidade: m.quantidade ?? 1, observacao: m.observacao }))),
        upsertEquipamentos(relId, equipamentos.map(e => ({ nome: e.nome ?? '', quantidade: e.quantidade ?? 1, observacao: e.observacao }))),
        upsertAtividades(relId, atividades.map(a => ({ descricao: a.descricao ?? '', progresso: a.progresso ?? 0, observacao: a.observacao }))),
        upsertOcorrencias(relId, ocorrencias.map(o => ({ tipo: o.tipo ?? '', descricao: o.descricao ?? '', impacto: o.impacto }))),
        upsertChecklist(relId, checklist.map(c => ({ item: c.item ?? '', concluido: c.concluido ?? false }))),
      ])

      toast.success(isNew ? 'Relatório criado!' : 'Relatório salvo!')
      onSaved?.()
      setLocation(`/obras/${obraId}/relatorios/${relId}`)
    } catch (err) {
      toast.error('Erro ao salvar: ' + (err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function handleFotoUpload(files: FileList) {
    if (!savedRelatorioId && isNew) {
      toast.error('Salve o relatório primeiro antes de adicionar fotos')
      return
    }
    setUploadingFotos(true)
    try {
      let relId = savedRelatorioId
      if (!relId) {
        const numero = await getNextRelatorioNumber(obraId)
        const rel = await createRelatorio({ ...form, obra_id: obraId, numero }) as Relatorio
        relId = rel.id
        setSavedRelatorioId(relId)
      }
      for (const file of Array.from(files)) {
        const path = `${obraId}/${relId}/${Date.now()}-${file.name}`
        const url = await uploadFile('fotos', path, file)
        await supabase.from('fotos').insert({ obra_id: obraId, relatorio_id: relId, url })
      }
      toast.success(`${files.length} foto(s) adicionada(s)!`)
    } catch (err) {
      toast.error('Erro ao fazer upload: ' + (err as Error).message)
    } finally {
      setUploadingFotos(false)
    }
  }

  async function handleAnexoUpload(files: FileList) {
    if (!savedRelatorioId && isNew) {
      toast.error('Salve o relatório primeiro antes de adicionar anexos')
      return
    }
    setUploadingAnexos(true)
    try {
      let relId = savedRelatorioId
      if (!relId) {
        const numero = await getNextRelatorioNumber(obraId)
        const rel = await createRelatorio({ ...form, obra_id: obraId, numero }) as Relatorio
        relId = rel.id
        setSavedRelatorioId(relId)
      }
      for (const file of Array.from(files)) {
        const path = `${obraId}/${relId}/${Date.now()}-${file.name}`
        const url = await uploadFile('anexos', path, file)
        await supabase.from('anexos').insert({ relatorio_id: relId, nome: file.name, url, tamanho: file.size })
      }
      toast.success(`${files.length} anexo(s) adicionado(s)!`)
    } catch (err) {
      toast.error('Erro ao fazer upload: ' + (err as Error).message)
    } finally {
      setUploadingAnexos(false)
    }
  }

  if (loading) return <PageLoader />

  const inputClass = 'border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
  const selectClass = inputClass

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-800">
          {isNew ? 'Novo Relatório' : `Editar Relatório n° ${relatorioId}`}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setLocation(`/obras/${obraId}/relatorios`)}
            className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-[#2D2D8F] text-white rounded text-sm hover:bg-blue-800 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Basic info */}
        <Section title="Informações básicas">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Data *</label>
              <input type="date" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="label">Modelo de relatório</label>
              <select value={form.modelo} onChange={e => setForm(f => ({ ...f, modelo: e.target.value }))} className={selectClass}>
                <option>Relatório Diário de Obra (RDO)</option>
                <option>Relatório Semanal de Obra</option>
                <option>Relatório Mensal de Obra</option>
              </select>
            </div>
          </div>
        </Section>

        {/* Weather */}
        <Section title="Clima">
          <div className="grid grid-cols-2 gap-6">
            {(['manha', 'tarde'] as const).map(period => (
              <div key={period}>
                <h4 className="font-medium text-sm text-gray-700 mb-3 capitalize">{period === 'manha' ? 'Manhã' : 'Tarde'}</h4>
                <div className="space-y-2">
                  <div>
                    <label className="label">Tempo</label>
                    <select
                      value={form[`clima_${period}_tempo`]}
                      onChange={e => setForm(f => ({ ...f, [`clima_${period}_tempo`]: e.target.value }))}
                      className={selectClass}
                    >
                      <option value="claro">☀️ Claro</option>
                      <option value="nublado">⛅ Nublado</option>
                      <option value="chuvoso">🌧️ Chuvoso</option>
                      <option value="garoa">🌦️ Garoa</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Condição</label>
                    <select
                      value={form[`clima_${period}_condicao`]}
                      onChange={e => setForm(f => ({ ...f, [`clima_${period}_condicao`]: e.target.value }))}
                      className={selectClass}
                    >
                      <option value="praticavel">Praticável</option>
                      <option value="impraticavel">Impraticável</option>
                      <option value="parcialmente_praticavel">Parcialmente Praticável</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Mão de obra */}
        <Section
          title={`Mão de obra (${maoDeObra.length})`}
          onAdd={() => setMaoDeObra(m => [...m, { funcao: '', quantidade: 1 }])}
        >
          {maoDeObra.map((m, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input placeholder="Função" value={m.funcao ?? ''} onChange={e => setMaoDeObra(arr => arr.map((x, j) => j === i ? { ...x, funcao: e.target.value } : x))} className={inputClass} />
              <input type="number" min={1} placeholder="Qtd" value={m.quantidade ?? 1} onChange={e => setMaoDeObra(arr => arr.map((x, j) => j === i ? { ...x, quantidade: parseInt(e.target.value) } : x))} className={`${inputClass} w-20`} />
              <input placeholder="Observação" value={m.observacao ?? ''} onChange={e => setMaoDeObra(arr => arr.map((x, j) => j === i ? { ...x, observacao: e.target.value } : x))} className={inputClass} />
              <button onClick={() => setMaoDeObra(arr => arr.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={15} /></button>
            </div>
          ))}
        </Section>

        {/* Equipamentos */}
        <Section
          title={`Equipamentos (${equipamentos.length})`}
          onAdd={() => setEquipamentos(e => [...e, { nome: '', quantidade: 1 }])}
        >
          {equipamentos.map((e, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input placeholder="Equipamento" value={e.nome ?? ''} onChange={ev => setEquipamentos(arr => arr.map((x, j) => j === i ? { ...x, nome: ev.target.value } : x))} className={inputClass} />
              <input type="number" min={1} placeholder="Qtd" value={e.quantidade ?? 1} onChange={ev => setEquipamentos(arr => arr.map((x, j) => j === i ? { ...x, quantidade: parseInt(ev.target.value) } : x))} className={`${inputClass} w-20`} />
              <input placeholder="Observação" value={e.observacao ?? ''} onChange={ev => setEquipamentos(arr => arr.map((x, j) => j === i ? { ...x, observacao: ev.target.value } : x))} className={inputClass} />
              <button onClick={() => setEquipamentos(arr => arr.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={15} /></button>
            </div>
          ))}
        </Section>

        {/* Atividades */}
        <Section
          title={`Atividades (${atividades.length})`}
          onAdd={() => setAtividades(a => [...a, { descricao: '', progresso: 0 }])}
        >
          {atividades.map((a, i) => (
            <div key={i} className="flex gap-2 mb-2 items-start">
              <input placeholder="Descrição da atividade" value={a.descricao ?? ''} onChange={e => setAtividades(arr => arr.map((x, j) => j === i ? { ...x, descricao: e.target.value } : x))} className={inputClass} />
              <div className="flex items-center gap-1 w-28">
                <input type="number" min={0} max={100} value={a.progresso ?? 0} onChange={e => setAtividades(arr => arr.map((x, j) => j === i ? { ...x, progresso: parseInt(e.target.value) } : x))} className={`${inputClass} w-16`} />
                <span className="text-xs text-gray-500">%</span>
              </div>
              <input placeholder="Obs." value={a.observacao ?? ''} onChange={e => setAtividades(arr => arr.map((x, j) => j === i ? { ...x, observacao: e.target.value } : x))} className={inputClass} />
              <button onClick={() => setAtividades(arr => arr.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={15} /></button>
            </div>
          ))}
        </Section>

        {/* Ocorrências */}
        <Section
          title={`Ocorrências (${ocorrencias.length})`}
          onAdd={() => setOcorrencias(o => [...o, { tipo: '', descricao: '' }])}
        >
          {ocorrencias.map((o, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <select value={o.tipo ?? ''} onChange={e => setOcorrencias(arr => arr.map((x, j) => j === i ? { ...x, tipo: e.target.value } : x))} className={`${inputClass} w-40`}>
                <option value="">Tipo</option>
                <option value="Acidente">Acidente</option>
                <option value="Atraso">Atraso</option>
                <option value="Anomalia">Anomalia</option>
                <option value="Paralisação">Paralisação</option>
                <option value="Outro">Outro</option>
              </select>
              <input placeholder="Descrição" value={o.descricao ?? ''} onChange={e => setOcorrencias(arr => arr.map((x, j) => j === i ? { ...x, descricao: e.target.value } : x))} className={inputClass} />
              <input placeholder="Impacto" value={o.impacto ?? ''} onChange={e => setOcorrencias(arr => arr.map((x, j) => j === i ? { ...x, impacto: e.target.value } : x))} className={inputClass} />
              <button onClick={() => setOcorrencias(arr => arr.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={15} /></button>
            </div>
          ))}
        </Section>

        {/* Checklist */}
        <Section
          title={`Checklist (${checklist.length})`}
          onAdd={() => setChecklist(c => [...c, { item: '', concluido: false }])}
        >
          {checklist.map((c, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <input type="checkbox" checked={c.concluido ?? false} onChange={e => setChecklist(arr => arr.map((x, j) => j === i ? { ...x, concluido: e.target.checked } : x))} className="w-4 h-4 rounded" />
              <input placeholder="Item do checklist" value={c.item ?? ''} onChange={e => setChecklist(arr => arr.map((x, j) => j === i ? { ...x, item: e.target.value } : x))} className={inputClass} />
              <button onClick={() => setChecklist(arr => arr.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={15} /></button>
            </div>
          ))}
        </Section>

        {/* Fotos upload */}
        <Section title="Fotos">
          <label className={`flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors ${uploadingFotos ? 'opacity-50' : ''}`}>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              disabled={uploadingFotos}
              onChange={e => e.target.files && handleFotoUpload(e.target.files)}
            />
            <Upload size={20} className="text-gray-400 mx-auto" />
            <span className="text-sm text-gray-500">{uploadingFotos ? 'Enviando...' : 'Clique para adicionar fotos'}</span>
          </label>
        </Section>

        {/* Anexos upload */}
        <Section title="Anexos">
          <label className={`flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors ${uploadingAnexos ? 'opacity-50' : ''}`}>
            <input
              type="file"
              multiple
              className="hidden"
              disabled={uploadingAnexos}
              onChange={e => e.target.files && handleAnexoUpload(e.target.files)}
            />
            <Upload size={20} className="text-gray-400 mx-auto" />
            <span className="text-sm text-gray-500">{uploadingAnexos ? 'Enviando...' : 'Clique para adicionar arquivos'}</span>
          </label>
        </Section>

        {/* Observações */}
        <Section title="Observações gerais">
          <textarea
            value={form.observacoes}
            onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))}
            rows={4}
            placeholder="Observações gerais do dia..."
            className={inputClass}
          />
        </Section>
      </div>

      {/* Bottom save */}
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
        <button onClick={() => setLocation(`/obras/${obraId}/relatorios`)} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
          Cancelar
        </button>
        <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#2D2D8F] text-white rounded text-sm hover:bg-blue-800 disabled:opacity-50 font-medium">
          {saving ? 'Salvando...' : isNew ? 'Criar Relatório' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  )
}

function Section({ title, children, onAdd }: { title: string; children?: React.ReactNode; onAdd?: () => void }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        {onAdd && (
          <button onClick={onAdd} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
            <Plus size={13} /> Adicionar
          </button>
        )}
      </div>
      {children && <div className="p-4">{children}</div>}
    </div>
  )
}
