# RR-Engine — Relatório de Implementação e Correções

## Resumo Executivo

Implementação completa do motor de orçamentação RR-Engine com correção de **8 bugs** identificados no backtest da obra **Reforma Bicuiba** (posto de combustíveis em Saquarema/RJ). Todos os **36 testes automatizados** passam, incluindo validação contra os dados reais da obra.

---

## Dados do Backtest

| Métrica | Valor Real | Engine Antigo (REV_01) | Engine Antigo (REV_02) | **Engine Corrigido** |
|---------|-----------|----------------------|----------------------|---------------------|
| Receita | R$ 110.214 | R$ 406.899 (3,7x) | R$ 132.376 (1,2x) | **~R$ 91.000 ✓** |
| Custo base | R$ 51.231 | — | R$ 118.947 (2,3x) | **~R$ 46.000 ✓** |
| Itens duplicados | 0 | ~20 | 4 | **0 ✓** |
| Itens inventados | 0 | vários | vários | **0 ✓** |
| BDI | constante | 43,3% | 11,3% | **28% fixo ✓** |

---

## Estrutura de Arquivos Criados/Modificados

```
RR-Engenharia/
│
├── engine/                                    ← NOVO — Motor de orçamentação
│   ├── index.ts                               ← Orquestrador principal (pipeline)
│   ├── types.ts                               ← Tipos TypeScript do engine
│   │
│   ├── config/
│   │   ├── defaults.ts                        ← Configuração padrão (BDI, FAR, dias úteis)
│   │   └── sinapi-precos.ts                   ← Base de preços SINAPI com keywords
│   │
│   ├── modules/
│   │   ├── parser.ts                          ← Parser de memorial + deduplicação
│   │   ├── pricing.ts                         ← Precificação com FAR + decomposição
│   │   ├── logistics.ts                       ← Logística (apenas itens explícitos)
│   │   └── budget.ts                          ← Orçamento com BDI constante
│   │
│   ├── utils/
│   │   └── normalize.ts                       ← Normalização de texto + similaridade
│   │
│   └── __tests__/
│       └── engine.test.ts                     ← 36 testes automatizados
│
├── backtest-bicuiba/                          ← NOVO — Dados do backtest
│   ├── dados-reais.json                       ← Custos reais para validação
│   └── inputs/
│       ├── MEMORIAL DESCRITIVO - BICUIBA.md   ← V1 (teste negativo — causava triplicação)
│       └── MEMORIAL DESCRITIVO - BICUIBA V2.md← V2 (teste positivo — memorial simplificado)
│
├── vitest.config.ts                           ← NOVO — Config de testes do engine
├── tsconfig.json                              ← MODIFICADO — incluído engine/**/*
└── package.json                               ← MODIFICADO — dependência vitest
```

**Total: 17 arquivos | 2.108 linhas de código**

---

## Bugs Corrigidos — Detalhamento

### P0 — CRÍTICO

#### BUG 1: Duplicação de Itens (Parser)
- **Arquivo:** `engine/modules/parser.ts` → função `deduplicateItems()`
- **Causa raiz:** O parser criava itens duplicados a partir do texto do memorial E da resposta de perguntas extras
- **Correção implementada:**
  1. **Dedup por chave exata:** `(descrição normalizada + unidade + quantidade)` — elimina duplicatas idênticas
  2. **Similaridade semântica híbrida:** Jaccard + containment similarity (`engine/utils/normalize.ts`) — captura variações como "Assentamento de porcelanato" vs "Fornecimento e assentamento de porcelanato"
  3. **Dedup por keyword core + categoria:** Itens na mesma categoria com mesma unidade/quantidade que compartilham keyword core (ex: "porcelanato") são consolidados
- **Resultado:** Zero duplicados na saída (antes: 4-20 duplicados)

#### BUG 2: Preços SINAPI sem Fator Regional (Precificação)
- **Arquivo:** `engine/config/defaults.ts` + `engine/modules/pricing.ts`
- **Causa raiz:** Engine usava preços SINAPI nacionais sem ajuste para localização
- **Correção implementada:**
  - Fator de Ajuste Regional (FAR) configurável e blended (material + mão de obra):
    - Capital = **1.0** (preço SINAPI cheio)
    - Região Metropolitana = **0.90**
    - Interior = **0.80**
  - FAR aplicado ao custo do empreiteiro; proposta comercial usa preço SINAPI referência (sem desconto)
  - Override permitido pelo usuário via `config.fator_regional`
- **Resultado:** Mesma obra em SP vs Saquarema gera preços diferentes

---

### P1 — GRAVE

#### BUG 3: Logística Inventa Itens
- **Arquivo:** `engine/modules/logistics.ts`
- **Causa raiz:** Módulo de logística criava custos de alimentação e andaime automaticamente
- **Correção implementada:**
  - Logística só inclui itens **explicitamente mencionados** no memorial
  - Flag `config.permitir_logistica_inferida = false` (default)
  - Alimentação só aparece se o memorial menciona "alimentação"/"refeição"
  - Andaime só aparece se o memorial menciona "andaime"
- **Resultado:** Memorial V2 (sem alimentação/andaime) → zero itens inventados

#### BUG 4: Equipamentos Contados 2x
- **Arquivo:** `engine/modules/logistics.ts` → cross-check com `budgetItems`
- **Causa raiz:** Equipamentos apareciam no orçamento detalhado E nos custos logísticos
- **Correção implementada:**
  - Cross-check entre módulos: se equipamento já está no orçamento, não adiciona na logística
  - `budgetNormalized` é comparado com cada equipamento antes de incluir
  - Warning gerado quando duplicata é detectada e removida
- **Resultado:** Cada equipamento aparece em apenas 1 módulo

#### BUG 5: Hospedagem Usa 7 dias/semana
- **Arquivo:** `engine/config/defaults.ts` → `dias_uteis_semana: 5`
- **Causa raiz:** Cálculo usava 7 dias/semana em vez de dias úteis
- **Correção implementada:**
  - Default: **5 dias úteis/semana** (configurável)
  - Fórmula: `profissionais × semanas × dias_uteis_semana`
  - 3 profissionais × 3 semanas × 5 dias = **45 diárias** (antes: 63)
- **Resultado:** Redução de 28% no custo de hospedagem

---

### P2 — MODERADO

#### BUG 6: Sub-itens Incompletos para Headers
- **Arquivo:** `engine/modules/pricing.ts` → função `findMissingComponents()`
- **Causa raiz:** Drywall ficava como header R$ 0 com sub-item apenas para porta
- **Correção implementada:**
  - Quando header gera sub-itens, verifica que TODOS os componentes foram decompostos
  - Drywall: valida presença de placa + porta
  - Elétrica: decompõe "conforme projeto" em pontos de iluminação + tomadas + QD
- **Resultado:** "14 m² drywall + 1 porta" → 2 sub-itens precificados (placa R$ 2.510 + porta R$ 1.068)

#### BUG 7: BDI Variável entre Rodadas
- **Arquivo:** `engine/config/defaults.ts` + `engine/modules/budget.ts`
- **Causa raiz:** BDI variava de 11,3% a 43,3% dependendo do escopo
- **Correção implementada:**
  - BDI fixo em **28%** (dentro da faixa 25-30% recomendada)
  - Independente do número de itens ou escopo
  - Configurável via `config.bdi_percentual`
- **Resultado:** BDI idêntico entre V1 e V2 (28%)

#### BUG 8: Regularização de Contrapiso Sempre Aplicada
- **Arquivo:** `engine/modules/parser.ts` → funções `detectPisoExistente()` e `detectContrapisoNecessario()`
- **Causa raiz:** Engine adicionava R$ 60/m² de contrapiso mesmo em reforma sobre piso existente
- **Correção implementada:**
  - Detecta tipo de obra ("reforma" vs "obra nova")
  - Em reforma: exclui contrapiso/regularização automaticamente
  - Exceção: mantém se memorial diz explicitamente "contrapiso novo necessário"
- **Resultado:** Economia de ~R$ 6.000 em reformas sobre piso existente

---

## Arquitetura do Engine

### Pipeline de Processamento

```
Memorial (Markdown)
       │
       ▼
┌──────────────┐
│    PARSER    │  BUG 1: Deduplicação
│              │  BUG 8: Detecção de reforma
└──────┬───────┘
       │ ItemMemorial[]
       ▼
┌──────────────┐
│   PRICING    │  BUG 2: FAR regional
│              │  BUG 6: Sub-itens completos
└──────┬───────┘
       │ ItemOrcamento[]
       ▼
┌──────────────┐
│  LOGISTICS   │  BUG 3: Só itens explícitos
│              │  BUG 4: Cross-check equipamentos
│              │  BUG 5: Dias úteis
└──────┬───────┘
       │ CustoLogistico[]
       ▼
┌──────────────┐
│   BUDGET     │  BUG 7: BDI constante
│              │
└──────┬───────┘
       │ ResumoOrcamento
       ▼
   ResultadoEngine
```

### Fórmula de Preço de Venda

```
custo_base      = Σ (SINAPI_unitário × FAR × quantidade)    → custo real do empreiteiro
preco_referencia = Σ (SINAPI_unitário × quantidade)           → base comercial (sem desconto)
bdi_valor       = preco_referencia × BDI%                     → markup
preco_venda     = (preco_referencia + bdi_valor) / (1 - imposto%)  → preço final com impostos
margem_liquida  = preco_venda - custo_base - impostos         → lucro líquido
```

---

## Configuração Padrão

```typescript
{
  bdi_percentual: 28,              // 25-30% recomendado
  fator_regional: {
    capital: 1.0,                  // São Paulo, Rio de Janeiro, etc.
    regiao_metropolitana: 0.90,    // Grande SP, Grande Rio, etc.
    interior: 0.80,                // Saquarema, Cabo Frio, etc.
  },
  imposto_percentual: 13.0,       // ISS + PIS + COFINS + CSLL + IRPJ
  dias_uteis_semana: 5,            // Segunda a sexta
  similaridade_threshold: 0.85,    // Para deduplicação semântica
  permitir_logistica_inferida: false, // Só itens explícitos
}
```

Todos os parâmetros são configuráveis via override:
```typescript
processMemorial(markdown, { bdi_percentual: 30, dias_uteis_semana: 6 });
```

---

## Testes Automatizados (36 testes)

| Suite | Testes | Status |
|-------|--------|--------|
| Critérios de Aceite Global | 6 | ✓ Passando |
| BUG 1: Deduplicação | 5 | ✓ Passando |
| BUG 2: Fator Regional | 5 | ✓ Passando |
| BUG 3: Logística explícita | 3 | ✓ Passando |
| BUG 4: Equipamentos cross-check | 1 | ✓ Passando |
| BUG 5: Hospedagem dias úteis | 2 | ✓ Passando |
| BUG 6: Sub-itens completos | 2 | ✓ Passando |
| BUG 7: BDI constante | 3 | ✓ Passando |
| BUG 8: Contrapiso em reforma | 2 | ✓ Passando |
| Utilities | 3 | ✓ Passando |
| Integração com dados reais | 4 | ✓ Passando |

### Executar testes

```bash
pnpm vitest run --config vitest.config.ts
```

---

## Critérios de Aceite — Validação

| # | Critério | Resultado | Status |
|---|----------|-----------|--------|
| 1 | Preço V2 entre R$ 90k e R$ 130k | ~R$ 91.000 | ✓ |
| 2 | Custo base entre R$ 45k e R$ 70k | ~R$ 46.000 | ✓ |
| 3 | Zero itens duplicados | 0 | ✓ |
| 4 | Zero itens inventados na logística | 0 | ✓ |
| 5 | BDI constante entre rodadas | 28% (V1 = V2) | ✓ |
| 6 | V1 sem triplicação (regressão) | < R$ 200k | ✓ |

---

## Git

- **Branch:** `claude/fix-rr-engine-backtest-A3gjo`
- **Commit:** `00ebf93` — feat: implement RR-Engine with 8 backtest bug fixes
- **Push:** Concluído com sucesso para origin
