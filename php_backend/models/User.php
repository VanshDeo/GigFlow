<?php

require_once __DIR__ . '/BaseModel.php';

class User extends BaseModel {
    protected static $tableName = 'users';

    public $id;
    public $name;
    public $email;
    public $password;
    public $created_at;
    public $updated_at;

    public static function create(array $data) {
        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        $createdUser = parent::create($data);
        
        $user = new User();
        foreach ($createdUser as $key => $value) {
            $user->$key = $value;
        }
        return $user;
    }

    public function matchPassword($enteredPassword) {
        return password_verify($enteredPassword, $this->password);
    }

    public static function findByEmail($email) {
        $instance = new static();
        $stmt = $instance->pdo->prepare("SELECT * FROM " . static::$tableName . " WHERE email = ?");
        $stmt->execute([$email]);
        $userData = $stmt->fetch();
        if ($userData) {
            $user = new User();
            foreach ($userData as $key => $value) {
                $user->$key = $value;
            }
            return $user;
        }
        return null;
    }

    public function __set($name, $value) {
        if (property_exists($this, $name)) {
            $this->$name = $value;
        }
    }

    public function __get($name) {
        if (property_exists($this, $name)) {
            return $this->$name;
        }
        return null;
    }
}
