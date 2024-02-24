<?php
    require('../../db/database.php');

    session_start();

    if(isset($_POST['submit'])){ // Determine if a variable is declared and is different than null
      $firstname = $_POST['firstname'];
      $lastname = $_POST['lastname'];
      $email = $_POST['email'];

      $table = "userdata";

      $result = $mysqli->prepare("SELECT id FROM userdata WHERE email LIKE ?");
      $result->bind_param("s", $email);
      $result->execute();
      $result->store_result();
      $result->bind_result($idrow);
      $rows = $result->num_rows;
      $result->fetch();

      if($rows==0 || $idrow==$_SESSION['id']){
        $result = $mysqli->prepare("UPDATE $table SET firstname=?, lastname=?, email=? WHERE id = ?");
        $result->bind_param('sssi', $firstname, $lastname, $email, $_SESSION['id']);
        if (!$result->execute()) throw new Exception("erroe nella execute");
        echo "<h3>Dati aggiornati correttamente!</h3>";
      }
      else{
        echo "<h3>Email già esistente!</h3>";

      }
    }


    if (isset($_POST['submitinfo'])) {
      $img = $_POST['img'];
      $bio = $_POST['biografia'];
      if(isset($_POST['newsletter']))
        $newsletter = "on";
      else
        $newsletter = "off";
      
        $table = "userdata";
        if($rows==0 || $idrow==$_SESSION['id']){
          $result = $mysqli->prepare("UPDATE $table SET bio=?, img=?, newsletter=? WHERE id = ?");
          $result->bind_param('sssi', $bio, $img, $newsletter, $_SESSION['id']);
          $result->execute();
          echo "<h3>Dati aggiornati correttamente!</h3>";
        } 
    }
 
    header("Location: show_profile.php");
  ?>