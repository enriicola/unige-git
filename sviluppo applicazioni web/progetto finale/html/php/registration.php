<!DOCTYPE html>
<html lang="en">

<link rel="stylesheet" type="text/css" href="../css/loginreg-style.css">

<head>
    <title>Sign-up</title>
</head>

<body>


<?php

    session_start();

    if(!empty($_SESSION['id'])) {
        header('Location: show_profile.php');
    }

	if(isset($_POST['submit'])) {
		include('../../private/createuser.php');
	}
?>


    <form id="formdati" method="post">

        <div class = "divleft">
            <img src="../img/registration/PedroII.jpg" width="100%" height="100%"> 
        </div>

        <div class="returnhome">
            <a href="homepage.php"> Torna alla homepage </a>
        </div>

        <div class="divright">
            <h1 style="margin-top:15%"> Unisciti a noi! </h1>

            <div> <input type="text" id="firstname" name="firstname" placeholder="Firstname" required > </div>
            <div> <input type="text" id="lastname" name="lastname" placeholder="Lastname" required > </div>
            <div> 
                <input type="email" id="email" name="email" placeholder="E-mail"required > 
                <p id="checkemail"> </p> 
            </div>
            <div> <input type="password" id="pass" name="pass" minlength="8" placeholder="Password" required > </div>
            <div> 
                <input type="password" id="confirm" name="confirm" minlength="8" placeholder="Confirm password" required > 
                <p id=checkpassword> </p>
            </div>  
            
            <div> <button type="submit" class="btn" id="submit" name="submit"> Submit </button>  </div>

            <div> 
                <p> Hai gia un account?
                <a class="active" href="login.php"> Login </a> 
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
                                            if (validateEmail(email.value)) {
                                                document.getElementById("checkemail").innerHTML = "";
                                                var xhttp = new XMLHttpRequest();
                                                xhttp.onload = function() {
                                                    if (xhttp.status === 200) {
                                                        if (xhttp.responseText.trim() == "NO") document.getElementById("checkemail").innerHTML = "Email gia utilizzata";
                                                    }
                                                };
                                                xhttp.open("GET", "../../private/checkemail.php?email="+email.value, true);
                                                xhttp.send();
                                            }
                                            else {
                                                document.getElementById("checkemail").innerHTML = "Formato email non valido";
                                            }
                                                
                                            }, false);
        

        var password = document.getElementById("pass");
        var confirm = document.getElementById("confirm");
        confirm.addEventListener("input", function() {
                                            if (password.value != confirm.value) document.getElementById("checkpassword").innerHTML = "Le password non coincidono";
                                            else document.getElementById("checkpassword").innerHTML = "";
                                          }, false)                                  
    </script>

</body>
</html>