<!DOCTYPE html>
<html lang="en">

<link rel="stylesheet" type="text/css" href="../css/loginreg-style.css">

<head>
    <title>Log-in</title>
</head>

<body>


<?php

    session_start();

    if(!empty($_SESSION['id'])) {
        header('Location: show_profile.php');
    }

	if(isset($_POST['submit'])) {
		include('../../private/loginprocedure.php');
	}
?>


    <form id="formdati" method="post">

        <div class = "divleft">
            <img src="../img/login/epoquechar.jpg"  width="100%" height="100%"> 
        </div>

        <div class="returnhome">
            <a href="homepage.php"> Torna alla homepage </a>
        </div>

        <div class="divright">

            <h1 style="margin-top:26%"> Inserisci email e password! </h1>

            <div> 
                <input type="email" id="email" name="email" placeholder="E-mail"required /> 
                <p id="checkemail"> </p>  
            </div>
            <div> <input type="password" id="pass" name="pass" minlength="8" placeholder="Password" required /> </div>

            <div> <button type="submit" class="btn" id="submit" name="submit"> Submit </button>  </div>

            <div> 
                <p> Non hai ancora un account?
                <a class="active" href="registration.php"> Sign up </a> 
                </p>
            </div>
        </div>
    </form>


    <script> 
            function validateEmail(email) {
                return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
            }

            var email = document.getElementById("email");
            email.addEventListener("input",function() {
                                                if (validateEmail(email.value)) 
                                                    document.getElementById("checkemail").innerHTML = "";
                                                else 
                                                    document.getElementById("checkemail").innerHTML = "Formato email non valido";
                                            },false);
    </script>
</body>
</html>