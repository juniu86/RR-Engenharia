# 📋 PROTOCOLO DE VALIDAÇÃO TÉCNICA
## Acordo entre Reginaldo Rodrigues (RR Engenharia) e Manus AI

**Data:** 25 de fevereiro de 2026  
**Projeto:** RR Engenharia - Website Redesign  
**Versão:** 1.0  
**Status:** ✅ ATIVO

---

## 1. OBJETIVO

Estabelecer um protocolo formal que garanta que **todas as soluções técnicas propostas** sejam validadas através de **documentação oficial, manuais de boas práticas e fontes certificadas**, eliminando abordagens baseadas em suposições ou modelos de teste.

---

## 2. PRINCÍPIOS FUNDAMENTAIS

### 2.1 Validação Obrigatória

**Toda solução técnica proposta DEVE:**

1. ✅ Ser baseada em documentação oficial do fornecedor/plataforma
2. ✅ Estar validada em manual de boas práticas reconhecido
3. ✅ Ter fonte certificada ou banco de dados confiável
4. ✅ Ser testada/comprovada em contexto similar
5. ✅ Ter evidência de que funciona na prática

### 2.2 Proibição de Suposições

**Manus AI NÃO PODE:**

- ❌ Propor soluções baseadas em "conhecimento geral"
- ❌ Assumir capacidades de plataformas sem confirmar
- ❌ Usar modelo de "teste e erro"
- ❌ Fazer suposições sobre o que o usuário tem acesso
- ❌ Trazer procedimentos que não foram validados em documentação oficial

### 2.3 Responsabilidade

Se Manus AI propuser algo sem validação:
- **Consequência:** Perda de tempo e créditos do usuário
- **Ação corretiva:** Parar imediatamente, pesquisar documentação oficial, trazer solução validada

---

## 3. FLUXO DE VALIDAÇÃO

### Antes de propor qualquer solução:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. IDENTIFICAR A NECESSIDADE                                │
│    (Ex: Deploy automático em GoDaddy)                       │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. PESQUISAR DOCUMENTAÇÃO OFICIAL                           │
│    - Site oficial do fornecedor                            │
│    - Documentação técnica                                  │
│    - Manuais de usuário                                    │
│    - FAQs e suporte                                        │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. VALIDAR CAPACIDADES                                      │
│    - Confirmar se a plataforma oferece o recurso           │
│    - Verificar limitações e restrições                     │
│    - Identificar pré-requisitos                            │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. CONSULTAR BOAS PRÁTICAS                                  │
│    - Manuais de boas práticas                              │
│    - Documentação de segurança                             │
│    - Padrões da indústria                                  │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. DOCUMENTAR FONTES                                        │
│    - URL oficial da documentação                           │
│    - Data de consulta                                      │
│    - Versão do produto/serviço                             │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. PROPOR SOLUÇÃO VALIDADA                                  │
│    - Com evidência de que funciona                         │
│    - Com passo a passo baseado em documentação             │
│    - Com links para referências                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. EXEMPLO: O QUE ACONTECEU COM GoDaddy SSH

### ❌ Erro Cometido

Manus AI propôs procedimentos de SSH em GoDaddy baseado em "conhecimento geral" de que hosting oferece SSH, sem validar:
- Se GoDaddy oferecia terminal web integrado
- Como exatamente funcionava em GoDaddy
- Se era a melhor solução para o contexto do usuário

**Resultado:** Perda de tempo, frustração, créditos gastos.

### ✅ Processo Correto

1. Pesquisar documentação oficial do GoDaddy
2. Confirmar que GoDaddy oferece SSH (sim, oferece)
3. Confirmar que NÃO oferece terminal web integrado (correto)
4. Identificar alternativas validadas (GitHub Actions + FTP)
5. Propor solução com evidência de que funciona

---

## 5. FONTES CONFIÁVEIS (Hierarquia)

### Nível 1: Documentação Oficial (Máxima Prioridade)

- ✅ Site oficial do fornecedor
- ✅ Documentação técnica oficial
- ✅ Manuais de usuário
- ✅ APIs oficiais
- ✅ Suporte oficial

**Exemplo:** https://www.godaddy.com/help/...

### Nível 2: Boas Práticas Certificadas

- ✅ RFC (Request for Comments) - padrões internet
- ✅ OWASP - segurança
- ✅ W3C - web standards
- ✅ NIST - segurança computacional
- ✅ ISO - padrões internacionais

### Nível 3: Comunidade Técnica Validada

- ✅ Stack Overflow (respostas com muitos upvotes)
- ✅ GitHub Issues (discussões técnicas)
- ✅ Blogs técnicos reconhecidos
- ✅ Documentação de projetos open-source

### Nível 4: ❌ NÃO USAR

- ❌ Suposições pessoais
- ❌ "Conhecimento geral"
- ❌ Modelos de teste e erro
- ❌ Blogs aleatórios
- ❌ Fóruns sem validação

---

## 6. DOCUMENTAÇÃO DE CADA SOLUÇÃO

Quando propor uma solução, DEVE incluir:

### Template Obrigatório

```markdown
## Solução: [Nome da Solução]

### Validação
- **Fonte:** [URL oficial ou documento]
- **Data de consulta:** [Data]
- **Versão do produto:** [Versão]
- **Status:** ✅ Validado em documentação oficial

### Pré-requisitos
- [Requisito 1]
- [Requisito 2]

### Passo a Passo
1. [Passo baseado em documentação oficial]
2. [Passo baseado em documentação oficial]

### Referências
- [Link 1]
- [Link 2]

### Risco/Limitações
- [Limitação conhecida]
- [Risco potencial]
```

---

## 7. QUANDO MANUS AI NÃO SABE

Se Manus AI não conseguir validar uma solução:

### Ação Obrigatória

1. **Comunicar ao usuário:**
   - "Não consegui validar esta solução em documentação oficial"
   - "Preciso pesquisar mais"
   - "Vou consultar as fontes oficiais"

2. **Pesquisar:**
   - Documentação oficial
   - Manuais técnicos
   - Fontes certificadas

3. **Trazer resultado:**
   - Com evidência de validação
   - Ou comunicar que não é possível

### NÃO fazer:

- ❌ Propor sem validação
- ❌ Usar "teste e erro"
- ❌ Fazer suposições
- ❌ Trazer procedimentos não validados

---

## 8. REVISÃO E ATUALIZAÇÃO

Este protocolo será revisado:

- **Mensalmente:** Para validar se está sendo seguido
- **Quando necessário:** Se surgir nova situação
- **Anualmente:** Para atualizar boas práticas

---

## 9. ASSINATURA DIGITAL

**Reginaldo Rodrigues (RR Engenharia)**
- Aceita este protocolo
- Exige validação técnica em todas as propostas
- Reserva-se o direito de parar trabalho se não for seguido

**Manus AI**
- Compromete-se a seguir este protocolo
- Pesquisará documentação oficial antes de propor
- Comunicará quando não conseguir validar

---

## 10. HISTÓRICO DE VERSÕES

| Versão | Data | Alterações |
|--------|------|-----------|
| 1.0 | 25/02/2026 | Versão inicial - Criado após incidente com GoDaddy SSH |

---

## 11. REFERÊNCIAS

- GoDaddy SSH Documentation: https://www.godaddy.com/help/connect-to-my-web-hosting-cpanel-account-with-ssh-secure-shell-31865
- RFC 4251 - SSH Protocol Architecture: https://tools.ietf.org/html/rfc4251
- OWASP - Secure Coding: https://owasp.org/

---

**Este documento é vinculante para todos os trabalhos do projeto RR Engenharia.**

**Última atualização:** 25 de fevereiro de 2026  
**Próxima revisão:** 25 de março de 2026
