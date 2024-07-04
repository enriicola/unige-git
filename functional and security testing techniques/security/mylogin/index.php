<!doctype html>
<body>
<?php
	if(isset($_GET['username']))
		echo $_GET['username'];
	else
		echo '<form action="/" method="GET">Username: <input type="text" name="username"><input type="submit"></form>';
?>
