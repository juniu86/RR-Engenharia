<?php
// RR Engenharia Deploy - Versão Final
// Usa apenas operações básicas de arquivo que funcionam em qualquer PHP

$zip_url = 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/CJjeTAhRpWemrntJ.zip';
$base = dirname(__FILE__);
$public = $base . '/public';
$temp = $base . '/temp_' . time();

function log_msg($msg) {
    echo "<div style='padding:8px;margin:3px 0;background:#f0f0f0;border-left:3px solid #0963ed;font-family:monospace;font-size:12px;'>" . htmlspecialchars($msg) . "</div>";
    flush();
    ob_flush();
}

function rm_rf($path) {
    if (!is_dir($path)) return;
    $files = scandir($path);
    foreach ($files as $f) {
        if ($f === '.' || $f === '..') continue;
        $p = $path . '/' . $f;
        if (is_dir($p)) {
            rm_rf($p);
        } else {
            @unlink($p);
        }
    }
    @rmdir($path);
}

function cp_rf($src, $dst) {
    if (!is_dir($dst)) @mkdir($dst, 0755, true);
    $files = @scandir($src);
    if (!$files) return false;
    foreach ($files as $f) {
        if ($f === '.' || $f === '..') continue;
        $s = $src . '/' . $f;
        $d = $dst . '/' . $f;
        if (is_dir($s)) {
            cp_rf($s, $d);
        } else {
            @copy($s, $d);
        }
    }
    return true;
}

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>RR Engenharia Deploy</title>
    <style>
        body { font-family: Montserrat, sans-serif; background: linear-gradient(135deg, #001c3d, #002863); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .box { background: white; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); padding: 40px; max-width: 600px; width: 100%; }
        h1 { color: #001c3d; margin: 0 0 10px 0; }
        .logs { background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px; padding: 15px; margin: 20px 0; max-height: 400px; overflow-y: auto; font-family: monospace; font-size: 12px; }
        button { background: #0963ed; color: white; border: none; padding: 12px 30px; border-radius: 5px; font-size: 16px; font-weight: bold; cursor: pointer; width: 100%; }
        button:hover { background: #0752c4; }
        .ok { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; display: none; }
        .err { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0; display: none; }
    </style>
</head>
<body>
    <div class="box">
        <h1>🚀 RR Engenharia Deploy</h1>
        <p style="color: #666; margin: 0 0 20px 0;">Atualizar website</p>
        
        <?php
        if ($_POST['deploy'] ?? null) {
            echo "<div class='logs'>";
            
            try {
                // 1. Download
                log_msg("📥 Baixando arquivo...");
                @mkdir($temp, 0755, true);
                $zip_file = $temp . '/site.zip';
                
                $ctx = stream_context_create(['http' => ['timeout' => 60]]);
                $data = @file_get_contents($zip_url, false, $ctx);
                if (!$data) throw new Exception("Erro ao baixar ZIP");
                
                if (!file_put_contents($zip_file, $data)) throw new Exception("Erro ao salvar ZIP");
                log_msg("✓ Baixado " . round(strlen($data) / 1024) . " KB");
                
                // 2. Extract
                log_msg("📦 Extraindo...");
                $z = new ZipArchive();
                if (!$z->open($zip_file)) throw new Exception("Erro ao abrir ZIP");
                if (!$z->extractTo($temp)) throw new Exception("Erro ao extrair ZIP");
                $z->close();
                log_msg("✓ Extraído");
                
                // 3. Verify public exists
                log_msg("🔍 Verificando estrutura...");
                $extracted_public = $temp . '/public';
                if (!is_dir($extracted_public)) throw new Exception("Pasta public não encontrada após extração");
                if (!is_file($extracted_public . '/index.html')) throw new Exception("index.html não encontrado");
                log_msg("✓ Estrutura OK");
                
                // 4. Backup
                log_msg("💾 Fazendo backup...");
                if (is_dir($public)) {
                    $backup = $base . '/public_backup_' . date('YmdHis');
                    if (!cp_rf($public, $backup)) throw new Exception("Erro ao fazer backup");
                    rm_rf($public);
                    log_msg("✓ Backup: " . basename($backup));
                }
                
                // 5. Copy new files
                log_msg("📂 Copiando arquivos...");
                if (!cp_rf($extracted_public, $public)) throw new Exception("Erro ao copiar arquivos");
                log_msg("✓ Copiado");
                
                // 6. Verify
                log_msg("✅ Verificando resultado...");
                if (!is_file($public . '/index.html')) throw new Exception("Verificação falhou: index.html não encontrado");
                log_msg("✓ Verificação OK");
                
                // 7. Cleanup
                log_msg("🧹 Limpando...");
                rm_rf($temp);
                log_msg("✓ Limpo");
                
                echo "</div>";
                echo "<div class='ok' style='display:block;'>✅ Deploy bem-sucedido!<br>Acesse <a href='https://rres.com.br' style='color:#155724;font-weight:bold;'>https://rres.com.br</a><br><br>⚠️ Delete este arquivo (deploy.php) por segurança!</div>";
                
            } catch (Exception $e) {
                echo "</div>";
                echo "<div class='err' style='display:block;'>❌ Erro: " . htmlspecialchars($e->getMessage()) . "</div>";
                @rm_rf($temp);
            }
        } else {
            ?>
            <form method="POST">
                <button name="deploy" value="1">▶️ Deploy Agora</button>
            </form>
            <p style="text-align:center;color:#999;font-size:12px;margin-top:20px;">Versão: 2026-02-25</p>
            <?php
        }
        ?>
    </div>
</body>
</html>
