<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

include 'db.php';

session_start();
$userId = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;
if (!$userId) {
    echo json_encode(['success' => false, 'error' => 'User not logged in']);
    exit;
}

error_log('Creating listing with user_id: ' . $userId);

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['Title'], $data['City'], $data['Price'], $data['Deal_Type'], $data['Rooms'])) {
    echo json_encode(['success' => false, 'error' => 'Required fields are missing']);
    exit;
}

$title = $conn->real_escape_string($data['Title']);
$description = isset($data['Description']) ? $conn->real_escape_string($data['Description']) : null;
$city = $conn->real_escape_string($data['City']);
$price = floatval($data['Price']);
$dealType = $conn->real_escape_string($data['Deal_Type']);
$rooms = intval($data['Rooms']);
$floor = isset($data['Floor']) ? intval($data['Floor']) : null;
$address = isset($data['Address']) ? $conn->real_escape_string($data['Address']) : null;

$query = "INSERT INTO listings (user_id, Title, Description, City, Price, Deal_Type, Rooms, Floor, Address) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("isssdsiis", $userId, $title, $description, $city, $price, $dealType, $rooms, $floor, $address);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to create listing: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>