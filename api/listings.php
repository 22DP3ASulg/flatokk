<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include 'db.php';

$query = "SELECT l.Ad_ID, l.user_id, l.Title, l.Description, l.City, l.Price, l.Deal_Type, l.Rooms, l.Floor, l.Address, u.username, u.email 
          FROM listings l 
          LEFT JOIN Users u ON l.user_id = u.User_ID";
$result = $conn->query($query);

$listings = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $listings[] = [
            'Ad_ID' => (int)$row['Ad_ID'],
            'user_id' => (int)$row['user_id'],
            'Title' => $row['Title'],
            'Description' => $row['Description'],
            'City' => $row['City'],
            'Price' => (float)$row['Price'],
            'Deal_Type' => $row['Deal_Type'],
            'Rooms' => (int)$row['Rooms'],
            'Floor' => $row['Floor'] ? (int)$row['Floor'] : null,
            'Address' => $row['Address'],
            'username' => $row['username'],
            'email' => $row['email']
        ];
    }
}

echo json_encode($listings);

$result->free();
$conn->close();
?>