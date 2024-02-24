<?php
    session_start();
    unset($_SESSION['id']);
    session_destroy();
    
    echo "<h3>Logout eseguito correttamente</h3>";
    header("Location: homepage.php");
?>