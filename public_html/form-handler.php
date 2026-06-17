<?php
/**
 * RR Engenharia — Handler do formulário de contato
 * Recebe o POST do formulário, valida, envia e-mail para contato@rres.com.br
 * e redireciona para a página de obrigado (gatilho de conversão no GA4).
 */

$DESTINO = 'contato@rres.com.br';

// Só aceita POST
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Location: /contato.html');
    exit;
}

// Honeypot anti-spam: bots preenchem o campo oculto "website"
if (!empty($_POST['website'])) {
    header('Location: /obrigado.html'); // descarta silenciosamente
    exit;
}

function limpar($s) {
    return trim(strip_tags((string)($s ?? '')));
}

$nome     = limpar($_POST['nome'] ?? '');
$empresa  = limpar($_POST['empresa'] ?? '');
$email    = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$telefone = limpar($_POST['telefone'] ?? '');
$servico  = limpar($_POST['servico'] ?? '');
$mensagem = limpar($_POST['mensagem'] ?? '');
$origem   = limpar($_POST['origem'] ?? '');

// Validação mínima
$erros = array();
if ($nome === '')                                   $erros[] = 'nome';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))     $erros[] = 'email';
if ($mensagem === '' && $servico === '')            $erros[] = 'detalhe';

if (!empty($erros)) {
    header('Location: /contato.html?erro=1');
    exit;
}

$assunto = 'Novo lead do site - ' . ($servico !== '' ? $servico : 'Contato');

$corpo  = "Novo contato pelo site rres.com.br\n";
$corpo .= "----------------------------------------\n";
$corpo .= "Nome:     $nome\n";
$corpo .= "Empresa:  $empresa\n";
$corpo .= "E-mail:   $email\n";
$corpo .= "Telefone: $telefone\n";
$corpo .= "Servico:  $servico\n";
$corpo .= "Origem:   $origem\n";
$corpo .= "----------------------------------------\n";
$corpo .= "Mensagem:\n$mensagem\n";

// Remetente = caixa REAL no mesmo domínio (evita rejeição por sender inexistente).
// 5o parametro (-f) define o envelope sender, importante para SPF/entrega.
$headers  = "From: RR Engenharia <contato@rres.com.br>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$assuntoEnc = '=?UTF-8?B?' . base64_encode($assunto) . '?=';
$enviado = @mail($DESTINO, $assuntoEnc, $corpo, $headers, '-f contato@rres.com.br');

if (!$enviado) {
    // Se o mail() falhar, registra para diagnóstico (visível em /erros-form.log no servidor).
    @error_log(date('c') . " | FALHA mail() | $email | $servico\n", 3, __DIR__ . '/erros-form.log');
}

header('Location: /obrigado.html');
exit;
