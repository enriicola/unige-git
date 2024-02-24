<?php
    require '../db/database.php'; // :)
    session_start();

    $on = "on";
    $stmt = $mysqli->prepare("SELECT email FROM userdata WHERE newsletter LIKE ?");
    $stmt->bind_param("s", $on);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($email); 

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    
    require '../PHPMailer/src/Exception.php';
    require '../PHPMailer/src/PHPMailer.php';
    require '../PHPMailer/src/SMTP.php';

    while ($stmt->fetch()) {
        try {
            $mail = new PHPMailer(true);
            $mail->SMTPDebug = 2;                   // Enable verbose debug output
            $mail->isSMTP();                        // Set mailer to use SMTP
            $mail->Host       = 'ssl://smtp.gmail.com;';    // Specify main SMTP server
            $mail->SMTPAuth   = true;               // Enable SMTP authentication
            $mail->Username   = 'itime.newsletter@gmail.com';
            $mail->Password   = 'lillo-css00';
            $mail->SMTPSecure = 'tls';              // Enable TLS encryption, 'ssl' also accepted
            $mail->Port       = 465;                // TCP port to connect to

            $mail->setFrom('itime.newsletter@gmail.com', 'iTime');
            $mail->addAddress('lp.gonfiantini@gmail.com');
            $mail->addAddress('enrico.pezzano@outlook.it');
            
            $mail->addAddress($email);

            $mail->isHTML(true); // If passed true, sets the email format to HTML.                 
            $mail->Subject = 'Lorem Ipsum';
            $img = "<img src=https://cdn.2kgames.com/civilization.com/2KGMKT_CivilizationVI-GS_Key-Art_Wide_THM.jpg>";
            $mail->Body = $img.$_GET['text'];
            $mail->AltBody = $_GET['text'];
            $mail->send();
            echo "<h3>Email inviata correttamente!</h3>";
        }
        catch (Exception $e) {
            echo "<h3>Email non mandata. Errore mailer: {$mail->ErrorInfo}</h3>";
            echo $_POST['text'];
        }
    }

?>