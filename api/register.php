<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$conn = new mysqli('localhost', 'root', '', 'flatok');
if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed']));
}

$data = json_decode(file_get_contents('php://input'), true);
$username = trim($data['username'] ?? '');
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

if (empty($username) || empty($email) || empty($password)) {
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

$stmt = $conn->prepare('SELECT User_ID FROM Users WHERE email = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(['error' => 'Email already exists']);
    exit;
}
$stmt->close();

$stmt = $conn->prepare('INSERT INTO Users (username, email, password, Role_ID) VALUES (?, ?, ?, 2)');
$stmt->bind_param('sss', $username, $email, $password);
if ($stmt->execute()) {
    echo json_encode(['success' => 'Registration successful']);
} else {
    echo json_encode(['error' => 'Registration failed']);
}
$stmt->close();
$conn->close();
?>