<?php
session_start();

if(!isset($_SESSION['nusuario'])){ //si no esta logeado
	header("location: index.php");
}
?>
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<link rel="stylesheet" href="css/w3.css">
<link rel="stylesheet" href="css/tema.css">

</head>
<body>
<?php
    include "menu.php";
?>

<div class="w3-container">
<h3>Tu nombre de usuario es <?php echo $_SESSION['nusuario'];?></h3>
<h3>Tu ID de usuario es <?php echo $_SESSION['id']?></h3>
</div>
</body>
</html>