
<?php
    require("../../db/database.php");

	$stmt = $mysqli->prepare("SELECT * FROM userdata WHERE id = ?");
	$stmt->bind_param('s', $_SESSION['id']);
	try {
		if ($stmt->execute())  { 
			$res = $stmt->get_result();
			$user = $res->fetch_assoc();
		} else throw new Exception("erroe in execute");
	} catch (Exception $e) {
		echo $e->getMessage();
	}
?>