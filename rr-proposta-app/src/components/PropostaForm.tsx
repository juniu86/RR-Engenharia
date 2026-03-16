import { useState } from 'react';
import type { DadosProposta } from '../types';
import { buscarCNPJ } from '../lib/cnpj';
import { cleanCNPJ, formatCNPJ } from '../lib/format';
import { CONDICAO_PAGAMENTO_DEFAULT } from '../lib/constants';

interface PropostaFormProps {
  onGerar: (dados: DadosProposta) => void;
}

export default function PropostaForm({ onGerar }: PropostaFormProps) {
  const [numero, setNumero] = useState('');
  const [cnpjInput, setCnpjInput] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [endereco, setEndereco] = useState('');
  const [escopo, setEscopo] = useState('');
  const [valorStr, setValorStr] = useState('');
  const [condicoesPagamento, setCondicoesPagamento] = useState(CONDICAO_PAGAMENTO_DEFAULT);
  const [buscandoCNPJ, setBuscandoCNPJ] = useState(false);
  const [erroCNPJ, setErroCNPJ] = useState('');

  async function handleBuscarCNPJ() {
    const digits = cleanCNPJ(cnpjInput);
    if (digits.length !== 14) {
      setErroCNPJ('CNPJ deve ter 14 dígitos');
      return;
    }

    setBuscandoCNPJ(true);
    setErroCNPJ('');

    try {
      const dados = await buscarCNPJ(digits);
      setRazaoSocial(dados.razao_social);
      setEndereco(dados.endereco);
      setCnpjInput(formatCNPJ(digits));
    } catch (err) {
      setErroCNPJ(err instanceof Error ? err.message : 'Erro ao buscar CNPJ');
    } finally {
      setBuscandoCNPJ(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const valorNumerico = parseFloat(valorStr.replace(/\./g, '').replace(',', '.'));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      alert('Informe um valor válido');
      return;
    }

    onGerar({
      numero,
      cliente: {
        razao_social: razaoSocial,
        cnpj: cnpjInput,
        endereco,
      },
      escopo,
      valor: valorNumerico,
      condicoes_pagamento: condicoesPagamento,
      data_emissao: new Date(),
    });
  }

  function handleValorChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Permite apenas dígitos, ponto e vírgula
    const raw = e.target.value.replace(/[^\d.,]/g, '');
    setValorStr(raw);
  }

  return (
    <form onSubmit={handleSubmit} className="no-print max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-rr-dark mb-6">Dados da Proposta</h2>

      {/* Número */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Número da Proposta
        </label>
        <input
          type="text"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          placeholder="Ex: 6029"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rr-primary"
          required
        />
      </div>

      {/* CNPJ com busca */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CNPJ do Cliente
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={cnpjInput}
            onChange={(e) => setCnpjInput(e.target.value)}
            placeholder="00.000.000/0000-00"
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rr-primary"
            maxLength={18}
          />
          <button
            type="button"
            onClick={handleBuscarCNPJ}
            disabled={buscandoCNPJ}
            className="bg-rr-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
          >
            {buscandoCNPJ ? 'Buscando...' : 'Buscar CNPJ'}
          </button>
        </div>
        {erroCNPJ && (
          <p className="text-red-600 text-xs mt-1">{erroCNPJ}</p>
        )}
      </div>

      {/* Razão Social */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Razão Social do Cliente
        </label>
        <input
          type="text"
          value={razaoSocial}
          onChange={(e) => setRazaoSocial(e.target.value)}
          placeholder="Razão Social"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rr-primary"
          required
        />
      </div>

      {/* Endereço */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Endereço do Cliente
        </label>
        <input
          type="text"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          placeholder="Endereço completo"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rr-primary"
          required
        />
      </div>

      {/* Escopo */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Escopo dos Serviços
        </label>
        <textarea
          value={escopo}
          onChange={(e) => setEscopo(e.target.value)}
          placeholder="Descreva o escopo dos serviços..."
          rows={5}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rr-primary resize-y"
          required
        />
      </div>

      {/* Valor */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Valor dos Serviços (R$)
        </label>
        <input
          type="text"
          value={valorStr}
          onChange={handleValorChange}
          placeholder="Ex: 9470,00"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rr-primary"
          required
        />
      </div>

      {/* Condições de Pagamento */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Condições de Pagamento
        </label>
        <textarea
          value={condicoesPagamento}
          onChange={(e) => setCondicoesPagamento(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rr-primary resize-y"
        />
      </div>

      {/* Botão */}
      <button
        type="submit"
        className="w-full bg-rr-dark text-white py-3 rounded font-bold text-sm hover:bg-rr-secondary transition-colors"
      >
        Gerar Proposta
      </button>
    </form>
  );
}
