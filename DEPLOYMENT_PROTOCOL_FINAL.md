# 🚀 Protocolo de Deploy - RR Engenharia (VERSÃO FINAL - FUNCIONA)

## ⚠️ IMPORTANTE: Método que Funciona

**Não use PHP scripts, não use SSH, não use terminal.**

Use o **método manual via cPanel File Manager** - é 100% confiável.

---

## Passo a Passo

### 1. Build do Projeto (Local)

```bash
cd /home/ubuntu/rr-engenharia-website
pnpm run build
```

Resultado: Arquivos em `/home/ubuntu/rr-engenharia-website/dist/public/`

### 2. Criar ZIP com os Arquivos

```bash
cd /home/ubuntu/rr-engenharia-website/dist/public
zip -r /home/ubuntu/Downloads/rr-website-files.zip .
```

Resultado: Arquivo `/home/ubuntu/Downloads/rr-website-files.zip` (≈317 KB)

### 3. Via cPanel File Manager (GoDaddy)

**Acesse:** https://godaddy.com/cPanel → File Manager

#### 3.1 Deletar Arquivos Antigos

Navegue para `/public_html/` e delete:
- ✓ Pasta `public` (se existir)
- ✓ Todas as pastas `public_backup_*`
- ✓ Arquivo `index.html`
- ✓ Arquivo `error_log`
- ✓ Arquivo `og-image.jpg`
- ✓ Arquivo `manifest.json`
- ✓ Arquivo `robots.txt`
- ✓ Arquivo `sitemap.xml`
- ✓ Qualquer arquivo `.php`

**MANTENHA:**
- ✗ Pasta `mail`
- ✗ Pasta `ssl`
- ✗ Pasta `tmp`
- ✗ Pasta `etc`
- ✗ Pasta `logs`
- ✗ Pasta `public_ftp`
- ✗ Pasta `__manus__`

#### 3.2 Upload do ZIP

1. Clique em "Upload" (ou arraste o arquivo)
2. Selecione `rr-website-files.zip`
3. Upload para `/public_html/`

#### 3.3 Extrair o ZIP

1. Clique direito em `rr-website-files.zip`
2. Selecione "Extract"
3. Escolha extrair em `/public_html/`
4. Confirme

#### 3.4 Verificar

Após extração, você deve ter:
- `/public_html/index.html` (363 KB)
- `/public_html/assets/` (pasta)
- `/public_html/manifest.json`
- `/public_html/robots.txt`
- `/public_html/sitemap.xml`

#### 3.5 Deletar o ZIP

Delete o arquivo `rr-website-files.zip` (opcional, mas recomendado)

### 4. Verificar Online

Acesse: https://rres.com.br

Se vir o site com logo, hero section, serviços, etc → **Deploy bem-sucedido!** ✅

---

## Checklist de Deploy

- [ ] Build executado: `pnpm run build`
- [ ] ZIP criado: `rr-website-files.zip`
- [ ] Arquivos antigos deletados em `/public_html/`
- [ ] ZIP enviado para `/public_html/`
- [ ] ZIP extraído em `/public_html/`
- [ ] `index.html` existe em `/public_html/`
- [ ] Site acessível em https://rres.com.br
- [ ] ZIP deletado (opcional)

---

## Por Que Este Método Funciona

1. **Sem PHP:** Não depende de versão de PHP ou permissões
2. **Sem Scripts:** Sem erros silenciosos de execução
3. **Manual:** Você controla cada passo
4. **Confiável:** cPanel File Manager é 100% confiável
5. **Simples:** Apenas upload + extract

---

## Troubleshooting

### Problema: Site ainda mostra página em branco

**Solução:**
1. Verifique se `index.html` existe em `/public_html/`
2. Verifique se a pasta `assets/` existe
3. Limpe o cache do navegador (Ctrl+Shift+Del)
4. Acesse em modo incógnito

### Problema: Alguns arquivos não carregam

**Solução:**
1. Verifique se a pasta `assets/` foi extraída
2. Verifique se `manifest.json` existe
3. Verifique permissões (devem ser 644 para arquivos, 755 para pastas)

### Problema: Erro 404 em assets

**Solução:**
1. Verifique se os caminhos no `index.html` estão corretos
2. Verifique se a pasta `assets/` contém `index-*.css` e `index-*.js`

---

## Regra Padrão: Sempre Fazer Assim

**Toda vez que você fizer um checkpoint e quiser fazer deploy:**

1. Build local: `pnpm run build`
2. Criar ZIP: `zip -r rr-website-files.zip dist/public/`
3. Upload + Extract via cPanel
4. Verificar em https://rres.com.br

**Nunca use PHP scripts, nunca use SSH, nunca use terminal remoto.**

---

**Última atualização:** 25 de fevereiro de 2026
**Status:** ✅ FUNCIONA 100%
