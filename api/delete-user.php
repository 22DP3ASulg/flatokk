<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

ob_start();
error_log('delete-user.php started at ' . date('Y-m-d H:i:s'));

try {
    include 'db.php';

    if (!$conn) {
        throw new Exception("Database connection failed: " . (isset($conn->connect_error) ? $conn->connect_error : 'No connection object'));
    }

    session_start();
    error_log('Session user_id: ' . ($_SESSION['user_id'] ?? 'null') . ', role: ' . ($_SESSION['role'] ?? 'null'));

    if (!isset($_SESSION['user_id']) || !isset($_SESSION['role']) || $_SESSION['role'] != 3) {
        error_log('Permission denied for user_id: ' . ($_SESSION['user_id'] ?? 'null'));
        echo json_encode(['success' => false, 'error' => 'Permission denied']);
        ob_end_flush();
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $data['userId'] ?? null;
    error_log('Received userId: ' . ($userId ?? 'null'));

    if (!$userId) {
        error_log('User ID is required, received: ' . json_encode($data));
        echo json_encode(['success' => false, 'error' => 'User ID is required']);
        ob_end_flush();
        exit;
    }

    if ((int)$_SESSION['user_id'] === (int)$userId) {
        error_log('Attempt to delete own account, userId: ' . $userId);
        echo json_encode(['success' => false, 'error' => 'Cannot delete your own account']);
        ob_end_flush();
        exit;
    }

    $conn->begin_transaction();

    try {
        $deleteCommentsQuery = "DELETE FROM comment WHERE User_ID = ?";
        $stmtComments = $conn->prepare($deleteCommentsQuery);
        if (!$stmtComments) {
            throw new Exception("Prepare failed (comments): " . $conn->error);
        }
        $stmtComments->bind_param('i', $userId);
        $stmtComments->execute();
        $stmtComments->close();

        $deleteListingsQuery = "DELETE FROM listings WHERE user_id = ?";
        $stmtListings = $conn->prepare($deleteListingsQuery);
        if (!$stmtListings) {
            throw new Exception("Prepare failed (listings): " . $conn->error);
        }
        $stmtListings->bind_param('i', $userId);
        $stmtListings->execute();
        $stmtListings->close();

        $query = "DELETE FROM Users WHERE User_ID = ?";
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Prepare failed (users): " . $conn->error);
        }
        $stmt->bind_param('i', $userId);

        if ($stmt->execute()) {
            error_log("User $userId deleted successfully by user_id: " . $_SESSION['user_id']);
            $conn->commit();
            echo json_encode(['success' => true]);
        } else {
            throw new Exception("Execute failed (users): " . $stmt->error);
        }

        $stmt->close();
    } catch (Exception $e) {
        $conn->rollback();
        throw new Exception("Transaction failed: " . $e->getMessage());
    }

    $conn->close();

} catch (Exception $e) {
    error_log("Exception in delete-user.php: " . $e->getMessage());
    ob_clean();
    echo json_encode(['success' => false, 'error' => 'Internal server error: ' . $e->getMessage()]);
} finally {
    ob_end_flush();
    exit;
}
?>