<?php

    require("../../db/database.php");


    $result = $mysqli->prepare("SELECT * FROM userdata WHERE email LIKE ?");
    $result->bind_param("s", $_GET['email']);
    if (!$result->execute()) throw new Exception("errore in execute");
    $result->store_result();
    
    if ($result->num_rows == 0) echo "SI";
    else echo "NO";

    $result->close();
    $mysqli->close();


?>

