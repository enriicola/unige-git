<?php
$db_host = 'db';
$db_username = 'root';
$db_password = 'password';
$db_name = 'course';
$connection = mysqli_connect($db_host, $db_username, $db_password, $db_name);
$n = $_GET['name'];
$query = "SELECT * FROM Courses WHERE name='$n';";
$results = mysqli_query($connection, $query);
while($row = mysqli_fetch_array($results)) {
    print_r($row);
}
