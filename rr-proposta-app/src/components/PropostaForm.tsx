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
    const raw = e.target.value.replace(/[^\d.,]/g, '');
    setValorStr(raw);
  }

  return (
    <form onSubmit={handleSubmit} className="no-print form-container">
      <h2 className="form-title">Dados da Proposta</h2>

      {/* Número */}
      <div className="form-field">
        <label className="form-label">Número da Proposta</label>
        <input
          type="text"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          placeholder="Ex: 6029"
          className="form-input"
          required
        />
      </div>

      {/* CNPJ com busca */}
      <div className="form-field">
        <label className="form-label">CNPJ do Cliente</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={cnpjInput}
            onChange={(e) => setCnpjInput(e.target.value)}
            placeholder="00.000.000/0000-00"
            className="form-input flex-1"
            maxLength={18}
          />
          <button
            type="button"
            onClick={handleBuscarCNPJ}
            disabled={buscandoCNPJ}
            className="form-btn-buscar"
          >
            {buscandoCNPJ ? 'Buscando...' : 'Buscar CNPJ'}
          </button>
        </div>
        {erroCNPJ && <p className="form-error">{erroCNPJ}</p>}
      </div>

      {/* Razão Social */}
      <div className="form-field">
        <label className="form-label">Razão Social do Cliente</label>
        <input
          type="text"
          value={razaoSocial}
          onChange={(e) => setRazaoSocial(e.target.value)}
          placeholder="Razão Social"
          className="form-input"
          required
        />
      </div>

      {/* Endereço */}
      <div className="form-field">
        <label className="form-label">Endereço do Cliente</label>
        <input
          type="text"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          placeholder="Endereço completo"
          className="form-input"
          required
        />
      </div>

      {/* Escopo */}
      <div className="form-field">
        <label className="form-label">Escopo dos Serviços</label>
        <textarea
          value={escopo}
          onChange={(e) => setEscopo(e.target.value)}
          placeholder="Descreva o escopo dos serviços..."
          rows={5}
          className="form-input form-textarea"
          required
        />
      </div>

      {/* Valor */}
      <div className="form-field">
        <label className="form-label">Valor dos Serviços (R$)</label>
        <input
          type="text"
          value={valorStr}
          onChange={handleValorChange}
          placeholder="Ex: 9470,00"
          className="form-input"
          required
        />
      </div>

      {/* Condições de Pagamento */}
      <div className="form-field">
        <label className="form-label">Condições de Pagamento</label>
        <textarea
          value={condicoesPagamento}
          onChange={(e) => setCondicoesPagamento(e.target.value)}
          rows={3}
          className="form-input form-textarea"
        />
      </div>

      {/* Botão */}
      <button type="submit" className="form-btn-submit">
        Gerar Proposta
      </button>
    </form>
  );
}
