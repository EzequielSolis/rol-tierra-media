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
</head>
<body>

<?php
    include "menu.php";
    include 'loginDB.php';
?> 		
	<section id="partidas" class="w3-container">
		<h2>Mis Partidas</h2>
		<div class="w3-row w3-theme-l2 w3-card-4">
			<div id="admin" class="w3-container w3-half w3-border-right">
				<h3>Partidas como Director de Juego</h3>
				<ul>
				<?php 
				if ($resultadoPartidas = mysqli_query($link, "SELECT `id`, `nombre_partida` from `partidas` where `nick_admin`='".$_SESSION['nusuario']."'")) {
										while($partidasJugador =  mysqli_fetch_assoc($resultadoPartidas)) {
											echo '<li><a href="jugar.php?id='.$partidasJugador['id'].'">'.$partidasJugador['nombre_partida'].'</a></li>';
										}
				}
				
				
				?>
				</ul>
			</div>
			<div id="jugador" class="w3-container w3-half">
				<h3>Partidas como Jugador</h3>
				<ul>
				<?php 
				if ($resultadoPartidas = mysqli_query($link, "SELECT `id`, `nombre_partida` from `partidas` 
						where id= ANY (SELECT `id_partida` FROM `partidas_usuarios` where `nick`='".$_SESSION['nusuario']."')")) {
					while($partidasJugador =  mysqli_fetch_assoc($resultadoPartidas)) {
						echo '<li><a href="jugar.php?id='.$partidasJugador['id'].'">'.$partidasJugador['nombre_partida'].'</a></li>';
					}
				}			
				
				?>
				</ul>
			</div>
		</div>
	</section>
