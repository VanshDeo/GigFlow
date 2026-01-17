<?php

require_once __DIR__ . '/BaseModel.php';
require_once __DIR__ . '/User.php'; // Required for freelancer_name/email joins

class Bid extends BaseModel {
    protected static $tableName = 'bids';

    public $id;
    public $gig_id;
    public $freelancer_id;
    public $message;
    public $price;
    public $status;
    public $created_at;
    public $updated_at;

    public static function findWithFreelancer(array $conditions = [], string $orderBy = null) {
        $instance = new static();
        $query = "SELECT b.*, u.name AS freelancer_name, u.email AS freelancer_email FROM " . static::$tableName . " b JOIN users u ON b.freelancer_id = u.id";
        $whereClauses = [];
        $params = [];

        foreach ($conditions as $key => $value) {
            $whereClauses[] = "b.`{$key}` = ?";
            $params[] = $value;
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
