<?php             

require("../../db/database.php");

    
    $search = "%{$_POST['search']}%"; 

    $stmt = $mysqli->prepare("SELECT * FROM products WHERE nameproduct LIKE ? OR descr LIKE ? UNION SELECT * FROM products");
    $stmt->bind_param("ss", $search, $search);
    try {
        if ($stmt->execute()){
            $result = $stmt->get_result();
    
            echo "<p class=result> Risultati trovati per la parola \"".$_POST['search']."\":</p>";
            
            $margin=0;
            while ($row = mysqli_fetch_array($result)) {
                echo "<div class=products style="."margin-top:".($margin*40)."%>";
                    
                    echo "<div class=card>";
                        echo "<img src=".$row['img']." type=img>";
                        echo "<p>".$row['descr']."</p>";
                        echo "<button class=find id=".$row['nameproduct']."-infobtn name=".$row['wiki']."  type=submit> Scopri di piu </button>";
                        echo "<button class=shop id=goshop type=submit> Vai allo shop! </button>";
                    echo "</div>";

                    $row = mysqli_fetch_array($result);
                    if ($row == NULL) break;
                    echo "<div class=divisor></div>";

                    echo "<div class=card>";
                        echo "<img src=".$row['img']." type=img>";
                        echo "<p>".$row['descr']."</p>";
                        echo "<button class=find id=".$row['nameproduct']."-infobtn name=".$row['wiki']." type=submit> Scopri di piu </button>";
                        echo "<button class=shop id=goshop type=submit> Vai allo shop! </button>";
                    echo "</div>";
                    
                    $row = mysqli_fetch_array($result);
                    if ($row == NULL) break;

                    echo "<div class=divisor></div>";
                        echo "<div class=card>";
                        echo "<img src=".$row['img']." type=img>";
                        echo "<p>".$row['descr']."</p>";
                        echo "<button class=find id=".$row['nameproduct']."-infobtn name=".$row['wiki']." type=submit> Scopri di piu </button>";
                        echo "<button class=shop id=goshop type=submit> Vai allo shop! </button>";
                    echo "</div>";

                echo "</div>";
                $margin++;
            } 
        } else throw new Exception("errore");
    } catch (Exception $e) {
        echo $e->getMessage();
    }

    $stmt->close();
    $result->close();
    $mysqli->close();
?>