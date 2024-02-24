<?php

    require("../../db/database.php");

    //session_start();

    $result = $mysqli->prepare("SELECT product, SUM(trips) FROM orders WHERE userID=? GROUP BY product");
    $result->bind_param('i', $_SESSION['id']); 
    try {
        if ($result->execute()) {
            $result->store_result();
            $result->bind_result($product, $trips); 

            $margin=3;
            while ($result->fetch()) {
                echo "<p style=margin-top:".$margin."%>Hai acquistato il prodotto <b><i>".$product."</i></b> ".$trips." volte.</p>";
            }


            if ($result->num_rows == 0) {
                echo "<p style=margin-top:".$margin."%> Non hai ancora effettuato nessun acquisto :C</p>";

            }
        } else throw new Exception("erroe in execute");

    } catch (Exception $e) {
        echo $e->getMessage();
    }

    $result->close();
?> 