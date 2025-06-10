<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

include 'db.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'User not logged in']);
    exit;
}

$userId = (int)$_SESSION['user_id'];
$data = json_decode(file_get_contents('php://input'), true);
$adId = $data['adId'] ?? 0;
$commentText = $data['commentText'] ?? '';

if (!$adId || !$commentText) {
    echo json_encode(['success' => false, 'error' => 'Ad ID and comment text are required']);
    exit;
}

$query = "INSERT INTO comment (Ad_ID, User_ID, Comment_text, Uploaded) VALUES (?, ?, ?, NOW())";
$stmt = $conn->prepare($query);
$stmt->bind_param('iis', $adId, $userId, $commentText);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to add comment: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>