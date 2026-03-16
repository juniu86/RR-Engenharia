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
    <div id="proposta-documento" className="proposta-wrapper">
      {/* Barra lateral azul decorativa */}
      <div className="proposta-accent-bar" />

      <div className="proposta-content">
        {/* ── Cabeçalho Premium ── */}
        <header className="proposta-header">
          <div className="proposta-header-left">
            <img
              src={EMPRESA.logo}
              alt="RR Engenharia"
              className="proposta-logo"
            />
            <div>
              <h1 className="proposta-empresa-nome">RR ENGENHARIA</h1>
              <p className="proposta-slogan">{EMPRESA.slogan}</p>
            </div>
          </div>
          <div className="proposta-header-right">
            <span className="proposta-numero-label">PROPOSTA</span>
            <span className="proposta-numero-valor">Nº {dados.numero || '—'}</span>
          </div>
        </header>

        <div className="proposta-divider" />

        {/* ── Dados da Empresa ── */}
        <section className="proposta-section">
          <div className="proposta-dados-grid">
            <div>
              <span className="proposta-label">Razão Social</span>
              <span className="proposta-valor">{EMPRESA.razao_social}</span>
            </div>
            <div>
              <span className="proposta-label">CNPJ</span>
              <span className="proposta-valor">{EMPRESA.cnpj}</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="proposta-label">Endereço</span>
            <span className="proposta-valor">{EMPRESA.endereco}</span>
          </div>
        </section>

        {/* ── Dados do Cliente ── */}
        <section className="proposta-section proposta-cliente-box">
          <h2 className="proposta-section-title">TOMADOR DO SERVIÇO</h2>
          <div className="proposta-dados-grid">
            <div>
              <span className="proposta-label">Razão Social</span>
              <span className="proposta-valor font-semibold">{nomeCliente}</span>
            </div>
            <div>
              <span className="proposta-label">CNPJ</span>
              <span className="proposta-valor">{dados.cliente.cnpj || '[CNPJ]'}</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="proposta-label">Endereço</span>
            <span className="proposta-valor">{dados.cliente.endereco || '[ENDEREÇO]'}</span>
          </div>
        </section>

        {/* ── Texto Introdutório ── */}
        <section className="proposta-section">
          <p className="proposta-texto">
            <strong>Prezados,</strong> em atenção à sua solicitação, apresentamos nossa proposta
            para os serviços de <strong>Contratação de Obra Civil</strong>, com base nas diretrizes
            fornecidas.
          </p>
        </section>

        {/* ── 1. ESCOPO DOS SERVIÇOS ── */}
        <section className="proposta-section">
          <h2 className="proposta-section-title">
            <span className="proposta-section-num">01</span>
            ESCOPO DOS SERVIÇOS
          </h2>
          <div className="proposta-escopo-box">
            <div className="proposta-escopo-header">
              Descrição da Atividade
            </div>
            <div className="proposta-escopo-body">
              {dados.escopo || '[DESCRIÇÃO DO ESCOPO]'}
            </div>
          </div>
        </section>

        {/* ── 2. Obrigações das Partes ── */}
        <section className="proposta-section">
          <h2 className="proposta-section-title">
            <span className="proposta-section-num">02</span>
            OBRIGAÇÕES DAS PARTES
          </h2>

          <h3 className="proposta-subsection-title">2.1 RR Engenharia</h3>
          <ul className="proposta-lista">
            {OBRIGACOES_RR.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h3 className="proposta-subsection-title mt-6">2.2 {nomeCliente}</h3>
          <ul className="proposta-lista">
            {OBRIGACOES_CLIENTE.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        {/* ── 3. Valor dos Serviços ── */}
        <section className="proposta-section">
          <h2 className="proposta-section-title">
            <span className="proposta-section-num">03</span>
            VALOR DOS SERVIÇOS
          </h2>
          <p className="proposta-texto">
            Nosso preço para execução dos serviços ofertados é:
          </p>
          <div className="proposta-valor-destaque">
            <span className="proposta-valor-moeda">{formatBRL(dados.valor)}</span>
            <span className="proposta-valor-extenso">
              ({valorPorExtenso(dados.valor)})
            </span>
          </div>
        </section>

        {/* ── 4. Condições de Pagamento ── */}
        <section className="proposta-section">
          <h2 className="proposta-section-title">
            <span className="proposta-section-num">04</span>
            CONDIÇÕES DE PAGAMENTO
          </h2>
          <p className="proposta-texto">
            {dados.condicoes_pagamento}
          </p>
        </section>

        {/* ── 5. Condições Gerais ── */}
        <section className="proposta-section">
          <h2 className="proposta-section-title">
            <span className="proposta-section-num">05</span>
            CONDIÇÕES GERAIS
          </h2>
          <ul className="proposta-lista">
            {CONDICOES_GERAIS.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        {/* ── 6. Validade ── */}
        <section className="proposta-section">
          <h2 className="proposta-section-title">
            <span className="proposta-section-num">06</span>
            VALIDADE DA PROPOSTA
          </h2>
          <p className="proposta-texto">{VALIDADE}</p>
        </section>

        {/* ── Assinatura ── */}
        <section className="proposta-assinatura">
          <div className="proposta-divider" />

          <div className="proposta-assinatura-content">
            <p className="proposta-assinatura-atenciosamente">Atenciosamente,</p>

            <div className="proposta-assinatura-linha" />

            <div className="proposta-assinatura-info">
              <img
                src={EMPRESA.logo}
                alt="RR Engenharia"
                className="proposta-assinatura-logo"
              />
              <div>
                <p className="proposta-assinatura-nome">RR ENGENHARIA E SOLUÇÕES LTDA.</p>
                <p className="proposta-assinatura-cnpj">CNPJ: {EMPRESA.cnpj}</p>
              </div>
            </div>
          </div>

          <p className="proposta-data-emissao">
            Proposta emitida em {formatDate(dados.data_emissao)}
          </p>
        </section>

        {/* ── Rodapé ── */}
        <footer className="proposta-footer">
          <div className="proposta-footer-bar" />
          <p>{EMPRESA.endereco}</p>
          <p>CNPJ: {EMPRESA.cnpj}</p>
        </footer>
      </div>
    </div>
  );
}
