<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

include 'db.php';

$search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';
$query = "SELECT User_ID AS id, username, email, Role_ID AS role, Registration_date FROM users";
if (!empty($search)) {
    $query .= " WHERE username LIKE '%$search%' OR email LIKE '%$search%'";
}
$result = $conn->query($query);

if (!$result) {
    die(json_encode(['error' => 'Query failed: ' . $conn->error]));
}

$users = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
} else {
    echo json_encode(['message' => 'No users found']);
}

echo json_encode($users);

$result->close();
$conn->close();
?>