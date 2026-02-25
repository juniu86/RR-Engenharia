# ⚡ Quick Start: Deploy Automático via Webhook

## TL;DR - Resumo Executivo

1. **Setup (uma vez):** 30 minutos
2. **Deploy (depois):** 1 clique + 2-3 minutos

---

## Setup Rápido (30 minutos)

### 1. Em GoDaddy - SSH

```bash
# 1. Entrar no diretório
cd /home/seu_usuario/public_html

# 2. Verificar se tudo está pronto
git status
pnpm --version
node --version

# 3. Fazer build inicial
pnpm install
pnpm run build

# 4. Gerar token secreto
openssl rand -hex 32
# Copie o resultado: a1b2c3d4e5f6...

# 5. Configurar variável de ambiente
echo 'export DEPLOY_WEBHOOK_TOKEN="a1b2c3d4e5f6..."' >> ~/.bashrc
source ~/.bashrc

# 6. Testar webhook
curl "https://rres.com.br/webhook-deploy.php?token=a1b2c3d4e5f6..."
```

### 2. Verificar Resposta

Se vir JSON com `"status": "success"` → ✅ Tudo pronto!

```json
{
  "status": "success",
  "message": "Deploy concluído com sucesso!",
  "site_url": "https://rres.com.br"
}
```

---

## Deploy (Depois)

### Método 1: Manual (Simples)

1. Faça checkpoint em Manus
2. Abra no navegador:
   ```
   https://rres.com.br/webhook-deploy.php?token=seu-token-secreto
   ```
3. Aguarde resposta JSON
4. Pronto! Site atualizado

### Método 2: Automático (GitHub Actions)

Quando você fizer checkpoint em Manus e exportar para GitHub:
1. GitHub Actions detecta novo push
2. Chama webhook automaticamente
3. Deploy acontece sozinho

---

## Fluxo Completo

```
┌─────────────────────────────────────────────────────┐
│ 1. Editar código em Manus                           │
│    (client/src/pages/Home.tsx, etc)                 │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 2. Testar localmente                                │
│    (http://localhost:3000)                          │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 3. Fazer checkpoint em Manus                        │
│    (UI: Publish → Create Checkpoint)                │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 4. Chamar webhook (escolha um):                     │
│                                                     │
│ A) Manual:                                          │
│    https://rres.com.br/webhook-deploy.php?token=.. │
│                                                     │
│ B) GitHub Actions:                                  │
│    (automático quando fizer push)                   │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 5. Aguardar 2-3 minutos                             │
│    (Git pull + build + deploy)                      │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 6. Verificar site                                   │
│    https://rres.com.br                              │
└─────────────────────────────────────────────────────┘
```

---

## Variáveis Importantes

Substitua em todos os comandos:

| Variável | Exemplo | Onde encontrar |
|----------|---------|----------------|
| `seu_usuario` | `u123456789` | cPanel → Account Information |
| `seu-token-secreto` | `a1b2c3d4e5f6...` | Gerado com `openssl rand -hex 32` |
| `rres.com.br` | Seu domínio | Seu domínio GoDaddy |

---

## Comandos Úteis

### Monitorar logs em tempo real

```bash
tail -f /home/seu_usuario/public_html/webhook-deploy.log
```

### Testar webhook com mais detalhes

```bash
curl -v "https://rres.com.br/webhook-deploy.php?token=seu-token-secreto"
```

### Fazer deploy manual (sem webhook)

```bash
cd /home/seu_usuario/public_html
git pull origin main
pnpm install
pnpm run build
cp -r dist/public/* public/
```

### Verificar se tudo está pronto

```bash
cd /home/seu_usuario/public_html
echo "Git: $(git status)"
echo "Node: $(node --version)"
echo "pnpm: $(pnpm --version)"
echo "Token: $DEPLOY_WEBHOOK_TOKEN"
```

---

## Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| "Unauthorized" | Token inválido. Verifique: `echo $DEPLOY_WEBHOOK_TOKEN` |
| "Git pull falhou" | SSH key não configurada. Configure em GitHub Settings |
| "Build falhou" | Erro no código. Verifique: `pnpm run build` local |
| Site não atualiza | Cache. Limpe: Ctrl+Shift+Del ou incógnito |
| Webhook lento | Normal. Leva 2-3 min (git + build + deploy) |

---

## Segurança

⚠️ **IMPORTANTE:**

1. **Nunca compartilhe o token** com ninguém
2. **Use HTTPS** sempre (não HTTP)
3. **Mude token** a cada 3 meses
4. **Monitore logs** para acessos suspeitos

---

## Próximos Passos

- [ ] Completar setup acima
- [ ] Testar webhook manualmente
- [ ] Fazer primeiro deploy
- [ ] Configurar GitHub Actions (opcional)
- [ ] Documentar para equipe

---

**Tempo de setup:** 30 minutos
**Tempo por deploy:** 2-3 minutos
**Status:** ✅ Pronto para usar
