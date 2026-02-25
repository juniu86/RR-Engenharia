<?php
/**
 * RR Engenharia - Website Deployment Script
 * 
 * INSTRUÇÕES:
 * 1. Faça upload deste arquivo (deploy.php) via cPanel File Manager para /public_html/
 * 2. Acesse: https://rres.com.br/deploy.php no navegador
 * 3. Clique no botão "Iniciar Deploy"
 * 4. Aguarde a conclusão (pode levar 1-2 minutos)
 * 5. Após sucesso, DELETE este arquivo (deploy.php) por segurança
 * 
 * IMPORTANTE: Este script é temporário e deve ser deletado após uso!
 */

// Configurações
$zip_url = 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/CJjeTAhRpWemrntJ.zip';
$temp_zip = '/tmp/rr-website-deploy.zip';
$extract_path = dirname(__FILE__);
$public_folder = $extract_path . '/public';

// Função para log
function log_message($msg) {
    echo "<div style='padding: 10px; margin: 5px 0; background: #f0f0f0; border-left: 4px solid #0963ed; font-family: monospace;'>";
    echo htmlspecialchars($msg);
    echo "</div>";
    flush();
    ob_flush();
}

// Função para remover diretório recursivamente
function remove_directory($dir) {
    if (is_dir($dir)) {
        $files = array_diff(scandir($dir), array('.', '..'));
        foreach ($files as $file) {
            $path = $dir . '/' . $file;
            if (is_dir($path)) {
                remove_directory($path);
            } else {
                unlink($path);
            }
        }
        rmdir($dir);
    }
}

// Função para copiar diretório recursivamente
function copy_directory($src, $dst) {
    $dir = opendir($src);
    @mkdir($dst);
    while (false !== ($file = readdir($dir))) {
        if ($file != '.' && $file != '..') {
            if (is_dir($src . '/' . $file)) {
                copy_directory($src . '/' . $file, $dst . '/' . $file);
            } else {
                copy($src . '/' . $file, $dst . '/' . $file);
            }
        }
    }
    closedir($dir);
}

// Iniciar HTML
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RR Engenharia - Deploy</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Montserrat', sans-serif;
            background: linear-gradient(135deg, #001c3d 0%, #002863 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            padding: 40px;
            max-width: 600px;
            width: 100%;
        }
        h1 {
            color: #001c3d;
            margin-bottom: 10px;
            font-size: 28px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
        }
        .logs {
            background: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            min-height: 100px;
            max-height: 400px;
            overflow-y: auto;
            font-family: 'Courier New', monospace;
            font-size: 12px;
        }
        button {
            background: #0963ed;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            width: 100%;
            transition: background 0.3s;
        }
        button:hover {
            background: #0752c4;
        }
        button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .status {
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            display: none;
        }
        .status.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
            display: block;
        }
        .status.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            display: block;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 RR Engenharia Deploy</h1>
        <p class="subtitle">Atualizar website em GoDaddy</p>
        
        <div class="warning">
            ⚠️ <strong>IMPORTANTE:</strong> Após o deploy bem-sucedido, delete este arquivo (deploy.php) por segurança!
        </div>

        <?php
        // Verificar se foi enviado comando de deploy
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'deploy') {
            echo "<div class='logs' id='logs'>";
            
            try {
                // Step 1: Download ZIP
                log_message("📥 Baixando arquivo do CDN...");
                $zip_content = @file_get_contents($zip_url);
                if ($zip_content === false) {
                    throw new Exception("Erro ao baixar arquivo do CDN. Verifique a URL.");
                }
                file_put_contents($temp_zip, $zip_content);
                log_message("✓ Arquivo baixado com sucesso (" . round(filesize($temp_zip) / 1024, 2) . " KB)");

                // Step 2: Extract ZIP
                log_message("📦 Extraindo arquivo...");
                $zip = new ZipArchive();
                if ($zip->open($temp_zip) !== true) {
                    throw new Exception("Erro ao abrir arquivo ZIP");
                }
                $zip->extractTo($extract_path);
                $zip->close();
                log_message("✓ Arquivo extraído com sucesso");

                // Step 3: Backup old files
                log_message("💾 Fazendo backup dos arquivos antigos...");
                $backup_folder = $extract_path . '/public_backup_' . date('YmdHis');
                if (is_dir($public_folder)) {
                    copy_directory($public_folder, $backup_folder);
                    remove_directory($public_folder);
                    log_message("✓ Backup criado em: " . basename($backup_folder));
                }

                // Step 4: Move new files
                log_message("📂 Movendo novos arquivos...");
                $temp_public = $extract_path . '/public';
                if (is_dir($temp_public)) {
                    rename($temp_public, $public_folder);
                } else {
                    throw new Exception("Pasta 'public' não encontrada no ZIP");
                }
                log_message("✓ Arquivos movidos com sucesso");

                // Step 5: Cleanup
                log_message("🧹 Limpando arquivos temporários...");
                @unlink($temp_zip);
                log_message("✓ Limpeza concluída");

                // Success
                echo "</div>";
                echo "<div class='status success'>";
                echo "✅ <strong>Deploy Concluído com Sucesso!</strong><br>";
                echo "Seu website foi atualizado. Acesse <a href='https://rres.com.br' style='color: #155724; font-weight: bold;'>https://rres.com.br</a> para verificar.<br><br>";
                echo "<strong>⚠️ PRÓXIMO PASSO:</strong> Delete este arquivo (deploy.php) via cPanel File Manager por segurança.";
                echo "</div>";

            } catch (Exception $e) {
                echo "</div>";
                echo "<div class='status error'>";
                echo "❌ <strong>Erro no Deploy:</strong><br>";
                echo htmlspecialchars($e->getMessage());
                echo "</div>";
                
                // Cleanup on error
                @unlink($temp_zip);
            }
        } else {
            // Show form
            ?>
            <form method="POST">
                <input type="hidden" name="action" value="deploy">
                <button type="submit">▶️ Iniciar Deploy Agora</button>
            </form>
            <p style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                Versão: <?php echo date('Y-m-d H:i:s'); ?><br>
                ZIP: CJjeTAhRpWemrntJ.zip
            </p>
            <?php
        }
        ?>
    </div>
</body>
</html>
