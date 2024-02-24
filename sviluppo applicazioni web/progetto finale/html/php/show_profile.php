<!-- Nota: per il progetto finale il form di login dovrà mantenere i nomi dei campi di input forniti in questo esercizio (email e pass) che saranno usati dai test automatici.  -->
<!-- NON  FARE L'UPDATE UNA VARIABILE ALLA VOLTA CHE LA MARINA SI ARRABBIA -->
<!-- OCCHIO CHE NON CI SIANO TAG RIPETUTI (4 HTML, 4 BODY, ETC...) -->
<!DOCTYPE html>
<html lang="en">
	<?php
			session_start();

			//empty does both of the checks you are doing at once
			//check if user is logged in first
			if(empty($_SESSION['id'])) {
				header('Location: pleaselogin.php');
				die();
			}	

			include("../../private/fetchprofiledata.php");
	?>
<head>
	<title> <?php echo $user['firstname']; ?> </title>
	<link rel="stylesheet" type="text/css" href="../css/profile-style.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<?php 
		include("navbar.php"); 
	?>
</head>
<body>
	<div class="card">
		<h2>User Info</h2>
		<img src="<?php echo $user['img'];?>" alt="user_img" id="user_img">
		<h1><?php echo $user['firstname']; ?></h1>
		<p class="title">iTime client</p><br>
		<button onclick="support()">Contact Support</button>
	</div>

	<div id="info" class="info">
		<div id="menu">
			<a href="#" onclick="togglemenu(1)" style="border-top-left-radius: 4vh"> Anteprima </a>
			<a href="#" onclick="togglemenu(2)"> Acquisti </a>
			<a href="#" onclick="togglemenu(3)"> Modifica </a>
			<a href="#" onclick="togglemenu(4)" style="border-top-right-radius: 4vh"> Logout </a>
		</div>

		<section id="anteprima">
			<br>
			<p>Nome: </p> <h3><?php echo $user['firstname']; ?></h3><br>
			<p>Cognome: </p> <h3><?php echo $user['lastname']; ?></h3><br>
			<p>Email: </p> <h3><?php echo $user['email']; ?></h3><br>
			<p>URL foto profilo: </p> <h3>
				<?php 
					if(empty($user['img']))
						echo "Non trovato :(";
					else
						echo $user['img'];
				?></h3><br>
			<p>Biografia: </p> <h3>
				<?php 
					if(empty($user['bio']))
						echo "Biografia inesistente :(";
					else
						echo $user['bio'];
				?></h3><br>
		</section>

		<section id="acquisti">
			<?php include("../../private/orders.php");?>
		</section>

		<section id="edit">	

			<form action="update_profile.php" method="POST">
				<label for="firstname"><h4>Nome</h4></label>
				<input type="text" id="firstname" name="firstname" value="<?php echo $user['firstname']; ?>">

				<label for="lastname"><h4>Cognome</h4></label>
				<input type="text" id="lastname" name="lastname" value="<?php echo $user['lastname']; ?>">

				<label for="email"><h4>Email</h4></label>
				<input type="email" id="email" name="email" value="<?php echo $user['email']; ?>" required><br>
				
				<input id="submit" name="submit" type="submit" value="Cambia generalita">
			</form>

			<form action="update_profile.php" method="POST" style="margin-top:5%">
			<label for="img"><h4>Indirizzo URL della foto profilo</h4></label>
				<input type="text" id="img" name="img" value="<?php echo $user['img']; ?>">

				<label for="bio"><h4>Biografia</h4></label>
				<input type="text" id="biografia" name="biografia" value="<?php echo $user['bio']; ?>"><br>
				<input type="checkbox" id="newsletter" name="newsletter" <?php if($user['newsletter']=="on") echo "checked";?>> Vuoi ricevere la nostra newsletter? </input><br>
				<input id="submitinfo" name="submitinfo" type="submit" value="Cambia info">
			</form>

			<form action="update_password.php" method="POST" style="margin: 10%">
				<label for="pass_o"><h4>Password</h4></label>
				<input type="password" id="old" name="old" placeholder="Old password..." required><br>
				<input type="password" id="new" name="new" placeholder="New password..." required>
				<input type="password" id="confirm" name="confirm" placeholder="Confirm new password..." required><br>

				<input id="submit_password" name="submit_password" type="submit" value="Cambia password">
			</form>
		</section>

		<section id="logout">
			<form action="logout.php">
				<br>
				<h2> Sei sicuro di voler uscire?? </h2>
				<input type="submit" value="Logout">
			</form>
		</section>
	</div>
	<script>
		function togglemenu(a){
			switch (a) {
				case 1: //anteprima
					document.getElementById("anteprima").style.display="block";
					document.getElementById("acquisti").style.display="none";
					document.getElementById("edit").style.display="none";
					document.getElementById("logout").style.display="none";
					break;
				case 2: //acquisti
					document.getElementById("anteprima").style.display="none";
					document.getElementById("acquisti").style.display="block";
					document.getElementById("edit").style.display="none";
					document.getElementById("logout").style.display="none";
					break;
				case 3: //edit
					document.getElementById("anteprima").style.display="none";
					document.getElementById("acquisti").style.display="none";
					document.getElementById("edit").style.display="block";
					document.getElementById("logout").style.display="none";
					break;
				case 4: //logout
					document.getElementById("anteprima").style.display="none";
					document.getElementById("acquisti").style.display="none";
					document.getElementById("edit").style.display="none";
					document.getElementById("logout").style.display="block";
					break;
				default:
					alert("javascript error!");
			}
		}
		function support(){
			alert("Chiamaci al numero 1234567890 :)");
		}

	</script>
</body>
</html>