<!DOCTYPE html>
<html lang="it">
<head>
    <title>Sign-up</title>
</head>
<body>
<?php
	echo "<h1>I have been called after submit on your form</h1>\n";
	echo "<h2>Now you should read the data sent and write them in a file</h2>\n";
	/****************************************************************************/
	/* TO BE DONE                                                               */
	/*                                                                          */
	/* This means: reading the data sent in POST, "cleaning" them, verifying    */
	/* that the user sent what you expect, writing data in the file             */
	/*                                                                          */
    /* If something goes wrong send back appropriate messages                   */
	/****************************************************************************/

	$fn = $_POST['firstname'];
	$ln = $_POST['lastname'];
	$mail = $_POST['email'];
	$psw = $_POST['pass'];
	$confirm = $_POST['confirm'];

	if($mail==null || $psw==null || $confirm==null){
		echo("Check input data, some are missing...");
		header("Refresh: 2; index.html");
	}

	if($psw != $confirm){
		echo("Le password devono essere uguali! Fai un altro tentativo...");
		header("Refresh: 2; index.html");
	}
	else{
		$users = fopen("users.txt", "a") or die("Unable to open file!");
		// while(!feof($users)) {
		// 	$line = fgets($users);
		// 	if($line == $mail){
		// 		flock($users,LOCK_UN);
		// 		echo("Attention! The user $mail already exists!");
		// 		header("Refresh: 2; index.html");
		// 	}
		// }
		// flock($users,LOCK_EX);
		$line = $fn.'|'.$ln.'|'.$mail.'|'.$psw;
		fwrite($users, $line);
		// flock($users,LOCK_UN);

		echo("Registration has been successful!");
		header("Refresh: 2; login.html");
	}
	fclose($users);
?>
</body>
</html>