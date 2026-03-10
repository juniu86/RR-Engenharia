/**
 * RR-Engine — Comprehensive Tests
 *
 * Tests all 8 bug fixes against the Bicuiba backtest data.
 * Uses dados-reais.json for validation.
 */

import { describe, it, expect } from 'vitest';
import { processMemorial, parseMemorial, buildConfig } from '../index';
import { priceItems } from '../modules/pricing';
import { calculateLogistics } from '../modules/logistics';
import { calculateBudget } from '../modules/budget';
import { deduplicateItems } from '../modules/parser';
import { calculateSimilarity, normalizeText } from '../utils/normalize';
import type { ItemMemorial, LogisticaMemorial, EngineConfig } from '../types';
import * as fs from 'fs';
import * as path from 'path';

// ─── Load test fixtures ───────────────────────────────────────────────────────

const BACKTEST_DIR = path.resolve(__dirname, '../../backtest-bicuiba');

const memorialV2 = fs.readFileSync(
  path.join(BACKTEST_DIR, 'inputs', 'MEMORIAL DESCRITIVO - BICUIBA V2.md'),
  'utf-8',
);

const memorialV1 = fs.readFileSync(
  path.join(BACKTEST_DIR, 'inputs', 'MEMORIAL DESCRITIVO - BICUIBA.md'),
  'utf-8',
);

const dadosReais = JSON.parse(
  fs.readFileSync(path.join(BACKTEST_DIR, 'dados-reais.json'), 'utf-8'),
);

// ─── Global Acceptance Criteria ───────────────────────────────────────────────

describe('Critérios de Aceite Global', () => {
  const resultV2 = processMemorial(memorialV2);

  it('Memorial V2: preço de venda entre R$ 90.000 e R$ 130.000', () => {
    expect(resultV2.resumo.preco_venda).toBeGreaterThanOrEqual(90_000);
    expect(resultV2.resumo.preco_venda).toBeLessThanOrEqual(130_000);
  });

  it('Memorial V2: custo base entre R$ 45.000 e R$ 70.000', () => {
    expect(resultV2.resumo.custo_base).toBeGreaterThanOrEqual(45_000);
    expect(resultV2.resumo.custo_base).toBeLessThanOrEqual(70_000);
  });

  it('Memorial V2: zero itens duplicados na saída', () => {
    const descriptions = resultV2.itens_orcamento
      .filter(i => !i.is_header)
      .map(i => i.descricao_normalizada);
    const uniqueDescs = new Set(descriptions);
    expect(descriptions.length).toBe(uniqueDescs.size);
  });

  it('Memorial V2: zero itens inventados na logística', () => {
    const logDescriptions = resultV2.custos_logisticos.map(c =>
      normalizeText(c.descricao),
    );
    expect(logDescriptions.some(d => d.includes('alimentacao'))).toBe(false);
    expect(logDescriptions.some(d => d.includes('andaime'))).toBe(false);
  });

  it('BDI constante entre rodadas V1 e V2', () => {
    const resultV1 = processMemorial(memorialV1);
    expect(resultV1.resumo.bdi_percentual).toBe(resultV2.resumo.bdi_percentual);
    expect(resultV2.resumo.bdi_percentual).toBe(28);
  });

  it('Memorial V1 NÃO gera triplicação (regressão)', () => {
    const resultV1 = processMemorial(memorialV1);
    // V1 should NOT triple the price (old engine: R$ 406.899 = 3.7x)
    // With fixes, should be in reasonable range
    expect(resultV1.resumo.preco_venda).toBeLessThan(200_000);
  });
});

// ─── BUG 1: Deduplication ─────────────────────────────────────────────────────

describe('BUG 1: Deduplicação de itens', () => {
  it('itens idênticos são removidos', () => {
    const itens: ItemMemorial[] = [
      { descricao: 'Assentamento de porcelanato', categoria: 'Pisos', unidade: 'm²', quantidade: 100 },
      { descricao: 'Assentamento de porcelanato', categoria: 'Pisos', unidade: 'm²', quantidade: 100 },
    ];

    const result = deduplicateItems(itens, false);
    expect(result).toHaveLength(1);
  });

  it('itens semanticamente similares são consolidados', () => {
    const itens: ItemMemorial[] = [
      { descricao: 'Assentamento de porcelanato', categoria: 'Pisos', unidade: 'm²', quantidade: 100 },
      { descricao: 'Fornecimento e assentamento de porcelanato', categoria: 'Pisos', unidade: 'm²', quantidade: 100 },
    ];

    const result = deduplicateItems(itens, false);
    expect(result).toHaveLength(1);
  });

  it('itens diferentes são mantidos', () => {
    const itens: ItemMemorial[] = [
      { descricao: 'Porcelanato 60x60', categoria: 'Pisos', unidade: 'm²', quantidade: 100 },
      { descricao: 'Cerâmica PEI 4', categoria: 'Pisos', unidade: 'm²', quantidade: 30 },
    ];

    const result = deduplicateItems(itens, false);
    expect(result).toHaveLength(2);
  });

  it('Memorial V1 detalhado não gera duplicados de porcelanato', () => {
    const result = processMemorial(memorialV1);
    const porcelanato = result.itens_orcamento.filter(i =>
      !i.is_header && normalizeText(i.descricao).includes('porcelanato'),
    );
    expect(porcelanato.length).toBeLessThanOrEqual(1);
  });

  it('Memorial V1 detalhado não gera duplicados de cerâmica', () => {
    const result = processMemorial(memorialV1);
    const ceramica = result.itens_orcamento.filter(i =>
      !i.is_header && normalizeText(i.descricao).includes('ceramica'),
    );
    expect(ceramica.length).toBeLessThanOrEqual(1);
  });
});

// ─── BUG 2: Regional Factor ──────────────────────────────────────────────────

describe('BUG 2: Fator de Ajuste Regional (FAR)', () => {
  const config = buildConfig();
  const itemPintura: ItemMemorial[] = [{
    descricao: 'Pintura acrílica em paredes',
    categoria: 'Pintura',
    unidade: 'm²',
    quantidade: 250,
  }];

  it('preços diferem entre capital e interior', () => {
    const { itens: capitalItens } = priceItems(itemPintura, config, 'capital');
    const { itens: interiorItens } = priceItems(itemPintura, config, 'interior');

    const precoCapital = capitalItens[0].preco_unitario_ajustado;
    const precoInterior = interiorItens[0].preco_unitario_ajustado;

    expect(precoInterior).toBeLessThan(precoCapital);
    expect(precoInterior / precoCapital).toBeCloseTo(0.80, 1);
  });

  it('fator interior = 0.80 (blended material + labor)', () => {
    expect(config.fator_regional.interior).toBe(0.80);
  });

  it('fator capital = 1.0', () => {
    expect(config.fator_regional.capital).toBe(1.0);
  });

  it('fator RM = 0.90', () => {
    expect(config.fator_regional.regiao_metropolitana).toBe(0.90);
  });

  it('Saquarema (interior RJ) recebe fator 0.80', () => {
    const result = processMemorial(memorialV2);
    const anyItem = result.itens_orcamento.find(i => !i.is_header);
    expect(anyItem?.fator_regional).toBe(0.80);
  });
});

// ─── BUG 3: Logística não inventa itens ───────────────────────────────────────

describe('BUG 3: Logística só inclui itens explícitos', () => {
  it('memorial sem alimentação → custo logístico sem alimentação', () => {
    const result = processMemorial(memorialV2);
    const alimentacao = result.custos_logisticos.find(c =>
      normalizeText(c.descricao).includes('alimentacao'),
    );
    expect(alimentacao).toBeUndefined();
  });

  it('memorial sem andaime → custo logístico sem andaime', () => {
    const result = processMemorial(memorialV2);
    const andaime = result.custos_logisticos.find(c =>
      normalizeText(c.descricao).includes('andaime'),
    );
    expect(andaime).toBeUndefined();
  });

  it('memorial V1 COM alimentação e andaime → itens incluídos', () => {
    const result = processMemorial(memorialV1);
    const alimentacao = result.custos_logisticos.find(c =>
      normalizeText(c.descricao).includes('alimentacao'),
    );
    const andaime = result.custos_logisticos.find(c =>
      normalizeText(c.descricao).includes('andaime'),
    );
    expect(alimentacao).toBeDefined();
    expect(andaime).toBeDefined();
  });
});

// ─── BUG 4: Equipment cross-check ────────────────────────────────────────────

describe('BUG 4: Equipamentos não contados 2x', () => {
  it('equipamento aparece em apenas um módulo', () => {
    const result = processMemorial(memorialV1);

    const orcamentoEquip = result.itens_orcamento.filter(i =>
      normalizeText(i.descricao).includes('martelete'),
    );
    const logEquip = result.custos_logisticos.filter(c =>
      normalizeText(c.descricao).includes('martelete'),
    );

    // Should be in at most one of the two
    const totalOccurrences = orcamentoEquip.length + logEquip.length;
    expect(totalOccurrences).toBeLessThanOrEqual(1);
  });
});

// ─── BUG 5: Hospedagem dias úteis ────────────────────────────────────────────

describe('BUG 5: Hospedagem usa dias úteis (5/semana)', () => {
  it('config default = 5 dias úteis/semana', () => {
    const config = buildConfig();
    expect(config.dias_uteis_semana).toBe(5);
  });

  it('3 profissionais × 3 semanas = 45 diárias, não 63', () => {
    const result = processMemorial(memorialV2);
    const hospedagem = result.custos_logisticos.find(c =>
      c.categoria === 'hospedagem',
    );
    expect(hospedagem).toBeDefined();
    expect(hospedagem!.quantidade).toBe(45); // 3 × 3 × 5 = 45
  });
});

// ─── BUG 6: Sub-itens completos ──────────────────────────────────────────────

describe('BUG 6: Sub-itens completos para headers', () => {
  it('drywall 14m² + 1 porta → 2 sub-itens precificados', () => {
    const result = processMemorial(memorialV2);
    const drywallItems = result.itens_orcamento.filter(i =>
      normalizeText(i.descricao).includes('drywall') || normalizeText(i.descricao).includes('porta drywall'),
    );

    // Should have header + placa + porta (at least 2 priced sub-items)
    const pricedSubItems = drywallItems.filter(i => !i.is_header && i.preco_total > 0);
    expect(pricedSubItems.length).toBeGreaterThanOrEqual(2);
  });

  it('placa drywall tem preço > 0', () => {
    const result = processMemorial(memorialV2);
    const placa = result.itens_orcamento.find(i =>
      !i.is_header && normalizeText(i.descricao).includes('drywall') && !normalizeText(i.descricao).includes('porta'),
    );
    expect(placa).toBeDefined();
    expect(placa!.preco_total).toBeGreaterThan(0);
  });
});

// ─── BUG 7: BDI constante ────────────────────────────────────────────────────

describe('BUG 7: BDI constante e configurável', () => {
  it('BDI default = 28%', () => {
    const result = processMemorial(memorialV2);
    expect(result.resumo.bdi_percentual).toBe(28);
  });

  it('BDI pode ser configurado para 30%', () => {
    const result = processMemorial(memorialV2, { bdi_percentual: 30 });
    expect(result.resumo.bdi_percentual).toBe(30);
  });

  it('BDI idêntico entre V1 e V2', () => {
    const r1 = processMemorial(memorialV1);
    const r2 = processMemorial(memorialV2);
    expect(r1.resumo.bdi_percentual).toBe(r2.resumo.bdi_percentual);
  });
});

// ─── BUG 8: Contrapiso em reforma ────────────────────────────────────────────

describe('BUG 8: Regularização de contrapiso em reforma', () => {
  it('memorial V2 (reforma + piso existente) não inclui contrapiso', () => {
    const result = processMemorial(memorialV2);
    const contrapiso = result.itens_orcamento.find(i =>
      normalizeText(i.descricao).includes('contrapiso') ||
      normalizeText(i.descricao).includes('regularizacao'),
    );
    expect(contrapiso).toBeUndefined();
  });

  it('memorial V1 (reforma mas descreve regularização) remove contrapiso', () => {
    const result = processMemorial(memorialV1);
    const contrapiso = result.itens_orcamento.find(i =>
      normalizeText(i.descricao).includes('contrapiso') ||
      normalizeText(i.descricao).includes('regularizacao'),
    );
    // V1 mentions regularização but obra is reforma sobre estrutura existente
    expect(contrapiso).toBeUndefined();
  });
});

// ─── Utility Tests ────────────────────────────────────────────────────────────

describe('Utilities: normalização e similaridade', () => {
  it('normaliza acentos e maiúsculas', () => {
    expect(normalizeText('Assentamento de Porcelanato')).toBe('assentamento de porcelanato');
    expect(normalizeText('Impermeabilização')).toBe('impermeabilizacao');
  });

  it('similaridade alta para descrições equivalentes', () => {
    const sim = calculateSimilarity(
      'Assentamento de porcelanato',
      'Fornecimento e assentamento de porcelanato',
    );
    expect(sim).toBeGreaterThan(0.5);
  });

  it('similaridade baixa para descrições diferentes', () => {
    const sim = calculateSimilarity(
      'Pintura acrílica em paredes',
      'Demolição de piso cerâmico',
    );
    expect(sim).toBeLessThan(0.3);
  });
});

// ─── Integration: Comparison with real costs ──────────────────────────────────

describe('Integração: Comparação com custos reais', () => {
  const result = processMemorial(memorialV2);

  it('custo total não deve exceder 2x o custo real', () => {
    const custoReal = dadosReais.custo_real.total;
    expect(result.resumo.custo_total).toBeLessThan(custoReal * 2);
  });

  it('preço de venda não deve exceder 1.5x a receita real', () => {
    const receitaReal = dadosReais.receita.total;
    expect(result.resumo.preco_venda).toBeLessThan(receitaReal * 1.5);
  });

  it('preço de venda não deve ser menor que 0.7x a receita real', () => {
    const receitaReal = dadosReais.receita.total;
    expect(result.resumo.preco_venda).toBeGreaterThan(receitaReal * 0.7);
  });

  it('número de itens razoável (< 30 para V2)', () => {
    expect(result.resumo.total_itens).toBeLessThan(30);
  });
});
