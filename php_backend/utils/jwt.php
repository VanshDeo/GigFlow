<?php

// Basic JWT implementation for demonstration. For production, use a robust library like firebase/php-jwt.

function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

function generateToken($userId) {
    $secret = $_ENV['JWT_SECRET'];
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode(['userId' => $userId, 'exp' => time() + (30 * 24 * 60 * 60)]); // 30 days expiration

    $base64UrlHeader = base64UrlEncode($header);
    $base64UrlPayload = base64UrlEncode($payload);

    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
    $base64UrlSignature = base64UrlEncode($signature);

    $token = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;

    // Set cookie
    $httpOnly = (($_ENV['NODE_ENV'] ?? 'development') !== 'development'); // Secure/httponly in production
    $sameSite = 'Strict';
    $maxAge = 30 * 24 * 60 * 60; // 30 days

    setcookie('jwt', $token, [
        'expires' => time() + $maxAge,
        'path' => '/',
        'domain' => '', // Set your domain if needed
        'secure' => $httpOnly,
        'httponly' => $httpOnly,
        'samesite' => $sameSite,
    ]);
}

function verifyToken($token) {
    $secret = $_ENV['JWT_SECRET'];

    @list($header, $payload, $signature) = explode('.', $token);

    if (!$header || !$payload || !$signature) {
        return false;
    }

    $expectedSignature = hash_hmac('sha256', $header . "." . $payload, $secret, true);
    $base64UrlExpectedSignature = base64UrlEncode($expectedSignature);

    if ($base64UrlExpectedSignature !== $signature) {
        return false; // Invalid signature
    }

    $decodedPayload = json_decode(base64UrlDecode($payload), true);

    if (isset($decodedPayload['exp']) && $decodedPayload['exp'] < time()) {
        return false; // Token expired
    }

    return $decodedPayload;
}
