<?php
// Restaurar do backup automático

$base = dirname(__FILE__);
$public = $base . '/public';

function rm_rf($path) {
    if (is_dir($path)) {
        foreach (scandir($path) as $f) {
            if ($f !== '.' && $f !== '..') {
                rm_rf($path . '/' . $f);
            }
        }
        rmdir($path);
    } else {
        unlink($path);
    }
}

function cp_rf($src, $dst) {
    if (is_dir($src)) {
        if (!is_dir($dst)) mkdir($dst, 0755, true);
        foreach (scandir($src) as $f) {
            if ($f !== '.' && $f !== '..') {
                cp_rf($src . '/' . $f, $dst . '/' . $f);
            }
        }
    } else {
        copy($src, $dst);
    }
}

function log_msg($msg) {
    echo "<div style='padding: 8px; margin: 3px 0; background: #f0f0f0; border-left: 3px solid #0963ed; font-family: monospace; font-size: 12px;'>" . htmlspecialchars($msg) . "</div>";
    flush();
    ob_flush();
}

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Restaurar Backup</title>
    <style>
        body { font-family: Montserrat; background: linear-gradient(135deg, #001c3d, #002863); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
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
        <h1>🔄 Restaurar Backup</h1>
        <p style="color: #666; margin: 0 0 20px 0;">Restaurar versão anterior do site</p>
        
        <?php
        if ($_POST['restore'] ?? null) {
            echo "<div class='logs'>";
            
            try {
                log_msg("🔍 Procurando backups...");
                $backups = glob($base . '/public_backup_*', GLOB_ONLYDIR);
                if (empty($backups)) {
                    throw new Exception("Nenhum backup encontrado!");
                }
                
                rsort($backups);
                $latest = $backups[0];
                log_msg("✓ Backup encontrado: " . basename($latest));
                
                log_msg("🗑️ Removendo public atual...");
                if (is_dir($public)) {
                    rm_rf($public);
                }
                log_msg("✓ Removido");
                
                log_msg("📂 Restaurando...");
                cp_rf($latest, $public);
                log_msg("✓ Restaurado");
                
                echo "</div>";
                echo "<div class='ok' style='display: block;'>✅ Restaurado! Acesse <a href='https://rres.com.br' style='color: #155724; font-weight: bold;'>https://rres.com.br</a><br><br>Delete este arquivo por segurança!</div>";
                
            } catch (Exception $e) {
                echo "</div>";
                echo "<div class='err' style='display: block;'>❌ " . htmlspecialchars($e->getMessage()) . "</div>";
            }
        } else {
            ?>
            <form method="POST">
                <button name="restore" value="1">🔄 Restaurar Agora</button>
            </form>
            <?php
        }
        ?>
    </div>
</body>
</html>
