<?php

// Error Reporting (for development)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Load environment variables
require_once __DIR__ . '/config/db.php'; // This also triggers loadEnv

// Set headers for CORS and JSON response
header("Access-Control-Allow-Origin: {$_ENV['CLIENT_URL']}");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Content-Type: application/json");

// Handle OPTIONS request for CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include Controllers and Middleware
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/GigController.php';
require_once __DIR__ . '/controllers/BidController.php';
require_once __DIR__ . '/middleware/authMiddleware.php';

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Basic Routing
switch (true) {
    case $requestUri === '/api/auth/register':
        if ($requestMethod === 'POST') AuthController::registerUser();
        break;
    case $requestUri === '/api/auth/login':
        if ($requestMethod === 'POST') AuthController::loginUser();
        break;
    case $requestUri === '/api/auth/logout':
        if ($requestMethod === 'POST') AuthController::logoutUser();
        break;

    case $requestUri === '/api/gigs':
        if ($requestMethod === 'GET') GigController::getGigs();
        if ($requestMethod === 'POST') protect('GigController::createGig')();
        break;
    case $requestUri === '/api/gigs/my':
        if ($requestMethod === 'GET') protect('GigController::getMyGigs')();
        break;
    
    // Handle dynamic gig ID
    case (preg_match('/^\/api\/gigs\/(\d+)$/', $requestUri, $matches) ? true : false) :
        $gigId = $matches[1];
        if ($requestMethod === 'GET') GigController::getGigById($gigId);
        break;

    case $requestUri === '/api/bids':
        if ($requestMethod === 'POST') protect('BidController::createBid')();
        break;
    
    // Handle dynamic gig ID for bids list
    case (preg_match('/^\/api\/bids\/(\d+)$/', $requestUri, $matches) ? true : false) :
        $gigId = $matches[1];
        if ($requestMethod === 'GET') BidController::getBidsByGigId($gigId);
        break;
    case (preg_match('/^\/api\/bids\/(\d+)\/hire$/', $requestUri, $matches) ? true : false) :
        $bidId = $matches[1];
        if ($requestMethod === 'PATCH') protect('BidController::hireFreelancer')($bidId);
        break;

    case $requestUri === '/':
        http_response_code(200);
        echo json_encode(['message' => 'GigFlow API is running...']);
        exit();

    default:
        http_response_code(404);
        echo json_encode(['message' => 'Not Found - ' . $requestUri]);
        exit();
}

// Fallback error handler for any uncaught exceptions (e.g., from PDO)
set_exception_handler(function($exception) {
    $statusCode = 500;
    $message = 'Server Error';

    if ($exception instanceof PDOException) {
        // Specific handling for DB errors, avoid leaking details in production
        $message = 'Database operation failed.';
        // Log the actual error: error_log($exception->getMessage());
    } else if (strpos($exception->getMessage(), 'Not Found') !== false) {
        $statusCode = 404;
        $message = $exception->getMessage();
    } else if (strpos($exception->getMessage(), 'Not authorized') !== false) {
        $statusCode = 401;
        $message = $exception->getMessage();
    } else if (strpos($exception->getMessage(), 'Invalid') !== false || strpos($exception->getMessage(), 'exists') !== false || strpos($exception->getMessage(), 'fields') !== false) {
        $statusCode = 400;
        $message = $exception->getMessage();
    }

    http_response_code($statusCode);
    echo json_encode([
        'message' => $message,
        'stack' => (($_ENV['NODE_ENV'] ?? 'development') !== 'production') ? $exception->getTraceAsString() : null
    ]);
    exit();
});
