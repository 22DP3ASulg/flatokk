# Welcome to FlatOK, a web-based real estate management system designed to allow users to manage property listings, register, log in, and interact with the platform. Administrators have additional privileges to oversee users and listings.

Overview
FlatOK provides a user-friendly interface for:

    Viewing and managing property listings (create, edit, delete).
    User registration and login with role-based access (regular users and admins).
    Commenting on listings.
    Admin panel for user and listing management.
    Theme toggling (light/dark mode).
The system is built using modern web technologies and runs on a local server environment.

Features
    User Management: Register, log in, and manage user accounts with role-based access (e.g., admin role with Role_ID = 3).
    Listing Management: Create, edit, and delete property listings with details like title, city, price, and more.
    Comment System: Add and view comments on listings.
    Admin Panel: Filter and delete users, manage listings.
    Responsive Design: Supports theme switching and basic navigation.
    Search Functionality: Search users by username or email in the admin panel.
Technologies Used
    Frontend: HTML, CSS, JavaScript
    Backend: PHP (version 8.2.12)
    Database: MySQL (version 8.0.31) via XAMPP (version 8.2.12)
    Server: Apache (included in XAMPP)
    API: Custom RESTful endpoints for user and listing management
Installation
Prerequisites
    XAMPP (version 8.2.12 or higher)
    Web browser (e.g., Chrome, Firefox)
    Basic knowledge of PHP, MySQL, and JavaScript
Steps
    Install XAMPP:
    Download and install XAMPP 8.2.12 from the official website.
    Start Apache and MySQL services from the XAMPP control panel.
Set Up the Project:
    Clone or download this repository to your local machine.
    Place the project folder (e.g., flatok) in the XAMPP htdocs directory (e.g., C:\xampp\htdocs\flatok on Windows or /opt/lampp/htdocs/flatok on Linux).
Configure the Database:
    Open phpMyAdmin (http://localhost/phpmyadmin) in your browser.
    Create a new database named flatok_db.
    Import the SQL structure for the users table (see database schema below) or run the following SQL:

CREATE TABLE users (
    User_ID INT(11) NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    Registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    Role_ID INT(11) NOT NULL,
    PRIMARY KEY (User_ID)
);
Update db.php with your database credentials if different from the default (e.g., root with no password).
Run the Project:
    Open your browser and navigate to http://localhost/flatok/admin.html or http://localhost/flatok/mainp.html.
    Register a new user or log in with existing credentials. Use role_id = 3 for admin access.
Usage
As a Regular User
    Visit mainp.html to view listings as a guest.
    Register (registration.html) or log in (login.html) to access Main2.html.
    Create, edit, or delete your own listings.
    Add comments to listings.
As an Admin
    Log in with a user having Role_ID = 3 to access admin.html.
    Use the admin panel to:
    Filter users by name (A-Z, Z-A) or registration date.
    Search users by username or email.
    Delete users (except the current admin).
Theme Switching
    Click the "Toggle Theme" button in the header to switch between light and dark modes. The preference is saved in localStorage.
Database Schema

API Endpoints
    check-session.php: Checks user session status.
    register.php: Handles user registration.
    login.php: Authenticates users.
    logout.php: Logs out the user.
    users.php: Retrieves user list.
    listings.php: Fetches all listings.
    create-listing.php: Creates a new listing.
    update-listing.php: Updates an existing listing.
    delete-listing.php: Deletes a listing.
    delete-user.php: Deletes a user.
    comments.php: Retrieves comments for a listing.
    create-comment.php: Adds a new comment.
Contributing
Feel free to fork this repository and submit pull requests. Please ensure any changes are tested and documented.

License
This project is open-source under the MIT License. See the LICENSE file for details (if applicable).

Contact
For questions or support, contact the project maintainer via email or through the GitHub issues page.
