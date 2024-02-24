<!DOCTYPE html>
<html>

    <link rel="stylesheet" type="text/css" href="newsletter-style.css">


    <?php 
        session_start();

        if(empty($_SESSION['admin'])) {
            header('Location: ../../html/php/homepage.php');
        }
    ?>



    <form id="formdati" action="../newsletter.php" method="GET">
        <textarea type = "text" id="text" name="text" rows="35" cols="30"> </textarea>
        <div> <button type="submit" id="sub-btn" name="sub-btn"> Submit </button> </div>
    </form>
</html>