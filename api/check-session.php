<?php
session_start();
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

include 'db.php';

error_log('Checking session - $_SESSION: ' . print_r($_SESSION, true));

if (isset($_SESSION['user_id'])) {
    $user_id = (int)$_SESSION['user_id'];
    $query = "SELECT User_ID, username, Role_ID FROM Users WHERE User_ID = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $response = [
            "success" => true,
            "user_id" => (int)$user['User_ID'],
            "username" => $user['username'],
            "role" => (int)$user['Role_ID']
        ];
        error_log('Session response: ' . print_r($response, true));
        echo json_encode($response);
    } else {
        error_log('User not found in DB for user_id: ' . $user_id);
        echo json_encode(["success" => false]);
        session_destroy();
    }

    $stmt->close();
} else {
    error_log('No user_id in session');
    echo json_encode(["success" => false]);
}

$conn->close();
?>