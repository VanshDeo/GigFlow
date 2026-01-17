<?php

require_once __DIR__ . '/BaseModel.php';
require_once __DIR__ . '/User.php'; // Required for owner_name/email joins

class Gig extends BaseModel {
    protected static $tableName = 'gigs';

    public $id;
    public $title;
    public $description;
    public $budget;
    public $owner_id;
    public $status;
    public $created_at;
    public $updated_at;

    public static function findWithUser(array $conditions = [], string $orderBy = null) {
        $instance = new static();
        $query = "SELECT g.*, u.name AS owner_name, u.email AS owner_email FROM " . static::$tableName . " g JOIN users u ON g.owner_id = u.id";
        $whereClauses = [];
        $params = [];

        foreach ($conditions as $key => $value) {
            if ($key === 'title' && is_array($value) && isset($value['$regex'])) {
                $whereClauses[] = "g.title REGEXP ?";
                $params[] = $value['$regex'];
            } else {
                $whereClauses[] = "g.`{$key}` = ?";
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

    public static function findByIdWithUser($id) {
        $instance = new static();
        $stmt = $instance->pdo->prepare("SELECT g.*, u.name AS owner_name, u.email AS owner_email FROM " . static::$tableName . " g JOIN users u ON g.owner_id = u.id WHERE g.id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
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
        // Needed for compatibility when fetching from DB directly as array and casting to object
        return null;
    }
}
