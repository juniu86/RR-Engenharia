<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Diagnóstico público (sem auth) — acessível via browser
if (($_GET['action'] ?? '') === 'diag' && ($_GET['token'] ?? '') === 'rr2024') {
    $dataDir = __DIR__ . '/data';
    $dbFile  = $dataDir . '/proposals.db';
    $info = [
        'php_version'    => PHP_VERSION,
        'sqlite_version' => null,
        'dir'            => $dataDir,
        'dir_exists'     => is_dir($dataDir),
        'dir_writable'   => is_writable($dataDir),
        'db_exists'      => file_exists($dbFile),
        'db_size_bytes'  => file_exists($dbFile) ? filesize($dbFile) : 0,
        'proposals_count'=> null,
        'seq_counters'   => null,
        'last_proposals' => [],
        'error'          => null,
    ];
    try {
        if (!is_dir($dataDir)) mkdir($dataDir, 0755, true);
        $db = new PDO('sqlite:' . $dbFile);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $info['sqlite_version'] = $db->query('SELECT sqlite_version()')->fetchColumn();
        $db->exec("CREATE TABLE IF NOT EXISTS proposals (id TEXT PRIMARY KEY, numero TEXT, cliente_nome TEXT, total REAL, created_at TEXT, updated_at TEXT, data TEXT, show_line_prices INTEGER DEFAULT 1, revisao INTEGER, parent_id TEXT);
                   CREATE TABLE IF NOT EXISTS seq_counters (year INTEGER PRIMARY KEY, value INTEGER DEFAULT 39);");
        $info['proposals_count'] = (int) $db->query('SELECT COUNT(*) FROM proposals')->fetchColumn();
        $info['seq_counters']    = $db->query('SELECT * FROM seq_counters')->fetchAll(PDO::FETCH_ASSOC);
        $info['last_proposals']  = $db->query('SELECT id, numero, cliente_nome, created_at FROM proposals ORDER BY created_at DESC LIMIT 5')->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        $info['error'] = $e->getMessage();
    }
    echo json_encode($info, JSON_PRETTY_PRINT);
    exit;
}

// Auth
$token = $_SERVER['HTTP_X_AUTH_TOKEN'] ?? '';
if ($token !== 'rr2024') {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// DB setup
$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
    // Protect data directory from direct HTTP access
    file_put_contents($dataDir . '/.htaccess', "Order Allow,Deny\nDeny from all\n");
}

try {
    $db = new PDO('sqlite:' . $dataDir . '/proposals.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec("PRAGMA journal_mode=WAL;");
    $db->exec("
        CREATE TABLE IF NOT EXISTS proposals (
            id TEXT PRIMARY KEY,
            numero TEXT,
            cliente_nome TEXT,
            total REAL,
            created_at TEXT,
            updated_at TEXT,
            data TEXT,
            show_line_prices INTEGER DEFAULT 1,
            revisao INTEGER,
            parent_id TEXT
        );
        CREATE TABLE IF NOT EXISTS seq_counters (
            year INTEGER PRIMARY KEY,
            value INTEGER DEFAULT 39
        );
    ");
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    exit;
}

$action = $_GET['action'] ?? '';
$body = json_decode(file_get_contents('php://input'), true) ?? [];

try {
    switch ($action) {

        case 'list':
            $stmt = $db->query("SELECT * FROM proposals ORDER BY created_at DESC");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $proposals = array_map(function ($row) {
                return [
                    'id'             => $row['id'],
                    'numero'         => $row['numero'],
                    'clienteNome'    => $row['cliente_nome'],
                    'total'          => (float) $row['total'],
                    'createdAt'      => $row['created_at'],
                    'updatedAt'      => $row['updated_at'],
                    'data'           => json_decode($row['data'], true),
                    'showLinePrices' => (bool) $row['show_line_prices'],
                    'revisao'        => isset($row['revisao']) ? (int) $row['revisao'] : null,
                    'parentId'       => $row['parent_id'] ?? null,
                ];
            }, $rows);
            echo json_encode($proposals);
            break;

        case 'save':
            $p = $body;
            if (empty($p['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing id']);
                break;
            }
            $stmt = $db->prepare("
                INSERT INTO proposals (id, numero, cliente_nome, total, created_at, updated_at, data, show_line_prices, revisao, parent_id)
                VALUES (:id, :numero, :cliente_nome, :total, :created_at, :updated_at, :data, :show_line_prices, :revisao, :parent_id)
                ON CONFLICT(id) DO UPDATE SET
                    numero          = excluded.numero,
                    cliente_nome    = excluded.cliente_nome,
                    total           = excluded.total,
                    updated_at      = excluded.updated_at,
                    data            = excluded.data,
                    show_line_prices = excluded.show_line_prices,
                    revisao         = excluded.revisao,
                    parent_id       = excluded.parent_id
            ");
            $stmt->execute([
                ':id'              => $p['id'],
                ':numero'          => $p['numero'],
                ':cliente_nome'    => $p['clienteNome'],
                ':total'           => $p['total'],
                ':created_at'      => $p['createdAt'],
                ':updated_at'      => $p['updatedAt'],
                ':data'            => json_encode($p['data']),
                ':show_line_prices' => $p['showLinePrices'] ? 1 : 0,
                ':revisao'         => $p['revisao'] ?? null,
                ':parent_id'       => $p['parentId'] ?? null,
            ]);
            echo json_encode(['ok' => true]);
            break;

        case 'delete':
            $id = $body['id'] ?? '';
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing id']);
                break;
            }
            $stmt = $db->prepare("DELETE FROM proposals WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['ok' => true]);
            break;

        case 'peek_seq':
            $year = (int) ($_GET['year'] ?? date('Y'));
            $stmt = $db->prepare("SELECT value FROM seq_counters WHERE year = ?");
            $stmt->execute([$year]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $current = $row ? (int) $row['value'] : 39;
            echo json_encode(['next' => $current + 1]);
            break;

        case 'consume_seq':
            $year = (int) ($body['year'] ?? date('Y'));
            $db->exec("BEGIN IMMEDIATE");
            $stmt = $db->prepare("SELECT value FROM seq_counters WHERE year = ?");
            $stmt->execute([$year]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $current = $row ? (int) $row['value'] : 39;
            $next = $current + 1;
            $upsert = $db->prepare("
                INSERT INTO seq_counters (year, value) VALUES (?, ?)
                ON CONFLICT(year) DO UPDATE SET value = excluded.value
            ");
            $upsert->execute([$year, $next]);
            $db->exec("COMMIT");
            echo json_encode(['consumed' => $next]);
            break;

        default:
            http_response_code(404);
            echo json_encode(['error' => 'Unknown action']);
    }
} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->exec("ROLLBACK");
    }
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
