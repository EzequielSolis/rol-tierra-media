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
<meta name="author" content="Ezequiel Solis Aguilar">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<link rel="stylesheet" href="css/w3.css">
<link rel="stylesheet" href="css/tema.css">
<style>
.numero {
    width: 80px;
}

textarea {

    resize:none;
}
</style>


</head>
<body>
<?php
    include "menu.php";
    include 'loginDB.php';
    
    // variables para el formulario
    $errores = array();
    $nPartida = $descripcion=  $max_jug = $nivel = $horario = $anuncio = $pass = "";
    $nivel = 1;
    $max_jug = 4;
    $gen_pj_auto = 0;
    //validacion pre-base de datos
	/*en teoria los atributos maxlenght de los input deberia prohibir la cantidad de caracteres que se usan
	 * pero es mas seguro verificarlo desde el servidor */
    if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["crearPartida"])) {
    	if (empty($_POST["nPartida"])) {
    		$errores[] = "Nombre de Partida: Campo obligatorio";
    	}
    	else {
    		$nPartida = htmlspecialchars($_POST["nPartida"]);
    		if (strlen($nPartida)<6 || strlen($nPartida)>40) {
    			$errores[] = "Nombre de Partida: La longitud debe de entre 6 y 40 caracteres.";
    		}
    	}
    	if(empty($_POST['jugadores'])) {
    		$max_jug = 4; //valor por defecto
    	}else{
    		$max_jug = $_POST['jugadores'];
    		if ($max_jug < 1 || $max_jug > 6) {
    			$errores[] = "Número de jugadores: Debe ser entre 1 y 6";
    		}
    	}
    	if(empty($_POST['nivel'])) {
    		$nivel = 1; //valor por defecto	
    	}else{
    		$nivel = $_POST['nivel'];
    		if ($nivel < 1 || $nivel > 10) {
    			$errores[] = "Nivel: Debe ser entre 1 y 10";
    		}
    	}
    	
    	$descripcion = htmlspecialchars($_POST['descripcion']);
    	if (strlen($descripcion) > 400) 
    		$errores[] = "Descripción: Debe tener menos de 400 caracteres"; 
    	
    	$horario = htmlspecialchars($_POST['horario']);
   		if (strlen($horario) > 40) 
    		$errores[] = "Horario: Debe tener menos de 40 caracteres";
    	
   
    }
    
    //formulario
?>

	
		<section id="formulario" class="w3-container">
			<h2>Creación de Partida</h2>
			<form class="w3-container " method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
				<div class="w3-row w3-card-4">
					<div id="obligatorio" class="w3-container w3-third w3-border-right">
						<h3>Campos obligatorios</h3>
						<label >Nombre de Partida</label>
						<input class="w3-input w3-border w3-theme-l3" type="text" name="nPartida" maxlength="40" value="<?php echo $nPartida;?>">
						<br> 
						<label>Máximo número de jugadores (sin contarte a ti)</label>
						<input type="number" name="jugadores" class="w3-input w3-border w3-theme-l3 numero" value ="<?php echo $max_jug;?>" min="1" max="6">
						<br>
						<label>Nivel (sin contarte a ti)</label>
						<input type="number" name="nivel" class="w3-input w3-border w3-theme-l3 numero" value="<?php echo $nivel;?>" min="0" max="10">
						<br>
						<p><input class="w3-btn w3-theme-l1" type="submit" name="crearPartida" value="Crear Partida"></p>
						
					</div>
					<div id="opcionales" class="w3-container w3-third w3-border-right">
						<h3>Campos opcionales</h3>	
						<label>Descripción</label>
						<textarea name="descripcion" class="w3-input w3-border w3-theme-l3 " rows="2" maxlength="400"><?php echo $descripcion;?></textarea>
						<br>
						<label>Horario</label>
						<input class="w3-input w3-border w3-theme-l3" type="text" name="horario" maxlength="40" value="<?php echo $horario;?>">
						<br>
					</div>
					
					<div id="errores" class="w3-container w3-third w3-text-red" >
					<p>
					<?php if (count($errores)) 
							 echo  implode('<br>',$errores);
					 ?>
					 </p>
					</div>
					
				</div>
				
			</form>
		</section>
<?php

if(isset($_POST["crearPartida"])){ //comprueba si el boton ha sido pulsado
	
	if(!count($errores)) { //si no hay errores de validacion entra
		
		$nPartida = mysqli_real_escape_string($link, $nPartida);
		$nivel = mysqli_real_escape_string($link, $nivel);
		//$gen_pj_auto = mysqli_real_escape_string($link, $gen_pj_auto);
		$max_jug = mysqli_real_escape_string($link, $max_jug);
		
		$descripcion = mysqli_real_escape_string($link, $descripcion);
		$horario  = mysqli_real_escape_string($link, $horario);
		//$anuncio = mysqli_real_escape_string($link, $anuncio);
		//$pass = mysqli_real_escape_string($link, $pass);
		

		//ojo con la concatenacion de numeros
		mysqli_query($link, "	INSERT INTO `partidas` (`nombre_partida`,`nick_admin`,`descripcion`, `max_jug`, `nivel`, `horario`, `fecha`)
						VALUES(
						'".$nPartida."',
						'".$_SESSION['nusuario']."',
						'".$descripcion."' ,
						'".$max_jug."',
						'".$nivel."',
						'".$horario."',
						NOW()
			)"); 
		
		if(mysqli_affected_rows($link)==1) { //exito	
			echo '
			<script>
			document.getElementById("formulario").innerHTML = "<h3>Partida Creada</h3>";
			</script>';
		}
				
		else{ //este insert solo puede afectar 1 o 0 lineas, en este ultimo caso si hay un parametro unique repetido en la db
			echo '
			<script>
			document.getElementById("errores").innerHTML = "<p>Nombre de partida ya registrado</p>";
			</script>';
		}		
	}
}
mysqli_close($link);
?>






</body>
</html>

