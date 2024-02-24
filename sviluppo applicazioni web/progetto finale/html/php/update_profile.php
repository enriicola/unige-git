<!-- Nota: per il progetto finale il form di login dovrà mantenere i nomi dei campi di input forniti in questo esercizio (email e pass) che saranno usati dai test automatici.  -->
<!-- NON  FARE L'UPDATE UNA VARIABILE ALLA VOLTA CHE LA MARINA SI ARRABBIA -->
<!-- OCCHIO CHE NON CI SIANO TAG RIPETUTI (4 HTML, 4 BODY, ETC...) -->

<!DOCTYPE html>
<html lang="en">
<head>
  <title> <?php echo $user['firstname']; ?> </title>
  <link rel="stylesheet" type="text/css" href="../css/profile-style.css">
</head>
<body>
  <?php
    include('../../private/updateprofile.php');
  ?>
</body>
</html>