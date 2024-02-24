<?php
    require("../../db/database.php");
    session_start();

    try {
        $result = $mysqli->prepare("SELECT id, passwordd FROM userdata WHERE email LIKE ?");
        $result->bind_param('s', $_POST['email']);
        if ($result->execute()) {
            $result->store_result();
            $result->bind_result($idrow, $passwordrow); 
        } else throw new Exception("erroe in execute");
    } catch (Exception $e) {
        echo $e->getMessage();
    }
    
    if ($result->num_rows == 1) {
        $result->fetch(); 
        if (password_verify($_POST['pass'], $passwordrow)) {
            if ($idrow == 1) $_SESSION['admin'] = 1;
            $_SESSION['id'] = $idrow;
            $result->close();
            $mysqli->close();
            echo "login ok";
            header("Location: show_profile.php");
        }
    } 

    $result->close();
    $mysqli->close();

    echo "<h2 class=loginfailed> login fallito :'C</h2>";
?>