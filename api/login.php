<?php
session_start();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'error' => 'Email and password are required']);
    exit;
}

$stmt = $conn->prepare('SELECT User_ID, username, password, Role_ID FROM Users WHERE email = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'error' => 'Invalid email or password']);
    exit;
}

$user = $result->fetch_assoc();
if ($password !== $user['password']) {
    echo json_encode(['success' => false, 'error' => 'Invalid email or password']);
    exit;
}

$_SESSION['user_id'] = (int)$user['User_ID'];
$_SESSION['username'] = $user['username'];
$_SESSION['role'] = (int)$user['Role_ID'];

error_log('Login successful - Session set: user_id=' . $_SESSION['user_id'] . ', role=' . $_SESSION['role']);

$response = [
    'success' => true,
    'username' => $user['username'],
    'role_id' => (int)$user['Role_ID']
];
echo json_encode($response);

$stmt->close();
$conn->close();
?>