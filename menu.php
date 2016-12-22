<!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script> -->
<script src="js/jquery-2.2.0.js"></script>
<script>
$(document).ready(function(){
	var margen = $('#menuflotante').height();
	$('#margenMenu').css({"margin-top": margen});
	
})
$(window).resize(function(){ //si no se actualiza cada vez que se cambia el tamaño quedan margenes blancos (o se overlapan)
	var margen = $('#menuflotante').height();
	$('#margenMenu').css({"margin-top": margen});
	
});
</script>

<nav id="menuflotante" class="w3-topnav w3-theme-d1 w3-large" style="position:fixed;width:100%;top:0px" >
	<a href="index.php">Rol Tierra Media</a>
	<?php if (isset($_SESSION['nusuario'])) {
		echo '<a href="crearPartida.php">Crear Partida</a>';
		echo '<a href="buscarPartida.php">Buscar Partida</a>';
		echo '<a href="misPartidas.php">Mis Partidas</a>';
	}
	?>
	
	<a href="ayuda.php#Introduccion" target="_blank">Ayuda</a>

	<span style="float:right;margin-right:5%"><?php if  (!isset($_SESSION['nusuario'])) { //usuario desconectado ?>
			<a href="javascript:void(0)" onclick="document.getElementById('loginModal').style.display='block'">Iniciar Sesión</a>
	<?php }else { //usuario conectado?>
	
			Identificado como<strong><a href="perfil.php" class="w3-text-indigo"><?php echo $_SESSION['nusuario'] ?></a></strong>

			<a href="logout.php">Desconectarse</a>

								
	<?php } ?> 

	</span>
</nav>

<!-- Login Modal -->
<div id="loginModal" class="w3-modal">
	<div class="w3-modal-content w3-animate-top">
		<div class="w3-container w3-theme-d2">
			<span onclick="document.getElementById('loginModal').style.display='none'" class="w3-closebtn">&times;</span>
			<?php if (!isset($_SESSION['nusuario'])) { //USUARIO DESCONECTADO ACTUALMENTE
					   include 'loginDB.php';
					   ?> 
						<form class="w3-container" action="" method="post">
							<p>
							<label><b>Usuario</b></label>
							<input class="w3-input w3-border w3-theme-l3" name="lusuario" type="text" />
						
							<label><b>Contraseña </b></label>
							<input class="w3-input w3-border w3-theme-l3" name="lpass" type="password" />
							</p>
							<input type="submit" name= "entrar" value="Entrar" class="w3-btn w3-theme-l1" style="width:120px;">
							<input type="button" value="Registrarse"  onclick="location.href = 'registro.php';"  class="w3-btn w3-theme-l1" style="width:120px;">
							<br><br>
					
						</form>
						<?php if (isset($_POST['entrar'])){
					
							$lnick = mysqli_real_escape_string($link, $_POST['lusuario']);
							$lpwd = mysqli_real_escape_string($link, $_POST['lpass']);
							$row = mysqli_fetch_assoc(mysqli_query($link, "SELECT id,nick FROM usuarios WHERE nick='$lnick' AND pass='$lpwd'")); 
								if ($row['nick']) { //si hay coincidencia en la base de datos (al menos una, es imposible que haya mas de una)
													//tambien se puede comprobar con num_rows()
									//DATOS DE LA SESION nombre de usuario, id, y cualquier otra cosa de utilidad
									$_SESSION['nusuario'] = $row['nick'];
									$_SESSION['id'] = $row['id'];
									
								echo 	'<script> window.location.assign("index.php");
										//alert("Identificado con exito");
										</script>';
								}
								else { //datos de acceso incorrectos
									echo '<script>alert("Usuario y/o contraseña incorrectos")
											window.location.assign("index.php");</script>';
								}
							}
							
							mysqli_close($link);
				}else{ // USUARIO YA CONECTADO (no debería llegar aquí)
				echo 'Ya estás conectado';
				} ?> 


		</div>
	</div>
</div>

<div id="margenMenu"></div>
<br>
