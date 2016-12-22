<?php
session_start();

if(isset($_SESSION['nusuario'])){ //si ya esta logeado
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
    include 'loginDB.php';
    
// variables para el registro
$errores = array();
$nick = $email = $pass = "";

//validacion
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["registrarse"])) {
   if (empty($_POST["nick"])) {
     $errores[] = "Nombre de usuario: Campo obligatorio";
   } 
   else {
     $nick = $_POST["nick"];
     if (!preg_match("/^[a-zA-Z0-9_ñÑ]*$/",$nick)) {
       	$errores[] = "Nombre de usuario: Solo letras, n&uacutemeros y gui&oacuten bajo."; 
     }
     if (strlen($_POST["nick"])<4 || strlen($_POST["nick"])>16) {
     	$errores[] = "Nombre de usuario: La longitud debe de entre 4 y 16 caracteres.";
     } 
   }

 	if (empty($_POST["pass"])) {
   		$errores[] = "Contrase&ntildea: Campo obligatorio";
   	} else {
   		$pass = $_POST["pass"];
   		if (!preg_match("/^[a-zA-Z0-9_ñÑ]*$/",$pass)) {
   			$errores[] = "Contrase&ntildea: Solo letras, n&uacutemeros y gui&oacuten bajo.";
   		}
   		elseif (strlen($_POST["pass"])<4 || strlen($_POST["pass"])>16) {
   			$errores[] = "Contrase&ntildea: La longitud debe de entre 4 y 16 caracteres.";
   		}
   	}
   	
   	//confirmacion de contraseña
   	if (strcmp($_POST["cpass"], $_POST["pass"]) ) {
   		$errores[] = "Las contrase&ntildeas no coinciden";
   	}
   
   if (empty($_POST["email"])) {
     $errores[] = "Email: Campo obligatorio.";
   } else {
     $email = ($_POST["email"]);
     if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
       $errores[] = "Email: Email invalido."; 
     }
   }
}

?>

<div class="w3-row">
<div id="formulario" class="w3-container w3-third">
<br>
<h2>Formulario de Registro</h2>
<form class="w3-container" method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>"> 
   Nombre de Usuario <input class="w3-input w3-border w3-theme-l3" type="text" name="nick" value="<?php echo $nick;?>">
   <br>
   Contraseña <input class="w3-input w3-border w3-theme-l3" type="password" name="pass" value="<?php echo $pass?>">
   <br>
   Confirma Contraseña <input class="w3-input w3-border w3-theme-l3" type="password" name="cpass" value="">
   <br>
   Email <input class="w3-input w3-border w3-theme-l3" type="text" name="email" value="<?php echo $email;?>">
   <br>
   <input class="w3-btn w3-theme-l1" type="submit" name="registrarse" value="Registrarse"> 
</form>
<br><br>
</div>
</div>


<?php

if(isset($_POST["registrarse"])){ //comprueba si el boton ha sido pulsado
	if(!count($errores)) { //si no hay errores de validacion entra
		$nick = mysqli_real_escape_string($link, $nick);
		$pass = mysqli_real_escape_string($link, $pass);
		$email = mysqli_real_escape_string($link, $email);
		mysqli_query($link, "	INSERT INTO `usuarios` (`nick`,`pass`,`mail`,`fecha`)
						VALUES(
						'".$nick."',
						'".$pass."',
						'".$email."',
						NOW()
			)"); 
		
		if(mysqli_affected_rows($link)==1) { //exito	
			echo '
			<script>
			document.getElementById("formulario").innerHTML = "<h3>Registro completado</h3>";
			</script>';
		}
				
		else //un insert solo puede afectar 1 o 0 lineas, en este ultimo caso si hay un parametro unique repetido en la db
			$errores[]= "Nombre de usuario ya registrado.";
		
		
	}
}
	
if(count($errores)) {
	echo '<p style="color:red;margin-left:1%">';
	echo  implode('<br />',$errores);
	echo '</p>';
}

mysqli_close($link);
?>
</body>
</html>
