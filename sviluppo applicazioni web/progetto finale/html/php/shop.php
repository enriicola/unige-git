<!DOCTYPE html>
<html lang="eng">

<link rel="stylesheet" type="text/css" href="../css/shop-style.css">


<head> <title> Shop </title> </head>


    <body>
        <?php 
            include("navbar.php"); 
            session_start();
            if(empty($_SESSION['id'])) {
                header('Location: pleaselogin.php');
                die();
            }
        ?>

        <div class="bigimg"> 
            <img src="../img/shop/back-shop.jpeg" type="img" width="100%" height="100%">
        </div>

        <div class="description"> 
            <h1> Travel with us!  </h1>
            <h2> choose a destination now! </h2>
        </div>

        <?php 
            include("../../private/createcards.php");
        ?>
        <script type="text/javascript" src="../../private/createcardsession.js"></script>

    </body>

</html>