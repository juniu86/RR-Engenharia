#!/bin/bash

# RR Engenharia - Deploy via SSH
# Uso: bash deploy.sh
# Execute isto no terminal SSH do GoDaddy em /public_html/

set -e

ZIP_URL="https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/CJjeTAhRpWemrntJ.zip"
TEMP_DIR="/tmp/rr_deploy_$$"
ZIP_FILE="$TEMP_DIR/site.zip"
PUBLIC_DIR="./public"
BACKUP_DIR="./public_backup_$(date +%Y%m%d%H%M%S)"

echo "🚀 RR Engenharia Deploy"
echo "======================="

echo ""
echo "📥 Baixando arquivo..."
mkdir -p "$TEMP_DIR"
curl -s -o "$ZIP_FILE" "$ZIP_URL" || { echo "❌ Erro ao baixar"; exit 1; }
echo "✓ Arquivo baixado ($(du -h "$ZIP_FILE" | cut -f1))"

echo ""
echo "📦 Extraindo..."
unzip -q "$ZIP_FILE" -d "$TEMP_DIR" || { echo "❌ Erro ao extrair"; exit 1; }
echo "✓ Extraído com sucesso"

echo ""
echo "💾 Fazendo backup..."
if [ -d "$PUBLIC_DIR" ]; then
    cp -r "$PUBLIC_DIR" "$BACKUP_DIR"
    echo "✓ Backup criado: $BACKUP_DIR"
fi

echo ""
echo "📂 Removendo public antigo..."
rm -rf "$PUBLIC_DIR"
echo "✓ Removido"

echo ""
echo "📂 Copiando novos arquivos..."
cp -r "$TEMP_DIR/public" "$PUBLIC_DIR"
echo "✓ Copiado com sucesso"

echo ""
echo "✅ Verificando..."
if [ -f "$PUBLIC_DIR/index.html" ]; then
    echo "✓ index.html encontrado"
    echo "✓ Deploy bem-sucedido!"
else
    echo "❌ Erro: index.html não encontrado"
    exit 1
fi

echo ""
echo "🧹 Limpando..."
rm -rf "$TEMP_DIR"
echo "✓ Limpeza concluída"

echo ""
echo "✅ DEPLOY COMPLETO!"
echo "Acesse: https://rres.com.br"
