# 🚀 Protocolo de Deploy - RR Engenharia Website

## Regra Padrão: Sempre Gerar Script PHP Após Checkpoint

**Toda vez que um checkpoint é salvo, este protocolo deve ser executado:**

### Passo 1: Build do Projeto
```bash
cd /home/ubuntu/rr-engenharia-website
pnpm run build
```

### Passo 2: Criar ZIP da Pasta `dist/public/`
```bash
cd /home/ubuntu/rr-engenharia-website/dist
zip -r /tmp/rr-engenharia-website.zip public/
```

### Passo 3: Upload do ZIP para CDN
```bash
manus-upload-file /tmp/rr-engenharia-website.zip
```
**Copie a URL retornada (exemplo: `https://files.manuscdn.com/...zip`)**

### Passo 4: Atualizar URL no Script PHP
Abra `deploy.php` e atualize a linha:
```php
$zip_url = 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/CJjeTAhRpWemrntJ.zip';
```
Com a URL do novo ZIP.

### Passo 5: Upload do Script PHP para GoDaddy
1. Acesse cPanel: https://godaddy.com/cPanel
2. File Manager → /public_html/
3. Upload do arquivo `deploy.php`

### Passo 6: Executar Deploy
1. Abra: https://rres.com.br/deploy.php
2. Clique em "▶️ Iniciar Deploy Agora"
3. Aguarde conclusão (1-2 minutos)

### Passo 7: Verificar e Limpar
1. Acesse https://rres.com.br e verifique as mudanças
2. Volte ao cPanel e **DELETE o arquivo deploy.php** por segurança

---

## Credenciais GoDaddy (Armazenadas com Segurança)

**FTP:**
- Host: ftp.rres.com.br
- User: contato@rres.com.br
- Password: dP&%w+pvowb?

**cPanel:**
- URL: https://godaddy.com/cPanel
- User: contato@rres.com.br

---

## Checklist de Deploy

- [ ] Build executado sem erros
- [ ] ZIP criado com sucesso
- [ ] ZIP enviado para CDN
- [ ] URL do ZIP copiada
- [ ] deploy.php atualizado com nova URL
- [ ] deploy.php enviado para GoDaddy
- [ ] Deploy executado com sucesso
- [ ] Website verificado em https://rres.com.br
- [ ] deploy.php deletado do servidor

---

## Troubleshooting

### Erro: "Arquivo ZIP não encontrado"
- Verifique se a URL do CDN está correta
- Teste a URL no navegador

### Erro: "Permissão negada ao extrair"
- Verifique permissões da pasta /public_html/ no cPanel
- Tente deletar a pasta `public` manualmente antes do deploy

### Erro: "Arquivo ZIP corrompido"
- Refaça o build: `pnpm run build`
- Recrie o ZIP
- Reupload para CDN

---

## Notas Importantes

1. **Segurança**: Sempre delete o arquivo `deploy.php` após uso
2. **Backup**: O script cria automaticamente backup dos arquivos antigos
3. **Downtime**: Deploy leva 1-2 minutos, sem downtime do site
4. **Rollback**: Se algo der errado, use o backup automático na pasta `public_backup_*`

---

**Última atualização:** 25 de fevereiro de 2026
**Versão:** 1.0
