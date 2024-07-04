<?php
	session_start();
	$user = null;
	if(isset($_GET['user'])) $_SESSION['user'] = $_GET['user']; if(isset($_SESSION['user'])) $user = $_SESSION['user'];
?>
<!doctype html>
<body>
<?php
	if (isset($user)) echo "Welcome <b>$user</b>";
	else echo '<form action="/index_session.php" method="GET">Enter your username: <input type="text" name="user"><input type="submit" value="login"></form>';
?>
</body>
