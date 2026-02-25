# 🚀 Configuração de Deploy Automático via Webhook

## Visão Geral

Sistema de deploy automático que funciona assim:

```
Manus (Checkpoint) 
    ↓
Chama Webhook em GoDaddy
    ↓
Script PHP recebe sinal
    ↓
Git Pull + pnpm install + Build
    ↓
Copia arquivos para /public_html/
    ↓
Site atualizado automaticamente
```

**Tempo total:** ~2-3 minutos

---

## Pré-requisitos

### Em GoDaddy

- ✅ Acesso SSH ou cPanel com Terminal
- ✅ Git instalado
- ✅ Node.js 18+ instalado
- ✅ pnpm instalado
- ✅ Repositório clonado em `/home/seu_usuario/public_html/`

### Em Manus

- ✅ Projeto conectado ao GitHub
- ✅ Capacidade de fazer checkpoint

---

## Passo 1: Preparar GoDaddy

### 1.1 Verificar se Git está instalado

```bash
git --version
```

Se não estiver, você precisa instalar via cPanel ou pedir ao suporte GoDaddy.

### 1.2 Clonar repositório (se ainda não estiver)

```bash
cd /home/seu_usuario
git clone https://github.com/juniu86/RR-Engenharia.git public_html
cd public_html
```

### 1.3 Instalar dependências

```bash
pnpm install
```

Se pnpm não estiver instalado:
```bash
npm install -g pnpm
```

### 1.4 Fazer build inicial

```bash
pnpm run build
```

Resultado: Arquivos em `/home/seu_usuario/public_html/dist/public/`

---

## Passo 2: Configurar Webhook Script

### 2.1 Upload do arquivo `webhook-deploy.php`

1. Via cPanel File Manager, upload do arquivo `webhook-deploy.php` para `/public_html/`
2. Ou via Git (já estará no repositório)

### 2.2 Definir token secreto em GoDaddy

Via cPanel ou SSH, crie variável de ambiente:

**Opção A: Via SSH**
```bash
echo 'export DEPLOY_WEBHOOK_TOKEN="seu-token-secreto-super-longo-aqui"' >> ~/.bashrc
source ~/.bashrc
```

**Opção B: Via cPanel (Advanced)**
1. Acesse cPanel → Environment Variables
2. Adicione: `DEPLOY_WEBHOOK_TOKEN = seu-token-secreto-aqui`

**Gerar token seguro:**
```bash
openssl rand -hex 32
```

Resultado: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

---

## Passo 3: Testar Webhook Manualmente

### 3.1 Teste via URL

Abra no navegador:
```
https://rres.com.br/webhook-deploy.php?token=seu-token-secreto-aqui
```

**Resposta esperada:**
```json
{
  "status": "success",
  "message": "Deploy concluído com sucesso!",
  "site_url": "https://rres.com.br",
  "steps": [
    {"name": "git_pull", "status": "success"},
    {"name": "pnpm_install", "status": "success"},
    {"name": "build", "status": "success"},
    ...
  ]
}
```

### 3.2 Verificar logs

```bash
tail -f /home/seu_usuario/public_html/webhook-deploy.log
```

---

## Passo 4: Integrar com Manus

### 4.1 Criar Script de Trigger em Manus

Quando você fizer checkpoint em Manus, precisa chamar o webhook.

**Opção A: Manual (por enquanto)**

Após fazer checkpoint:
1. Abra: `https://rres.com.br/webhook-deploy.php?token=seu-token-secreto`
2. Aguarde resposta JSON
3. Verifique site em https://rres.com.br

**Opção B: Automático (futuro)**

Manus pode ter integração com webhooks. Quando disponível:
1. Configure webhook URL: `https://rres.com.br/webhook-deploy.php?token=seu-token-secreto`
2. Dispara automaticamente após checkpoint

### 4.2 Fluxo Recomendado

1. **Editar código em Manus**
2. **Testar localmente** (dev server em http://localhost:3000)
3. **Fazer checkpoint em Manus** (salva versão)
4. **Chamar webhook** (dispara deploy)
5. **Verificar site** em https://rres.com.br

---

## Passo 5: Automação Completa (Opcional)

Se quiser automação 100% sem chamar manualmente:

### Opção A: GitHub Actions (Recomendado)

Quando você fizer push para GitHub (via Manus Export):
1. GitHub Actions detecta novo push
2. Chama webhook em GoDaddy
3. Deploy automático

**Arquivo: `.github/workflows/webhook-trigger.yml`**

```yaml
name: Trigger Webhook Deploy

on:
  push:
    branches: [ main ]
    paths:
      - 'client/**'
      - 'package.json'

jobs:
  trigger-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger webhook
        run: |
          curl -X GET "https://rres.com.br/webhook-deploy.php?token=${{ secrets.DEPLOY_WEBHOOK_TOKEN }}"
```

### Opção B: Cron Job em GoDaddy

Executar deploy a cada 1 hora (se houver mudanças):

```bash
0 * * * * curl -s "https://rres.com.br/webhook-deploy.php?token=seu-token-secreto" >> /home/seu_usuario/public_html/webhook-cron.log 2>&1
```

---

## Troubleshooting

### Problema: "Unauthorized"

**Causa:** Token inválido ou não configurado

**Solução:**
1. Verifique token em GoDaddy: `echo $DEPLOY_WEBHOOK_TOKEN`
2. Verifique URL: token deve estar correto
3. Teste com token correto

### Problema: "Git pull falhou"

**Causa:** Repositório não está em `/public_html/` ou sem permissões

**Solução:**
1. Verifique se `.git` existe: `ls -la /home/seu_usuario/public_html/.git`
2. Verifique permissões: `git config --list`
3. Configure SSH key em GoDaddy para GitHub

### Problema: "pnpm install falhou"

**Causa:** pnpm não instalado ou sem permissões

**Solução:**
1. Instale pnpm: `npm install -g pnpm`
2. Verifique: `pnpm --version`

### Problema: "Build falhou"

**Causa:** Erro no código ou dependências faltando

**Solução:**
1. Verifique logs: `tail -f webhook-deploy.log`
2. Teste build manual: `cd /home/seu_usuario/public_html && pnpm run build`
3. Corrija erros no código

### Problema: Site não atualiza

**Causa:** Arquivos não foram copiados corretamente

**Solução:**
1. Verifique se `/public_html/public/index.html` existe
2. Verifique permissões: `ls -la /home/seu_usuario/public_html/public/`
3. Limpe cache do navegador (Ctrl+Shift+Del)

---

## Segurança

### ⚠️ Importante

1. **Token secreto:** Use token longo e aleatório
2. **HTTPS:** Sempre use HTTPS (webhook-deploy.php?token=...)
3. **Não compartilhe:** Nunca compartilhe o token
4. **Rotação:** Mude token a cada 3 meses
5. **Logs:** Monitore `webhook-deploy.log` para acessos suspeitos

### Melhorias Futuras

- [ ] Rate limiting (máximo 1 deploy por minuto)
- [ ] IP whitelist (apenas GitHub Actions)
- [ ] Notificação por email após deploy
- [ ] Rollback automático se build falhar

---

## Checklist de Setup

- [ ] Git instalado em GoDaddy
- [ ] Node.js 18+ instalado
- [ ] pnpm instalado
- [ ] Repositório clonado em `/public_html/`
- [ ] `webhook-deploy.php` em `/public_html/`
- [ ] Token secreto configurado em GoDaddy
- [ ] Teste manual do webhook bem-sucedido
- [ ] Site atualizado após teste
- [ ] Logs sendo criados em `webhook-deploy.log`

---

## Próximos Passos

1. **Completar setup acima**
2. **Testar webhook manualmente**
3. **Fazer checkpoint em Manus**
4. **Chamar webhook**
5. **Verificar site**
6. **Documentar processo para equipe**

---

**Status:** ✅ Pronto para implementação
**Tempo de setup:** ~30 minutos
**Tempo por deploy:** ~2-3 minutos
