<?php
    require("database.php");

    $table = "orders";

    if ($result = $mysqli->query("SHOW TABLES LIKE '".$table."'")) {
        if($result->num_rows == 0) {
            $mysqli->query("CREATE TABLE orders (
                            id int(11) AUTO_INCREMENT,
                            userID int(11) NOT NULL,
                            product varchar(20) NOT NULL,
                            trips int NOT NULL,
                            PRIMARY KEY  (ID) 
                            )");
        }
    }

    $table = "userdata";


    if ($result = $mysqli->query("SHOW TABLES LIKE '".$table."'")) {
        if($result->num_rows == 0) {
            $mysqli->query("CREATE TABLE userdata (
                            id int(11) AUTO_INCREMENT,
                            firstname varchar(20) NOT NULL,
                            lastname varchar(20) NOT NULL,
                            email varchar(50) NOT NULL,
                            passwordd varchar(255) NOT NULL,
                            bio varchar(255) NOT NULL,
                            img varchar(255) NOT NULL,
                            newsletter varchar(3) NOT NULL,
                            PRIMARY KEY  (ID) 
                            )");
        }
    }

    $table = "products";


    if ($result = $mysqli->query("SHOW TABLES LIKE '".$table."'")) {
        if($result->num_rows == 0) {
            $mysqli->query("CREATE TABLE products (
                            id int(11) AUTO_INCREMENT,
                            nameproduct varchar(20) NOT NULL,
                            img varchar(255) NOT NULL,
                            wiki varchar(20) NOT NULL,
                            descr varchar(255) NOT NULL,
                            price int NOT NULL,
                            PRIMARY KEY  (ID) 
                            )");
        }
    }

?>