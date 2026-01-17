<?php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/jwt.php';

class AuthController {
    public static function registerUser() {
        $input = json_decode(file_get_contents('php://input'), true);
        $name = $input['name'] ?? null;
        $email = $input['email'] ?? null;
        $password = $input['password'] ?? null;

        if (empty($name) || empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(['message' => 'Please enter all fields']);
            exit();
        }

        $userExists = User::findOne(['email' => $email]);

        if ($userExists) {
            http_response_code(400);
            echo json_encode(['message' => 'User already exists']);
            exit();
        }

        $user = User::create(['name' => $name, 'email' => $email, 'password' => $password]);

        if ($user) {
            generateToken($user->id);
            http_response_code(201);
            echo json_encode([
                '_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]);
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid user data']);
        }
        exit();
    }

    public static function loginUser() {
        $input = json_decode(file_get_contents('php://input'), true);
        $email = $input['email'] ?? null;
        $password = $input['password'] ?? null;

        if (empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(['message' => 'Please enter all fields']);
            exit();
        }

        $user = User::findByEmail($email);

        if ($user && $user->matchPassword($password)) {
            generateToken($user->id);
            http_response_code(200);
            echo json_encode([
                '_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['message' => 'Invalid email or password']);
        }
        exit();
    }

    public static function logoutUser() {
        setcookie('jwt', '', [
            'expires' => time() - 3600, // Expire in the past
            'path' => '/',
            'domain' => '',
            'secure' => (($_ENV['NODE_ENV'] ?? 'development') !== 'development'),
            'httponly' => (($_ENV['NODE_ENV'] ?? 'development') !== 'development'),
            'samesite' => 'Strict',
        ]);
        http_response_code(200);
        echo json_encode(['message' => 'Logged out successfully']);
        exit();
    }
}
