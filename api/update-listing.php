<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

ob_start();
error_log('update-listing.php started at ' . date('Y-m-d H:i:s'));

try {
    $dbFileOptions = ['../db.php', 'db.php', './db.php'];
    $dbFileFound = false;
    foreach ($dbFileOptions as $dbFile) {
        if (file_exists($dbFile)) {
            $dbFileFound = true;
            include $dbFile;
            error_log("Using db.php from: $dbFile");
            break;
        }
    }
    if (!$dbFileFound) {
        throw new Exception("Database file not found in any location: " . implode(', ', $dbFileOptions));
    }

    if (!$conn) {
        throw new Exception("Database connection failed: " . (isset($conn->connect_error) ? $conn->connect_error : 'No connection object'));
    }

    session_start();
    $userId = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;
    if (!$userId) {
        error_log('User not logged in, userId: ' . var_export($userId, true));
        echo json_encode(['success' => false, 'error' => 'User not logged in']);
        ob_end_flush();
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    error_log('Received data: ' . print_r($data, true));

    if (!isset($data['id'], $data['Title'], $data['City'], $data['Price'], $data['Deal_Type'], $data['Rooms'])) {
        error_log('Missing required fields, data: ' . print_r($data, true));
        echo json_encode(['success' => false, 'error' => 'Required fields are missing']);
        ob_end_flush();
        exit;
    }

    $id = (int)$data['id'];
    $title = $conn->real_escape_string($data['Title']);
    $description = isset($data['Description']) ? $conn->real_escape_string($data['Description']) : null;
    $city = $conn->real_escape_string($data['City']);
    $price = floatval($data['Price']);
    $dealType = $conn->real_escape_string($data['Deal_Type']);
    $rooms = intval($data['Rooms']);
    $floor = isset($data['Floor']) ? intval($data['Floor']) : null;
    $address = isset($data['Address']) ? $conn->real_escape_string($data['Address']) : null;

    $checkQuery = "SELECT user_id FROM listings WHERE Ad_ID = ?";
    $checkStmt = $conn->prepare($checkQuery);
    if (!$checkStmt) {
        throw new Exception("Prepare failed (check): " . $conn->error);
    }
    $checkStmt->bind_param("i", $id);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    $listing = $checkResult->fetch_assoc();
    $checkStmt->close();

    if (!$listing) {
        error_log("Listing with ID $id not found");
        echo json_encode(['success' => false, 'error' => 'Listing not found']);
        ob_end_flush();
        exit;
    }

    if ($listing['user_id'] !== $userId && $_SESSION['role_id'] !== 3) {
        error_log("Unauthorized access for user $userId to listing $id");
        echo json_encode(['success' => false, 'error' => 'Unauthorized access']);
        ob_end_flush();
        exit;
    }

    $query = "UPDATE listings SET Title = ?, Description = ?, City = ?, Price = ?, Deal_Type = ?, Rooms = ?, Floor = ?, Address = ? WHERE Ad_ID = ?";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        throw new Exception("Prepare failed (update): " . $conn->error);
    }

    $stmt->bind_param("sssdsiisi", $title, $description, $city, $price, $dealType, $rooms, $floor, $address, $id);
    if ($stmt->execute()) {
        error_log("Listing $id updated successfully by user $userId");
        echo json_encode(['success' => true]);
    } else {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    error_log("Exception in update-listing.php: " . $e->getMessage());
    ob_clean();
    echo json_encode(['success' => false, 'error' => 'Internal server error: ' . $e->getMessage()]);
} finally {
    ob_end_flush();
    exit;
}
?>