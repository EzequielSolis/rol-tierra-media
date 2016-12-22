<?php
session_start();

if(!isset($_SESSION['nusuario']) || !isset($_GET['id'])){ //si no esta logeado o no hay ID de argumento
	header("location: index.php");
}
	include 'loginDB.php';
    
    $mensaje = ""; //mensaje de éxito o no de la operación
    //comprobación de que la partida no está llena
    $resJugadores = mysqli_fetch_assoc(mysqli_query($link, "SELECT `n_jug`,`max_jug`, `nick_admin` FROM `partidas` WHERE id=".$_GET['id'] ));
    if ($resJugadores['n_jug'] >= $resJugadores['max_jug']) { //la partida esta llena
    	$mensaje = 'Error: La partida a la que intentas entrar está llena';
    } elseif ($resJugadores['nick_admin'] == $_SESSION['nusuario']) { //si el usuario que intenta entrar es el propio admin de la partida
    	$mensaje = 'Error: Eres el administrador de esta partida';
    } else {
    	//vinculo de partida con usuario
    	mysqli_query($link, "	INSERT INTO `partidas_usuarios` (`id_partida`,`nick`)
						VALUES(
						'".$_GET['id']."',
						'".$_SESSION['nusuario']."'
			)");
    	
    	if(mysqli_affected_rows($link)==1) { //actualizamos el numero de jugadores
    		$jugadoresActuales = $resJugadores['n_jug'] +1;
    		mysqli_query($link, "UPDATE `partidas` SET `n_jug`=".$jugadoresActuales." WHERE `id`=".$_GET['id']);	
    		$mensaje =  'Te has unido a la partida';
    		
    	}else
    		$mensaje =  'Error: Ya estabas unido a la partida';
    }
    
    mysqli_close($link);
    

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
    echo $mensaje;
?>

