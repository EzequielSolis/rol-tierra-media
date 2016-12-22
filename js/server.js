/** Servidor Node.js con Express y Socket.io para Rol Tierra Media Online
 *  Páginas que se conectan aquí: jugar.php y crearPJ.php (y sus js)
 *  Dependencias Node.js: Express, Socket.io, Chance
 *  TODO: alertas eliminables para mostrar eventos http://www.w3schools.com/w3css/w3css_alerts.asp
 */

var socket = require( 'socket.io' );
var express = require( 'express' );
var http = require( 'http' );
var Chance = require( 'chance' );
var fs = require ( 'fs' ); //filesystem

var app = express();
var server = http.createServer( app );
var chance = new Chance();
/* Uso de Chance:
 * chance.d10() devuelve entero
 * chance.rpg('3d6') devuelve array de enteros
 * chance.rpg('3d6', sum: true}) devuelve entero (la suma)
 */

var io = socket.listen( server );

//objetos que serviran como vectores asociativos para contener datos de las partidas
var registro = {}; //objeto para guardar los mensajes
var conectados = {}; //objeto que contiene un objeto por cada partida activa y dentro los usuarios conectados
var nConectados = {}; //numero de conectados en cierta partida
var personajes = {};
var enemigos = {};
var posicionPersonajes = {}; 
var turno = {};
var turnoOrdenado = {};
var sortilegiosPreparados = {}; 
var accionesNPCEnviadas = {};
var asalto = {};
var contadorAsalto = {};
var registroAsalto = {};
var estado = {};

cargarDatos();

//io.sockets.on('connection', function(socket) {
io.on( 'connection', function(socket) {

	//unimos el cliente a la "room" correspondiente a su partida
	var nombre = socket.handshake.query.nusuario;
	var idPartida = socket.handshake.query.id_partida;
	if (!(typeof socket.handshake.query.jugadores === 'undefined')){
		var jugadores = socket.handshake.query.jugadores.split(','); //la array se envia como string separada por comas
		var iteraciones = jugadores.length; //para el futuro bloque for
	}
	
	var director; //sera true si el jugador es director
	if (socket.handshake.query.tipo == 'director')
		director = true;
	else
		director = false;

    socket.join(idPartida);
    console.log("El usuario " + nombre + " se ha unido a la partida " + idPartida);

    //CHAT
    
    //USUARIOS CONECTADOS AL CHAT
    if (typeof conectados[idPartida] === 'undefined') {
    	conectados[idPartida] = [];
    	nConectados[idPartida] = 0;
    	
    };
    var encontrado = -1; //buscamos si ya esta el nombre de usuario que se acaba de conectar
    for (var i = 0; i < nConectados[idPartida]; i++){
    	if(conectados[idPartida][i].nombre == nombre) {
    		encontrado = i; //posicion donde se ha encontrado
    	}
    	
    }
    if (encontrado == -1) { //si el nombre no esta dentro, se introduce
    	conectados[idPartida][nConectados[idPartida]] = {nombre : nombre, ventanas : 1 }; //introducimos el nombre el vector de usuarios conectados
        nConectados[idPartida]++;
    } else { // si el nombre esta dentro
    	conectados[idPartida][encontrado].ventanas++; //el usuario tiene conectada una ventana mas
    }
    //construimos la cadena a enviar 
    var uConectados = conectados[idPartida][0].nombre; //el primero
    for (var i = 1; i < nConectados[idPartida]; i++) { //i empieza en 1 porque ya hemos introducido el 0
    	uConectados = uConectados + ", " + conectados[idPartida][i].nombre;
    }
    io.to(idPartida).emit('conectados', uConectados);
    
    //REGISTRO DEL CHAT
    if (typeof registro[idPartida] === 'undefined') {
    	registro[idPartida] = []; //array dentro del objeto registro
    }
    for(var i=0; i<registro[idPartida].length; i++){
    	io.to(idPartida).emit('registro', {nom: registro[idPartida][i].nom, mensaje:registro[idPartida][i].mensaje});
    }
    io.to(socket.id).emit('registroEnviado');
    console.log("Registro enviado");
    io.to(idPartida).emit('estadoActualizado', estado[idPartida]); //se envía el estado de la partida
    io.to(idPartida).emit('eventoSistema', {nom: "Sistema", mensaje: "El usuario " + nombre + " se ha conectado."}); //este mensaje no se guarda en el registro
     
    //Cargar personajes de una partida
    //primera vez que se abre esa partida
    if (typeof personajes[idPartida] === 'undefined'){ 
    	//inicializamos matriz de posicion de personajes
    	posicionPersonajes[idPartida] = [];
    	for(var i=0; i<20; i++) {
    		posicionPersonajes[idPartida][i] = [];
		    for(var j=0; j<30; j++) {
		    	posicionPersonajes[idPartida][i][j] = null;
		    }
		}
    	
    	personajes[idPartida] = []; //vector para guardar los personajes
    	enemigos[idPartida] = []; //vector para guardar enemigos

	    for (i in jugadores){ 
	    	
	    	var fichero = '../personajes/' + idPartida + 'pj' + jugadores[i] + '.json';
	    	//si el fichero existe, se añade al vector de personajes de esa partida
	    	fs.readFile(fichero, (err, data) => {
	    		if (!err){ //fichero existe
	    			personajes[idPartida].push(JSON.parse(data));
		    	  }
	    		iteraciones--;
	    		if ( iteraciones == 0) { //ultima iteracion
	    			if (director) {
	    				io.to(socket.id).emit('director', {personajes : personajes[idPartida], posPersonajes: posicionPersonajes[idPartida], enemigos : enemigos[idPartida]});
	    			}
	    			else
	    				enviarPj(nombre, idPartida); //se envia PJ al primer usuario en abrir la partida
	    		}
	    	});
	    }
	    
    } else { //se envia PJ a todos los usuarios una vez la estructura esta creada tras la primera vez
    	if (director) {
    		io.to(socket.id).emit('director', {personajes: personajes[idPartida], posPersonajes: posicionPersonajes[idPartida], enemigos : enemigos[idPartida]});
    	} else 
    		enviarPj(nombre, idPartida);
    }
	
   
    	
    	
	
     
    //--------------------------------------CAPTURA DE EVENTOS-------------------------------------------
    //Eventos de combate
    socket.on( 'inicioTurno', function(){
    	accionesNPCEnviadas[idPartida] = false;
    	//Se resetean los vectores de turno
    	turno[idPartida] = 'undefined';
    	turnoOrdenado[idPartida] = 'undefined';
    	turno[idPartida] = []; 
    	turnoOrdenado[idPartida] = [];
    	io.to(idPartida).emit('eventoSistema', {nom: "Sistema", mensaje: "Va a comenzar un nuevo turno. Declara que acción vas a realizar"});
    	//enviar a todos los jugadores evento de "elige tu accion"
    	io.to(idPartida).emit('esperarAccion');
    });
    //Acciones enviadas por los jugadores
    //recibe objeto con personaje(objeto) y accion (entero)
    socket.on( 'enviarAccion', function(datos){
    	turno[idPartida].push(datos); 
    	io.to(idPartida).emit('accionEnviada', datos, {enviados : turno[idPartida].length, total : personajes[idPartida].length});
    	
    	//comprobamos si han sido enviadas todas las acciones
    	if (turno[idPartida].length == personajes[idPartida].length && accionesNPCEnviadas[idPartida] == true){
    		//se traspasan los datos de jugadores al vector de turnos ordenados
			for (k in turno[idPartida]){
    			turnoOrdenado[idPartida].push(turno[idPartida][k]);
    		}
			turnoOrdenado[idPartida].sort(function (a, b){
				if (a.accion == b.accion)
					return (b.personaje.velocidad - a.personaje.velocidad);
				else 
					return (a.accion - b.accion);
			});
			//inicio de turno
			accionesTurno(idPartida, 1); //1 es la accion de preparar sortilegio, que es la primera
			io.to(idPartida).emit('eventoSistema', {nom: "Sistema", mensaje: "Turno declarado por todos los jugadores"});
			accionesNPCEnviadas[idPartida] = false; //se devuelve este valor a false
    	}
    	
    });
    
    //Acciones enviadas por el director para los NPC
    //recibe objeto con enemigosAcciones (copia del vector de enemigos en el momento en que se realizan las acciones) y accionesNPC (vector de enteros representando acciones)
    socket.on( 'enviarAccionesNPC', function(datos){


    	for (var i = 0; i < datos.enemigosAcciones.length; i++){
    		turnoOrdenado[idPartida].push({personaje: datos.enemigosAcciones[i], accion:  datos.accionesNPC[i]});
    	}
		accionesNPCEnviadas[idPartida] = true;

		//si con esto terminan las acciones de los personajes:
		if (turno[idPartida].length == personajes[idPartida].length) {
			//se traspasan los datos de jugadores al vector de turnos ordenados
			for (k in turno[idPartida]){
    			turnoOrdenado[idPartida].push(turno[idPartida][k]);
    		}
			turnoOrdenado[idPartida].sort(function (a, b){
				if (a.accion == b.accion)
					return (b.personaje.velocidad - a.personaje.velocidad);
				else 
					return (a.accion - b.accion);
			});
			//inicio de turno
			accionesTurno(idPartida, 1); //1 es la accion de preparar sortilegio, que es la primera
			io.to(idPartida).emit('eventoSistema', {nom: "Sistema", mensaje: "Turno declarado por todos los jugadores"});
			accionesNPCEnviadas[idPartida] = false; //se devuelve este valor a false
		}
		
		
    });
    
    //Evento que se captura cuando el Director decide no seguir esperando a algún jugador (o los NPC) para empezar el turno
    socket.on( 'forzarTurno', function(){
    	for (k in turno[idPartida]){
			turnoOrdenado[idPartida].push(turno[idPartida][k]);
		}
		turnoOrdenado[idPartida].sort(function (a, b){
			if (a.accion == b.accion)
				return (b.personaje.velocidad - a.personaje.velocidad);
			else 
				return (a.accion - b.accion);
		});
		
		accionesTurno(idPartida, 1); //1 es la accion de preparar sortilegio, que es la primera
		io.to(idPartida).emit('eventoSistema', {nom: "Sistema", mensaje: "Turno comenzado por el Director"});
		accionesNPCEnviadas[idPartida] = false; //se devuelve este valor a false
    });
    
    /* Evento que se captura cada vez que un personaje o un NPC realiza una acción
     * tipo: entero positivo que representa el tipo de acción a realizar
     */
    socket.on( 'realizarAccion', function(tipo, cantidad, posicion, operacion, datos, arma){
    	if (datos == undefined){ //valor por defecto
    		datos = null;
    	}
    	if (arma == undefined){
    		arma = null; 
    	}
    	
    	if (contadorAsalto[idPartida] == undefined){ //primera vez que se envia un asalto en esta partida
    		contadorAsalto[idPartida] = 1;
    	}
    	else{
    		contadorAsalto[idPartida]++;
    	}
    	
    	//se inicializan la estructura si no lo estan
    	if (asalto[idPartida] == undefined)
    		asalto[idPartida] = [];
    	if (sortilegiosPreparados[idPartida] == undefined)
    		sortilegiosPreparados[idPartida] = [];
    	if (registroAsalto[idPartida] == undefined){ 
			registroAsalto[idPartida] = [];
		}
    	 	
    	asalto[idPartida].push({nom : turnoOrdenado[idPartida][posicion].personaje.nombre, acc: operacion, dat: datos});
    	
    	switch(operacion){
    	default : 
    		//si estaba preparando un sortilegio, se deja de preparar
    		for (var i in sortilegiosPreparados[idPartida]){
	    		if (sortilegiosPreparados[idPartida][i].usuario == turnoOrdenado[idPartida][posicion].personaje.usuario){
	    			sortilegiosPreparados[idPartida][i].asaltos = 0;
	    		}
    		}
    		break; //cancelar no hace nada
    	case 'Preparar Sortilegio':
    		/* Se verifica si estaba preparando el mismo sortilegio anteriormente
    		 * Se registra registroAsalto[idPartida].push(cadenaResultado);
    		 */
    		var encontrado = false;
    		/* Variable asaltos. guarda el numero de asaltos que lleva preparando el sortilegio para enviarlo al registro de combate.
    		 * Por defecto es 1, ya que es el numero de asaltos que lleva preparando un sortilegio por primera vez. Si lleva mas tiempo se modificará.
    		 */
    		var asaltos = 1;   		
    		for (var i in sortilegiosPreparados[idPartida]){
    			//si encuentra el usuario actual en el vector
    			if (sortilegiosPreparados[idPartida][i].usuario == turnoOrdenado[idPartida][posicion].personaje.usuario){
    				encontrado = true;
    				//si el sortilegio que tiene preparado es el mismo se suma 1 a los asaltos preparando el sortilegio
    				//si no, se reinicia a 1 reemplazando el sortilegio
    				if (sortilegiosPreparados[idPartida][i].sortilegio == datos){
    					sortilegiosPreparados[idPartida][i].asaltos++;
    					asaltos = sortilegiosPreparados[idPartida][i].asaltos
    				} else {
    					sortilegiosPreparados[idPartida][i].sortilegio = datos;
    					sortilegioPreparados[idPartida][i].asaltos = 1;
    				}
    				
    			}
    		}
    		if (!encontrado) {//no lo ha encontrado
				//se introduce el nombre del usuario que prepara sortilegio, el nombre del sortilegio (está en datos) y la cantidad de asaltos que lleva preparandolo (en este caso 1)
    			sortilegiosPreparados[idPartida].push({usuario: turnoOrdenado[idPartida][posicion].personaje.usuario, sortilegio: datos, asaltos: 1});
			}
    		//se introduce en el registro 
    		registroAsalto[idPartida].push(turnoOrdenado[idPartida][posicion].personaje.nombre + " prepara su sortilegio " + datos + ": " + asaltos + "º asalto.");
    		
    		break;
    	case 'Realizar Sortilegio' :
    		/*	Se comprueba si el sortilegio que se va a lanzar esta siendo preparado anteriormente
    		 * Se resta los puntos de poder necesarios
    		 * se registra
    		 * se resetean los asaltos preparados
    		 */
    		var encontrado = false;
    		for (var i in sortilegiosPreparados[idPartida]){
	    		if (sortilegiosPreparados[idPartida][i].usuario == turnoOrdenado[idPartida][posicion].personaje.usuario){
	    			encontrado = true;
	    			if (sortilegiosPreparados[idPartida][i].sortilegio == datos.nom){ //esta preparando este mismo conjuro
	    				registroAsalto[idPartida].push(lanzarSortilegio(turnoOrdenado[idPartida][posicion].personaje, datos.nivel, datos.nom, datos.desc, sortilegiosPreparados[idPartida][i].asaltos));
	    				//se resetea la preparacion del sortilegio
	    				sortilegiosPreparados[idPartida][i].asaltos = 0;
    				} else { //estaba preparando otro conjuro o ninguno
    					registroAsalto[idPartida].push(lanzarSortilegio(turnoOrdenado[idPartida][posicion].personaje, datos.nivel, datos.nom, datos.desc, 0));
    					//se resetea la preparacion del sortilegio (tenia otro sortilegio preparado)
	    				sortilegiosPreparados[idPartida][i].asaltos = 0;
    				}
	    			
	    		}
    		}
    		
    		if (!encontrado) {
    			registroAsalto[idPartida].push(lanzarSortilegio(turnoOrdenado[idPartida][posicion].personaje, datos.nivel, datos.nom, datos.desc, 0));
    		}
    		
    		//se restan los puntos de poder para realizar el sortilegio
    		var posicionPersonaje = buscarPorNombre(turnoOrdenado[idPartida][posicion].personaje.nombre, idPartida, 'aliado');
    		personajes[idPartida][posicionPersonaje].puntosPoder -= datos.nivel; 

    		
    		
    		
    		
    		break;
    	case 'Ataque a Distancia': 
    	case 'Ataque C/C':
    		/* Se necesita del enemigo la posicion en el vector de turno (la del ejecutor ya la tenemos)
    		 * Precondicion: el ejecutor debe tener mas de 0 de vida (podria ser herido en una accion anterior (sortilegio) (hacer desde el cliente [autocancelar accion si esta muerto]
    		 * tirada de ataque que toque (a distancia en este caso, es fasi) + BO - BD (si es npc) la BD se puede restar al final
    		 * se busca en la tabla el resultado de lo que ha ocurrido (hay que crear la bendita tabla)
    		 * se modifica la vida del defensor en caso de haber sido impactado -> en el turno
    		 * se guarda en alguna estructura todos los mensajes a mostrar (Pepe ha atacado a Dragon negro: Tirada a distancia -> etc etc x de daño)
    		 * CUANDO TODOS HAYAN ACTUADO
    		 * se envia esa estructura en un evento, informando
    		 * se borran del mapa los personajes con menos de 0 de vida (o se modifica la funcion de redibujar para que borre automaticamente los pjs con menos de 0 de vida)
    		 * y se actualizan los demas (para esto usar los eventos de actualizar personajes de debajo)
    		 * 
    		 */
    		
    		//si estaba preparando un sortilegio, se deja de preparar
    		for (var i in sortilegiosPreparados[idPartida]){
	    		if (sortilegiosPreparados[idPartida][i].usuario == turnoOrdenado[idPartida][posicion].personaje.usuario){
	    			sortilegiosPreparados[idPartida][i].asaltos = 0;
	    		}
    		}
    		
    		var posDefensor = buscarDefensor(datos, idPartida);
			if (turnoOrdenado[idPartida][posicion].personaje.usuario == undefined) //atacante npc
				var bonificador = arma.ataque; //en npc habria que poner simplemente ataque
			else
				var bonificador = habilidadArma(idPartida, posicion, arma.tipo);
			
			var	tirada = tiradaAbierta(bonificador);
			var rFinal = tirada.resultado;
			//se aplica la bonificacion defensiva
			rFinal -= turnoOrdenado[idPartida][posDefensor].personaje.bd;
			if (turnoOrdenado[idPartida][posDefensor].personaje.usuario == undefined) //el defensor es npc
				var defensa = turnoOrdenado[idPartida][posDefensor].personaje.armadura;
			else{ //es personaje aliado 
				if (turnoOrdenado[idPartida][posDefensor].personaje.equipado.armadura == null)
					var defensa = 'Sin Armadura';
				else
					var defensa = turnoOrdenado[idPartida][posDefensor].personaje.equipado.armadura.nombre;
			}
			
			
			var damage = tablaAtaque(rFinal, arma.tipo, defensa);

			turnoOrdenado[idPartida][posDefensor].personaje.vida -= damage;
			//se cambia esa vida en el vector de personajes y enemigos "global" tambien. Tras el "resumenAsalto" hacer un actualizarenemigos y actualizarpersonajes en mapa
			if (turnoOrdenado[idPartida][posDefensor].personaje.usuario == undefined) {
				var posEnemigo = buscarPorNombre(turnoOrdenado[idPartida][posDefensor].personaje.nombre, idPartida, 'enemigo');
				enemigos[idPartida][posEnemigo].vida = turnoOrdenado[idPartida][posDefensor].personaje.vida;
			}
				
			else{
				var posEnemigo = buscarPorNombre(turnoOrdenado[idPartida][posDefensor].personaje.nombre, idPartida, 'aliado');
				personajes[idPartida][posEnemigo].vida = turnoOrdenado[idPartida][posDefensor].personaje.vida; 
			}
				

			var cadenaResultado = "Ataque de " + arma.tipo +" de " + turnoOrdenado[idPartida][posicion].personaje.nombre + " a "+turnoOrdenado[idPartida][posDefensor].personaje.nombre 
			+ ": " + tirada.cadenaTiradas + " + " + bonificador + " - " + turnoOrdenado[idPartida][posDefensor].personaje.bd + "= " + rFinal
			+ "-> Daño causado: " + damage;
			if (tipo == 3) //ataque a distancia: se guarda en el registro
				registroAsalto[idPartida].push(cadenaResultado);
			else{ //ataque cuerpo a cuerpo, se envia el evento inmediatamente
				io.to(idPartida).emit('eventoSistema', {nom : "Sistema", mensaje : cadenaResultado });
				console.log("ataque cuerpo a cuerpo enviado");
			}
    		
    		break;
    		
    	case "Movimiento":
    		//si estaba preparando un sortilegio, se deja de preparar
    		for (var i in sortilegiosPreparados[idPartida]){
	    		if (sortilegiosPreparados[idPartida][i].usuario == turnoOrdenado[idPartida][posicion].personaje.usuario){
	    			sortilegiosPreparados[idPartida][i].asaltos = 0;
	    		}
    		}
    		posicionPersonajes[idPartida] = datos;
        	io.to(idPartida).emit('actualizandoMapa', posicionPersonajes[idPartida]);
    		break;
    	}
    	
    	
    	
    	//Resolución del turno 
    	if (contadorAsalto[idPartida] == cantidad){ 
    		if (tipo != 4 && tipo != 5){ 
    			console.log("accion simultanea terminada (sortilegios o ataque a distancia)");
	    		for (msg in registroAsalto[idPartida]){
	    			io.to(idPartida).emit('eventoSistema', {nom : "Sistema", mensaje :registroAsalto[idPartida][msg] });
	    		}
    		}
    		registroAsalto[idPartida] = undefined;
    		io.to(idPartida).emit('actualizarEnemigosMapa', enemigos[idPartida]);
    		io.to(idPartida).emit('personajesActualizados', personajes[idPartida]);
    		io.to(idPartida).emit('actualizarPersonajesMapa', personajes[idPartida]);
    		io.to(idPartida).emit('resumenAsalto', asalto[idPartida]);
    		asalto[idPartida] = undefined; //reseteamos la estructura
    		contadorAsalto[idPartida] = 0;
    		if (tipo < 5)
    			accionesTurno(idPartida, tipo + 1);
    		else
    			finTurno(idPartida);
    	}
    	else { //el asalto no esta terminado
    		if (tipo == 4 || tipo == 5){ //acciones no simultaneas
    			io.to(idPartida).emit('accionRecibida', posicion); //evento para colorear de verde el usuario que ha realizado ya su acción
    			io.to(idPartida).emit('siguienteAccion', tipo, posicion + 1, cantidad, turnoOrdenado[idPartida]); //se le da paso al siguiente personaje
    		}else{
    			io.to(idPartida).emit('accionRecibida', posicion); //evento para colorear de verde el usuario que ha realizado ya su acción
    		}
    	}
    		
    });
    
    //--------------------------------------------------------------------------------------------------
  //Actualizar vector de personajes. Si la opción enMapa está activada, tambien se actualizan los enemigos en el mapa.
    socket.on( 'actualizarPersonajes', function(per, enMapa){
    	if (enMapa == undefined) //valor por defecto
    		enMapa = false;
    	console.log(per[0].puntosPoder);
    	personajes[idPartida] = per; //actualizamos el vector de personajes aliados
    	io.to(idPartida).emit('personajesActualizados', per);
    	
    	if(enMapa == true){
    		io.to(idPartida).emit('actualizarPersonajesMapa', per);
    	}
    		
    	
    });
    //Actualiza el PJ tras hacer una compra o subir de nivel. Lanzado desde jugador. El parametro e es el pj que se recibe. 
    socket.on('actualizarPJ', function(pjActualizar){
    	for (var i in pjActualizar){
    		personajes[idPartida][buscarPj(pjActualizar.usuario, idPartida)][i] = pjActualizar[i];
    	}
    	
    	io.to(idPartida).emit('personajesActualizados', personajes[idPartida]);
    });
    
    //Actualizar vector de enemigos. Si la opción enMapa está activada, tambien se actualizan los enemigos en el mapa.
    socket.on( 'actualizarEnemigos', function(ene, enMapa){
    	if (enMapa == undefined) //valor por defecto
    		enMapa = false;
    	enemigos[idPartida] = ene; //actualizamos el vector de enemigos
    	
    	if(enMapa == true){
    		io.to(idPartida).emit('actualizarEnemigosMapa', ene);
    	}
    		
    	
    });
    //Mostrar y ocultar mapa
    socket.on( 'mostrarMapa', function(posPer){
    	posicionPersonajes[idPartida] = posPer; //actualizamos la matriz de posiciones
    	io.to(idPartida).emit('mostrarMapaJugador', posicionPersonajes[idPartida]);
    });
    socket.on( 'ocultarMapa', function(){
    	io.to(idPartida).emit('ocultarMapaJugador');
    });
    //Actualizar mapa
    socket.on( 'actualizarMapa', function(posPer){
    	posicionPersonajes[idPartida] = posPer;
    	io.to(idPartida).emit('actualizandoMapa', posicionPersonajes[idPartida]);
    });
    
    
    //mensajes globales {data.nom, data.mensaje}
    socket.on( 'mensaje', function(data){
    	console.log('Mensaje Recibido: Nombre: ' + data.nom + ' Mensaje: ' + data.mensaje);
    	if (data.mensaje == "/store"){ //comando de gestion
    		guardarDatos();
    	} else {
	    	registro[idPartida].push({nom:data.nom, mensaje:data.mensaje});
	    	io.to(idPartida).emit('mensajes', {nom: data.nom, mensaje:data.mensaje});
    	}
    });
    //mensajes privados {data.emisor, data.receptor, data.mensaje}
    socket.on( 'mensajePrivado', function(data){
    	console.log('Mensaje privado: Emisor: ' + data.emisor + ' Receptor: ' + data.receptor+ ' Mensaje: ' + data.mensaje);
    	io.to(idPartida).emit('mensajesPrivados', {emisor: data.emisor, receptor: data.receptor, mensaje:data.mensaje});
    });
    
    socket.on( 'actualizarEstado', function(data){
    	io.to(idPartida).emit('estadoActualizado', data);
    	if (typeof estado[idPartida] === 'undefined') {
        	estado[idPartida] = ""; //vector para guardar los personajes
    	}
    	estado[idPartida] = data;
    	io.to(idPartida).emit('eventoSistema', {nom : "Sistema", mensaje: "Estado de la partida actualizado"} );
    });
        
    //Crear PJ 
    socket.on( 'crearPJ', function(data, callback){ //el callback hara que vuelva a la pagina de juego
    	//data tiene personaje, idpartida, nusuario
    	var nombrefichero = '../personajes/'+ data.id + 'pj' + data.nusuario + '.json';
    	fs.writeFile(nombrefichero , data.personaje , function (err) {
    		  if (err) return console.log(err);
    		  console.log('Personaje para partida ' + data.id + ': '+ data.nusuario + ' creado.');
    		  //añadimos el personaje al vector de personajes de la partida
    		  if (typeof personajes[idPartida] === 'undefined') {
    	        	personajes[idPartida] = []; //vector para guardar los personajes
    		  }
    		  personajes[idPartida].push(JSON.parse(data.personaje));
    		  //enviamos un evento para que el DJ reciba el personaje mientras está conectado
    		  io.to(idPartida).emit('nuevoPJ', JSON.parse(data.personaje));
    		  //respuesta para que la pantalla de crear PJ redirija
    		  callback();
    		});
    	
    });
    
    //TIRADAS
    
    //Tirada abierta (criticos y pifias explosivas)
    socket.on( 'tiradaAbierta', function(e){
    	var tirada = tiradaAbierta(e.mod);
    	io.to(idPartida).emit('eventoSistema', {nom : "Sistema", mensaje: "TA [" + e.personaje + "," + e.hab + "] " + tirada.cadenaTiradas + " + " + e.mod + "= " + tirada.resultado} );
  	
    });
    
    
    
    //Tirada cerrada (no explosiva)
    socket.on( 'tiradaCerrada', function(e){
       	var tirada = chance.d100();
    	var resultado = tirada + e.mod;
    	
    	io.to(idPartida).emit('eventoSistema', {nom : "Sistema", mensaje: "TC [" + e.personaje + "," + e.hab + "] [" + tirada + "] + " + e.mod + "= " + resultado} );
    	
    });
    
  
    /* Lanzamiento de un sortilegio fuera de combate.
     * Se recibe el personaje ejecutor, el nivel del sortilegio, el nombre del sortilegio y la descripción del sortilegio
     */
    socket.on('sortilegioTranquilo', function(pj, nivel, nomSortilegio, descripcion){
    	lanzarSortilegio(pj, nivel, nomSortilegio, descripcion, -1);
    });
    

    

    // DESCONEXIÓN: Guardar datos en disco (TODO: solo datos modificados)
    socket.on ('disconnect', function (){
    	//actualizando usuarios conectados
    	for (var i = 0; i < nConectados[idPartida]; i++){
        	if(conectados[idPartida][i].nombre == nombre){
        		if (conectados[idPartida][i].ventanas == 1){
        			conectados[idPartida].splice(i, 1); //en la posicion i, eliminamos 1
            		nConectados[idPartida]--;
            		io.to(idPartida).emit('eventoSistema', {nom: "Sistema", mensaje: "El usuario " + nombre + " se ha desconectado."});
        		}
        		else //ha cerrado una ventana pero sigue con alguna abierta
        			conectados[idPartida][i].ventanas--; 
        	}	
        }
    	//actualizamos la gente conectada en la partida
    	if (nConectados[idPartida] > 0){
    		uConectados = conectados[idPartida][0].nombre; //el primero
            for (var i = 1; i < nConectados[idPartida]; i++) { //i empieza en 1 porque ya hemos introducido el 0
            	uConectados = uConectados + ", " + conectados[idPartida][i].nombre;
            }
            io.to(idPartida).emit('conectados', uConectados);
    	}
    });
  //----------------------------------------
    /* Envía al cliente un PJ dado un nombre de usuario y la ID partida en la que esta. El personaje debe estar cargado.
     * No devuelve nada.
     */
    function enviarPj(nombre, idPartida) {

    	if(buscarPj(nombre, idPartida)) {
    		io.to(socket.id).emit('siPJ', { pj : personajes[idPartida][buscarPj(nombre, idPartida)], posPersonajes: posicionPersonajes[idPartida]});
    	}
    	else //no se encuentra el personaje
    		io.to(socket.id).emit('noPJ');
    }
    
    /* Busca la cantidad de acciones de un mismo tipo determinado por parametro para que todos los jugadores que hayan elegido el mismo
     * tipo de acción actuen simultaneamente.
     * Recibe el idPartida  de la partida en la que se ejecuta el turno y tipo de acción (entero del 1 al 6) que se va a realizar
     */
    function accionesTurno(idPartida, tipo){
    	console.log("Acciones turno tipo " +tipo);
    	var inicio;
    	var cantidad = 0;
    	var k = 0;
    	
    	//turnoOrdenado[idPartida].length > k  es la condición necesaria para no salir de rango del vector
    	while (turnoOrdenado[idPartida].length > k &&  turnoOrdenado[idPartida][k].accion < tipo) { //acciones en teoria ya realizadas (tienen mas prioridad que las que buscamos)
    		k++;
    	} 
    	if (turnoOrdenado[idPartida].length > k && turnoOrdenado[idPartida][k].accion == tipo){ //si hay al menos una accion del tipo que buscamos
			inicio = k;
			while(turnoOrdenado[idPartida].length > k && turnoOrdenado[idPartida][k].accion == tipo){ //las acciones que buscamos
	    		cantidad++;
	    		k++;
	    	}
		}
    	
    	if (cantidad == 0){ //si no hay acciones declaradas para ese tipo de accion se busca de la siguiente
    		if (tipo != 5) //ultima opción, ya que la acción 6 es no hacer nada
    			accionesTurno(idPartida, tipo + 1);
    		else
    			finTurno(idPartida);
    	} 
    	else {//emitimos el evento de asalto de este turno
        	io.to(idPartida).emit('asalto', tipo, inicio, cantidad, turnoOrdenado[idPartida]);
    	}
    }
    /* Función que se dispara al terminar un turno desde accionesTurno()
     * Reseteará las estructuras utilizadas para el turno y enviará un evento confirmando el fin de turno
     * TODO: De momento no resetea ninguna estructura porque todas se resetean "solas" al iniciar un nuevo turno/nueva accion
     */
    function finTurno(idPartida){
    	console.log("Fin de turno en " +idPartida);
    	io.to(idPartida).emit('finTurno');
    }
    
    /* Lanzamiento de un sortilegio 
     * Se recibe el personaje ejecutor, el nivel del sortilegio, el nombre del sortilegio, la descripción del sortilegio y el número de asaltos que lleva preparandose
     * Si el sortilegio se lanza fuera de combate, asaltosPreparados debe ser -1
     */
    function lanzarSortilegio(pj, nivel, nomSortilegio, descripcion, asaltosPreparados){

    	
    	var bonoPreparacion;
    	
    	switch(asaltosPreparados){
    	
    	case -1: bonoPreparacion = 0; break; //sortilegio fuera de combate, sin bono
    	case 0: bonoPreparacion = -30; break;
    	case 1: bonoPreparacion = -15; break;
    	case 2: bonoPreparacion = 0; break;
    	case 3: bonoPreparacion = 10; break;
    	default: bonoPreparacion = 20; break; //4 o mas
    	}
    	
    	if (asaltosPreparados == -1){ //se restan los puntos de poder y se actualiza el personaje solo si esta fuera del combate, ya que dentro del combate debe esperar a que terminen todos
        	//se restan los puntos de poder requeridos para ejecutar el sortilegio (equivalente al nivel del sortilegio)
        	personajes[idPartida][buscarPj(pj.usuario, idPartida)].puntosPoder =  pj.puntosPoder - nivel;
        	//se actualizan los puntos de poder
        	io.to(idPartida).emit('personajesActualizados', personajes[idPartida]);
    	}

    	var tirada = chance.d100();
    	var resultado = tirada + pj.sortilegiosBase + bonoPreparacion;
    	/*	Formato de salida
    	 * 
    	 * Sortilegio de JUGADOR - NOMBRE
    	 * DESCRIPCION
    	 * [TIRADA + SORTILEGIOBASE] = RESULTADO => Salvación enemiga: SALVACION
    	 * 
    	 */
    	var salvacion = resultadoSortilegio(resultado);
    	var cadenaSortilegio;
    	
    	if (asaltosPreparados == -1){
    		cadenaSortilegio = "<b>Sortilegio de " + pj.nombre + " - " + nomSortilegio + " (Nivel "+ nivel +")</b><br>";
        	cadenaSortilegio +=	descripcion + "<br>";
        	cadenaSortilegio += "["+ tirada + "+" + pj.sortilegiosBase +"] = " + resultado + " => Salvación enemiga: " + salvacion;
        	
        	io.to(idPartida).emit('eventoSistema', {nom : "Sistema", mensaje: cadenaSortilegio} );
        	return 0;
    	} else {
    		cadenaSortilegio = "<b>Sortilegio de " + pj.nombre + " - " + nomSortilegio + " (Nivel "+ nivel +")</b> preparado durante "+asaltosPreparados+" asaltos.<br>";
        	cadenaSortilegio +=	descripcion + "<br>";
        	cadenaSortilegio += "["+ tirada + "+" + pj.sortilegiosBase +"+"+ bonoPreparacion + "] = " + resultado + " => Salvación enemiga: " + salvacion;
        	
        	return cadenaSortilegio;
    	}


    }
    
    
    
    
    
});


server.listen( 8080, function(){
	console.log('Escuchando en puerto 8080...');
} );

//setInterval(guardarDatos, 1800000); //se guardan datos cada 30 minutos automaticamente

//---------------------------------------Funciones Auxiliares-------------------------------------------------------
/*funcion de gestion para guardar los datos del sistema */
function guardarDatos(){
	
	fs.writeFile('../personajes/partidas/registros.json' , JSON.stringify(registro, null, 4) , function (err) {
		  if (err){
			  return console.log(err);	  
		  }
	});

	fs.writeFile('../personajes/partidas/personajes.json' , JSON.stringify(personajes, null, 4) , function (err) {
		  if (err){
			  return console.log(err);	  
		  }
	});

	if (posicionPersonajes === undefined){
		console.log('No se han guardado las posiciones (posiciones vacias)');
	} else{
		fs.writeFile('../personajes/partidas/posPersonajes.json' , JSON.stringify(posicionPersonajes, null, 4) , function (err) {
			  if (err){
				  return console.log(err);	  
			  }
		});
		console.log('Posiciones guardadas');
	}
	

	if (enemigos === undefined){
		console.log('No se han guardado los enemigos (enemigos vacios)');
	} else {
		fs.writeFile('../personajes/partidas/enemigos.json' , JSON.stringify(enemigos, null, 4) , function (err) {
			  if (err){
				  return console.log(err);	  
			  }
		});

	}

	if (enemigos === undefined){
		console.log('No se han guardado los enemigos (estados vacios)');
	} else {
		fs.writeFile('../personajes/partidas/estado.json' , JSON.stringify(estado, null, 4) , function (err) {
			  if (err){
				  return console.log(err);	  
			  }
		});

	}
	console.log('Estado guardado.');
}

/*funcion para carga de datos del sistema */
function cargarDatos(){

	console.log("Cargando registro...")
	fs.readFile('../personajes/partidas/registros.json', (err, data) => {
		if (!err){ //fichero existe
			registro = JSON.parse(data);
    	  }
	
	});
	console.log("Registro Cargado");
	console.log('Cargando personajes...');
	fs.readFile('../personajes/partidas/personajes.json', (err, data) => {
		if (!err){ //fichero existe
			personajes = JSON.parse(data);
    	  }
	
	});
	console.log('Personajes cargados.');
	console.log('Cargando posiciones...');
	fs.readFile('../personajes/partidas/posPersonajes.json', (err, data) => {
		if (!err){ //fichero existe
			posicionPersonajes = JSON.parse(data);
    	  }
	
	});
	console.log('Posiciones cargadas');
	console.log('Cargando enemigos...');
	fs.readFile('../personajes/partidas/enemigos.json', (err, data) => {
		if (!err){ //fichero existe
			enemigos = JSON.parse(data);
    	  }
	
	});
	console.log('Enemigos cargados.');
	console.log('Cargando estados...');
	fs.readFile('../personajes/partidas/estado.json', (err, data) => {
		if (!err){ //fichero existe
			estado = JSON.parse(data);
    	  }
	
	});
	console.log('Estados cargados.');
}

/* Busca un PJ dado un nombre de usuario y la ID partida en la que esta. El personaje debe estar cargado.
* Devuelve el personaje si lo encuentra y false si no.
*/
function buscarPj(nombre, idPartida) {
	for (i in personajes[idPartida]) {
		if (personajes[idPartida][i].usuario == nombre) {
			return i;
		}
	}
	//no se ha encontrado
	return false;
}

/* Dado un modificador que se suma a la tirada, devuelve un objeto {resultado, cadenaTiradas}
 * resultado es un entero y cadenaTiradas es una cadena con todas las tiradas (es tirada abierta)
 */
function tiradaAbierta(modificador){
	var nTiradas = 0;
	var tirada = new Array();
	var resultado = 0;
	tirada[0] = chance.d100();
	while (tirada[nTiradas] > 95) { //"critico" explosivo en la ultima tirada
  		nTiradas++; //hay una tirada mas
		tirada[nTiradas] = chance.d100();
	}
	for (var i = 0; i <= nTiradas; i++){
		resultado += tirada[i];
	}
	resultado += modificador; //se suma el modificador final solo una vez
	
	var cadenaTiradas = "[" + tirada[0];
	
	for (var i = 1; i <= nTiradas; i++){
		cadenaTiradas += ",";
		cadenaTiradas += tirada[i];
	}
	cadenaTiradas += "]";
	
	return {resultado: resultado, cadenaTiradas: cadenaTiradas};
}

/* Dado un nombre de personaje/enemigo, la idPartida y el tipo ('aliado' o 'enemigo') 
 * devuelve la posicion dentro del vector donde se encuentra
 */
function buscarPorNombre(nombre, idPartida, tipo){
	if (tipo == 'aliado'){
		for (i in personajes[idPartida]){
			if (personajes[idPartida][i].nombre == nombre){
				return i;
			}
		}
			
	} else {
		for (i in enemigos[idPartida]){
			if (enemigos[idPartida][i].nombre == nombre){
				return i;
			}
		}
	}
		
}
/* Busca en el vector de turno ordenado la posicion de un personaje dado su nombre

 */
function buscarDefensor(nombre, idPartida){
	for (i in turnoOrdenado[idPartida]){
		if (turnoOrdenado[idPartida][i].personaje.nombre == nombre){
			return i;
		}
	}
	return 'no encontrado';
}

//devuelve la habilidad que tiene un personaje de turnoOrdenado con un determinado arma
function habilidadArma(idPartida, posicion, tipoArma){
	var habilidad;
	switch (tipoArma){
	case "Filo": habilidad = turnoOrdenado[idPartida][posicion].personaje.bHabilidad.filo;
		break;
	case "Contundente": habilidad = turnoOrdenado[idPartida][posicion].personaje.bHabilidad.contundente;
		break;
	case "Asta": habilidad = turnoOrdenado[idPartida][posicion].personaje.bHabilidad.asta;
		break;
	case "A dos manos": habilidad = turnoOrdenado[idPartida][posicion].personaje.bHabilidad.dosManos;
		break;
	case "Proyectil": habilidad = turnoOrdenado[idPartida][posicion].personaje.bHabilidad.proyectiles;
		break;
		
	}
	return habilidad;
}

/* Dado el valor de ataque, tipo de ataque, y tipo de defensa del defensor
 * devuelve el daño ocasionado al defensor
 */
function tablaAtaque(ataque, tipo, defensa){
	var resultado;
	var armadura;
	switch(defensa){
	case 'Coraza' : 
	case 'coraza' :
		armadura = 0;
	break;
	case 'Cota de malla' :
	case 'cotaMalla' :	
		armadura = 1;
	break;
	case 'Armadura de cuero endurecido' : 
	case 'cueroEndurecido' :
		armadura = 2;
	break;
	case 'Armadura de cuero' : 
	case 'cuero':
		armadura = 3;
	break;
	default: armadura = 4; //sin armadura
	break;
	}
	

	var proyectiles = [
	                   [0,0,0,0,0],
	                   [1,0,0,0,0],
	                   [2,2,0,4,0],
	                   [3,4,3,6,0],
	                   [4,6,5,8,0],
	                   [5,7,7,10,8],
	                   [6,8,9,12,10],
	                   [7,10,10,13,11],
	                   [8,13,12,14,13],
	                   [9,14,13,16,15],
	                   [10,16,15,17,16],
	                   [11,17,17,19,18],
	                   [11,19,19,20,20],
	                   [12,20,21,22,22],
	                   [13,22,23,23,23],
	                   [14,23,25,25,25],
	                   [15,25,26,26,27]                   
	                   ];
	
	var filo = [
		        [0,0,0,0,0],
		        [1,0,0,0,0],
		        [1,1,0,0,0],
		        [2,1,0,0,0],
		        [2,2,0,0,0],
		        [3,3,2,3,0],
		        [3,4,3,5,0],
		        [4,5,5,7,7],
		        [5,6,6,9,9],
		        [5,7,7,10,10],
		        [6,8,9,12,11],
		        [6,8,9,12,11],
		        [7,10,11,14,15],
		        [8,11,12,15,17],
		        [8,12,13,17,19],
		        [9,13,15,18,20],
		        [9,13,16,19,21],
		        [10,14,17,20,23],    
		        [11,15,18,22,25],
		        [11,16,20,23,27],
		        [12,17,21,24,28],
		        [12,18,22,25,30]
		        ];
	
	var contundente = [

				[0,0,0,0,0],
				[1,0,0,0,0],
				[1,1,0,0,0],
				[2,2,0,0,0],
				[3,3,0,0,0],
				[3,4,0,0,0],
				[4,5,0,0,0],
				[5,6,2,3,0],
				[5,7,3,5,0],
				[6,8,4,6,0],
				[7,9,6,7,6],
				[8,10,7,8,8],
				[8,11,8,9,9],
				[9,12,9,10,10],
				[10,13,10,11,12],
				[10,14,11,12,13],
				[11,15,12,13,14],
				[12,16,13,14,15],
				[13,17,15,15,17],
				[13,18,16,16,18],
				[14,19,17,17,19],
				[15,20,18,18,21],
				[16,21,19,19,22],
				[16,22,20,20,23]
				];
	
	var dosManos = [
				[0,0,0,0,0],
				[2,0,0,0,0],
				[3,0,0,0,0],
				[4,3,0,6,0],
				[5,5,2,8,0],
				[6,7,4,10,0],
				[7,9,7,13,10],
				[8,11,9,15,13],
				[9,12,12,17,16],
				[11,14,14,20,19],
				[12,16,17,22,22],
				[13,18,19,24,25],
				[14,20,22,27,28],
				[15,22,24,29,31],
				[16,24,27,31,33],
				[17,26,29,33,36],
				[19,28,32,36,39],
				[20,29,34,38,42],
				[21,31,37,40,45],
				[22,33,40,43,48]
				];	
	var garrasDientes = [
				[0,0,0,0,0],
				[0,0,0,0,1],
				[0,0,0,0,2],
				[1,0,0,1,4],
				[1,1,1,2,5],
				[2,2,2,4,6],
				[3,3,3,5,8],
				[4,4,5,7,9],
				[5,5,7,9,10],
				[6,6,8,10,12],
				[6,7,9,11,13],
				[7,8,10,12,14],
				[7,9,11,13,15],
				[8,10,12,15,17],
				[9,11,13,16,19],
				[10,11,14,17,20],
				[14,15,18,20,26],
				[16,18,20,23,28],
				[18,20,22,25,30]
				];
	var agarre = [
				[0,0,0,0,0],
				[1,0,0,0,0],
				[1,0,0,0,1],
				[2,1,0,1,1],
				[2,2,1,3,2],
				[3,3,2,4,4],
				[3,4,4,6,5],
				[4,4,5,7,7],
				[4,5,6,8,8],
				[5,6,7,9,10],
				[5,7,8,10,11],
				[6,8,10,12,14],
				[7,9,11,13,15],
				[8,10,12,14,16],
				[10,11,14,16,18],
				[11,13,16,18,20],
				[12,15,18,20,22]
				];
	console.log(tipo);
	switch(tipo){
	case 'Proyectil':

		console.log("Ataque de proyectiles, ataque: " + ataque + " armadura: "+ defensa + armadura);
		if (ataque <= 70)
			resultado = 0;
		else if (ataque > 145)
			resultado = proyectiles[16][armadura]; //ultima fila
		else{
			var fila = Math.floor(ataque / 5) - 14;
			if (ataque%5 != 0) //redondeamos hacia arriba
				fila++;
	
			resultado = proyectiles[fila][armadura];
		}
		
		break;
	case 'Contundente':

		console.log("Ataque contundente, ataque: " + ataque + " armadura: "+ defensa + armadura);
		if (ataque <= 35)
			resultado = 0;
		else if (ataque > 150)
			resultado = contundente[23][armadura]; //ultima fila
		else{
			var fila = Math.floor(ataque / 5) - 7;
			if (ataque%5 != 0) //redondeamos hacia arriba
				fila++;
	
			resultado = contundente[fila][armadura];
		}
		
		break;
	case 'A dos manos':

		console.log("Ataque a dos manos, ataque: " + ataque + " armadura: "+ defensa + armadura);
		if (ataque <= 55)
			resultado = 0;
		else if (ataque > 150)
			resultado = dosManos[16][armadura]; //ultima fila
		else{
			var fila = Math.floor(ataque / 5) - 11;
			if (ataque%5 != 0) //redondeamos hacia arriba
				fila++;
	
			resultado = dosManos[fila][armadura];
		}
		
		break;
	case 'garra':
	case 'mordisco':
	case 'picoPinzas':

		console.log("Ataque de monstruo (garras, mordisco, o pico/pinzas), ataque: " + ataque + " armadura: "+ defensa + armadura);
		if (ataque <= 55)
			resultado = 0;
		else if (ataque > 135)
			resultado = garrasDientes[18][armadura]; //ultima fila
		else{
			var fila = Math.floor(ataque / 5) - 9;
			if (ataque%5 != 0) //redondeamos hacia arriba
				fila++;
	
			resultado = garrasDientes[fila][armadura];
		}
		
		break;
		
	case 'topetazo':

		console.log("Ataque de monstruo (topetazo): " + ataque + " armadura: "+ defensa + armadura);
		if (ataque <= 55)
			resultado = 0;
		else if (ataque > 135)
			resultado = agarre[16][armadura]; //ultima fila
		else{
			var fila = Math.floor(ataque / 5) - 11;
			if (ataque%5 != 0) //redondeamos hacia arriba
				fila++;
	
			resultado = agarre[fila][armadura];
		}
		
		break;
		
	default: //filo
		console.log("Ataque de filo, ataque: " + ataque + " armadura: "+ defensa+armadura);
		if (ataque <= 40)
			resultado = 0;
		else if (ataque > 150)
			resultado = filo[21][armadura]; //ultima fila
		else{
			var fila = Math.floor(ataque / 5) - 9;
			if (ataque%5 != 0) //redondeamos hacia arriba
				fila++;
	
			resultado = filo[fila][armadura];
		}
		
		break;
		
	}
	console.log(resultado);
	return resultado;
}

/*Función que determina el resultado de una tirada de sortilegio.
 * Recibe el resultado de la tirada de un sortilegio con todos los bonos ya aplicados
 * Devuelve el valor que debe aplicarse a la tirada de resistencia de un posible enemigo si el sortilegio es un exito, o "Sortilegio fallido" si el sortilegio ha fallado.
 */
function resultadoSortilegio (resultado){
	
	var tablaResultado = [ //24 filas
                      		[8, 70],
                      		[12, 65],
                      		[16, 60],
                      		[20, 50],
                      		[24, 45],
                      		[28, 35],
                      		[32, 30],
                      		[36, 20],
                      		[40, 15],
                      		[44, 5],
                      		[48, 0],
                      		[52, 0],
                      		[56, -5],
                      		[60, -10],
                      		[64, -15],
                      		[68, -20],
                      		[72, -25],
                      		[76, -30],
                      		[80, -35],
                      		[84, -40],
                      		[88, -45],
                      		[92, -50],
                      		[96, -55],
                      		[99, -65],
	                      ];
	
	
	if (resultado >= 5){ //si es menor que 5, el sortilegio falla
		if (resultado > 99){
			return -90;
		}
		else{
			for (var i = 0; i < 24; i++){
				if (tablaResultado[i][0] > resultado){ //es el resultado que buscamos
					return tablaResultado[i][1];
				}
			}
		}
	} else {
		return "Sortilegio fallido";
	}
	
}

