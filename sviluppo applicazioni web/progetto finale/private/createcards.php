<?php

require("../../db/database.php");


        $result = $mysqli->query("SELECT * FROM products");
        
            $margin=0;
            while ($row = mysqli_fetch_array($result)) {
                $counter = 0;

                echo "<div class=products style="."margin-top:".($margin*40)."%>";
                    
                    echo "<div class=card>";
                        echo "<img src=".$row['img']." type=img>";
                        echo "<p>".$row['descr']."</p>";
                        echo "<button id=".$row['nameproduct']."-btncart name=".$row['nameproduct']." value=".$row['price']." type=submit> Order Now </button>";
                    echo "</div>";

                    $row = mysqli_fetch_array($result);
                    if ($row == NULL) break;
                    echo "<div class=divisor></div>";

                    echo "<div class=card>";
                        echo "<img src=".$row['img']." type=img>";
                        echo "<p>".$row['descr']."</p>";
                        echo "<button id=".$row['nameproduct']."-btncart name=".$row['nameproduct']." value=".$row['price']." type=submit> Order Now </button>";
                    echo "</div>";
                    
                    $row = mysqli_fetch_array($result);
                    if ($row == NULL) break;

                    echo "<div class=divisor></div>";
                        echo "<div class=card>";
                        echo "<img src=".$row['img']." type=img>";
                        echo "<p>".$row['descr']."</p>";
                        echo "<button id=".$row['nameproduct']."-btncart name=".$row['nameproduct']." value=".$row['price']." type=submit> Order Now </button>";
                    echo "</div>";

            echo "</div>";

            $margin++;
        }



            $result->close();

?>
