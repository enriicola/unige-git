<?php
    $i = 1;
    while ($i < 100) {
        echo $i."<br>";
        exec('php test/test_all.php');
        $i++;
    }
?>