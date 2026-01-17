<?php

require_once __DIR__ . '/../models/Gig.php';
require_once __DIR__ . '/../models/User.php';

class GigController {
    public static function getGigs() {
        $keyword = $_GET['keyword'] ?? null;
        $conditions = ['status' => 'open'];

        if ($keyword) {
            $conditions['title'] = ['$regex' => $keyword];
        }

        $gigsData = Gig::findWithUser($conditions);
        $gigs = array_map(function($gig) {
            return [
                '_id' => $gig['id'],
                'title' => $gig['title'],
                'description' => $gig['description'],
                'budget' => (float)$gig['budget'],
                'ownerId' => [
                    '_id' => $gig['owner_id'],
                    'name' => $gig['owner_name'],
                    'email' => $gig['owner_email']
                ],
                'status' => $gig['status'],
                'createdAt' => $gig['created_at'],
                'updatedAt' => $gig['updated_at']
            ];
        }, $gigsData);

        http_response_code(200);
        echo json_encode($gigs);
        exit();
    }

    public static function createGig() {
        $input = json_decode(file_get_contents('php://input'), true);
        $title = $input['title'] ?? null;
        $description = $input['description'] ?? null;
        $budget = $input['budget'] ?? null;

        if (empty($title) || empty($description) || empty($budget)) {
            http_response_code(400);
            echo json_encode(['message' => 'Please add all fields']);
            exit();
        }

        $user = $_SERVER['user']; // Set by authMiddleware

        $gigData = [
            'title' => $title,
            'description' => $description,
            'budget' => (float)$budget,
            'owner_id' => $user->id,
            'status' => 'open',
        ];

        $createdGig = Gig::create($gigData);

        http_response_code(201);
        echo json_encode([
            '_id' => $createdGig['id'],
            'title' => $createdGig['title'],
            'description' => $createdGig['description'],
            'budget' => (float)$createdGig['budget'],
            'ownerId' => $createdGig['owner_id'],
            'status' => $createdGig['status'],
            'createdAt' => $createdGig['created_at'],
            'updatedAt' => $createdGig['updated_at']
        ]);
        exit();
    }

    public static function getMyGigs() {
        $user = $_SERVER['user']; // Set by authMiddleware
        $gigsData = Gig::find(['owner_id' => $user->id], 'created_at DESC');

        $gigs = array_map(function($gig) {
            return [
                '_id' => $gig['id'],
                'title' => $gig['title'],
                'description' => $gig['description'],
                'budget' => (float)$gig['budget'],
                'ownerId' => $gig['owner_id'],
                'status' => $gig['status'],
                'createdAt' => $gig['created_at'],
                'updatedAt' => $gig['updated_at']
            ];
        }, $gigsData);

        http_response_code(200);
        echo json_encode($gigs);
        exit();
    }

    public static function getGigById($id) {
        $gig = Gig::findByIdWithUser($id);

        if ($gig) {
            http_response_code(200);
            echo json_encode([
                '_id' => $gig['id'],
                'title' => $gig['title'],
                'description' => $gig['description'],
                'budget' => (float)$gig['budget'],
                'ownerId' => [
                    '_id' => $gig['owner_id'],
                    'name' => $gig['owner_name'],
                    'email' => $gig['owner_email']
                ],
                'status' => $gig['status'],
                'createdAt' => $gig['created_at'],
                'updatedAt' => $gig['updated_at']
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Gig not found']);
        }
        exit();
    }
}
