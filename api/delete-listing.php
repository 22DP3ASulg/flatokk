<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');


$rawData = file_get_contents('php://input');
error_log('Raw POST data: ' . $rawData);

$data = json_decode($rawData, true);
error_log('Decoded JSON data: ' . print_r($data, true));

include 'db.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Not logged in']);
    exit;
}

$user_id = (int)$_SESSION['user_id']; 
$role = (int)($_SESSION['role'] ?? 0);
$listing_id = $data['listingId'] ?? null;

error_log('Session user_id: ' . $user_id . ' (type: ' . gettype($user_id) . ')');
error_log('Session role: ' . $role . ' (type: ' . gettype($role) . ')');
error_log('Extracted listing_id: ' . $listing_id);

if (!$listing_id) {
    echo json_encode(['success' => false, 'error' => 'Listing ID is required']);
    exit;
}

$query = "SELECT user_id FROM listings WHERE Ad_ID = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param('i', $listing_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'error' => 'Listing not found']);
    exit;
}

$row = $result->fetch_assoc();
$listing_user_id = (int)$row['user_id'];

error_log('Listing user_id: ' . $listing_user_id . ' (type: ' . gettype($listing_user_id) . ')');
error_log('Comparing user_id: ' . $user_id . ' with listing_user_id: ' . $listing_user_id);
error_log('Is admin? ' . ($role == 3 ? 'Yes' : 'No'));
error_log('Is owner? ' . ($user_id == $listing_user_id ? 'Yes' : 'No'));

if ($user_id != $listing_user_id && $role != 3) {
    echo json_encode(['success' => false, 'error' => 'Permission denied']);
    exit;
}

$delete_query = "DELETE FROM listings WHERE Ad_ID = ?";
$delete_stmt = $conn->prepare($delete_query);
$delete_stmt->bind_param('i', $listing_id);

if ($delete_stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to delete listing']);
}

$delete_stmt->close();
$stmt->close();
$conn->close();
?>