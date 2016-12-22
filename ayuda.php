<?php
session_start();
?>
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1"> 
<link rel="stylesheet" href="css/w3.css">
<link rel="stylesheet" href="css/tema.css">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
</head>
<body>

<nav class="w3-sidenav w3-theme-l3" style="width:15%">
	<div style="margin-left:5%;margin-top:5%;margin-bottom:10%" >
		<a href="#Introduccion">Introducción</a> 
		<a href="#CrearBuscar">Creación y Busqueda de Partidas</a> 
		<a href="#Personaje">Creación de Personaje</a> 
		<a href="#Jugador">Acciones del Jugador</a> 
		<a href="#Director">Acciones del Director</a> 


		
		
	
	</div>
</nav>

<div class="w3-tab " style="margin-left:15%">
	<div id="Introduccion" class="w3-container">
		<h2>Introducción</h2>
		
		
		<p>Rol Tierra Media es una plataforma para jugar online al juego de rol <i>Middle-earth	Role Playing</i> (publicado en España como <i>El Señor de los
				Anillos, el juego de rol de la Tierra Media</i>), desarrollado por <i>Iron Crown</i> cuya primera edición fue publicada en 1984.</p>
		<p>En un juego de rol, los jugadores interpretan el papel de unos personajes que tomando sus decisiones modifican el transcurso de una historia 
		o ambientación dirigida por uno de los jugadores que actúa como Director de juego. Para jugar a un juego de rol normalmente son necesarios varios elementos como dados, 
		fichas de personaje impresas, lápices, y sobre todo, la posiblidad de reunir a todos los jugadores en una misma mesa. Esto no siempre es posible, así que esta plataforma
		busca sustituir a esa mesa de juego simplemente con registrar una cuenta de usuario. Además, aunque siempre es recomendable conocer las reglas descritas por el libro, las 
		tareas generalmente mas complejas y tediosas de un juego de rol como la creación de un personaje o determinar los resultados de una ronda de combate son mucho mas rápidas 
		y fluidas en Rol Tierra Media.  </p>
	</div>
	<div id="CrearBuscar" class="w3-container">
		<h2>Búsqueda de Partidas</h2>
		<p>Tras identificarte en el sistema, dirígete a "Buscar Partida" en el menú superior. Verás una lista de partidas, mostrandose primero las de mas reciente creación. 
		Simplemente pulsa jugar en la partida que mas te guste y podrás acceder a ella a traves de "Mis Partidas".</p>
		<h2>Creación de Partidas</h2>	
		<p>Para ser Director de juego de una partida, deberás crear una partida. Una vez te hayas identificado en el sistema, deberás acceder a "Crear Partida" a través del menú superior.</p>
		<p>En el formulario que aparece, se deberán rellenar obligatoriamente los siguientes campos:</p>

		<ul class="w3-ul w3-card">
			<li><strong>Nombre de Partida:</strong> El título de la partida. Intenta usar un nombre descriptivo como "Descubriendo las mazmorras de Moria".</li>
			<li><strong>Máximo número de jugadores:</strong> El número máximo de jugadores que podrán participar en tu partida (sin incluirte a ti mismo, ya que eres el director). Debe ser un número comprendido
			entre 1 y 6.</li>
			<li><strong>Nivel:</strong> El nivel en el que comenzarán los personajes. Lo habitual es empezar a nivel 1, pero puedes poner un nivel mayor de partida si lo deseas (el nivel máximo es 10).</li>
		</ul>
		<br>
		<p>Además de estos, hay otros campos informativos que no son obligatorios rellenar, pero si muy recomendables para que otros usuarios decidan si quieren jugar tu partida.</p>
		<ul class="w3-ul w3-card">
			<li><strong>Descripción:</strong> ¿De qué tratará la aventura? Tienes 400 caracteres para que los demás jugadores lo sepan. </li>
			<li><strong>Horario:</strong> El horario en el que se debería jugar la partida o en los que estarías disponible.</li>
		</ul>
		<br>
		<p>Una vez hayas creado la partida, podrás acceder a ella a través de "Mis Partidas".</p>
	</div>
	<div id="Personaje" class="w3-container">
		<h2>Creación de Personaje</h2>
		<p>Una vez situado en una partida la primera acción que un jugador debe realizar es crear su personaje. Para ello pulsa en “Crear Personaje”.  </p>
		<p>Selecciona la raza y profesión que deseas para tu personaje y pulsa en el botón “Continuar”. Aparecerán las tiradas de características temporalmente asignadas. 
		Dichas puntuaciones pueden ser arrastradas de una característica a otra para configurar el personaje con las características adecuadas. 
		Además, cada profesión tiene un atributo primario. Activando la casilla de atributo primario se puede sustituir dicho atributo por 90, sea cual sea su puntuación original, que se perdería. </p>
		<p>Después de pasar esa pantalla, nos encontramos en la pantalla de subida de habilidades. Según la profesión se tendrán unos puntos para distribuir en cada grupo de habilidades.  
		Subir una habilidad un punto cuesta un punto mientras que subir la habilidad dos puntos cuesta tres (no es posible subir más de dos puntos por nivel en una habilidad). 
		La excepción a esta regla son las habilidades de movimiento, que pueden ser subidas a coste uno con total libertad. Se pueden subir las habilidades con el botón izquierdo del ratón y bajarlas con el botón derecho. 
		Además, si la profesión permite el aprendizaje de listas de sortilegios se podrán asignar puntos de aprendizaje. Tras escribir el nombre del personaje, la creación de personaje estará completa.</p>
		  <p>Si la partida es de nivel mayor que uno, tras la creación del personaje aparecerá un botón para “Subir de nivel” hasta el nivel seleccionado por el Director de Juego.</p>
	</div>
	<div id="Jugador" class="w3-container">
		<h2>Acciones del Jugador</h2>
		<p>Una vez creado el personaje se puede acceder a la ficha de personaje y a la tienda.</p>
		<p>En la tienda se puede comprar objetos para equipar al personaje. Está dividida en dos categorías, armas y armaduras.</p>
		<p>La ficha de personaje está dividida en tres pestañas: general, magia y equipo. 
			<ul class="w3-ul w3-card">
				<li>En la pestaña general se encuentran las características y habilidades del personaje. Pulsando en una generará una tirada que se mostrara en el chat de la partida.</li>
				<li>En la pestaña magia se muestra el dominio y puntos de poder del personaje, así como las listas de sortilegios y los sortilegios conocidos. Pulsando en un sortilegio se lanzará en el chat.</li>
				<li>En la pestaña equipo puede equiparse cualquier arma o armadura de la que se disponga.</li>
			</ul>
		</p>
		<p>Cuando sea el momento adecuado, el Director de Juego lanzará un turno de combate. Aparecerá entonces una opción por cada posible acción de combate 
		(preparar sortilegio, lanzar sortilegio, ataque a distancia, ataque cuerpo a cuerpo y moverse). 
		Tras la declaración de acción por parte de todos los jugadores, se ejecutará el combate en orden pudiendo cancelar siempre la acción en el botón “Cancelar” de la pestaña Combate del chat. 
		En el propio chat se puede ver el resultado de las acciones. </p>
		<p>Cuando se realice un ataque, se verán resaltados de rojo las casillas en las que es posible ejecutar el ataque (hay que tener en cuenta la visión y rango del atacante). 
		Para ejecutar el ataque es necesario pulsar en una casilla resaltada con un enemigo dentro.</p>
		<p>De la misma manera, cuando se realice un movimiento se resaltaran de color amarillo las casillas a las que es posible mover. Basta con seleccionar la casilla deseada.</p>
	</div>
	<div id="Director" class="w3-container">
		<h2>Acciones del Director</h2>
		<ol>
			<li>Control de Personajes</li>
				<p>Como director de juego, se puede mirar la ficha de cualquier personaje y actuar sobre ella como si fuese el propietario. 
				Además, seleccionar un personaje permite mediante el botón “Colocar” situar a ese personaje en cualquier punto del mapa.</p>
			<li>Estado de la Partida</li>
				<p>El mapa está oculto por defecto. En su lugar, se muestra el “Estado de la Partida”. Consiste en un texto en el que el Director puede escribir cualquier cosa que desea que los jugadores vean. 
				Una descripción de la partida, de la misión actual, alguna pista que hayan encontrado… Para actualizar dicho texto simplemente hay que escribir en el cuadro de texto y pulsar el botón “Actualizar” 
				y los jugadores verán el cambio al instante.</p>
			<li>Mostrar y Ocultar Mapa</li>
				<p>Para mostrar el mapa es necesario pulsar en el botón “Mostrar mapa” (de la misma manera pulsando “Ocultar mapa” se oculta). 
				Aparecerá el mapa y se podrá colocar a los personajes en él mediante el botón “Colocar”.</p>
			<li>Enemigos</li>
				<p>Para colocar enemigos, primero es necesario crearlos. Pulsando en el botón “Añadir NPC” se puede elegir un tipo de enemigo dada una lista de posibles enemigos. 
				Tras seleccionarlo se le debe poner un nombre y asignar un color. Pulsando el botón “Ver NPC” se pueden ver los distintos NPC creados y colocarlos en el mapa. 
				Además se les puede cambiar los puntos de vida si fuese necesario. Activando la casilla “eliminar NPC cuando sus puntos de vida lleguen a 0” cuando un enemigo llegue a 0 puntos de vida, 
				ya sea por daño de combate o por cambiarlo en esta misma pantalla el enemigo se eliminará.</p>
			<li>Combate</li>
				<p>Al pulsar en “Iniciar combate” se iniciará la fase de declaración de acciones de un combate. Todos los jugadores deberán declarar su acción mientras que al Director de Juego le aparecerá 
				una pantalla donde podrá declarar las acciones de todos los enemigos al mismo tiempo. Tras pulsar “Enviar acciones” una vez todos los jugadores hayan completado la declaración de acciones se ejecutara el turno. 
				El Director de Juego es el encargado de realizar las acciones de los enemigos.</p>
			<li>Experiencia</li>
				<p>Con el botón “Dar experiencia” puedes otorgar experiencia a los personajes que consideres. Al llegar a la cantidad necesaria para subir de nivel, los jugadores podrán subir de nivel inmediatamente.</p>
			<li>Descanso</li>
				<p>En la pantalla de descanso (mediante el botón “Descanso”) puedes elegir dar descanso a los personajes de manera equitativa o individual.  </p>
		</ol>
	</div>
	
</div>

</body>
</html>