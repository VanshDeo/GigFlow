<?php

require_once __DIR__ . '/../config/db.php';

abstract class BaseModel {
    protected static $tableName;
    protected static $idColumn = 'id';
    protected $pdo;

    public function __construct() {
        $this->pdo = connectDB();
    }

    public static function findById($id) {
        $instance = new static();
        $stmt = $instance->pdo->prepare("SELECT * FROM " . static::$tableName . " WHERE " . static::$idColumn . " = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public static function findOne(array $conditions) {
        $instance = new static();
        $query = "SELECT * FROM " . static::$tableName;
        $whereClauses = [];
        $params = [];

        foreach ($conditions as $key => $value) {
            $whereClauses[] = "`{$key}` = ?";
            $params[] = $value;
        }

        if (!empty($whereClauses)) {
            $query .= " WHERE " . implode(' AND ', $whereClauses);
        }

        $stmt = $instance->pdo->prepare($query);
        $stmt->execute($params);
        return $stmt->fetch();
    }

    public static function find(array $conditions = [], string $orderBy = null) {
        $instance = new static();
        $query = "SELECT * FROM " . static::$tableName;
        $whereClauses = [];
        $params = [];

        foreach ($conditions as $key => $value) {
            if (is_array($value)) { // For regex-like behavior or specific operators
                foreach ($value as $op => $val) {
                    switch ($op) {
                        case '$regex':
                            $whereClauses[] = "`{$key}` REGEXP ?";
                            $params[] = $val;
                            break;
                        case '$ne':
                            $whereClauses[] = "`{$key}` != ?";
                            $params[] = $val;
                            break;
                        // Add more operators as needed
                        default:
                            // Handle unrecognized operators or throw an error
                            break;
                    }
                }
            } else {
                $whereClauses[] = "`{$key}` = ?";
                $params[] = $value;
            }
        }

        if (!empty($whereClauses)) {
            $query .= " WHERE " . implode(' AND ', $whereClauses);
        }

        if ($orderBy) {
            $query .= " ORDER BY {$orderBy}";
        }

        $stmt = $instance->pdo->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function create(array $data) {
        $instance = new static();
        $columns = implode(', ', array_map(function($col){ return '`'.$col.'`'; }, array_keys($data)));
        $placeholders = implode(', ', array_fill(0, count($data), '?'));
        $query = "INSERT INTO " . static::$tableName . " ({$columns}) VALUES ({$placeholders})";
        $stmt = $instance->pdo->prepare($query);
        $stmt->execute(array_values($data));
        return static::findById($instance->pdo->lastInsertId());
    }

    public function save() {
        if (isset($this->id)) {
            $updates = [];
            $params = [];
            foreach (get_object_vars($this) as $key => $value) {
                if ($key !== static::$idColumn && $key !== 'pdo') {
                    $updates[] = "`{$key}` = ?";
                    $params[] = $value;
                }
            }
            $params[] = $this->id;

            $query = "UPDATE " . static::$tableName . " SET " . implode(', ', $updates) . " WHERE " . static::$idColumn . " = ?";
            $stmt = $this->pdo->prepare($query);
            $stmt->execute($params);
            return $this;
        } else {
            return false; // For new records, use static::create
        }
    }

    public static function updateMany(array $conditions, array $data) {
        $instance = new static();
        $setClauses = [];
        $setParams = [];
        foreach ($data as $key => $value) {
            $setClauses[] = "`{$key}` = ?";
            $setParams[] = $value;
        }

        $whereClauses = [];
        $whereParams = [];
        foreach ($conditions as $key => $value) {
            if (is_array($value) && isset($value['$ne'])) {
                $whereClauses[] = "`{$key}` != ?";
                $whereParams[] = $value['$ne'];
            } else {
                $whereClauses[] = "`{$key}` = ?";
                $whereParams[] = $value;
            }
        }

        $query = "UPDATE " . static::$tableName . " SET " . implode(', ', $setClauses);
        if (!empty($whereClauses)) {
            $query .= " WHERE " . implode(' AND ', $whereClauses);
        }

        $params = array_merge($setParams, $whereParams);
        $stmt = $instance->pdo->prepare($query);
        $stmt->execute($params);
        return $stmt->rowCount();
    }
}
