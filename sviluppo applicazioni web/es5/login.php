<!DOCTYPE html>
<html lang="it">
<head>
    <title>Log-In</title>
</head>
<body>
<?php
    $mail = $_POST['email'];
    $pass = $_POST['pass'];

    // $users = fopen("users.txt", "a") or die("Unable to open file!");
    // flock($users,LOCK_EX);
    // while(!feof($users)) {
    //     $line = fgets($users);
    //     if($line == $mail){
    //         // flock($users,LOCK_UN);
    //         echo "Bentornato $mail";
    //         fclose($users);
    //         header("Refresh: 2; index.html");
    //     }
    // }

    /////////////////////////////////////
    $users = file ('users.txt');///////////

    $success = false;
    foreach ($users as $user) {
        $user_details = explode('|', $user);
        if ($user_details[2] == $mail && $user_details[3] == $pass) {
            $success = true;
            $mail = $user_details[2];
            $pass = $user_details[3];
            break;
        }
    }
    if ($success)
        echo "<br> Hi $mail you have been logged in. <br>";
    else
        echo "<br> You have entered the wrong username or password. Please try again. <br>";

    // lock($users,LOCK_UN);
    
    // fclose($users);
?>
</body>
</html>