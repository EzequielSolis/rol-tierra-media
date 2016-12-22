<?php
session_start();

if(!isset($_SESSION['nusuario'])){ //si no esta logeado
	header("location: index.php");
}
include "loginDB.php";
$nivelPartida = mysqli_fetch_assoc(mysqli_query($link, "SELECT `nivel` FROM `partidas` WHERE id=".$_GET['id'] ));
$nivel = $nivelPartida['nivel'];
echo $nivel;

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
.mover{
	cursor: move;
	font-size: 120%;
	}
.numero {
    width: 80px;
	}
</style>
<script src="http://localhost:8080/socket.io/socket.io.js"> </script>  
<!-- <script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>-->
<script src="js/jquery-2.2.0.js"></script>
<script src="js/utilidades.js"></script>
<script>
var php_idPartida = "<?php echo $_GET['id'];?>";
var php_nUsuario = "<?php echo $_SESSION['nusuario'];?>";
var php_nivel = "<?php echo $nivel;?>";

</script>
<script src="js/crearPJ.js"></script>
</head>
<body>

<?php
    include "menu.php";

?> 		

<h1>Creación de Personaje</h1>
<div id="raza_prof" class="w3-row w3-border-top">
	<section id="sec_raza" class="w3-container w3-half w3-border-right">
	<h3>Raza</h3>
		<p><input class="w3-radio" type="radio" name="raza" value="Hobbit"> <label class="w3-validate">Hobbit</label></p>
		<p><input class="w3-radio" type="radio" name="raza" value="Umli"> <label class="w3-validate">Umli</label></p>
		<p><input class="w3-radio" type="radio" name="raza" value="Enano"> <label class="w3-validate">Enano</label></p>
		<p><input class="w3-radio" type="radio" name="raza" value="Wose"> <label class="w3-validate">Wose</label></p>
		<p><input class="w3-radio" type="radio" name="raza" value="Humano"> <label class="w3-validate">Humano</label></p>
		<p><input class="w3-radio" type="radio" name="raza" value="Medio Elfo"> <label class="w3-validate">Medio Elfo</label></p>
		<p><input class="w3-radio" type="radio" name="raza" value="Elfo Silvano"> <label class="w3-validate">Elfo Silvano</label></p>
		<p><input class="w3-radio" type="radio" name="raza" value="Elfo Sindar"> <label class="w3-validate">Elfo Sindar</label></p>
		<p><input class="w3-radio" type="radio" name="raza" value="Elfo Noldor"> <label class="w3-validate">Elfo Noldor</label></p>
		<br>
		<div class="w3-container " id="infoRaza"  style="display:none">
			<table class="w3-table-all">
				<tr class="w3-theme">
			        <th>Atributo</th>
			        <th>Bonificador</th>
			      </tr>
			      <tr>
				      <td>Fuerza</td>
				      <td id="repFuerza"></td>
				   </tr>
				   <tr>
				      <td>Agilidad</td>
				      <td id="repAgilidad"></td>
				   </tr>
				   <tr>
				      <td>Constitución</td>
				      <td id="repConstitucion"></td>
				   </tr>
				   <tr>
				      <td>Inteligencia</td>
				      <td id="repInteligencia"></td>
				   </tr>
				   <tr>
				      <td>Intuición</td>
				      <td id="repIntuicion"></td>
				   </tr>
				   <tr>
				      <td>Presencia</td>
				      <td id="repPresencia"></td>
				   </tr>

			</table>
		</div>
		
	
	</section>
	<section id="sec_profesion" class="w3-container w3-half">
	<h3>Profesión</h3>
		<p><input class="w3-radio" type="radio" name="profesion" value="Guerrero"> <label class="w3-validate">Guerrero</label></p>
		<p><input class="w3-radio" type="radio" name="profesion" value="Explorador"> <label class="w3-validate">Explorador</label></p>
		<p><input class="w3-radio" type="radio" name="profesion" value="Mago"> <label class="w3-validate">Mago</label></p>
		<p><input class="w3-radio" type="radio" name="profesion" value="Animista"> <label class="w3-validate">Animista</label></p>
		<p><input class="w3-radio" type="radio" name="profesion" value="Montaraz"> <label class="w3-validate">Montaraz</label></p>
		<p><input class="w3-radio" type="radio" name="profesion" value="Bardo"> <label class="w3-validate">Bardo</label></p>
		<p><input type="color" id="color" value="#888888"> Color que te representará en el mapa</p>
		<br><br>
		<button class="w3-btn w3-brown" id="btn_raza_prof">Continuar</button>
		<br><br>
		<div class="w3-container " id="infoProfesion"  style="display:none">
			<table class="w3-table-all">
				<tr class="w3-theme">
			        <th>Categoria</th>
			        <th>Puntos a repartir</th>
			      </tr>
			      <tr>
				      <td>Movimiento</td>
				      <td id="repMovimiento"></td>
				   </tr>
			       <tr>
				      <td>Combate</td>
				      <td id="repCombate"></td>
				   </tr>
				   <tr>
				      <td>Generales</td>
				      <td id="repGenerales"></td>
				   </tr>
				   <tr>
				      <td>Subterfugio</td>
				      <td id="repSubterfugio"></td>
				   </tr>
				   <tr>
				      <td>Mágicas</td>
				      <td id="repMagicas"></td>
				   </tr>
			</table>
			<br>
			<table class="w3-table-all">
				<tr class="w3-theme">
			        <th>Categoria</th>
			        <th>Bono por nivel</th>
			      </tr>
			       <tr>
				      <td>Combate</td>
				      <td id="bonCombate"></td>
				   </tr>
				   <tr>
				      <td>Generales</td>
				      <td id="bonGenerales"></td>
				   </tr>
				   <tr>
				      <td>Subterfugio</td>
				      <td id="bonSubterfugio"></td>
				   </tr>
				   <tr>
				      <td>Mágicas</td>
				      <td id="bonMagicas"></td>
				   </tr>
			</table>
		</div>
		

	
	</section>
	
</div>

	<section id="sec_tiradas" class="w3-container w3-row w3-border-top">
		<h3>Características de Personaje</h3>
		<p>Mueve las tiradas que has obtenido entre las distintas
			características</p>
		<div class="w3-half">
			<table class="w3-table w3-striped w3-bordered w3-border w3-card-4">
				<tr class="w3-theme-l2">
					<th>Fuerza</th>
					<th>Agilidad</th>
					<th>Constitución</th>
					<th>Inteligencia</th>
					<th>Intuición</th>
					<th>Presencia</th>

				</tr>
				<tr>
					<td class="mover" id="tir1" draggable="true" ondragstart="drag(event)" ondrop="drop(event)" ondragover="allowDrop(event)"></td>
					<td class="mover" id="tir2" draggable="true" ondragstart="drag(event)" ondrop="drop(event)"	ondragover="allowDrop(event)"></td>
					<td class="mover" id="tir3" draggable="true" ondragstart="drag(event)" ondrop="drop(event)" ondragover="allowDrop(event)"></td>
					<td class="mover" id="tir4" draggable="true" ondragstart="drag(event)" ondrop="drop(event)" ondragover="allowDrop(event)"></td>
					<td class="mover" id="tir5" draggable="true" ondragstart="drag(event)" ondrop="drop(event)" ondragover="allowDrop(event)"></td>
					<td class="mover" id="tir6" draggable="true" ondragstart="drag(event)" ondrop="drop(event)" ondragover="allowDrop(event)"></td>

				</tr>
			</table>
			<br>
			<p>Marca esta casilla para cambiar la puntuación de tu característica primaria de tu profesión por un 90. Por ejemplo: si eres un
				montaraz, tu característica primaria sería Constitución, así que si tienes 52 Constitución puedes cambiarlo por un 90 (¡asegúrate de cambiarlo por
				tu puntuación mas baja!)</p>
			<p>Eres un <strong><span id="car_prof"></span></strong>, así que tu característica primaria es <strong><span id="car_prof_pri"></span></strong>.</p>
			
			<p>
				<input id="checkprimario" type="checkbox" class="w3-check"><label
					class="w3-validate">Reemplazar tu característica primaria por un 90</label>
			</p>
			<button id="btn_car" class="w3-btn w3-brown">Continuar</button>
		</div>
	</section>
	
	<section id="sec_adol" class="w3-container w3-border-top">
	<div class="w3-row">
		<h3>Habilidades adquiridas en la adolescencia y durante el aprendizaje</h3>
		<p>Estas son las habilidades que has adquirido en la adolescencia debido a tu raza (<strong><span id="adol_raza"></span></strong>).</p>
		<p>Según tu profesión, te serán asignados unos puntos para cada categoria que representan los puntos de habilidad que has ganado durante el aprendizaje de tu profesión.
		Haz <em>click izquierdo</em> sobre una habilidad para incrementarla (siempre que te queden puntos) o <em>click derecho</em> para decrementarla (pero nunca por debajo del mínimo 
		que tu raza te otorga) </p>
		<p class="w3-small">Solo puedes subir dos grados en cada habilidad, costando el segundo grado dos puntos en lugar de uno. La excepción son las 
		habilidades de Movimiento y Maniobra que tienen grados máximos (Sin armadura: 2, Cuero: 3, Cuero endurecido: 5, Cota de Malla: 7, Coraza: 9)</p>
		
		<div class="w3-container w3-quarter">
			<table class="w3-table w3-striped w3-bordered w3-border w3-card-4">
				<tr class= "w3-theme-l2">
					<th colspan="2" class="w3-center">Movimiento y Maniobra (<span id="movimiento"></span> puntos)</th>
				</tr>
				<tr onclick="incrementarHabilidad('sinArmadura')" oncontextmenu="decrementarHabilidad('sinArmadura');return false;">
					<td class="w3-center">Sin armadura</td><td class="w3-center" id="sinArmadura"></td>
				</tr>
				<tr onclick="incrementarHabilidad('cuero')" oncontextmenu="decrementarHabilidad('cuero');return false;">
					<td class="w3-center">Cuero</td><td class="w3-center" id="cuero"></td>
				</tr>
				<tr onclick="incrementarHabilidad('cueroEndurecido')" oncontextmenu="decrementarHabilidad('cueroEndurecido');return false;">
					<td class="w3-center">Cuero endurecido</td><td class="w3-center"><span id="cueroEndurecido"></span></td>
				</tr>
				<tr onclick="incrementarHabilidad('cotaMalla')" oncontextmenu="decrementarHabilidad('cotaMalla');return false;">
					<td class="w3-center">Cota de malla</td><td class="w3-center" id="cotaMalla"></td>
				</tr>	
				<tr onclick="incrementarHabilidad('coraza')" oncontextmenu="decrementarHabilidad('coraza');return false;">
					<td class="w3-center">Coraza</td><td class="w3-center" id="coraza"></td>
				</tr>	
			
			
			</table>
			<br>
			<table class="w3-table w3-striped w3-bordered w3-border w3-card-4">
				<tr class= "w3-theme-l2">
					<th colspan="2" class="w3-center">Habilidad con las Armas (<span id="armas"></span> puntos)</th>
				</tr>
				<tr onclick="incrementarHabilidad('filo')" oncontextmenu="decrementarHabilidad('filo');return false;">
					<td class="w3-center">De filo</td><td class="w3-center"id="filo"></td>
				</tr>
				<tr onclick="incrementarHabilidad('contundente')" oncontextmenu="decrementarHabilidad('contundente');return false;">
					<td class="w3-center">Contundente</td><td class="w3-center" id="contundente"></td>
				</tr>
				<tr onclick="incrementarHabilidad('dosManos')" oncontextmenu="decrementarHabilidad('dosManos');return false;">
					<td class="w3-center">A 2 manos</td><td  class="w3-center"id="dosManos"></td>
				</tr>
				<tr onclick="incrementarHabilidad('arrojadizas')" oncontextmenu="decrementarHabilidad('arrojadizas');return false;">
					<td class="w3-center">Arrojadizas</td><td class="w3-center" id="arrojadizas"></td>
				</tr>	
				<tr onclick="incrementarHabilidad('proyectiles')" oncontextmenu="decrementarHabilidad('proyectiles');return false;">
					<td class="w3-center">Proyectiles</td><td class="w3-center" id="proyectiles"></td>
				</tr>	
				<tr onclick="incrementarHabilidad('asta')" oncontextmenu="decrementarHabilidad('asta');return false;">
					<td class="w3-center">Armas de asta</td><td class="w3-center" id="asta"></td>
				</tr>	
			
			</table>
		</div>
		<div class="w3-container w3-quarter">
			<table class="w3-table w3-striped w3-bordered w3-border w3-card-4">
				<tr class= "w3-theme-l2">
					<th colspan="2" class="w3-center">Habilidades Generales (<span id="generales"></span> puntos)</th>
				</tr>
				<tr onclick="incrementarHabilidad('trepar')" oncontextmenu="decrementarHabilidad('trepar');return false;">
					<td class="w3-center" >Trepar</td><td class="w3-center" id="trepar"></td>
				</tr>
				<tr onclick="incrementarHabilidad('montar')" oncontextmenu="decrementarHabilidad('montar');return false;">
					<td class="w3-center">Montar</td><td  class="w3-center"id="montar"></td>
				</tr>
				<tr onclick="incrementarHabilidad('nadar')" oncontextmenu="decrementarHabilidad('nadar');return false;">
					<td class="w3-center">Nadar</td><td class="w3-center"id="nadar"></td>
				</tr>
				<tr onclick="incrementarHabilidad('rastrear')" oncontextmenu="decrementarHabilidad('rastrear');return false;">
					<td class="w3-center">Rastrear</td><td class="w3-center"id="rastrear"></td>
				</tr>
				
	
			</table>
			<br>
			<table class="w3-table w3-striped w3-bordered w3-border w3-card-4">
				<tr class= "w3-theme-l2">
					<th colspan="2" class="w3-center">Habilidades de Subterfugio (<span id="subterfugio"></span> puntos)</th>
				</tr>
				<tr onclick="incrementarHabilidad('emboscar')" oncontextmenu="decrementarHabilidad('emboscar');return false;">
					<td class="w3-center">Emboscar</td><td class="w3-center"id="emboscar"></td>
				</tr>
				<tr onclick="incrementarHabilidad('acecharEsconderse')" oncontextmenu="decrementarHabilidad('acecharEsconderse');return false;">
					<td class="w3-center">Acechar / Esconder</td><td class="w3-center"><span id="acecharEsconderse"></span></td>
				</tr>
				<tr onclick="incrementarHabilidad('abrirCerraduras')" oncontextmenu="decrementarHabilidad('abrirCerraduras');return false;">
					<td class="w3-center">Abrir Cerraduras</td><td class="w3-center"><span id="abrirCerraduras"></span></td>
				</tr>
				<tr onclick="incrementarHabilidad('desactivarTrampas')" oncontextmenu="decrementarHabilidad('desactivarTrampas');return false;">
					<td class="w3-center">Desactivar trampas</td><td class="w3-center"id="desactivarTrampas"></td>
				</tr>
	
			</table>
			<br>
			<table class="w3-table w3-striped w3-bordered w3-border w3-card-4">
				<tr class= "w3-theme-l2">
					<th colspan="2" class="w3-center">Habilidades Mágicas (<span id="magicas"></span> puntos)</th>
				</tr>
				<tr onclick="incrementarHabilidad('leerRunas')" oncontextmenu="decrementarHabilidad('leerRunas');return false;">
					<td class="w3-center">Leer Runas</td><td class="w3-center"id="leerRunas"></td>
				</tr>
				<tr onclick="incrementarHabilidad('objetosMagicos')" oncontextmenu="decrementarHabilidad('objetosMagicos');return false;">
					<td class="w3-center">Usar objetos</td><td class="w3-center"id="objetosMagicos"></td>
				</tr>
				<tr onclick="incrementarHabilidad('sortilegiosDirigidos')" oncontextmenu="decrementarHabilidad('sortilegiosDirigidos');return false;">
					<td class="w3-center">Sortilegios Dirigidos</td><td class="w3-center"id="sortilegiosDirigidos"></td>
				</tr>
			</table>
		</div>
		<div class="w3-container w3-quarter">
			<table class="w3-table w3-striped w3-bordered w3-border w3-card-4">
				<tr class= "w3-theme-l2">
					<th colspan="2" class="w3-center">Otras</th>
				</tr>
				<tr>
					<td class="w3-center">Desarrollo físico</td><td class="w3-center"id="desarrolloFisico"></td>
				</tr>
				<tr>
					<td class="w3-center">Percepción</td><td class="w3-center"id="percepcion"></td>
				</tr>
				<tr>
					<td class="w3-center">Puntos de Poder</td><td class="w3-center"id="puntosPoder"></td>
				</tr>
				<tr>
					<td class="w3-center">Grados adicionales en Idiomas</td><td class="w3-center"id="gradosAdicionalesIdiomas"></td>
				</tr>
				<tr>
					<td class="w3-center">Puntos de Historial</td><td class="w3-center" id="puntosHistorial"></td>
				</tr>
				<tr>
					<td class="w3-center">Sortilegios Base</td><td class="w3-center" id="sortilegiosBase"></td>
				</tr>
			</table>
			<br>
			<table class="w3-table w3-striped w3-bordered w3-border w3-card-8">
				<tr class= "w3-theme-l2">
					<th colspan="2" class="w3-center">Tiradas de Resistencia</th>
				</tr>
				<tr>
					<td class="w3-center">Esencia</td><td class="w3-center" id="ese"></td>
				</tr>
				<tr>
					<td class="w3-center">Canalización</td><td class="w3-center" id="can"></td>
				</tr>
				<tr>
					<td class="w3-center">Venenos</td><td class="w3-center" id="ve"></td>
				</tr>
				<tr>
					<td class="w3-center">Enfermedades</td><td class="w3-center" id="enf"></td>
				</tr>
			</table>
			<br>
				<div class="magiaON" style="display:none;">
					<table  id="tablaMagia" class="w3-table w3-striped w3-bordered w3-border w3-card-4" >
					<tr class= "w3-theme-l2">
							<th colspan="2" class="w3-center">Listas de Sortilegios (<span id="puntosLista"></span> puntos)</th>
						</tr>
					<!-- Listas disponibles se introduciran dinámicamente -->
					</table>
				</div>
		</div>
		<div id="resumenpj" class="w3-container w3-quarter">
			<table class="w3-table w3-striped w3-bordered w3-border w3-card-8">
				<tr class= "w3-theme-l2">
					<th colspan="2" class="w3-center">Resumen Personaje</th>
				</tr>
				<tr>
					<td class="w3-center">Raza</td><td class="w3-center" id="rraza"></td>
				</tr>
				<tr>
					<td class="w3-center">Profesión</td><td class="w3-center" id="rprof"></td>
				</tr>
				</table>
				<table class="w3-table w3-striped w3-bordered w3-border w3-card-8">
				<tr class= "w3-theme-l2">
					<th>Atributo</th><th>Puntuación</th><th>Bono Natural</th><th>Bono Racial</th><th>Bono Total</th>
				</tr>
				<tr>
					<td >Fuerza</td><td class="w3-center" id="rfue"></td><td class="w3-center" id="bnfue"></td><td class="w3-center" id="brfue"></td><td class="w3-center" id="btfue"></td>
				</tr>
				<tr>
					<td >Agilidad</td><td class="w3-center" id="ragi"></td><td class="w3-center" id="bnagi"></td><td class="w3-center" id="bragi"></td><td class="w3-center" id="btagi"></td>
				</tr>
				<tr>
					<td>Constitución</td><td class="w3-center" id="rcon"></td><td class="w3-center" id="bncon"></td><td class="w3-center" id="brcon"></td><td class="w3-center" id="btcon"></td>
				</tr>
				<tr>
					<td >Inteligencia</td><td class="w3-center"id="rint"></td><td class="w3-center" id="bnint"></td><td class="w3-center" id="brint"></td><td class="w3-center" id="btint"></td>
				</tr>
				<tr>
					<td >Intuición</td><td class="w3-center" id="ri"></td><td class="w3-center" id="bni"></td><td class="w3-center" id="bri"></td><td class="w3-center" id="bti"></td>
				</tr>
				<tr>
					<td>Presencia</td><td class="w3-center" id="rpre"></td><td class="w3-center" id="bnpre"></td><td class="w3-center" id="brpre"></td><td class="w3-center" id="btpre"></td>
				</tr>
				
				<tr>
					<td >Apariencia</td><td colspan="4" class="w3-center"><span id="rapa"></span> + <span id="bapa"></span> (bono de Presencia)</td>
				</tr>
			</table>
			<br>
			<p class="magiaON w3-small" style="display:none;"> 
			La probabilidad de aprender una lista de sortilegios es la puntuación que tengas en dicha lista multiplicada por 20. Es decir, con 2 puntos
			en una lista habría un 40% de aprender esa lista mientras que con 5 puntos se aprendería con toda seguridad. En caso de no aprender la lista, 
			los puntos permanecerán asignados y se volverá a intentar aprender cada vez que subas de nivel. Los puntos no asignados se perderán.
			</p>
		</div>
	</div>

	<br>
	<p>Introduce el nombre de tu personaje <input type="text" id="nombre" maxlength="16"> <button id="btn_nombre" class="w3-btn w3-brown">Terminar</button> </p>
	

	</section>





</body>
</html>





