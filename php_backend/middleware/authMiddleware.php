<?php

require_once __DIR__ . '/../utils/jwt.php';
require_once __DIR__ . '/../models/User.php';

function protect($callback) {
    return function(...$args) use ($callback) {
        $token = $_COOKIE['jwt'] ?? null;

        if (!$token) {
            http_response_code(401);
            echo json_encode(['message' => 'Not authorized, no token']);
            exit();
        }

        try {
            $decoded = verifyToken($token);

            if (!$decoded || !isset($decoded['userId'])) {
                http_response_code(401);
                echo json_encode(['message' => 'Not authorized, token failed']);
                exit();
            }

            $user = User::findById($decoded['userId']);

            if (!$user) {
                http_response_code(401);
                echo json_encode(['message' => 'Not authorized, user not found']);
                exit();
            }

            // Attach user data to the request context (simulating req.user)
            $_SERVER['user'] = $user;

            return call_user_func_array($callback, $args);
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['message' => 'Not authorized, token failed', 'error' => $e->getMessage()]);
            exit();
        }
    };
}

