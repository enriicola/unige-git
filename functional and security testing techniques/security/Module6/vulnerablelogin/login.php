<?php
// Original code by Andrea Valenza (thanks!)

// connection to the database
// FIXME: db credentials should not be stored in clear text on PHP files
$conn = new mysqli('db', 'root', 'password', 'course');

// retrieving user's credentials
$username = $_POST['username'];
$password = $_POST['password'];

// query execution
// FIXME: the following row is vulnerable
// $results = $conn->query("SELECT * FROM Students WHERE username = '$username' AND password = '$password'");
// $results = $conn->query("SELECT * FROM Students WHERE username = '$username' AND password = '' or '1'='1'");
$results = $conn->query("SELECT * FROM Students WHERE username = ? AND password = ?", [$username, $password]);

// check if any rows were returned
// FIXME: the number of rows should be 1, not other values
if ($results->num_rows > 0) {
    // display a welcome message if login was successful
    $row = $results->fetch_assoc();
    $username = $row['username'];
    $email = $row['email'];
    echo "Login successful! Welcome $username ($email)!";
} else {
    // otherwise, display a generic error message
    echo "Invalid username or password";
}

// close the db connection
$conn->close();
