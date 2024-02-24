<?php
    require("database.php");

    $arrayproduct = array("belle epoque", "egitto", "rome", "primitivi", "pirati", "cyberpunk", "medioevo", "fallout");

    $arrayimg = array("belleepoque.jpg", "egyptian.jpg", "rome.png", "primitivi.jpg", "pirati.jpg", "cyberpunk.jpg", "medioevo.jpg", "fallout.jpg");
    $arrayurlimg = array_map(function($item) {
        $urlimg = "../img/products/";
        return $urlimg.$item;
    }, $arrayimg);

    $arraywiki = array("Belle_Époque", "Antico_Egitto", "Civiltà_romana", "Evoluzione_umana", "Pirateria", "Cyberpunk_2077", "Medioevo", "Fallout_4");
    
    $descr = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum ad nesciunt voluptatum, incidunt aut non quasi nisi facilis commodi mollitia consequuntur placeat aperiam suscipit libero quidem ducimus nostrum aliquid iusto.";
    $price = 100;
    $i = 0;
    while ($i < 8) {
        $result = $mysqli->prepare("INSERT INTO products (nameproduct, img, wiki, descr, price) VALUES (?, ?, ?, ?, ?)");
        $result->bind_param('ssssi', $arrayproduct[$i], $arrayurlimg[$i], $arraywiki[$i], $descr, $price);
        $result->execute();
        $i++;
    }


?>