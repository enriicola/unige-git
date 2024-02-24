<?php
   
   require("../../db/database.php");


    $cyphpasswd = password_hash($_POST['pass'], PASSWORD_DEFAULT);		


    try {
        $result = $mysqli->prepare("SELECT * FROM userdata WHERE email LIKE ?");
        $result->bind_param('s', $_POST['email']);
        if ($result->execute()) {
            $result->store_result();
        } else throw new Exception("errore in execute");
    } catch (Exception $e) {
        echo $e->getMessage();
    }

    if ($result->num_rows > 0) {
        $mysqli->close();
        $result->close();
        echo "<h2 class=regfailed> utente gia' esistente </h2>";
    } else {
        $init_img = "https://e7.pngegg.com/pngimages/355/848/png-clipart-computer-icons-user-profile-google-account-s-icon-account-miscellaneous-sphere-thumbnail.png";
        $init_bio = "nessuna bio inserita";
        $init_newsletter = "on";
        try {
            $result = $mysqli->prepare("INSERT INTO userdata (firstname, lastname, email, passwordd, bio, img, newsletter) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $result->bind_param('sssssss', $_POST['firstname'], $_POST['lastname'], $_POST['email'], $cyphpasswd, $init_bio, $init_img, $init_newsletter);
            if (!$result->execute()) throw new Exception("erroe in execute");
            $mysqli->close();
            $result->close();
        } catch (Exception $e) {
            echo $e->getMessage();
        }
        header("Location: homepage.php");
    }

?>