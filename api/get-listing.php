<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

ob_start();
error_log('get-listing.php started for ID: ' . (isset($_GET['id']) ? $_GET['id'] : 'null'));

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

    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    error_log('Processing ID: ' . $id);
    if (!$id) {
        error_log('Missing ID parameter');
        echo json_encode(['success' => false, 'error' => 'Listing ID is missing']);
        ob_end_flush();
        exit;
    }

    $testQuery = $conn->query("SELECT 1");
    if (!$testQuery) {
        throw new Exception("Test query failed: " . $conn->error);
    }

    $query = "SELECT * FROM listings WHERE Ad_ID = ?";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $listing = $result->fetch_assoc();
        echo json_encode(['success' => true, 'listing' => $listing]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Listing not found']);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    error_log("Exception in get-listing.php: " . $e->getMessage());
    ob_clean();
    echo json_encode(['success' => false, 'error' => 'Internal server error: ' . $e->getMessage()]);
} finally {
    ob_end_flush();
    exit;
}
?>