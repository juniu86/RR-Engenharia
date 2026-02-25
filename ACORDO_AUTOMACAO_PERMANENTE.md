# 📋 ACORDO PERMANENTE DE AUTOMAÇÃO
## RR Engenharia - Website Deployment

**Data:** 25 de fevereiro de 2026  
**Partes:** Reginaldo Rodrigues (RR Engenharia) ↔ Manus (Assistente de IA)  
**Status:** ✅ VINCULANTE E PERMANENTE  
**Validade:** Indefinida (até revogação formal)

---

## PRINCÍPIO FUNDAMENTAL

> **NENHUM DEPLOY MANUAL SERÁ ACEITO. TODO FLUXO DEVE SER 100% AUTOMÁTICO.**

---

## ARQUITETURA ESTABELECIDA

```
┌─────────────────────────────────────────────────────────────┐
│ VOCÊ EDITA NO MANUS                                         │
│ (Melhorias, correções, novos conteúdos)                    │
└────────────────┬─────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ VOCÊ FAZ CHECKPOINT                                         │
│ (Salva versão no Manus)                                     │
└────────────────┬─────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ VOCÊ EXPORTA PARA GITHUB                                    │
│ (1 clique via UI do Manus)                                  │
└────────────────┬─────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ GITHUB ACTIONS DETECTA PUSH                                 │
│ (Automático - sem ação sua)                                 │
└────────────────┬─────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ BUILD + DEPLOY AUTOMÁTICO                                   │
│ (pnpm install → build → FTP upload)                         │
└────────────────┬─────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ SITE ATUALIZADO EM GODADDY                                  │
│ (2-3 minutos - você vê em tempo real)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## COMPROMISSOS DO MANUS

### ✅ OBRIGAÇÕES PERMANENTES

1. **Nunca propor deploy manual**
   - ❌ Proibido: "Upload via cPanel"
   - ❌ Proibido: "Extraia o ZIP manualmente"
   - ❌ Proibido: "Acesse o terminal do GoDaddy"
   - ✅ Permitido: "Faça checkpoint → Exporte para GitHub"

2. **Validar TUDO em documentação oficial**
   - Antes de propor qualquer solução
   - Pesquisar em docs oficiais (GitHub, GoDaddy, etc)
   - Citar fontes em cada proposta
   - Nunca usar "teste e erro"

3. **Manter fluxo 100% automático**
   - GitHub Actions sempre ativo
   - FTP secrets configurados
   - Workflow testado e funcional
   - Monitorar e corrigir falhas

4. **Documentar TUDO**
   - Cada mudança no workflow
   - Cada atualização de secrets
   - Cada problema e solução
   - Manter README atualizado

---

## COMPROMISSOS DO REGINALDO

### ✅ OBRIGAÇÕES DO USUÁRIO

1. **Seguir o fluxo estabelecido**
   - Editar em Manus
   - Fazer checkpoint
   - Exportar para GitHub
   - Nunca fazer upload manual

2. **Fornecer informações precisas**
   - Credenciais quando necessário
   - Feedback sobre problemas
   - Requisitos de novos features

3. **Manter secrets seguros**
   - Não compartilhar tokens em público
   - Revogar tokens expirados
   - Avisar se houver vazamento

4. **Revisar antes de exportar**
   - Testar mudanças em preview
   - Verificar se tudo está correto
   - Só exportar quando pronto

---

## PROTOCOLO DE VIOLAÇÃO

Se este acordo for violado (deploy manual, teste e erro, etc):

### PASSO 1: IDENTIFICAÇÃO
- Manus identifica a violação
- Para a ação imediatamente
- Documenta o incidente

### PASSO 2: NOTIFICAÇÃO
- Avisa Reginaldo
- Explica por que foi bloqueado
- Oferece alternativa automática

### PASSO 3: CORREÇÃO
- Restaura fluxo automático
- Documenta a lição aprendida
- Atualiza este acordo se necessário

### PASSO 4: PREVENÇÃO
- Implementa guardrails técnicos
- Adiciona validações automáticas
- Bloqueia ações manuais no código

---

## FLUXO DE MUDANÇAS NO ACORDO

Se qualquer coisa precisar mudar:

1. **Você propõe mudança** (mensagem clara)
2. **Manus pesquisa** (documentação oficial)
3. **Manus propõe solução** (com evidência)
4. **Você aprova** (confirmação)
5. **Acordo atualizado** (nova versão com data)

**Nada muda sem aprovação mútua.**

---

## TECNOLOGIAS ENVOLVIDAS

| Componente | Status | Responsável |
|-----------|--------|------------|
| Manus Webdev | ✅ Ativo | Manus |
| GitHub Repository | ✅ Ativo | juniu86/RR-Engenharia |
| GitHub Actions Workflow | ✅ Ativo | `.github/workflows/deploy.yml` |
| FTP Secrets | ✅ Configurado | GitHub Secrets |
| GoDaddy Hosting | ✅ Online | ftp.rres.com.br |
| Domain | ✅ Registrado | rres.com.br |

---

## CONTATOS E ESCALAÇÃO

**Se algo der errado:**

1. **Erro no build:** Manus debugga e corrige
2. **Erro no FTP:** Manus ajusta secrets/workflow
3. **Erro em GoDaddy:** Manus pesquisa e resolve
4. **Dúvida sobre fluxo:** Manus explica e documenta

**Nunca:** "Vou fazer manual enquanto isso"

---

## ASSINATURA DIGITAL

**Manus:** Compromete-se a manter este acordo  
**Data:** 25 de fevereiro de 2026  
**Versão:** 1.0  
**Próxima revisão:** 25 de março de 2026

---

## HISTÓRICO DE VERSÕES

| Versão | Data | Mudança |
|--------|------|---------|
| 1.0 | 25/02/2026 | Acordo inicial - Automação 100% |

---

## NOTAS FINAIS

Este acordo existe porque:

1. **Você perdeu tempo** com deploys manuais
2. **Você gastou créditos** com tentativa e erro
3. **Você merece melhor** - automação real

A partir de agora:
- ✅ Tudo é automático
- ✅ Tudo é documentado
- ✅ Tudo é validado
- ✅ Tudo é rápido

**Nenhuma exceção.**

---

**Assinado digitalmente em 25 de fevereiro de 2026**  
**Válido indefinidamente até revogação formal**
