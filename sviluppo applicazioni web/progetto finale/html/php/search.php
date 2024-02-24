<!DOCTYPE html>
<html lang="eng">
     
<link rel="stylesheet" type="text/css" href="../css/search-style.css">

<head> <title> Search </title> </head>

<body>

    <?php 
        include("navbar.php"); 
        include("../../private/searchcard.php");
    ?>

    <script> 
        var buttons = document.getElementsByTagName('button')
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].id != "" && buttons[i].id.match("-infobtn") != null) {
                buttons[i].onclick = function () {
                    location.replace("infopage.php?info="+buttons[i].name);
                }
            } else {
                buttons[i].onclick = function () {
                    location.replace("shop.php");
                }
            }
        }
    </script>

</body>
</html>