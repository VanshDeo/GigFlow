<?php

require_once __DIR__ . '/../models/Bid.php';
require_once __DIR__ . '/../models/Gig.php';
require_once __DIR__ . '/../models/User.php';

class BidController {
    public static function createBid() {
        $input = json_decode(file_get_contents('php://input'), true);
        $gigId = $input['gigId'] ?? null;
        $message = $input['message'] ?? null;
        $price = $input['price'] ?? null;

        if (empty($gigId) || empty($message) || empty($price)) {
            http_response_code(400);
            echo json_encode(['message' => 'Please provide all fields']);
            exit();
        }

        $user = $_SERVER['user']; // Set by authMiddleware

        $gigData = Gig::findById($gigId);
        if (!$gigData) {
            http_response_code(404);
            echo json_encode(['message' => 'Gig not found']);
            exit();
        }
        $gig = new Gig();
        foreach ($gigData as $key => $value) {
            $gig->$key = $value;
        }

        if ($gig->owner_id == $user->id) {
            http_response_code(400);
            echo json_encode(['message' => 'Cannot bid on your own gig']);
            exit();
        }

        if ($gig->status !== 'open') {
            http_response_code(400);
            echo json_encode(['message' => 'Gig is not open for bidding']);
            exit();
        }

        $existingBid = Bid::findOne(['gig_id' => $gigId, 'freelancer_id' => $user->id]);
        if ($existingBid) {
            http_response_code(400);
            echo json_encode(['message' => 'You have already placed a bid on this gig']);
            exit();
        }

        $bidData = [
            'gig_id' => $gigId,
            'freelancer_id' => $user->id,
            'message' => $message,
            'price' => (float)$price,
            'status' => 'pending',
        ];

        $createdBid = Bid::create($bidData);

        http_response_code(201);
        echo json_encode([
            '_id' => $createdBid['id'],
            'gigId' => $createdBid['gig_id'],
            'freelancerId' => $createdBid['freelancer_id'],
            'message' => $createdBid['message'],
            'price' => (float)$createdBid['price'],
            'status' => $createdBid['status'],
            'createdAt' => $createdBid['created_at'],
            'updatedAt' => $createdBid['updated_at']
        ]);
        exit();
    }

    public static function getBidsByGigId($gigId) {
        $user = $_SERVER['user']; // Set by authMiddleware

        $gigData = Gig::findById($gigId);
        if (!$gigData) {
            http_response_code(404);
            echo json_encode(['message' => 'Gig not found']);
            exit();
        }
        $gig = new Gig();
        foreach ($gigData as $key => $value) {
            $gig->$key = $value;
        }

        if ($gig->owner_id != $user->id) {
            http_response_code(401);
            echo json_encode(['message' => 'Not authorized to view bids for this gig']);
            exit();
        }

        $bidsData = Bid::findWithFreelancer(['gig_id' => $gigId]);
        $bids = array_map(function($bid) {
            return [
                '_id' => $bid['id'],
                'gigId' => $bid['gig_id'],
                'freelancerId' => [
                    '_id' => $bid['freelancer_id'],
                    'name' => $bid['freelancer_name'],
                    'email' => $bid['freelancer_email']
                ],
                'message' => $bid['message'],
                'price' => (float)$bid['price'],
                'status' => $bid['status'],
                'createdAt' => $bid['created_at'],
                'updatedAt' => $bid['updated_at']
            ];
        }, $bidsData);

        http_response_code(200);
        echo json_encode($bids);
        exit();
    }

    public static function hireFreelancer($bidId) {
        $user = $_SERVER['user']; // Set by authMiddleware

        $bidData = Bid::findById($bidId);
        if (!$bidData) {
            http_response_code(404);
            echo json_encode(['message' => 'Bid not found']);
            exit();
        }
        $bid = new Bid();
        foreach ($bidData as $key => $value) {
            $bid->$key = $value;
        }

        $gigData = Gig::findById($bid->gig_id);
        if (!$gigData) {
            http_response_code(404);
            echo json_encode(['message' => 'Gig not found']);
            exit();
        }
        $gig = new Gig();
        foreach ($gigData as $key => $value) {
            $gig->$key = $value;
        }

        if ($gig->owner_id != $user->id) {
            http_response_code(401);
            echo json_encode(['message' => 'Not authorized to hire for this gig']);
            exit();
        }

        if ($gig->status !== 'open') {
            http_response_code(400);
            echo json_encode(['message' => 'Gig is already assigned']);
            exit();
        }

        // Atomic update logic
        // 1. Update chosen bid -> hired
        $bid->status = 'hired';
        $bid->save();

        // 2. Update gig -> assigned
        $gig->status = 'assigned';
        $gig->save();

        // 3. Update all other bids for this gig -> rejected
        Bid::updateMany(
            ['gig_id' => $gig->id, 'id' => ['$ne' => $bid->id]],
            ['status' => 'rejected']
        );

        http_response_code(200);
        echo json_encode(['message' => 'Freelancer hired successfully', 'bid' => [
            '_id' => $bid->id,
            'gigId' => $bid->gig_id,
            'freelancerId' => $bid->freelancer_id,
            'message' => $bid->message,
            'price' => (float)$bid->price,
            'status' => $bid->status,
            'createdAt' => $bid->created_at,
            'updatedAt' => $bid->updated_at
        ]]);
        exit();
    }
}
