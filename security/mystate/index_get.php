<?php 
	$user = null;
	if(isset($_GET['user'])) $user = $_GET['user'];
?>
<!doctype html>
<body>
<?php
	if(isset($user)) echo "Welcome <b>$user</b>";
	else echo '<form action="/index_get.php" method="GET">Enter your username: <input type="text" name="user"><input type="submit" value="login"></form>';
?>
</body>
