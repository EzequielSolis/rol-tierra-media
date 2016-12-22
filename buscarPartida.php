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
    include 'loginDB.php';
    
  
    $resPartidas = mysqli_fetch_assoc(mysqli_query($link, "SELECT COUNT(*) as `TOTAL` FROM `partidas`" ));
    $totalPartidas = $resPartidas['TOTAL'];
	$porPag = 5	; //numero de partidas que se mostraran en una página
	$maxPag = $totalPartidas / $porPag;
	//el resultado puede ser 0.6, 1.7, 9.1, 5.0... En todos los casos menos en el último hay que crear una página extra.
	if (!isset($_GET['pagina'])) //si no tenemos el parametro pagina, es 1
		$paginaActual = 1;
	else 
		$paginaActual = $_GET['pagina'];
	
?>

<nav id= "paginas" class="w3-container">
<h2>Buscar Partida</h2>
  <div class="w3-center">
    <ul class="w3-pagination">
      <?php 
      if ($paginaActual != 1) { //si no es la primera pagina se mostrara el boton
      ?>
      <li><a href="?pagina=<?php echo $paginaActual-1;?>">«</a></li>
      <?php }?>

      <?php 
      for($i = 0; $i < $maxPag; $i++) {
      ?>
      	<li><a href="?pagina=<?php echo $i+1;?>" <?php if ($paginaActual == $i+1) echo 'class="w3-theme-d1"';?> > <?php echo $i+1;	?></a></li>
      <?php
      }
      if ($maxPag > $paginaActual) { //si quedan paginas mas adelante se mostrara el boton
      ?>
      <li><a href="?pagina=<?php echo $paginaActual+1;?>">»</a></li>
      <?php }?>
    </ul>
  </div>
</nav>
<div class="w3-row">

  <div id="relleno" class="w3-quarter">
   <br>
  </div>
  <section id="resultado" class="w3-half" >

  	<?php 
  	
  	
  	if ($result = mysqli_query($link, "SELECT * FROM `partidas` order by ID desc LIMIT ".($paginaActual-1)*$porPag.",".$porPag)) {
  		while($row =  mysqli_fetch_assoc($result)) { 
  			$fecha = strtotime($row['fecha']);
  			$fecha = date("d/m/Y H:i", $fecha);
  			
  			?>
  			<div class="w3-card-8 w3-theme">
  			  	<div class = "w3-row">
  	 				<div class="w3-quarter w3-container ">
  	 					
  	 					<p><strong>Nombre de Partida <br> <?php echo $row['nombre_partida'];?></strong></p>
  	 					<p>Creada el <?php echo $fecha;?></p>
  	 					<p>Nivel inicial de personajes: <?php echo $row['nivel'];?></p>
  	 					<?php 
  	 						echo '<p><a href="unirsePartida.php?id='.$row['id'].'" class="w3-btn w3-brown">Jugar</a></p>';
 	 					
  	 					?>
  	 				
  	 				</div>
  	 				
  	 				<div class="w3-half w3-container ">
	  	 				<p>Descripción: <br> <?php echo $row['descripcion'];?></p>
	  	 				<p>Horario: <?php echo $row['horario'];?></p>
  	 				</div>
  	 				
  	 				<div class="w3-quarter w3-container">
  	 					<p><b>Director de Juego</b>
  	 					<br>
  	 					<?php echo $row['nick_admin'];?></p>
  	 					<p><b>Jugadores:</b> (<?php echo $row['n_jug'];?>/<?php echo $row['max_jug'];?>)</p>
  	 					
  	 					<?php 
  	 					 if ($resultadoJugadores = mysqli_query($link, "SELECT `nick` FROM `partidas_usuarios` where `id_partida`=".$row['id'])) {
  								while($jugs =  mysqli_fetch_assoc($resultadoJugadores)) { 
  									echo $jugs['nick'].'<br>';
  								}
  	 					 }
  						?>
  	 				</div>
  	 				
  	 				
  				</div>
  			</div>
  			<br>
  			
  			
  			
  			
  		<?php 
  		}  		
  	}



  	?>
  	
  	
  	
  </section>
  
</div>




</body>
</html>
<?php 
mysqli_close($link);
?>
