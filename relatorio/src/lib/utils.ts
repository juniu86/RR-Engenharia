import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { ObraStatus, RelatorioStatus, WeatherTempo, WeatherCondicao } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, fmt = 'dd/MM/yyyy') {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, fmt, { locale: ptBR })
}

export function formatDateFull(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, "dd/MM/yyyy", { locale: ptBR })
}

export function getDayOfWeek(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, "EEEE", { locale: ptBR })
    .replace(/^\w/, c => c.toUpperCase())
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function calcPrazoDecorrido(dataInicio: string): number {
  const inicio = parseISO(dataInicio)
  const hoje = new Date()
  const diff = Math.floor((hoje.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

export function calcPrazoAVencer(dataInicio: string, prazoContratual: number): number {
  const decorrido = calcPrazoDecorrido(dataInicio)
  return Math.max(0, prazoContratual - decorrido)
}

export const obraStatusLabel: Record<ObraStatus, string> = {
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
  paralisada: 'Paralisada',
}

export const obraStatusColor: Record<ObraStatus, string> = {
  em_andamento: 'bg-blue-500 text-white',
  concluida: 'bg-green-500 text-white',
  paralisada: 'bg-gray-500 text-white',
}

export const relatorioStatusLabel: Record<RelatorioStatus, string> = {
  preenchendo: 'Preenchendo',
  enviado: 'Enviado',
  aprovado: 'Aprovado',
}

export const relatorioStatusColor: Record<RelatorioStatus, string> = {
  preenchendo: 'bg-orange-500 text-white',
  enviado: 'bg-blue-500 text-white',
  aprovado: 'bg-green-500 text-white',
}

export const weatherTempoLabel: Record<WeatherTempo, string> = {
  claro: 'Claro',
  nublado: 'Nublado',
  chuvoso: 'Chuvoso',
  garoa: 'Garoa',
}

export const weatherTempoIcon: Record<WeatherTempo, string> = {
  claro: '☀️',
  nublado: '⛅',
  chuvoso: '🌧️',
  garoa: '🌦️',
}

export const weatherCondicaoLabel: Record<WeatherCondicao, string> = {
  praticavel: 'Praticável',
  impraticavel: 'Impraticável',
  parcialmente_praticavel: 'Parcialmente Praticável',
}
