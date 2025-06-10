<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include 'db.php';

$adId = isset($_GET['adId']) ? (int)$_GET['adId'] : 0;

$query = "SELECT c.Comment_ID, c.Comment_text, c.Uploaded, u.username, u.email 
          FROM comment c 
          LEFT JOIN Users u ON c.User_ID = u.User_ID 
          WHERE c.Ad_ID = ? 
          ORDER BY c.Uploaded DESC";
$stmt = $conn->prepare($query);
$stmt->bind_param('i', $adId);
$stmt->execute();
$result = $stmt->get_result();

$comments = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $comments[] = [
            'Comment_ID' => (int)$row['Comment_ID'],
            'Comment_Text' => $row['Comment_text'],
            'Uploaded' => $row['Uploaded'],
            'username' => $row['username'],
            'email' => $row['email']
        ];
    }
}

echo json_encode($comments);

$stmt->close();
$conn->close();
?>