import type { DadosProposta } from '../types';
import { formatBRL, formatDate, valorPorExtenso } from '../lib/format';
import {
  EMPRESA,
  OBRIGACOES_RR,
  OBRIGACOES_CLIENTE,
  CONDICOES_GERAIS,
  VALIDADE,
} from '../lib/constants';

interface PropostaDocProps {
  dados: DadosProposta;
}

export default function PropostaDoc({ dados }: PropostaDocProps) {
  const nomeCliente = dados.cliente.razao_social || '[NOME DO CLIENTE]';

  return (
    <div id="proposta-documento" className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none print:max-w-none">
      {/* ── Página 1 ── */}
      <div className="p-12 print:p-0">
        {/* Cabeçalho */}
        <Cabecalho />

        {/* Dados da Empresa */}
        <div className="mt-4 text-sm leading-relaxed">
          <p>
            <strong>Razão Social: {EMPRESA.razao_social}</strong>
          </p>
          <p>
            <strong>Endereço: {EMPRESA.endereco}</strong>
          </p>
          <p>
            <strong>CNPJ: {EMPRESA.cnpj}</strong>
          </p>
        </div>

        {/* Dados do Cliente */}
        <div className="mt-4 text-sm leading-relaxed">
          <p>
            Tomador de serviço: <strong>{nomeCliente}</strong> pessoa jurídica de direito privado,
            devidamente inscrita perante a Receita Federal do Brasil no CNPJ: {dados.cliente.cnpj || '[CNPJ]'},
            situada na <strong>{dados.cliente.endereco || '[ENDEREÇO]'}</strong>.
          </p>
        </div>

        {/* Número da Proposta */}
        <p className="text-right font-bold mt-6 text-sm">
          Proposta {dados.numero || '[NÚMERO]'}
        </p>

        {/* Texto Introdutório */}
        <p className="mt-4 text-sm leading-relaxed">
          <strong>Prezados,</strong> em atenção à sua solicitação, apresentamos nossa proposta para os serviços de{' '}
          <strong>Contratação de obra Civil</strong>, com base nas diretrizes fornecidas.
        </p>

        {/* 1. ESCOPO DOS SERVIÇOS */}
        <h3 className="font-bold mt-6 mb-2 text-sm">
          1. ESCOPO DOS SERVIÇOS
        </h3>
        <div className="border border-gray-400">
          <div className="bg-rr-dark text-white text-center py-2 font-bold text-sm">
            Descrição da Atividade
          </div>
          <div className="p-3 text-sm font-bold uppercase leading-relaxed whitespace-pre-line">
            {dados.escopo || '[DESCRIÇÃO DO ESCOPO]'}
          </div>
        </div>

        {/* Obrigações das Partes */}
        <h3 className="font-bold mt-8 mb-2 text-sm">
          Obrigações das Partes
        </h3>

        <h4 className="font-bold mt-4 mb-2 text-sm">
          2.1 RR Engenharia:
        </h4>
        <ul className="list-disc pl-8 text-sm space-y-1.5 leading-relaxed">
          {OBRIGACOES_RR.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h4 className="font-bold mt-6 mb-2 text-sm">
          2.2 {nomeCliente.toUpperCase()}:
        </h4>
        <ul className="list-disc pl-8 text-sm space-y-1.5 leading-relaxed">
          {OBRIGACOES_CLIENTE.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        {/* 3.0 Valor dos Serviços */}
        <h3 className="font-bold mt-8 mb-2 text-sm">
          3.0 – Valor dos serviços
        </h3>
        <p className="text-sm leading-relaxed">
          Nosso preço para execução dos serviços ofertados é:
        </p>
        <p className="text-sm mt-2">
          <strong>- {formatBRL(dados.valor)}</strong>
          ({valorPorExtenso(dados.valor)})
        </p>

        {/* 4.0 Condições de Pagamento */}
        <h3 className="font-bold mt-8 mb-2 text-sm">
          40 - Condições de Pagamento
        </h3>
        <p className="text-sm leading-relaxed">
          {dados.condicoes_pagamento}
        </p>

        {/* 5.0 Condições Gerais */}
        <h3 className="font-bold mt-8 mb-2 text-sm">
          5.0 – Condições Gerais
        </h3>
        <ul className="list-disc pl-8 text-sm space-y-2 leading-relaxed">
          {CONDICOES_GERAIS.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        {/* 6.0 Validade */}
        <h3 className="font-bold mt-8 mb-1 text-sm">
          6.0 – Validade da proposta
        </h3>
        <p className="text-sm leading-relaxed">
          {VALIDADE}
        </p>

        {/* Encerramento */}
        <div className="mt-12 text-right text-sm">
          <p className="font-bold">Atenciosamente</p>
          <p className="font-bold mt-2">RR ENGENHARIA</p>
        </div>

        {/* Data de Emissão */}
        <p className="mt-8 text-xs text-gray-500 text-center">
          Proposta emitida em {formatDate(dados.data_emissao)}
        </p>
      </div>
    </div>
  );
}

function Cabecalho() {
  return (
    <div className="flex items-end gap-4">
      <img
        src={EMPRESA.logo}
        alt="RR Engenharia"
        className="h-24 w-auto"
      />
      <p className="text-rr-primary font-bold text-lg pb-1">
        {EMPRESA.slogan}
      </p>
    </div>
  );
}
