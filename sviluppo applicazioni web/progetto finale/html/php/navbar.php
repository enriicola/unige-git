<!DOCTYPE html>
<html lang="en">

<link rel="stylesheet" type="text/css" href="../css/navbar-style.css">

<head> 
    <title> Navbar </title> 
</head>

<body>

    <div id="topnav" class="topnav">
        <div class="homeimg"> 
            <a href="homepage.php"> <img src="../img/icon/time-machine.png" type="img" width="4.5%" height="9%"> </a>
        </div>
        <div class="position">  
            <div class="list">
                <a href="homepage.php"> Home </a>
                <a href="shop.php"> Shop </a>
                <a href="show_profile.php"> Profile </a>
                <a href="registration.php"> Sign up </a>
                <a href="login.php"> Sign in </a>
                <div class="cover">
                    <form action="search.php" method="POST">
                        <input class="input-box" id="search" name="search" type="text" placeholder=" In che epoca vuoi viaggiare?">
                        <button class="ok" type="submit">
                        <img src="../img/search.png" type="img">
                        </button> 
                    </form>
                </div>
            </div>
        </div>

        <div class="dotcounter"> <p id="cart-number"> 0 </p> </div>

        <div class="shopimg">
             <a href="shopping-cart.php"> <img src="../img/icon/shopping-cart.png" type="img" width="2%" height="4%"> </a>
        </div>

    </div>

    <script type="text/javascript" src="../../private/navcart.js"></script>

</body>

</html>