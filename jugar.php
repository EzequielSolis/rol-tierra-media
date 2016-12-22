<?php
session_start();

if(!isset($_SESSION['nusuario']) || !isset($_GET['id'])){ //si no esta logeado o si no hay parametro ID en la URL
	header("location: index.php");
}
include 'loginDB.php';
//jugadores en partida
$resJugadores = mysqli_query($link, "SELECT `nick` FROM `partidas_usuarios` WHERE `id_partida`=".$_GET['id']);
$jugadores = array();
while($row =  mysqli_fetch_assoc($resJugadores)) {
	array_push($jugadores, $row['nick']);
}
//nombre del director
$resAdmin = mysqli_fetch_assoc(mysqli_query($link, "SELECT `nick_admin` FROM `partidas` WHERE id=".$_GET['id'] ));
$director = $resAdmin['nick_admin'];
//verificando si es un usuario de la partida, si es director de la partida o si ninguna de las dos
$tipoUsuario ="";

if ($director == $_SESSION['nusuario']) { //si es el admin
	$tipoUsuario = 'director';
} 
foreach ($jugadores as &$jg){ //buscamos si hay algun jugador con su nombre
	if ($jg == $_SESSION['nusuario']) {
		$tipoUsuario = 'jugador';
	}
}
if(!($tipoUsuario == 'director' || $tipoUsuario == 'jugador')) //si no es director ni jugador redirecciona a inicio
	header("location: index.php");


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
.pestana{
	opacity: 0.5;
	box-shadow:none;
}
.pestana:hover{
	opacity: 1;
	box-shadow:none;
}
.pestanaSel {
	box-shadow:none;
}
.pestanaSel:hover{
	box-shadow:none;
}
.link {
	cursor:pointer;	
}
.tablaScroll {
	max-height:300px;
	overflow:auto;
}
input {
    width: 100%;
    padding: 0px;
    margin: 0px;
}



</style>
<!-- heroku<script src="http://server-tierra-media.herokuapp.com/socket.io/socket.io.js"> </script> -->
<!--<script src="http://roltierramedia.ddns.net:8080/socket.io/socket.io.js"> </script>  -->
<!-- <script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>-->
<script src="http://localhost:8080/socket.io/socket.io.js"></script>
<script src="js/jquery-2.2.0.js"></script>
<script src="js/utilidades.js"></script>

<script>
//Conversión de variables PHP a JavaScript
var php_idPartida = "<?php echo $_GET['id'];?>";
var php_nUsuario = "<?php echo $_SESSION['nusuario'];?>";
var php_tipoUsuario = "<?php echo $tipoUsuario;?>";
<?php
	$js_array = json_encode($jugadores);
	echo "var php_jugadores = ". $js_array . ";\n";
?>
</script>
<script src="js/jugar.js"></script>
<script>

</script>
</head>
<body>
<?php
    include "menu.php";

?> 		

<div id=barraSuperior class = "w3-container w3-theme-l1 w3-topnav w3-large w3-row">
	<div id= "menuTop" class="w3-container w3-half">
		<a id="linkModalSubirNivel" style="display:none" class="link w3-red" onclick="document.getElementById('modalSubirNivel').style.display='block'">Subir de Nivel</a>
		<a id="linkModalVerPj" style="display:none" class="link" onclick="document.getElementById('modalVerPj').style.display='block'">Ficha de Personaje</a>
		<a id="linkModalTienda" style="display:none" class="link" onclick="document.getElementById('modalTienda').style.display='block'">Tienda</a>
		

		
	</div>
	<div id="menuTop2" class="w3-container w3-half"> <!-- Para acciones de juego -->
		<div id="accionesJugador" style="display:none"> 
			<a id='prepararSortilegio' class='link'>Preparar sortilegio</a>
			<a id='realizarSortilegio' class='link'>Realizar sortilegio</a>
			<a id='ataqueDistancia' class='link'>Ataque a distancia</a>
			<a id='ataqueCuerpo' class='link'>Ataque cuerpo a cuerpo</a>
			<a id='accionMovimiento' class='link'>Moverse</a>
		</div>
		<div id="accionesDirector" style="display:none"> 
			Elegir personaje: 
			<select class='w3-theme-d4 tagSel'></select>
			<a id='moverForzado' title='Recuerda que puedes mover a un personaje a una posición a la que normalmente no podría' class='link'>Colocar</a>
			<a id='addNPC' class='link'  onclick="document.getElementById('modalNPC').style.display='block'">Añadir NPC</a>
			<a id='verNPC' class='link'  onclick="document.getElementById('modalVerNPC').style.display='block'">Ver NPCs</a>
			<a id='vida' class='link'  onclick="document.getElementById('modalVida').style.display='block'">Modificar PV</a>
			<a id='inicioCombate' class='link'>Combatir</a>
		</div>
	
	</div>

</div>
<br>
<div class="w3-row">
	<div id="izquierda	" class=" w3-quarter">
		<button id="btnchat" class="w3-btn w3-theme-l1 pestanaSel" onclick="pestana('chat')">Chat</button>
		<button id="btncombate" class="w3-btn w3-theme-l4 pestana" onclick="pestana('combate')">Combate</button>
		<!-- <button id="btnnotas" class="w3-btn w3-theme-l4 pestana" onclick="pestana('notas')">Notas</button>-->
		<div id="chat" class="w3-container w3-theme-l1">
			<p>Usuarios conectados: <span id="conectados"></span></p>
			<ul id="chattiemporeal" class="w3-input w3-border w3-theme-l3" style="height:500px;overflow:auto">
				<!-- mensajes procedentes del servidor Nodejs -->
			</ul>
			<br>
			<form id="formchat" >
		    	<input id="m" autocomplete="off" class="w3-input w3-border w3-theme-l3" style="width: 75%;display: inline-block">
	      		<button class="w3-btn w3-theme-d1" style="width: 20%;">Enviar</button>
	      		<br><br>
	      		<select id="destinatarioChat" class="w3-select w3-border">
	      			<option value='all' selected>Envíar a todos</option>
		      		<?php //insertamos con php a todos los jugadores de la partida como posibles destinatarios
		      			echo "<option value='".$director."'>".$director."</option>";
			      		foreach ($jugadores as &$jg){ //buscamos si hay algun jugador con su nombre
			      			if ($jg != $_SESSION['nusuario']) {
			      				echo "<option value='".$jg."'>".$jg."</option>";
			      			}
			      		}
		      		
		      		?>
		      		
	      		</select>
	    	</form>
	    	<br>
	    </div>
	    <div id="combate" class="w3-container w3-theme-l1" style="display:none; min-height: 500px;">

		    <p id="estadoTurno"></p>
		    <div id="accionesTurno">
		   		<!-- acciones -->
		    </div>
		    <br>
		    <div id="opcionesCombate" class="w3-container"></div>
		    <div class="w3-container">
			    <ul id="registroCombate" class="w3-input w3-border w3-theme-l3" style="height:200px;overflow:auto">
					
				</ul>
		    </div>
	    </div>
	    <div id="notas" class="w3-container w3-theme-l1" style="display:none;min-height: 500px;">
		    <p>En construcción</p>
	    </div>
    	
	</div>
	
	<div class="w3-container w3-quarter w3-half" >


		<div id="wrapTablero">
			<canvas id="tablero" width="1014" height="590"></canvas>
		</div>
		<script src="js/hexagonos.js"></script>
		<div id="infoCasilla"></div> <!-- información de la casilla sobre la que se pose el ratón -->
		<div id="estPartida" class="w3-container">
			<h4>Estado de la partida:</h4>	
			<p id="textoEstado"></p>
			<div id="estadoDirector" style="display: none;">
				<textarea id="textareaEstado" style="resize: none" rows="4" cols="100"></textarea>
				<button id="actTextoEstado" class="w3-btn w3-theme-l1">Actualizar</button>
			</div>
		</div>
		

	</div>
</div>







<div id="modalVerPj" class="w3-modal">
	<div class="w3-modal-content w3-card-12 w3-animate-bottom">
		<header class="w3-container w3-theme-d4"> 
		
		<span onclick="document.getElementById('modalVerPj').style.display='none'" class="w3-closebtn">×</span>
		<h2>Ficha de personaje</h2>
		<span id="pjSel" class="w3-red"></span> <!-- Aquí va la selección de personaje para el Director de Juego -->
		<div class="w3-navbar ">
			<button id="btnficha" class="w3-btn w3-theme-l1 pestanaSel" onclick="pestana('ficha')">Ficha</button>
			<button id="btnmagia" class="w3-btn w3-theme-l4 pestana" onclick="pestana('magia')">Magia</button>
			<button id="btnequipo" class="w3-btn w3-theme-l4 pestana " onclick="pestana('equipo')">Equipo</button>
		</div>
		</header>
		
		<div id="ficha" class="w3-container w3-theme-l1">
			<div class="w3-row">
				<div class="w3-container w3-third">
					<p><b>Nombre: </b><span id="modalNombre"></span></p>
					<p><b>Nivel: </b><span id="modalNivel"></span> <b>Experiencia: </b><span id="modalExperiencia"></span></p>
					<p><b>Vida: </b><span id="modalVidaActual"></span>/<span id="modalVidaMaxima"></span></p>
				</div>
				<div class="w3-container w3-third">
					<p><b>Raza: </b><span id="modalRaza"></span></p>
					<p><b>Profesión: </b><span id="modalProfesion"></span></p>
					<p title="Apariencia base + bonificador de Presencia"><b>Apariencia: </b><span id="modalApariencia"></span></p>
				</div>
				<div class="w3-container w3-third">
					<span id="imgprof"></span>
				</div>
				<div class="w3-container w3-half">
					<table class="w3-table w3-striped w3-bordered w3-border w3-card-4">
						<tr class= "w3-theme-d2">
							<th colspan="5" class="w3-center">Atributos</th>
						</tr>
						<tr class= "w3-theme">
							<th>Nombre</th>
							<th title="Grados en la habilidad">Puntuación</th>
							<th title="Bono por puntuación">Bono</th>
							<th title="Bono de Raza">Raza</th>
							<th>Total</th>
						</tr>
						<tr>
							<td id="nFuerza">Fuerza</td>
							<td id="fuerza"></td>
							<td id="pbonFuerza"></td>
							<td id="razaFuerza"></td>
							<td class="bonFue"></td>
						</tr>
						<tr>
							<td id="nAgilidad">Agilidad</td>
							<td id="agilidad"></td>
							<td id="pbonAgilidad"></td>
							<td id="razaAgilidad"></td>
							<td class="bonAgi"></td>
						</tr>
						<tr>
							<td id="nConstitucion">Constitución</td>
							<td id="constitucion"></td>
							<td id="pbonConstitucion"></td>
							<td id="razaConstitucion"></td>
							<td class="bonCon"></td>
						</tr>
						<tr>
							<td id="nInteligencia">Inteligencia</td>
							<td id="inteligencia"></td>
							<td id="pbonInteligencia"></td>
							<td id="razaInteligencia"></td>
							<td class="bonInt"></td>
						</tr>
						<tr>
							<td id="nIntuicion">Intuición</td>
							<td id="intuicion"></td>
							<td id="pbonIntuicion"></td>
							<td id="razaIntuicion"></td>
							<td class="bonI"></td>
						</tr>
						<tr>
							<td id="nPresencia">Presencia</td>
							<td id="presencia"></td>
							<td id="pbonPresencia"></td>
							<td id="razaPresencia"></td>
							<td class="bonPre"></td>
						</tr>
					</table>
					<br>
					<table class="w3-table w3-striped w3-bordered w3-border w3-card-4">
						<tr class= "w3-theme-d2">
							<th colspan="6" class="w3-center">Armas</th>
						</tr>
						<tr class= "w3-theme">
							<th>Nombre</th>
							<th title="Grados en la habilidad">Grados</th>
							<th title="Bonificación por grados">Bono</th>
							<th title="Bono de Atributo">Atr</th>
							<th title="Bono de Profesión">Prof</th>
							<th>Total</th>
						</tr>
						<tr>
							<td id="nFilo">Filo</td>
							<td id="gradoFilo"></td>
							<td id="pbonFilo"></td>
							<td class="bonFue"></td>
							<td class="bonProfArmas"></td>
							<td id="bonFilo"></td>
						</tr>
						<tr>
							<td id="nContundentes">Contundentes</td>
							<td id="gradoContundentes"></td>
							<td id="pbonContundentes"></td>
							<td class="bonFue"></td>
							<td class="bonProfArmas"></td>
							<td id="bonContundentes"></td>
						</tr>
						<tr>
							<td id="nDosManos">A dos manos</td>
							<td id="gradoDosManos"></td>
							<td id="pbonDosManos"></td>
							<td class="bonFue"></td>
							<td class="bonProfArmas"></td>
							<td id="bonDosManos"></td>
						</tr>
						<tr>
							<td id="nArrojadizas">Arrojadizas</td>
							<td id="gradoArrojadizas"></td>
							<td id="pbonArrojadizas"></td>
							<td class="bonAgi"></td>
							<td class="bonProfArmas"></td>
							<td id="bonArrojadizas"></td>
						</tr>
						<tr>
							<td id="nProyectiles">Proyectiles</td>
							<td id="gradoProyectiles"></td>
							<td id="pbonProyectiles"></td>
							<td class="bonAgi"></td>
							<td class="bonProfArmas"></td>
							<td id="bonProyectiles"></td>
						</tr>
						<tr>
							<td id="nAsta">Asta</td>
							<td id="gradoAsta"></td>
							<td id="pbonAsta"></td>
							<td class="bonFue"></td>
							<td class="bonProfArmas"></td>
							<td id="bonAsta"></td>
						</tr>
					</table>
					<br>
					<table class="w3-table w3-striped w3-bordered w3-border w3-card-4">
						<tr class= "w3-theme-d2">
							<th colspan="6" class="w3-center">Generales</th>
						</tr>
						<tr class= "w3-theme">
							<th>Nombre</th>
							<th title="Grados en la habilidad">Grados</th>
							<th title="Bonificación por grados">Bono</th>
							<th title="Bono de Atributo">Atr</th>
							<th title="Bono de Profesión">Prof</th>
							<th>Total</th>
						</tr>
						<tr>
							<td id="nTrepar">Trepar</td>
							<td id="gradoTrepar"></td>
							<td id="pbonTrepar"></td>
							<td class="bonAgi"></td>
							<td class="bonProfGenerales"></td>
							<td id="bonTrepar"></td>
						</tr>
						<tr>
							<td id="nMontar">Montar</td>
							<td id="gradoMontar"></td>
							<td id="pbonMontar"></td>
							<td class="bonI"></td>
							<td class="bonProfGenerales"></td>
							<td id="bonMontar"></td>
						</tr>
						<tr>
							<td id="nNadar">Nadar</td>
							<td id="gradoNadar"></td>
							<td id="pbonNadar"></td>
							<td class="bonAgi"></td>
							<td class="bonProfGenerales"></td>
							<td id="bonNadar"></td>
						</tr>
						<tr>
							<td id="nRastrear">Rastrear</td>
							<td id="gradoRastrear"></td>
							<td id="pbonRastrear"></td>
							<td class="bonInt"></td>
							<td class="bonProfGenerales"></td>
							<td id="bonRastrear"></td>
						</tr>
					</table>
					<br>
					<table class="w3-table w3-striped w3-bordered w3-border w3-card-4">
						<tr class= "w3-theme-d2">
							<th colspan="6" class="w3-center">Tiradas de Resistencia</th>
						</tr>
						<tr class= "w3-theme">
							<th>Nombre</th>
							<th title="Bono de Atributo">Atr</th>
							<th title="Bono de Raza">Raza</th>
							<th>Total</th>
						</tr>
						<tr>
							<td id="nEsencia">Esencia</td>
							<td class="bonInt"></td>
							<td id="bonRazaEsencia"></td>
							<td id="bonEsencia"></td>
						</tr>
						<tr>
							<td id="nCanalizacion">Canalización</td>
							<td class="bonI"></td>
							<td id="bonRazaCanalizacion"></td>
							<td id="bonCanalizacion"></td>
						</tr>
						<tr>
							<td id="nVeneno">Veneno</td>
							<td class="bonCon"></td>
							<td id="bonRazaVeneno"></td>
							<td id="bonVeneno"></td>
						</tr>
						<tr>
							<td id="nEnfermedad">Enfermedad</td>
							<td class="bonCon"></td>
							<td id="bonRazaEnfermedad"></td>
							<td id="bonEnfermedad"></td>
						</tr>
	
					</table>
					
				</div>
				

				<div class="w3-container w3-half">
					<table class="w3-table w3-striped w3-bordered w3-border w3-card-4">
						<tr class= "w3-theme-d2">
							<th colspan="6" class="w3-center">Movimiento</th>
						</tr>
						<tr class= "w3-theme">
							<th>Nombre</th>
							<th title="Grados en la habilidad">Grados</th>
							<th title="Bonificación por grados">Bono</th>
							<th title="Bono de Atributo">Atr</th>
							<th title="Penalizador de armadura">Pen</th>
							<th>Total</th>
						</tr>
						<tr>
							<td id="nSinArmadura">Sin Armadura</td>
							<td id="gradoSinArmadura"></td>
							<td id="pbonSinArmadura"></td>
							<td class="bonAgi"></td>
							<td id=penSinArmadura>0</td>
							<td id="bonSinArmadura"></td>
						</tr>
						<tr>
							<td id="nCuero">Cuero</td>
							<td id="gradoCuero"></td>
							<td id="pbonCuero"></td>
							<td class="bonAgi"></td>
							<td id=penCuero>-15</td>
							<td id="bonCuero"></td>
						</tr>
						<tr>
							<td id="nCueroEndurecido">Cuero Endurecido</td>
							<td id="gradoCueroEndurecido"></td>
							<td id="pbonCueroEndurecido"></td>
							<td class="bonAgi"></td>
							<td id=penCueroEndurecido>-30</td>
							<td id="bonCueroEndurecido"></td>
						</tr>
						<tr>
							<td id="nMalla">Cota de Mallas</td>
							<td id="gradoMalla"></td>
							<td id="pbonMalla"></td>
							<td class="bonFue"></td>
							<td id=penMalla>-45</td>
							<td id="bonMalla"></td>
						</tr>
						<tr>
							<td id="nCoraza">Coraza</td>
							<td id="gradoCoraza"></td>
							<td id="pbonCoraza"></td>
							<td class="bonFue"></td>
							<td id=penCoraza>-60</td>
							<td id="bonCoraza"></td>
						</tr>
					</table>
					<br>
					<table class="w3-table w3-striped w3-bordered w3-border w3-card-4">
						<tr class= "w3-theme-d2">
							<th colspan="6" class="w3-center">Subterfugio</th>
						</tr>
						<tr class= "w3-theme">
							<th>Nombre</th>
							<th title="Grados en la habilidad">Grados</th>
							<th title="Bonificación por grados">Bono</th>
							<th title="Bono de Atributo">Atr</th>
							<th title="Bono de Profesión">Prof</th>
							<th>Total</th>
						</tr>
						<tr>
							<td id="nEmboscar">Emboscar</td>
							<td id="gradoEmboscar"></td>
							<td id="pbonEmboscar"></td>
							<td>0</td>
							<td>0</td>
							<td id="bonEmboscar"></td>
						</tr>
						<tr>
							<td id="nAcechar">Acechar / Esconderse</td>
							<td id="gradoAcechar"></td>
							<td id="pbonAcechar"></td>
							<td class="bonPre"></td>
							<td class="bonProfAcechar"></td>
							<td id="bonAcechar"></td>
						</tr>
						<tr>
							<td id="nAbrirCerraduras">Abrir Cerraduras</td>
							<td id="gradoAbrirCerraduras"></td>
							<td id="pbonAbrirCerraduras"></td>
							<td class="bonInt"></td>
							<td class="bonProfSubterfugio"></td>
							<td id="bonAbrirCerraduras"></td>
						</tr>
						<tr>
							<td id="nDesactivarTrampas">Desactivar Trampas</td>
							<td id="gradoDesactivarTrampas"></td>
							<td id="pbonDesactivarTrampas"></td>
							<td class="bonI"></td>
							<td class="bonProfSubterfugio"></td>
							<td id="bonDesactivarTrampas"></td>
						</tr>
					</table>
					<br>
					<table class="w3-table w3-striped w3-bordered w3-border w3-card-4">
						<tr class= "w3-theme-d2">
							<th colspan="6" class="w3-center">Mágicas</th>
						</tr>
						<tr class= "w3-theme">
							<th>Nombre</th>
							<th title="Grados en la habilidad">Grados</th>
							<th title="Bonificación por grados">Bono</th>
							<th title="Bono de Atributo">Atr</th>
							<th title="Bono de Profesión">Prof</th>
							<th>Total</th>
						</tr>
						<tr>
							<td id="nLeerRunas">Leer Runas</td>
							<td id="gradoLeerRunas"></td>
							<td id="pbonLeerRunas"></td>
							<td class="bonInt"></td>
							<td id="bonProfLeerRunas"></td>
							<td id="bonLeerRunas"></td>
						</tr>
						<tr>
							<td id="nObjetosMagicos">Objetos Mágicos</td>
							<td id="gradoObjetosMagicos"></td>
							<td id="pbonObjetosMagicos"></td>
							<td class="bonI"></td>
							<td id="bonProfObjetosMagicos"></td>
							<td id="bonObjetosMagicos"></td>
						</tr>
						<tr>
							<td id="nSortilegiosDirigidos">Sortilegios Dirigidos</td>
							<td id="gradoSortilegiosDirigidos"></td>
							<td id="pbonSortilegiosDirigidos"></td>
							<td class="bonAgi"></td>
							<td id="bonProfMagicas"></td>
							<td id="bonSortilegiosDirigidos"></td>
						</tr>
					</table>
					<br>
					<table class="w3-table w3-striped w3-bordered w3-border w3-card-4">
						<tr class= "w3-theme-d2">
							<th colspan="6" class="w3-center">Otros</th>
						</tr>
						<tr class= "w3-theme">
							<th>Nombre</th>
							<th title="Grados en la Habilidad">Grados</th>
							<th title="Bonificación por grados">Bono</th>
							<th title="Bono de Atributo">Atr</th>
							<th title="Bono de Profesión">Prof</th>
							<th>Total</th>
						</tr>
						<tr>
							<td id="nPercepcion">Percepción</td>
							<td id="gradoPercepcion"></td>
							<td id="pbonPercepcion"></td>
							<td class="bonI"></td>
							<td id="bonProfPercepcion"></td>
							<td id="bonPercepcion"></td>
						</tr>
					</table>
				</div>
			</div>
			<br>
		</div>
		<div id="magia" style="display:none;"class="w3-container w3-theme-l1">
			<div class="w3-row">
				<div class="w3-container w3-half">
					<p><b>Dominio: </b><span id="modalDominio"></span></p>
				</div>
				<div class="w3-container w3-half">
					<p><b>Puntos de Poder: </b><span id="modalPuntosPoder"></span>/<span id="modalPuntosPoderMaximos"></span></p>
					<p><b>Bono de Sortilegios Base: </b><span id="modalSortilegiosBase"></span></p>
				</div>
			</div>
			<h2 class="w3-center">Listas de Sortilegios</h2>
			<div class="w3-row">
				<div class="w3-container w3-half">
					<h4>Listas de Dominio</h4>
					<div id="dominioAprendidas">
						<!-- dinamico -->
					</div>
					<br><br><br>
					<div style="display:none;" id="dominioAprendiendo">
						<table id="dominioAprendiendoTabla" class="w3-table w3-bordered w3-border w3-card-4" >
							<tr class= "w3-theme-d2">
								<th>Listas en Aprendizaje</th>
								<th>Puntos</th>
							</tr>
							<!-- Listas disponibles se introduciran dinámicamente -->
						</table>
					</div>
				</div>
				<div class="w3-container w3-half">
					<h4>Listas de Profesión</h4>
					<div id="profesionAprendidas">
						<!-- dinamico -->
					</div>
					<br><br><br>
					<div style="display:none;" id="profesionAprendiendo">
						<table id="profesionAprendiendoTabla" class="w3-table w3-bordered w3-border w3-card-4" >
							<tr class= "w3-theme-d2">
								<th>Listas en Aprendizaje</th>
								<th>Puntos</th>
							</tr>
							<!-- Listas disponibles se introduciran dinámicamente -->
						</table>
					</div>
				</div>
			</div>
			
					
		</div>
		<div id="equipo" style="display:none;" class="w3-container w3-theme-l1">
			<h3>Resumen</h3>
			<div class="w3-row">
				<div class="w3-container w3-third">
					<p><b>Arma : </b><span id="armaEquipada"></span></p>
					<p><b>Escudo: </b><span id="escudoEquipado"></span></p>
				</div>
				<div class="w3-container w3-third">
					<p><b>Armadura : </b><span id="armaduraEquipada"></span></p>
					<p><b>Movimiento: </b><span id="movimiento"></span></p>
				</div>
				<div class="w3-container w3-third">
					<p><b>Dinero: </b><span class="dinero"></span> monedas de plata</p>
				</div>
			
			</div>
			<h3>Inventario</h3>
			<h4>Armas</h4>
			<div class="tablaScroll">
				<table id="equipoArmas" class="w3-table w3-striped w3-bordered w3-border">
					<tr class="w3-theme-d2">
						<th title="Nombre del arma">Nombre</th>
						<th title="Tipo de arma">Tipo</th>
						<th title="Rango de pifia">Pifia</th>
						<th title="Tipo de Crítico">Crit</th>
						<th title="Alcance del arma">Rango</th>
						<th title="Peso del arma">Peso</th>
						<th title="Equipar">Equipar</th>
					</tr>
					<!-- A partir de aquí se meterán filas dinámicamente con jQuery -->
				</table>
			</div>
			<h4>Armaduras</h4>
			<div class="tablaScroll">
				<table id="equipoArmaduras" class="w3-table w3-striped w3-bordered w3-border">
					<tr class="w3-theme-d2">
						<th title="Nombre de la armadura">Nombre</th>
						<th title="Peso de la armadura">Peso</th>
						<th title="Equipar">Equipar</th>
					</tr>
					<!-- A partir de aquí se meterán filas dinámicamente con jQuery -->
				</table>
			</div>
			<h4>Otros</h4>
			<div class="tablaScroll">
				<table id="equipoOtros" class="w3-table w3-striped w3-bordered w3-border">
					<tr class="w3-theme-d2">
						<th title="Nombre">Nombre</th>
						<th title="Descripción">Descripción</th>
						<th title="Peso">Peso</th>
						<th title="Equipar">Equipar</th>
					</tr>
					<!-- A partir de aquí se meterán filas dinámicamente con jQuery -->
				</table>
			</div>
		</div>
	</div>
</div>

<div id="modalTienda" class="w3-modal">
	<div class="w3-modal-content w3-theme-l1 w3-card-12 w3-animate-bottom">
		<header class="w3-container w3-theme-d4"> 
		
		<span onclick="document.getElementById('modalTienda').style.display='none'" class="w3-closebtn">×</span>
		<h2>Tienda (Dinero: <span class="dinero"></span>)</h2>
		<div class="w3-navbar ">
			<button id="btnarmas" class="w3-btn w3-theme-l1 pestanaSel" onclick="pestana('armas')">Armas</button>
			<button id="btnarmaduras" class="w3-btn w3-theme-l4 pestana" onclick="pestana('armaduras')">Armadura</button>
			<!--  De momento no hay <button id="btnotros" class="w3-btn w3-theme-l4 pestana" onclick="pestana('otros')">Otros</button>-->
		</div>
		</header>
		
		<div id="armas" class="w3-container w3-theme-l1">
			<h4>Comprar Armas</h4>
			<div class="tablaScroll"> <!-- De esta manera solo se scrollearan los datos y el header de la tabla -->
				<table id="tiendaArmas" class="w3-table w3-striped w3-bordered w3-border">
					<tr class="w3-theme-d2">
						<th title="Nombre del arma">Nombre</th>
						<th title="Tipo de arma">Tipo</th>
						<th title="Rango de pifia">Pifia</th>
						<th title="Tipo de Crítico">Crit</th>
						<th title="Alcance del arma">Rango</th>
						<th title="Peso del arma">Peso</th>
						<th title="Precio del arma">Precio</th>
						<th title="Comprar">Comprar</th>
					</tr>
				<!-- A partir de aquí se meterán filas dinámicamente con jQuery -->
				</table>
				
			</div>
		</div>
		<div id="armaduras" style="display:none;" class="w3-container w3-theme-l1">
			<h4>Comprar Armaduras</h4>
			<div class="tablaScroll"> <!-- De esta manera solo se scrollearan los datos y el header de la tabla -->
				<table id="tiendaArmaduras" class="w3-table w3-striped w3-bordered w3-border">
					<tr class="w3-theme-d2">
						<th title="Nombre de la armadura">Nombre</th>
						<th title="Peso de la armadura">Peso</th>
						<th title="Precio de la armadura">Precio</th>
						<th title="Comprar">Comprar</th>
					</tr>
				<!-- A partir de aquí se meterán filas dinámicamente con jQuery -->
				</table>
				
			</div>
		</div>
		<div id="otros" style="display:none;" class="w3-container w3-theme-l1">
			<h4>Comprar Consumibles y otros</h4>
			<div class="tablaScroll">
				<table id="tiendaOtros" class="w3-table w3-striped w3-bordered w3-border">
					<tr class="w3-theme-d2">
						<th title="Nombre">Nombre</th>
						<th title="Descripción">Descripción</th>
						<th title="Peso">Peso</th>
						<th title="Precio">Precio</th>
						<th title="Comprar">Comprar</th>
					</tr>
				<!-- A partir de aquí se meterán filas dinámicamente con jQuery -->
				</table>
			</div>
		</div>
		<br>
		<div style="display:none;" class="w3-container carritoOculto">
		<h4>Lista de Compra:</h4>
		<table id="carrito" class="w3-table w3-white w3-bordered w3-border">
		</table>
		<p>
			Total a pagar: <span id="totalCarrito"></span>  
			<button id="carritoComprar" class="w3-btn w3-right w3-green" >Comprar</button>
			<button id ="carritoCancelar" class="w3-btn w3-right w3-red">Cancelar</button> 
		</p>

		</div>
	</div>
</div>
		
<div id="modalSubirNivel" class="w3-modal">
	<div class="w3-modal-content w3-theme-l1 w3-card-12 w3-animate-bottom">
		<header class="w3-container w3-theme-d4"> 
		<span onclick="document.getElementById('modalSubirNivel').style.display='none'" class="w3-closebtn">×</span>
		<h2>Subida de Nivel</h2>
		</header>
		
		
			
		<div class="w3-container w3-row w3-border-bottom">
			<h4>Habilidades</h4>
			<div class="w3-container w3-half">
				<table class="w3-table w3-striped w3-bordered w3-border w3-card-4">
								<tr class= "w3-theme-d2">
									<th colspan="5" class="w3-center">Movimiento (<span id="puntosmovimiento"></span> puntos)</th>
								</tr>
								<tr class= "w3-theme">
									<th>Nombre</th>
									<th title="Grados en la habilidad">Grados</th>
								</tr>
								<tr id="accSubirsinArmadura" class="link">
									<td>Sin Armadura</td>
									<td id="subirsinArmadura"></td>
								</tr>
								<tr id="accSubircuero" class="link">
									<td>Cuero</td>
									<td id="subircuero"></td>
								</tr>
								<tr id="accSubircueroEndurecido" class="link">
									<td>Cuero Endurecido</td>
									<td id="subircueroEndurecido"></td>
								</tr>
								<tr id="accSubircotaMalla" class="link">
									<td>Cota de Mallas</td>
									<td id="subircotaMalla"></td>
								</tr>
								<tr id="accSubircoraza" class="link">
									<td>Coraza</td>
									<td id="subircoraza"></td>
								</tr>
				</table>
				<br>
				<table class="w3-table w3-striped w3-bordered w3-border w3-card-4">
								<tr class= "w3-theme-d2">
									<th colspan="5" class="w3-center">Armas (<span id="puntosarmas"></span> puntos)</th>
								</tr>
								<tr class= "w3-theme">
									<th>Nombre</th>
									<th title="Grados en la habilidad">Grados</th>
								</tr>
								<tr id="accSubirfilo" class="link">
									<td>Filo</td>
									<td id="subirfilo"></td>
								</tr>
								<tr id="accSubircontundente" class="link">
									<td>Contundentes</td>
									<td id="subircontundente"></td>
								</tr>
								<tr id="accSubirdosManos" class="link">
									<td>A dos Manos</td>
									<td id="subirdosManos"></td>
								</tr>
								<tr id="accSubirarrojadizas" class="link">
									<td>Arrojadizas</td>
									<td id="subirarrojadizas"></td>
								</tr>
								<tr id="accSubirproyectiles" class="link">
									<td>Proyectiles</td>
									<td id="subirproyectiles"></td>
								</tr>
								<tr id="accSubirasta" class="link">
									<td>Asta</td>
									<td id="subirasta"></td>
								</tr>
				</table>
				<br>
				<div class="magiaON" >
					<h4>Listas de Sortilegios</h4>
				
					<table  id="tablaMagia" class="w3-table w3-striped w3-bordered w3-border w3-card-4" >
					<tr class= "w3-theme-l2">
							<th colspan="2" class="w3-center">Listas de Sortilegios (<span id="puntosLista"></span> puntos)</th>
						</tr>
					<!-- Listas disponibles se introduciran dinámicamente -->
					</table>
				</div>
			</div>

			<div class="w3-half">
				<table class="w3-table w3-striped w3-bordered w3-border w3-card-4">
								<tr class= "w3-theme-d2">
									<th colspan="5" class="w3-center">Generales (<span id="puntosgenerales"></span> puntos)</th>
								</tr>
								<tr class= "w3-theme">
									<th>Nombre</th>
									<th title="Grados en la habilidad">Grados</th>
								</tr>
								<tr id="accSubirtrepar" class="link">
									<td>Trepar</td>
									<td id="subirtrepar"></td>
								</tr>
								<tr id="accSubirmontar" class="link">
									<td>Montar</td>
									<td id="subirmontar"></td>
								</tr>
								<tr id="accSubirnadar" class="link">
									<td>Nadar</td>
									<td id="subirnadar"></td>
								</tr>
								<tr id="accSubirrastrear" class="link">
									<td>Rastrear</td>
									<td id="subirrastrear"></td>
								</tr>
				</table>
				<br>
				<table class="w3-table w3-striped w3-bordered w3-border w3-card-4">
								<tr class= "w3-theme-d2">
									<th colspan="5" class="w3-center">Subterfugio (<span id="puntossubterfugio"></span> puntos)</th>
								</tr>
								<tr class= "w3-theme">
									<th>Nombre</th>
									<th title="Grados en la habilidad">Grados</th>
								</tr>
								<tr id="accSubiremboscar" class="link">
									<td>Emboscar</td>
									<td id="subiremboscar"></td>
								</tr>
								<tr id="accSubiracecharEsconderse" class="link">
									<td>Acechar / Esconderse</td>
									<td id="subiracecharEsconderse"></td>
								</tr>
								<tr id="accSubirabrirCerraduras" class="link">
									<td>Abrir Cerraduras</td>
									<td id="subirabrirCerraduras"></td>
								</tr>
								<tr id="accSubirdesactivarTrampas" class="link">
									<td>Desactivar Trampas</td>
									<td id="subirdesactivarTrampas"></td>
								</tr>
				</table>
				<br>
				<table class="w3-table w3-striped w3-bordered w3-border w3-card-4">
								<tr class= "w3-theme-d2">
									<th colspan="5" class="w3-center">Mágicas (<span id="puntosmagicas"></span> puntos)</th>
								</tr>
								<tr class= "w3-theme">
									<th>Nombre</th>
									<th title="Grados en la habilidad">Grados</th>
								</tr>
								<tr id="accSubirleerRunas" class="link">
									<td>Leer Runas</td>
									<td id="subirleerRunas"></td>
								</tr>
								<tr id="accSubirobjetosMagicos" class="link">
									<td>Objetos Mágicos</td>
									<td id="subirobjetosMagicos"></td>
								</tr>
								<tr id="accSubirsortilegiosDirigidos" class="link">
									<td>Sortilegios Dirigidos</td>
									<td id="subirsortilegiosDirigidos"></td>
								</tr>
				</table>
				<br>
				<p class="magiaON w3-small" style="display:none;"> 
					Recuerda que la probabilidad de aprender una lista de sortilegios es la puntuación que tengas en dicha lista multiplicada por 20. 
					Los puntos no empleados no se guardarán para un siguiente nivel.
				</p>
			</div>
		
		</div>
		<br>
		
		<div class="w3-container w3-row w3-border-bottom">
			<div class="w3-half">
				
			</div>

		</div>
		<div class="w3-container w3-border-bottom">
			<br>
			<button id="nivelAplicar" class="w3-btn w3-green">Guardar Cambios</button>
			<button onclick="document.getElementById('modalSubirNivel').style.display='none'" class="w3-btn w3-red">Cancelar</button>
			<br>
		</div>
		<br>
		
		
		
		
		
	</div>
</div>
<div id="modalExp" class="w3-modal">
	<div class="w3-modal-content w3-theme-l1 w3-card-12 w3-animate-bottom">
		<header class="w3-container w3-theme-d4">
			<span class="w3-closebtn experienciaCancelar">×</span>
			<h2>Descanso de Personajes</h2>
		</header>
		<br>

		<div class="w3-row">	
			<div id="darPuntosExp" class="w3-container w3-half w3-border-right">
				<table id="darExpTabla" class="w3-table w3-bordered w3-border">
				<!-- A partir de aquí se meterán filas dinámicamente con jQuery -->
				</table>
			</div>
			<div id="textoExperiencia" class="w3-container w3-half">
				<ul class="w3-ul w3-border">
				  <li><h5>Experiencia necesaria para alcanzar cierto nivel</h5></li>
				  <li>Nivel 2: 20000</li>
				  <li>Nivel 3: 30000</li>
				  <li>Nivel 4: 40000</li>
				  <li>Nivel 5: 50000</li>
				  <li>Nivel 6: 70000</li>
				  <li>Nivel 7: 90000</li>
				  <li>Nivel 8: 110000</li>
				  <li>Nivel 9: 130000</li>
				  <li>Nivel 10: 150000</li>
				</ul>
			</div>
		</div>
		<div class="w3-container w3-border-bottom">
			<br>
			<button id="experienciaAplicar" class="w3-btn w3-green">Guardar Cambios</button>
			<button class="w3-btn w3-red experienciaCancelar">Cancelar</button>
			<br>
		</div>
	</div>
</div>

<div id="modalDescanso" class="w3-modal">
	<div class="w3-modal-content w3-theme-l1 w3-card-12 w3-animate-bottom">
		<header class="w3-container w3-theme-d4">
			<span class="w3-closebtn descansoCancelar">×</span>
			<h2>Descanso de Personajes</h2>
		</header>
		<br>
		<div class="w3-container w3-border-bottom">
			<p>Los personajes recuperan 3 puntos de vida por cada hora de descanso</p>
			<p>Si el descanso es de al menos 8 horas, se restaurarán los puntos de poder</p>
		</div>
		<div class="w3-row">	
			<div id="horasDescanso" class="w3-container w3-half w3-border-right">
				<input type="radio" style="width: auto" name="tipoDescanso" value="general" checked><label> Todos descansan el mismo tiempo</label>
				<br>
				<p> Horas de descanso: <input style="width: 15%" id='horasGeneral' max='999' type='number'value='0'>
			</div>
			<div id="textoDescanso" class="w3-container w3-half">
				<input type="radio" style="width: auto" name="tipoDescanso" value="individual"><label> Cada uno descansa un tiempo distinto</label>
				<table id="horasDescansoTabla" class="w3-table w3-bordered w3-border">
				<!-- A partir de aquí se meterán filas dinámicamente con jQuery -->
				</table>
			</div>
		</div>
		<div class="w3-container w3-border-bottom">
			<br>
			<button id="descansoAplicar" class="w3-btn w3-green">Guardar Cambios</button>
			<button class="w3-btn w3-red descansoCancelar">Cancelar</button>
			<br>
		</div>
	</div>
</div>

<div id="modalNPC" class="w3-modal">
	<div class="w3-modal-content w3-theme-l1 w3-card-12 w3-animate-bottom">
		<header class="w3-container w3-theme-d4"> 
		
		<span onclick="document.getElementById('modalNPC').style.display='none'" class="w3-closebtn">×</span>
		<h2>Añadir enemigo</h2>
		</header>
		<br>
		<div id="listaEnemigos" class="w3-container w3-theme-l1">

				<table id="tablaEnemigos" class="w3-table w3-striped w3-bordered w3-border">
					<tr class="w3-theme-d2">
						<th title="Nombre">Nombre</th>
						<th title="Nivel">Nivel</th>
						<th title="Movimiento">Mov</th>
						<th title="PV">PV</th>
						<th title="Armadura">Armadura</th>
						<th title="Defensa">Defensa</th>
						<th title="Ataque">Ataque</th>
						<th title="Tipo Ataque">Tipo</th>
						<th title="Crítico">Crítico</th>
						<th title="Add">Añadir</th>
					</tr>
				<!-- A partir de aquí se meterán filas dinámicamente con jQuery -->
				</table>
				
		</div>
	</div>
</div>

<div id="modalDatosNPC" class="w3-modal">
	<div class="w3-modal-content w3-theme-l1 w3-card-12 w3-animate-bottom">
		<header class="w3-container w3-theme-d4"> 
		
		<span onclick="document.getElementById('modalDatosNPC').style.display='none'" class="w3-closebtn">×</span>
		<h2>Nombre y color del enemigo</h2>
		</header>
		<br>
		<div class= "w3-row">
			<div class="w3-container w3-half">
				<label><b>Nombre</b></label>
				<input id="nNPC" class="w3-input w3-border w3-theme-l3" type="text" maxlength="25" width="200" />
			</div>
			<div class="w3-container w3-half">
				<label><b>Color</b></label>
				<br>
				<input type="color" id="colorNPC" value="#888888"/>
				
			</div>
		</div>
		<br>
		<div class="w3-container">
		<a id='addDatosNPC' class='w3-btn w3-green'>Aceptar</a>
		</div>
		<br>
		
		
	</div>
</div>

<div id="modalVerNPC" class="w3-modal">
	<div  class="w3-modal-content w3-theme-l1 w3-card-12 w3-animate-bottom">
		<header class="w3-container w3-theme-d4"> 
		<span onclick="document.getElementById('modalVerNPC').style.display='none'" class="w3-closebtn">×</span>
		<h2>Lista de NPC</h2>
		</header>
		<br>
		<div id="listaEnemigos" class="w3-container w3-theme-l1">

				<table id="enemigosVivos" class="w3-table w3-striped w3-bordered w3-border">
				<!-- A partir de aquí se meterán filas dinámicamente con jQuery -->
				</table>
				
		</div>
		<br>
		<div class="w3-container">
			<button class="w3-btn w3-green"
					onclick="document.getElementById('modalVerNPC').style.display='none'; document.getElementById('modalNPC').style.display='block'">Añadir otro</button>
		</div>
		<br>
	</div>

</div>

<div id="modalVida" class="w3-modal">
	<div  class="w3-modal-content w3-theme-l1 w3-card-12 w3-animate-bottom">
		<header class="w3-container w3-theme-d4"> 
		<span class="w3-closebtn vidaCancelar">×</span>
		<h2>Vida Personajes</h2>
		</header>
		<br>
		<div class="w3-row">
			<div id="vidaPersonajes" class="w3-container w3-half w3-border-right">
				<table id="tablaVidaPersonajes" class="w3-table w3-striped w3-bordered w3-border">
				<!-- A partir de aquí se meterán filas dinámicamente con jQuery -->
				</table>
			</div>
			<div id="vidaNPC" class="w3-container w3-half">
				<table id="tablaVidaEnemigos" class="w3-table w3-striped w3-bordered w3-border">
				<!-- A partir de aquí se meterán filas dinámicamente con jQuery -->
				</table>
				<input name="autoEliminar" type="checkbox" class="w3-check">	<label class="w3-validate">Eliminar NPC cuando su vida llega a 0</label>
			</div>
		</div>
		<div class="w3-container w3-border-bottom">
			<br>
			<button id="vidaGuardar" class="w3-btn w3-green">Guardar Cambios</button>
			<button class="w3-btn w3-red vidaCancelar">Cancelar</button>
			<br>
		</div>
	</div>
</div>

<div id="modalAccionesNPC" class="w3-modal">
	<div  class="w3-modal-content w3-theme-l1 w3-card-12 w3-animate-bottom">
		<header class="w3-container w3-theme-d4"> 
		<h2>Acciones de los NPC</h2>
		</header>
		<br>
		<div id="listaAccionesEnemigos" class="w3-container w3-theme-l1">

				<table id="enemigosAccionesVivos" class="w3-table w3-striped w3-bordered w3-border">
				<!-- A partir de aquí se meterán filas dinámicamente con jQuery -->
				</table>
				
		</div>
		<br>
		<div class="w3-container">
			<button id="enviarAccionesNPC" class="w3-btn w3-green"
					onclick="document.getElementById('modalAccionesNPC').style.display='none';">Enviar</button>
		</div>
		<br>
	</div>

</div>
</body>
</html>