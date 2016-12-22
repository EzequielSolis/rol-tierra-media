<?php
session_start();
?>
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1"> 
<link rel="stylesheet" href="css/w3.css">
<link rel="stylesheet" href="css/w3-theme-light-green.css">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
</head>
<body>

<nav class="w3-sidenav w3-theme-l3" style="width:15%">
	<div style="margin-left:5%;margin-top:5%;margin-bottom:10%" >
		<a href="#Introduccion">Introducción</a> 
		<details>
	  		<summary ><strong>Atributos de un Personaje</strong></summary>
	  		<a href="#link2">Características</a> 
	  		<a href="#link3">Razas</a> 
	  		<a href="#link1">Grados de habilidad</a> 
	  		<a href="#link1">Profesiones</a> 
	  		<a href="#link1">Antecedentes</a> 
	  		<a href="#link1">Experiencia y subida de nivel</a> 
	  		<a href="#link1">Bonificaciones</a> 
	  		<a href="#link1">Otras capacidades</a> 
	  		<a href="#link2"><em>Generación de un personaje</em></a> 
	  		
		</details>
		<details>
	  		<summary ><strong>Sistema de juego</strong></summary>
	  		<a href="#link2">Escenario</a> 
	  		<a href="#link3">PNJ</a> 
	  		<a href="#link1">Trama</a> 
	  		<a href="#link1">Aventuras típicas</a> 
	  		<a href="#link1">Magia</a> 
	  		<a href="#link1">Religión</a> 
	  		<a href="#link1">Heridas, muerte y curación</a> 
	  		<a href="#link1">Veneno y enfermedades</a> 
	  		<a href="#link2">Dinero</a> 
	  		<a href="#link2">Clima</a> 
		</details>
		<details>
	  		<summary ><strong>Acción en el Medio Estratégico</strong></summary>
	  		<a href="#link2">Actividad en las áreas civilizadas</a> 
	  		<a href="#link3">Actividad en el campo</a> 
	  		<a href="#link1">Exploración en el campo</a> 
		</details>
		<details>
	  		<summary ><strong>Acción en el Medio Táctico</strong></summary>
	  		<a href="#link2">Secuencia de acciones durante un asalto</a> 
	  		<a href="#link3">Preparación y realización de sortilegios</a> 
	  		<a href="#link1">Movimiento</a> 
	  		<a href="#link1">Maniobras</a> 
	  		<a href="#link1">Ataques</a> 
	  		<a href="#link1">Acciones conflictivas y otros factores</a> 
	  		<a href="#link1">Bonificaciones</a> 
	  		<a href="#link1">Otras Capacidades</a> 
		</details>
		<details>
	  		<summary ><strong>Lista de Sortilegios</strong></summary>
	  		<p><em>Listas abiertas</em></p>
	  		<a href="#Esencia">Esencia</a> 
	  		<a href="#Canalizacion">Canalización</a> 
	  		<p><em>Listas cerradas</em></p>
	  		<a href="#Magos">Magos</a> 
	  		<a href="#Bardos">Bardos</a> 
	  		<a href="Montaraces">Montaraces</a> 
	  		<a href="#Animistas">Animistas</a> 

		</details>
		
		
	
	</div>
</nav>

<div class="w3-tab " style="margin-left:15%">

	<div id="Introduccion" class="w3-container">
	<h2>Introducción</h2>
	<p>esta pagina debería estar en una pestaña nueva sin menu ni pollas</p>
	</div>
	<div id="Esencia" class="w3-container">
	<h2>Listas Abiertas de Sortilegios de Esencia</h2>
	<p>Estas listas de sortilegios pueden aprenderlas cualquiera con dominio de Esencia.</p>
	<h4>Dominio Espiritual</h4>
	<table class="w3-table w3-striped w3-border">
	<tr class="w3-theme-d2">
  		<th>Nivel</th>
  		<th>Nombre</th>
  		<th>Descripción</th>
  		<th>Area de Efecto</th>
  		<th>Duración</th>
  		<th>Alcance</th>
	</tr>
	<tr>
  		<td>1</td>
  		<td>Dormir V</td>
  		<td>Hace que el blanco (o blancos) se duerma; el número de niveles que pueden verse
  		afectados es 5 (por ejemplo, cinco blancos de primer nivel, un blanco de cuarto
  		nivel y uno de primero, etc). Todos los blancos deben estar a la vista de quien
  		realiza el sortilegio.</td>
  		<td>varía</td>
  		<td>varía</td>
  		<td>30 m.</td>
	</tr>
	<tr>
  		<td>2</td>
  		<td>Encantar Semejante</td>
  		<td>El blanco (que debe ser humanoide) cree que quien realiza el sortilegio es un 
  		buen amigo.</td>
  		<td>1 blanco</td>
  		<td>1 hora/nivel</td>
  		<td>30 m.</td>
	</tr>
	<tr>
  		<td>3</td>
  		<td>Dormir VII</td>
  		<td>Igual que Dormir V, pero pueden verse afectados un total de 7 niveles</td>
  		<td>varía</td>
  		<td>varía</td>
  		<td>30 m.</td>
	</tr>
	<tr>
  		<td>4</td>
  		<td>Confusión</td>
  		<td>El blanco es incapaz de tomar decisiones o iniciar acciones durante 1 asalto/5 pts, 
  		fallo de TR. El blanco puede seguir combatiendo contra contrincantes con los que ya luchaba
  		o actuar en defensa propia.</td>
  		<td>1 blanco</td>
  		<td>varía</td>
  		<td>30 m.</td>
	</tr>
	<tr>
  		<td>5</td>
  		<td>Sugestión</td>
  		<td>El blanco realizará solo un acto que se le sugiera y que no le resulte completamente
  		extraño (es decir, no sé suicidará ni se arrancará los ojos)</td>
  		<td>1 blanco</td>
  		<td>varía</td>
  		<td>3 m.</td>
	</tr>
	<tr>
  		<td>6</td>
  		<td>Dormir X</td>
  		<td>Igual que Dormir V, pero pueden verse afectados un total de 10 niveles.</td>
  		<td>varía</td>
  		<td>varía</td>
  		<td>30 m.</td>
	</tr>
	<tr>
  		<td>7</td>
  		<td>Retener Semejante</td>
  		<td>Un blanco humanoide se ve reducido al 25% de su actividad normal mientras quien
  		realiza el sortilegio esté concentrado.</td>
  		<td>1 blanco</td>
  		<td>C</td>
  		<td>30 m.</td>
	</tr>
	<tr>
  		<td>8</td>
  		<td>Dominio de Semejante</td>
  		<td>El blanco deberá obedecer a quien realiza el sortilegio como si se tratase de un
  		Sugestión durante lo que dure el sortilegio. El que lanza el sortilegio puede usar 
  		cualquier número de sugerencias no extrañas al blanco.</td>
  		<td>1 blanco</td>
  		<td>10 min/nivel</td>
  		<td>15 m.</td>
	</tr>
	<tr>
  		<td>9</td>
  		<td>Encantamiento Verdadero</td>
  		<td>Igual que Encantar Semejante pero ahora puede afectar a cualquier criatura viva y 
  		sensible.</td>
  		<td>1 blanco</td>
  		<td>1 hora/nivel</td>
  		<td>30 m.</td>
	</tr>
	<tr>
  		<td>10</td>
  		<td>Búsqueda</td>
  		<td>Se le da una misión al blanco; si falla tendrá una penalización determinada por el
  		DJ (la misión debe estar al alcance de las capacidades del blanco). La penalización debe
  		ser un pequeño impedimento, tal como una disminución en las características o una fobia
  		(por ejemplo, miedo a las arañas o al agua) o cualquier otra enfermedad mental o incapacidad
  		física (una cojera, reumatismo, cicatrices, etc.)</td>
  		<td>1 blanco</td>
  		<td>varía</td>
  		<td>3 m.</td>
	</tr>
	</table>
	</div>
	<div id="Canalizacion" class="w3-container">
	</div>
	<div id="Magos" class="w3-container">
	</div>
	<div id="Bardos" class="w3-container">
	</div>
	<div id="Montaraces" class="w3-container">
	</div>
	<div id="Animistas" class="w3-container">
	</div>
	
</div>

</body>
</html>