<?php
/**
 * RR Engenharia - Webhook Deploy Receiver
 * 
 * URL: https://rres.com.br/webhook-deploy.php?token=YOUR_SECRET_TOKEN
 * 
 * Fluxo:
 * 1. Manus faz checkpoint
 * 2. Manus chama este webhook
 * 3. Script faz git pull + build + deploy
 * 4. Site é atualizado automaticamente
 */

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

// Token secreto (configure em GoDaddy como variável de ambiente)
$EXPECTED_TOKEN = getenv('DEPLOY_WEBHOOK_TOKEN') ?: 'seu-token-secreto-aqui';

// Diretório do projeto (ajuste conforme seu setup em GoDaddy)
$PROJECT_DIR = dirname(__FILE__);
$PUBLIC_DIR = $PROJECT_DIR . '/public';
$DIST_DIR = $PROJECT_DIR . '/dist/public';

// Arquivo de log
$LOG_FILE = $PROJECT_DIR . '/webhook-deploy.log';

// ============================================================================
// FUNÇÕES
// ============================================================================

function log_msg($msg) {
    global $LOG_FILE;
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = "[$timestamp] $msg\n";
    file_put_contents($LOG_FILE, $log_entry, FILE_APPEND);
    echo $log_entry;
}

function exec_cmd($cmd) {
    $output = [];
    $return_code = 0;
    exec($cmd . ' 2>&1', $output, $return_code);
    return [
        'output' => implode("\n", $output),
        'code' => $return_code,
        'success' => $return_code === 0
    ];
}

function rm_rf($path) {
    if (!is_dir($path)) return true;
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
    return @rmdir($path);
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

// ============================================================================
// VALIDAÇÃO
// ============================================================================

// Verificar método HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['error' => 'Method not allowed']));
}

// Verificar token
$received_token = $_GET['token'] ?? $_POST['token'] ?? '';
if ($received_token !== $EXPECTED_TOKEN) {
    http_response_code(401);
    log_msg("❌ Acesso negado: token inválido");
    die(json_encode(['error' => 'Unauthorized']));
}

log_msg("✅ Webhook recebido com token válido");

// ============================================================================
// DEPLOY
// ============================================================================

http_response_code(200);
header('Content-Type: application/json');

$response = [
    'status' => 'deploying',
    'steps' => []
];

try {
    // Step 1: Git Pull
    log_msg("📥 Step 1: Git Pull");
    $result = exec_cmd("cd $PROJECT_DIR && git pull origin main 2>&1");
    if (!$result['success']) {
        throw new Exception("Git pull falhou: " . $result['output']);
    }
    log_msg("✓ Git pull bem-sucedido");
    $response['steps'][] = ['name' => 'git_pull', 'status' => 'success'];
    
    // Step 2: pnpm install
    log_msg("📦 Step 2: pnpm install");
    $result = exec_cmd("cd $PROJECT_DIR && pnpm install 2>&1");
    if (!$result['success']) {
        throw new Exception("pnpm install falhou: " . $result['output']);
    }
    log_msg("✓ pnpm install bem-sucedido");
    $response['steps'][] = ['name' => 'pnpm_install', 'status' => 'success'];
    
    // Step 3: Build
    log_msg("🔨 Step 3: Build");
    $result = exec_cmd("cd $PROJECT_DIR && pnpm run build 2>&1");
    if (!$result['success']) {
        throw new Exception("Build falhou: " . $result['output']);
    }
    log_msg("✓ Build bem-sucedido");
    $response['steps'][] = ['name' => 'build', 'status' => 'success'];
    
    // Step 4: Verificar dist/public
    log_msg("🔍 Step 4: Verificar dist/public");
    if (!is_dir($DIST_DIR)) {
        throw new Exception("Pasta dist/public não encontrada após build");
    }
    if (!is_file($DIST_DIR . '/index.html')) {
        throw new Exception("index.html não encontrado em dist/public");
    }
    log_msg("✓ dist/public verificado");
    $response['steps'][] = ['name' => 'verify_dist', 'status' => 'success'];
    
    // Step 5: Backup
    log_msg("💾 Step 5: Backup");
    $backup_dir = $PROJECT_DIR . '/public_backup_' . date('YmdHis');
    if (is_dir($PUBLIC_DIR)) {
        if (!cp_rf($PUBLIC_DIR, $backup_dir)) {
            throw new Exception("Erro ao fazer backup");
        }
        rm_rf($PUBLIC_DIR);
        log_msg("✓ Backup criado: " . basename($backup_dir));
    }
    $response['steps'][] = ['name' => 'backup', 'status' => 'success'];
    
    // Step 6: Deploy
    log_msg("📂 Step 6: Deploy");
    if (!cp_rf($DIST_DIR, $PUBLIC_DIR)) {
        throw new Exception("Erro ao copiar arquivos para public");
    }
    log_msg("✓ Arquivos copiados para public");
    $response['steps'][] = ['name' => 'deploy', 'status' => 'success'];
    
    // Step 7: Verificação Final
    log_msg("✅ Step 7: Verificação Final");
    if (!is_file($PUBLIC_DIR . '/index.html')) {
        throw new Exception("Verificação falhou: index.html não encontrado em public");
    }
    log_msg("✓ Verificação bem-sucedida");
    $response['steps'][] = ['name' => 'verify_final', 'status' => 'success'];
    
    // Success
    $response['status'] = 'success';
    $response['message'] = 'Deploy concluído com sucesso!';
    $response['site_url'] = 'https://rres.com.br';
    log_msg("🎉 Deploy concluído com sucesso!");
    
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['error'] = $e->getMessage();
    log_msg("❌ Erro durante deploy: " . $e->getMessage());
    http_response_code(500);
}

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>
