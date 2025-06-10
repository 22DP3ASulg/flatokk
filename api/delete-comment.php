<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

include 'db.php';

session_start();

if (!isset($_SESSION['user_id']) || !isset($_SESSION['role']) || $_SESSION['role'] != 3) {
    echo json_encode(['success' => false, 'error' => 'Admin access required']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$commentId = $data['commentId'] ?? 0;

if (!$commentId) {
    echo json_encode(['success' => false, 'error' => 'Comment ID is required']);
    exit;
}

$query = "DELETE FROM comment WHERE Comment_ID = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param('i', $commentId);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Comment not found']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to delete comment: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>