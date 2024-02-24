<!DOCTYPE html>
<html lang="eng">

<link rel="stylesheet" type="text/css" href="../css/shopping-cart-style.css">

<head> <title> Shopping-cart </title> </head>


    <body>
        <?php include("navbar.php")?>
        
        <div class="items"> 
            <h1> Carrello: </h1>

            <div class="list-items">
                <ul id="list-items"></ul>
            </div>

            <div class="returnshop">
                <a href="shop.php"> Torna allo shop </a>
            </div>

        </div>


        <div class="summary"> 
            <div class="list-sum-items">
                <ul id="list-sum-items"> </ul>
            </div>
            <button id="button-checkout" type="submit"> Checkout </button>
        </div>

    <script type="text/javascript" src="../../private/createcart.js"></script>

    </body>

</html>