/** JavaScript asociado a jugar.php
 * Requiere jQuery, Socket.io, utilidadesRol.js y las variables PHP del nombre de usuario, ID partida, tipo de usuario y array con todos los jugadores en
 * php_nUsuario, php_idPartida, php_tipoUsuario y php_jugadores
 */


$('document').ready(function(){
	//al conectar, enviamos la id de la partida, el nombre de usuario y el tipo de usuario que es (director o jugador)
	var socket = io.connect( 'http://localhost:8080', 
			{ query : "id_partida="+php_idPartida+"&nusuario="+php_nUsuario+"&tipo="+php_tipoUsuario+"&jugadores="+php_jugadores } );
	//var socket = io.connect( 'http://83.33.245.56:8080', 
	//		{ query : "id_partida="+php_idPartida+"&nusuario="+php_nUsuario+"&tipo="+php_tipoUsuario+"&jugadores="+php_jugadores } ); //mi ip externa
	//var socket = io.connect( 'http://roltierramedia.ddns.net:8080', 
	//				{ query : "id_partida="+php_idPartida+"&nusuario="+php_nUsuario+"&tipo="+php_tipoUsuario+"&jugadores="+php_jugadores } ); //mi ip externa
	// heroku var socket = io.connect( 'http://server-tierra-media.herokuapp.com', 
	//				{ query : "id_partida="+php_idPartida+"&nusuario="+php_nUsuario+"&tipo="+php_tipoUsuario+"&jugadores="+php_jugadores } ); //mi ip externa
	
	var canvas = document.getElementById('tablero');
	var ctx = canvas.getContext('2d');
	var lay = Layout( layout_pointy,  Point(19, 19),  Point(515,310) );
	var capturaPixeles; //se inicializara en el primer dibujado de mapa
	//simulacion de enum para los tiles del mapa
	
	var t = {
		nada : -1, //indicador de que no hay que dibujar nada
		//tiles base
		hier : 0, //hierba
		agua : 1, 
		aren : 2, //arena

		//obstaculos
		bosq : 3, //bosque
		roca : 4, //rocas

		//caminos
		rec1: 5, // recta -
		rec2: 6, // recta \
		rec3: 7, // recta /

		//cruces
		cru1: 8, // -<
		cru2: 9, // >-

		//curvas

		cur1: 10, // izquierda a abajoder
		cur2: 11, // abajoizq a derecha
		cur3: 12, // izquierda a arribader
		cur4: 13, // arribaizq a derecha

		//no tiles

		bola: 14

	}
	

	//matriz del mapa
	
	var mapa = {
			
			tiles :	[
				[t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca,], 							
				[t.nada, t.nada, t.nada, t.nada, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.nada, t.nada ],
				[t.rec1, t.rec1, t.rec1, t.rec1, t.cur1, t.nada, t.nada, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada ],
				[t.nada, t.nada, t.nada, t.nada, t.rec2, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.cur2, t.rec1, t.rec1 ],
				[t.nada, t.nada, t.nada, t.nada, t.nada, t.rec2, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.roca, t.nada, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.nada, t.nada, t.nada, t.nada, t.nada, t.cur2, t.cur3, t.nada, t.nada ],
				[t.nada, t.bosq, t.nada, t.nada, t.nada, t.rec2, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.roca, t.roca, t.roca, t.roca, t.nada, t.nada, t.nada, t.cur2, t.cur3, t.nada, t.nada, t.nada, t.nada ],
				[t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.cur4, t.rec1, t.cur1, t.nada, t.nada, t.nada, t.nada, t.roca, t.bosq, t.nada, t.nada, t.nada, t.nada, t.roca, t.nada, t.nada, t.nada, t.nada, t.rec3, t.nada, t.nada, t.nada, t.nada, t.nada ],
				[t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.rec2, t.nada, t.nada, t.nada, t.nada, t.nada, t.roca, t.roca, t.nada, t.nada, t.roca, t.nada, t.nada, t.nada, t.nada, t.rec3, t.bosq, t.roca, t.nada, t.nada, t.nada, t.bosq ],
				[t.nada, t.nada, t.bosq, t.nada, t.bosq, t.bosq, t.nada, t.nada, t.bosq, t.cur4, t.rec1, t.cur1, t.nada, t.nada, t.nada, t.nada, t.roca, t.roca, t.nada, t.nada, t.nada, t.nada, t.nada, t.rec3, t.nada, t.nada, t.nada, t.nada, t.bosq, t.bosq ],
				[t.nada, t.nada, t.nada, t.nada, t.nada, t.bosq, t.nada, t.nada, t.nada, t.nada, t.roca, t.rec2, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.rec3, t.nada, t.nada, t.bosq, t.nada, t.bosq, t.bosq, t.bosq ],
				[t.nada, t.nada, t.nada, t.nada, t.nada, t.bosq, t.bosq, t.nada, t.nada, t.nada, t.nada, t.cur2, t.cru2, t.rec1, t.rec1, t.rec1, t.rec1, t.rec1, t.rec1, t.rec1, t.rec1, t.cru1, t.cur3, t.nada, t.nada, t.nada, t.nada, t.bosq, t.bosq, t.bosq ],
				[t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.rec3, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.bosq, t.nada, t.nada, t.nada, t.cur4, t.cur1, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada ],
				[t.roca, t.roca, t.roca, t.roca, t.nada, t.nada, t.nada, t.roca, t.nada, t.nada, t.rec3, t.nada, t.nada, t.nada, t.nada, t.roca, t.roca, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.cur4, t.rec1, t.rec1, t.cur1, t.nada, t.nada, t.nada ],
				[t.roca, t.roca, t.roca, t.roca, t.bosq, t.nada, t.nada, t.nada, t.nada, t.rec3, t.nada, t.nada, t.nada, t.nada, t.roca, t.roca, t.roca, t.roca, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.rec2, t.nada, t.nada, t.nada ],
				[t.roca, t.roca, t.roca, t.roca, t.nada, t.nada, t.nada, t.nada, t.nada, t.rec3, t.nada, t.bosq, t.nada, t.nada, t.roca, t.roca, t.roca, t.roca, t.nada, t.nada, t.bosq, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.cur4, t.rec1, t.rec1 ],
				[t.roca, t.roca, t.roca, t.nada, t.nada, t.nada, t.nada, t.nada, t.rec3, t.nada, t.nada, t.nada, t.nada, t.nada, t.roca, t.roca, t.roca, t.roca, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada ],
				[t.roca, t.roca, t.roca, t.nada, t.nada, t.nada, t.nada, t.nada, t.rec3, t.nada, t.nada, t.nada, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.nada, t.nada, t.nada, t.nada, t.nada, t.bosq, t.nada, t.nada, t.nada, t.nada ],
				[t.roca, t.roca, t.roca, t.nada, t.nada, t.nada, t.nada, t.rec3, t.nada, t.nada, t.nada, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.nada, t.nada, t.nada, t.nada, t.roca, t.nada, t.nada, t.bosq, t.nada, t.nada ],
				[t.roca, t.roca, t.roca, t.nada, t.nada, t.nada, t.nada, t.rec3, t.nada, t.nada, t.nada, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.bosq, t.nada, t.nada, t.nada ],
				[t.roca, t.roca, t.roca, t.nada, t.nada, t.nada, t.rec3, t.nada, t.nada, t.nada, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.roca, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada, t.nada ]
				],
			hexagonos : [],
			posPersonajes : []
	}
	var pj;
	var pnj;
	var personajes; //para el director
	var enemigos; //para el director


	cargarTienda(); 
	
	/*Accion que se está realizando; para el evento onclick del mapa
	 * Posibles tipos de acción:
	 * ninguna:		Ninguna acción realizada
	 * movForzado:	Movimiento a cualquier lugar del mapa (para inicializar posición de un personaje o movimientos no naturales)
	*/
	var accion = {
			tipo : "ninguna",
			datos : null
	};

	var registroEnviado = false;
	var nUsuario = php_nUsuario;
	var nombreChat = nUsuario; //el nombre que se usara en el chat
	var listasCargadas = false;
	var tableroMostrado = false; //determina si el tablero empieza oculto o mostrado (oculto por defecto)
	$("#tablero").hide();

	
	//Simulacion de clase javascript para el carrito de compra de la tienda
	var carrito = { 
			// Vector de objetos (items de la tienda)
			contenido : [],
			// Coste de todos los objetos dentro del vector contenido
			coste : 0,
			// Identificador del siguiente item que se introduce
			id : 0,
			/* Recibe como parametro un item de la tienda (que es un objeto JavaScript). No devuelve nada.
			 * Añade ese objeto al array del carrito listos para comprar y actualiza la tabla de objetos a comprar y el precio de la operación total.
			 */
			addItem : function (objeto) {
				$('.carritoOculto').show();
				this.contenido.push(objeto);
				idobjeto = this.id;
				$('#carrito').append("<tr id='itemlista"+idobjeto+"'><td>"+objeto.nombre+"</td><td>"+objeto.precio+"</td><td><a id='borraritem"+idobjeto+"' class='w3-right w3-btn w3-small w3-round w3-red'>Eliminar</a></td></tr>");
				$('#borraritem'+idobjeto).on('click', {idtabla : idobjeto, iditem: objeto.id}, function(event){
					carrito.eliminarItem(event.data.idtabla, event.data.iditem);
				});
				this.id++;
				this.coste += objeto.precio;
				$('#totalCarrito').text(this.coste);
			},
			
			/* Recibe como parametros la id de la fila en la que está el objeto y el id del objeto a eliminar
			 * Borra la fila de la tabla y el objeto del contenido. No devuelve nada.
			 */
			eliminarItem: function(idtabla, iditem){
				var buscar;
				for (var x in this.contenido){
					if (this.contenido[x].id == iditem){
						buscar = x;
					}
				}
				$('#itemlista'+idtabla).remove();
				this.coste -= this.contenido[buscar].precio;
				$('#totalCarrito').text(this.coste);
				this.contenido.splice(buscar,1);
				if(this.contenido.length == 0){ //si no quedan mas items se resetea el carrito
					this.resetCarrito();
				}
				
			},

			/* No recibe ni devuelve ningun parametro explicito.
			 * Resetea el carrito y vuelve a ocultar todos los campos relacionados
			 */
			resetCarrito : function () {
				$('#totalCarrito').text(this.coste);
				this.contenido = []; //reiniciamos la array
				this.coste = 0;
				this.id = 0;
				$('#carrito').empty();
				$('.carritoOculto').hide();
				
			},
			/* No recibe ni devuelve ningun parametro explicito.
			 * Añade el carrito de la compra al equipo del pj y resetea el carrito.
			 * También emite el evento correspondiente para que los cambios se hagan en el lado del servidor.
			 */
			comprar : function () {
				if (pj.dinero >= this.coste){ //si no tiene suficiente dinero no se hace nada				
					for (i in this.contenido){
						pj.equipo.push(this.contenido[i]);
					};
					pj.dinero -= this.coste;
					$('.dinero').text(pj.dinero); //se actualiza los lugares donde aparece el dinero del pj
					socket.emit('actualizarPJ', pj);

					this.resetCarrito();
					cargarEquipo();
				}
				else {
					alert("Dinero insuficiente");
				}
				
			}
			
			
	};
 	 //Operaciones de tablero
 	 
 	 //busca un personaje en la matriz de personajes y devuelve un objeto con las dos coordenadas
 	 //Precondición: Los personajes son únicos en el mapa (solo hay una instancia de un personaje)
 	 //Postcondición: Devuelve un objeto con atributos r,q con fila y columna del personaje o null si no encuentra al personaje
 	function buscarPersonaje(personaje){
 		//Es necesaria marcar la diferencia entre enemigo y aliado ya que el nombre es unico en los enemigos pero no en los aliados.
 		if (personaje.usuario == undefined){ //enemigo
	 		for (var i = 0; i <20; i++) {
	 			for (var j = 0; j<30; j++ ) {
	 				if (mapa.posPersonajes[i][j] != null && mapa.posPersonajes[i][j].nombre == personaje.nombre)
	 					return {r: i, q:j};
	 			}
	 		}
 		}
 		else{ //aliado
 			for (var i = 0; i <20; i++) {
	 			for (var j = 0; j<30; j++ ) {
	 				if (mapa.posPersonajes[i][j] != null && mapa.posPersonajes[i][j].usuario == personaje.usuario)
	 					return {r: i, q:j};
	 			}
	 		}
 		} 
 		
 		return null;

 	}
	//busca un enemigo en el vector de enemigos por nombre
	//devuelve null si no encuentra nada
	function buscarEnemigo(ene){
		var posicion = null; 
		for (i in enemigos){
			if (enemigos[i].nombre == ene)
				posicion = i;
		}
		return posicion;
	}
	
	//elimina el enemigo que esta en la posicion que recibe
	function eliminarNPC(pos){ 
		
		var cord = buscarPersonaje(enemigos[pos]);
		if (cord != null) { //si el personaje está en el mapa se elimina de él
			mapa.posPersonajes[cord.r][cord.q] = null; //eliminamos el personaje de la matriz
			socket.emit('actualizarMapa', mapa.posPersonajes);
		}
		
		//lo eliminamos de la lista de npc
		enemigos.splice(pos, 1);
		socket.emit('actualizarEnemigos', enemigos);
		actualizarEnemigos();
		actualizarPuntosVida();
	}

	function dibujarPersonajes() {
		
		
		for(var i = 0; i < 20; i++){
			for (var j=0; j<30; j++){
				if (mapa.posPersonajes[i][j] != null){
					var p = hex_to_pixel(lay, matrizHex(i, j));
					
					ctx.beginPath();
					ctx.arc(p.x, p.y, 10, 0, 2 * Math.PI, false);
					ctx.fillStyle = mapa.posPersonajes[i][j].color;
					ctx.fill();
					ctx.lineWidth = 3;
					if (mapa.posPersonajes[i][j].nombre == pj.nombre) //propio personaje
						ctx.strokeStyle = 'white';
					else if(mapa.posPersonajes[i][j].profesion == null) //si no tiene clase es enemigo
						ctx.strokeStyle = 'red';
					else //aliado
						ctx.strokeStyle = 'lawngreen';
					ctx.stroke();
				}
					
			}
		}
	}

	

	//Eventos de jugador y director
	
	//Un personaje ha sido actualizado.
	//En el caso del director, es necesario cargar el personaje seleccionado por el
	socket.on('personajesActualizados', function(per){
		personajes = per.slice(); //se clona el vector de personajes para actualizarlo
		for (i in per){
			if (per[i].usuario == pj.usuario){ //el atributo usuario es unico para cada personaje
				pj = per[i];
				cargarPj();
			}
		}
	});

	
	/*director: recibe:
	 * personajes: vector con los pjs
	 * enemigos: vector con los enemigos
	 * posPersonajes: matriz con los personajes y enemigos en ella
	 */
	
	socket.on('director', function(e){
		$('#linkModalVerPj').show();
		//$('#linkModalTienda').hide();
		//$('#linkModalSubirNivel').hide();
		$('#estadoDirector').show();
		$('#textoEstado').hide();
		$('#accionesDirector').show();
		
		nombreChat = "<i>Director</i> (" + nUsuario + ")";
		personajes = e.personajes;
		enemigos = e.enemigos;
		actualizarEnemigos();
		actualizarPuntosVida();
		mapa.posPersonajes = e.posPersonajes;
		if (personajes.length > 0){ //si la array no esta vacia
			pj = personajes[0]; //este es el pj que actualmente esta "viendo" el director
			cargarPj();
		}
		//se crea el desplegable para elegir personaje
		$('#pjSel').append("<select class='w3-theme-d4 tagSel'></select>");
		for (var i = 0; i < personajes.length; i++){
			addPjSelect(personajes[i].nombre, i);
		}
		//al cambiar el valor del desplegable se actualiza la ficha
		$('.tagSel').change(function() {
		    pj = personajes[$(this).val()];
		    cargarPj();
		    $('.tagSel').val($(this).val()); // para que se actualice en todos los selectores
		    
		    if (tableroMostrado){
		    	//se actualiza el mapa para que se refleje el personaje que se tiene seleccionado
			    ctx.putImageData(capturaPixeles, 0, 0);
				dibujarPersonajes();
		    }
		    
		});
		cargarNPC();
		
		//Un personaje ha sido actualizado.
		//En el caso del director, es necesario cargar el personaje seleccionado por el
		socket.on('personajesActualizados', function(per){
			personajes = per.slice(); //se clona el vector de personajes para actualizarlo
			for (i in per){
				if (per[i].usuario == pj.usuario){ //el atributo usuario es unico para cada personaje
					pj = per[i];
					cargarPj();
				}
			}
		});
		//Experiencia
		$('#menuTop').append("<a id='darExp' class='link'>Dar Experiencia</a>");
		$('#darExp').bind('click', function(){
			$('#modalExp').show();
			
			//reseteamos las tablas
			$("#darExpTabla tr").remove();
			$("#darExpTabla tr").remove();
			//cabecera de la tabla
			$('#darExpTabla').append("<tr class='w3-theme-d2'><th title='Nombre'>Nombre</th><th title='Nivel'>Nivel</th><th title='Experiencia actual'>Experiencia</th><th title='Experiencia ganada'>Sumar Exp</th></tr>");
			//Creamos la tabla
			for (i in personajes){
				var fila = "<tr>";
				fila += "<td>"+ personajes[i].nombre; +"</td>";
				fila += "<td>"+ personajes[i].nivel; +"</td>";
				fila += "<td>"+ personajes[i].experiencia; +"</td>";
				fila += "<td style='width:26%' ><input id='sumarExp"+i+"' max='99999' min='0' type='number' value='0'></td>";
				fila += "</tr>";
				$('#darExpTabla').append(fila);
			}
			
			$('#experienciaAplicar').unbind('click').bind('click', function(){ 
				var cadenaChat = "";
				for(i in personajes){
					if(Number.isInteger(parseInt($('#sumarExp'+i).val()))){ 
						var exp = parseInt($('#sumarExp' +i).val());
						var resultadoExp = subirExp(personajes[i].experiencia, exp); //definido en utilidades.js, devuelve objeto {expTotal, nivel, haSubido}
						cadenaChat += "<br>" + personajes[i].nombre + " ha ganado " + exp + " puntos de experiencia.";
						personajes[i].experiencia = resultadoExp.expTotal;
						personajes[i].nivel = resultadoExp.nivel;
						if (resultadoExp.haSubido)
							cadenaChat += "<br>¡" + personajes[i].nombre + " ha subido a nivel " + personajes[i].nivel + "!";

					}
				}
				socket.emit('actualizarPersonajes', personajes, false);
				socket.emit('mensaje', {nom: "Sistema", mensaje: cadenaChat});
				$('#modalExp').hide();
			});
			
			
			
		});
		
		$('.experienciaCancelar').bind('click', function(){ 
			$('#modalExp').hide();
		});
		//Descanso de personajes
		$('#menuTop').append("<a id='descanso' class='link'>Descanso</a>");
		$('#descanso').bind('click', function(){
			$('#modalDescanso').show();
			
			//reseteamos las tablas
			$("#horasDescansoTabla tr").remove();
			$("#horasDescansoTabla tr").remove();
			//cabecera de la tabla
			$('#horasDescansoTabla').append("<tr class='w3-theme-d2'><th title='Nombre'>Nombre</th><th title='Horas de descanso'>Horas</th></tr>");
			
			
			for (i in personajes){
				var fila = "<tr>";
				fila += "<td>"+ personajes[i].nombre; +"</td>";
				fila += "<td style='width:20%' ><input id='pjHoras"+i+"' max='999' min='0' type='number'value='0'></td>";
				fila += "</tr>";
				$('#horasDescansoTabla').append(fila);
			}
			
			$('#descansoAplicar').unbind('click').bind('click', function(){ 
				var cadenaChat = "";
				if ($('input[name=tipoDescanso]:checked').val() == "general"){
					for(i in personajes){
						if(Number.isInteger(parseInt($('#horasGeneral').val()))){ //si es un numero (se toma parte entera)
							cadenaChat = "El grupo ha descansado " + parseInt($('#horasGeneral').val()) + " horas.";
							//recupera 3 puntos de vida por cada hora de descanso
							personajes[i].vida += 3 * parseInt($('#horasGeneral').val());
							if (personajes[i].vida > personajes[i].vidaMaxima){
								personajes[i].vida = personajes[i].vidaMaxima;
							}
							if (parseInt($('#horasGeneral').val()) >= 8){
								personajes[i].puntosPoder = personajes[i].poderMaximo;
							}
							
							
						}
					}
				} else { //descanso individual
					for(i in personajes){
						if(Number.isInteger(parseInt($('#pjHoras'+i).val()))){ 
							//recupera 3 puntos de vida por cada hora de descanso
							cadenaChat += "<br>" + personajes[i].nombre + " ha descansado " + parseInt($('#pjHoras' +i).val()) + " horas.";
							personajes[i].vida += 3 * parseInt($('#pjHoras'+i).val());
							if (personajes[i].vida > personajes[i].vidaMaxima){
								personajes[i].vida = personajes[i].vidaMaxima;
							}
							
							if (parseInt($('#pjHoras'+i).val()) >= 8){
								personajes[i].puntosPoder = personajes[i].poderMaximo;
							}
						}
					}
				}
				
				actualizarPuntosVida();
				socket.emit('actualizarPersonajes', personajes, false);
				socket.emit('mensaje', {nom: "Sistema", mensaje: cadenaChat});
				$('#modalDescanso').hide();
			});

		});
		$('.descansoCancelar').bind('click', function(){ 
			$('#modalDescanso').hide();
		});
		
		
		
		$('#menuTop').append("<a id='cargarMapa' class='link'>Mostrar Mapa</a>");
		$('#cargarMapa').bind('click',  function(){
			if (tableroMostrado){

				tableroMostrado = false;
				$("#cargarMapa").text("Mostrar Mapa");
				$("#tablero").hide();
				$("#infoCasilla").hide();
				$("#estPartida").show();
				socket.emit('ocultarMapa');
			}
			else {
				if (personajes.length > 0){
					tableroMostrado = true;
					$("#cargarMapa").text("Ocultar Mapa");
					
					$("#estPartida").hide();
					$("#tablero").show();
					$("#infoCasilla").show();
					cargarTablero();
					socket.emit('mostrarMapa', mapa.posPersonajes); 
				}
				else alert("Se requiere que al menos un personaje haya sido creado");
			}
		});
		//operaciones personajes
		
		//Movimiento Forzado - Coloca a un personaje en cualquier lugar del mapa 
		$('#moverForzado').bind('click',  function(){
			if (accion.tipo == "ninguna"){ //si hay otra acción en curso (o esta misma) esta no empezara 
				var coordenadas = buscarPersonaje(pj);
				if(coordenadas != null) {
					
					movimiento = rangoMov(mapa, t,  matrizHex(coordenadas.r, coordenadas.q ), pj.velocidad/3);
					movimiento.forEach(function(hex){
						drawHex(ctx, lay, hex, 'rgba(255, 255, 0, 0.3)');
					})
				}
				//Se rellenan los datos para el evento click
				accion.tipo = "movForzado";
				accion.datos = coordenadas;
			}
			else  
				alert("Hay una acción en curso");
			
		});
		$('#inicioCombate').bind('click',  function(){
				/* 1) enviar evento de inicio de turno para que todos manden sus acciones
				 * 2) enviar las acciones de los npcs (todas juntas?) (todos, incluso los que no estan en el mapa)
				 * 3) esperar a recibir todas las acciones de los jugadores (solo los que esten en el mapa)
				 * 4) empieza el turno en si
				 * 5) el primer jugador (recibe evento de "su turno") hace su accion (emite evento) o la retrasa (emite evento)
				 * 6) así sucesivamente hasta que todos terminen
				 * 7) vuelta a 1)
				 */
			socket.emit('inicioTurno');

		});
		//esperando accion NPC
		socket.on('esperarAccion', function(){ 
			$('#registroCombate').empty();
			$('#estadoTurno').text("Esperando declarar acciones");
			$('#opcionesCombate').empty();
			$('#opcionesCombate').append("<a id='forzarTurno' class='link'>Forzar inicio de turno</a>"); 
			$("#forzarTurno").unbind('click').bind('click', function(){ 
				socket.emit('forzarTurno');
			});
			
			//reseteamos la tabla
			$("#enemigosAccionesVivos tr").remove();
			//cabecera de la tabla
			$('#enemigosAccionesVivos').append("<tr class='w3-theme-d2'><th title='Nombre'>Nombre</th><th title='Movimiento'>Mov</th><th title='PV'>PV</th>" +
					"<th title='Armadura'>Armadura</th>	<th title='Defensa'>Def</th><th title='Ataque'>Ata</th><th title='Tipo Ataque'>Tipo</th>" +
					"<th title='Crítico'>Crítico</th><th title='Acción que realizará'>Acción</th></tr>");
			//desplegable, no se incluye la etiqueta de obertura ya que tendra un ID dinamico
			var desplegable =  //"<option value='1'>Preparar Sortilegio</option>" +
							 	//"<option value='2'>Realizar Sortilegio</option>" +
							 	//"<option value='3'>Ataque distancia</option>" +
							 	"<option value='4'>Ataque cuerpo a cuerpo</option>" +
							 	"<option value='5'>Movimiento</option>" +
							 	"<option value='6' selected>Nada</option>" +
							 "</select>";

			for (i in enemigos){
				var fila = "<tr>";
				fila += "<td>"+ enemigos[i].nombre; +"</td>";
				fila += "<td>"+ enemigos[i].velocidad +"</td>";
				fila += "<td>"+ enemigos[i].vidaMaxima +"</td>";
				fila += "<td>"+ enemigos[i].armadura +"</td>";
				fila += "<td>"+ enemigos[i].bd +"</td>";
				fila += "<td>"+ enemigos[i].ataque +"</td>";
				fila += "<td>"+ enemigos[i].tipoAtaque +"</td>";
				fila += "<td>"+ enemigos[i].critico +"</td>";
				fila += "<td><select id='sel"+ i + "'>"+ desplegable +"</td>";
				fila += "</tr>";
				$('#enemigosAccionesVivos').append(fila);
				

			}
			
			$('#modalAccionesNPC').show();
			$('#enviarAccionesNPC').unbind('click').bind('click', function(){ 

				var accionesNPC = [];
					for(i in enemigos){
						accionesNPC[i] = parseInt($('#sel'+i).val());
					}
					//se envia el vector de enemigos aunque ya lo tenga el servidor por se elimina algun enemigo o añade a lo largo del turno
					socket.emit('enviarAccionesNPC', {enemigosAcciones: enemigos, accionesNPC : accionesNPC});
			});
		});
		


	});
	/* Evento que se recibe al crearse un nuevo pj en la partida, va dirigido al director de juego
	 * Actualiza el vector de personajes.
	 */
	socket.on('nuevoPJ', function(e){ 
		if (php_tipoUsuario == 'director'){
			personajes.push(e);
			//se inserta el personaje en el último lugar del desplegable
			addPjSelect(personajes[personajes.length -1].nombre, personajes.length -1);
			
		};
		
	})
	//Evento para cuando un jugador aun no ha creado PJ
	socket.on('noPJ', function(){
		$('#linkCrearPj').remove();
		$('#linkModalVerPj').hide();
		$('#linkModalTienda').hide();
		//$('#linkModalSubirNivel').hide();
		
		$('#menuTop').prepend("<a id='linkCrearPj' href='crearPJ.php?id="+php_idPartida+"'>Crear Personaje</a>");
		
	});
	//Evento para cuando un jugador se conecta con su personaje ya creado.
	socket.on('siPJ', function siPJ	(e){
		$('#linkCrearPj').remove();
		$('#linkModalVerPj').show();
		$('#linkModalTienda').show();
		$('#linkModalSubirNivel').hide();
		
		pj = e.pj; //cargamos el pj
		mapa.posPersonajes = e.posPersonajes; //cargamos la matriz de personajes
		nombreChat = pj.nombre + " (" + nUsuario + ")";

		cargarPj();

		
		
		//EVENTOS JUGADOR
		socket.on('mostrarMapaJugador', function(posPj){
			//se actualiza la posicion de los personajes
			mapa.posPersonajes = posPj;
			$("#estPartida").hide();
			$("#tablero").show();
			$("#infoCasilla").show();
			cargarTablero();
			tableroMostrado = true;
		});
		socket.on('ocultarMapaJugador', function(){
			$("#tablero").hide();
			$("#infoCasilla").hide();
			$("#estPartida").show();
			tableroMostrado = false;
		});

		//esperando accion jugador
		socket.on('esperarAccion', function(){ 
			$('#registroCombate').empty();
			$('#estadoTurno').text("Esperando declarar acciones");
			$('#accionesJugador').show();
			
			$('#prepararSortilegio').unbind('click').bind('click', function() {
				socket.emit('enviarAccion', {personaje: pj, accion: 1}); //incluso si decide preparar un sortilegio, aún no debe decidir cual
				$('#accionesJugador').hide();
		    });
			$('#realizarSortilegio').unbind('click').bind('click', function() {
				socket.emit('enviarAccion', {personaje: pj, accion: 2}); 
				$('#accionesJugador').hide();
		    });
			$('#ataqueDistancia').unbind('click').bind('click', function() {
				if (pj.equipado.arma == undefined || pj.equipado.arma.tipo !== 'Proyectil')
					alert("Necesitas tener equipada un arma de rango para realizar esta acción");
				else {
					socket.emit('enviarAccion', {personaje: pj, accion: 3}); 
					$('#accionesJugador').hide();
				}
		    });
			$('#ataqueCuerpo').unbind('click').bind('click', function() {
					if (pj.equipado.arma == undefined || pj.equipado.arma.tipo == 'Proyectil')
					alert("Necesitas tener equipada un arma de cuerpo a cuerpo para realizar esta acción");
				else {
					socket.emit('enviarAccion', {personaje: pj, accion: 4});
					$('#accionesJugador').hide();
				}
		    });
			$('#accionMovimiento').unbind('click').bind('click', function() {
				socket.emit('enviarAccion', {personaje: pj, accion: 5}); 
				$('#accionesJugador').hide();
		    });
			
			
		})
		
		
	});
	
	socket.on('accionEnviada', function(datos, cantidad){ 
		$('#accionesTurno').append("<p>"+datos.personaje.nombre+"</i>: acción declarada ("+ cantidad.enviados +"/"+ cantidad.total +")</p>");

	});
	
	/* Evento que gestiona cada asalto. Se capturará tantas veces como jugadores haya en ese asalto.
	 * Recibe: tipo (entero de 1-6), inicio (posicion del vector donde empieza ese asalto),
	 * 	cantidad (cantidad de posiciones que dura ese asalto), turnoOrdenado (vector con pares personaje/accion)
	 */
	
	socket.on('asalto', function (tipo, inicio, cantidad, turnoOrdenado){
		var usuarioParticipa = false;
		var npcParticipa = false;
		var posicion = []; //vector donde se guardará la posición donde están los NPC que actuan (o el usuario)
		$('#opcionesCombate').empty();
		$('#estadoTurno').text("Acción de prioridad "+ tipo + ": " + nombreAccion(tipo));
		$('#accionesTurno').empty(); 
		$('#accionesTurno').append("<ul class='w3-ul w3-border'><li><h5>Esperando acción de: </h5></li>");
		for (var i = inicio; i < inicio + cantidad; i++){
			$('#accionesTurno ul').append("<li id='listaAcciones"+i+"' class='w3-red'>"+ turnoOrdenado[i].personaje.nombre +"</li>");
			if (tipo != 4 && tipo != 5){//en los turnos simultaneos se busca a todos los que participan
				//Se comprueba si el usuario que recibe el evento participa en el asalto
				if (turnoOrdenado[i].personaje.usuario == undefined && php_tipoUsuario == 'director'){
					npcParticipa = true;
					posicion.push(i);		
				}else if (turnoOrdenado[i].personaje.usuario == php_nUsuario){
					usuarioParticipa = true;
					posicion.push(i);
				}
			}
			
		}
		if (tipo == 4 || tipo == 5){ //accion no simultanea, solo actua el primero por ahora (turnoOrdenado[inicio].personaje.nombre)
			if (turnoOrdenado[inicio].personaje.usuario == undefined && php_tipoUsuario == 'director'){ //actua el director
				npcParticipa = true;
				posicion.push(inicio);
			} else if (turnoOrdenado[inicio].personaje.usuario == php_nUsuario){ //actua el jugador que captura este evento
				usuarioParticipa = true;
				posicion.push(inicio);
			}
		}
		$('#accionesTurno').append("</ul>");
		//Acciones a realizar para el asalto, según el tipo de acción serán distintas, pero todas se pueden cancelar
		if (usuarioParticipa || (npcParticipa && php_tipoUsuario == 'director')){
			pestana("combate"); //Cambiamos la pestaña al combate para alertar de que es su turno
			switch(tipo){
			case 1:	 console.log("Acción 1");
				
				/* idea general:
				 * el sistema espera a que pulses un conjuro, para esto se hace que accion.tipo = prepararconjuro (o otra variable si es necesario)
				 * y se captura eso en el apartado de magia, creando una condicion para que funcione en combate, entonces se hace el emit.
				 * En el emit debe estar incluido el nombre del conjuro y en el server debe haber un contador de los conjuros preparados
				 * 
				 */
				if (pj.vida > 0) { //si esta inconsciente se autocancela

					accion.tipo = "Preparar Sortilegio";
					accion.cantidad = cantidad;
					accion.posicion = posicion[0];

				} else { //se autocancela la accion si esta inconsciente
					socket.emit('realizarAccion', tipo, cantidad, posicion[0], 'Cancelar');
				}
				
				break;
			case 2:  
				if (pj.vida > 0) { //si esta inconsciente se autocancela

					accion.tipo = "Realizar Sortilegio";
					accion.cantidad = cantidad;
					accion.posicion = posicion[0];

				} else { //se autocancela la accion si esta inconsciente
					socket.emit('realizarAccion', tipo, cantidad, posicion[0], 'Cancelar');
				}
				
				break;
				break;
			case 3: //los npc no atacan a distancia
				if (pj.vida > 0) {
					var coordenadas = buscarPersonaje(pj);
					if(coordenadas != null) {
						
						accion.hexagonos = rangoAtaque(mapa, t,  matrizHex(coordenadas.r, coordenadas.q ), pj.equipado.arma.alcance/3);
						accion.hexagonos.forEach(function(hex){
							drawHex(ctx, lay, hex, 'rgba(255, 0, 0, 0.3)');
						})
					}
					//Se rellenan los datos para el evento click
					accion.tipo = "Ataque a Distancia";
					accion.coordenadas = coordenadas;
					accion.cantidad = cantidad;
					accion.posicion = posicion[0];
				} else { //se autocancela la accion si esta inconsciente
					socket.emit('realizarAccion', tipo, cantidad, posicion[0], 'Cancelar');
				}
				
				break;
			case 4:  

				if (turnoOrdenado[posicion[0]].personaje.usuario == undefined){ //es npc
					if (enemigos[buscarEnemigo(turnoOrdenado[posicion[0]].personaje.nombre)].vida > 0) {

						var coordenadas = buscarPersonaje(enemigos[buscarEnemigo(turnoOrdenado[posicion[0]].personaje.nombre)]);
						if(coordenadas != null) {
							
							accion.hexagonos = rangoAtaque(mapa, t,  matrizHex(coordenadas.r, coordenadas.q ), 1);
							accion.hexagonos.forEach(function(hex){
								drawHex(ctx, lay, hex, 'rgba(255, 0, 0, 0.3)');
							})
						}
						//Se rellenan los datos para el evento click
						accion.tipo = "NPC: Ataque C/C";
						accion.ataque = turnoOrdenado[posicion[0]].personaje.ataque;
						accion.tipoAtaque = turnoOrdenado[posicion[0]].personaje.tipoAtaque;
						accion.coordenadas = coordenadas;
						accion.cantidad = cantidad;
						accion.posicion = posicion[0];
					} else { //se autocancela la accion si esta inconsciente
						socket.emit('realizarAccion', tipo, cantidad, posicion[0], 'Cancelar');
					}
				}
				else { //es aliado
					if (pj.vida > 0) {
						var coordenadas = buscarPersonaje(pj);
						if(coordenadas != null) {
							
							accion.hexagonos = rangoAtaque(mapa, t,  matrizHex(coordenadas.r, coordenadas.q ), 1);
							accion.hexagonos.forEach(function(hex){
								drawHex(ctx, lay, hex, 'rgba(255, 0, 0, 0.3)');
							})
						}
						//Se rellenan los datos para el evento click
						accion.tipo = "Ataque C/C";
						accion.coordenadas = coordenadas;
						accion.cantidad = cantidad;
						
						accion.posicion = posicion[0];
					} else { //se autocancela la accion si esta inconsciente
						socket.emit('realizarAccion', tipo, cantidad, posicion[0], 'Cancelar');
					}
				}
				
				
					
				break;
			case 5:  
				
				if (turnoOrdenado[posicion[0]].personaje.usuario == undefined){ //es npc
					if (enemigos[buscarEnemigo(turnoOrdenado[posicion[0]].personaje.nombre)].vida > 0) {

						var coordenadas = buscarPersonaje(enemigos[buscarEnemigo(turnoOrdenado[posicion[0]].personaje.nombre)]);

						if(coordenadas != null) {
							
							accion.hexagonos = rangoMov(mapa, t,  matrizHex(coordenadas.r, coordenadas.q ), enemigos[buscarEnemigo(turnoOrdenado[posicion[0]].personaje.nombre)].velocidad/3);
							accion.hexagonos.forEach(function(hex){
								drawHex(ctx, lay, hex, 'rgba(0, 255, 0, 0.3)');
							})
						}
						//Se rellenan los datos para el evento click
						accion.tipo = "Movimiento";
						accion.coordenadas = coordenadas;
						accion.cantidad = cantidad;
						accion.personaje = enemigos[buscarEnemigo(turnoOrdenado[posicion[0]].personaje.nombre)];
						accion.posicion = posicion[0];
					} else { //se autocancela la accion si esta inconsciente
						socket.emit('realizarAccion', tipo, cantidad, posicion[0], 'Cancelar');
					}
				}
				else {
					if (pj.vida > 0) {
						var coordenadas = buscarPersonaje(pj);
						if(coordenadas != null) {
							
							accion.hexagonos = rangoMov(mapa, t,  matrizHex(coordenadas.r, coordenadas.q ), pj.velocidad/3);
							accion.hexagonos.forEach(function(hex){
								drawHex(ctx, lay, hex, 'rgba(0, 255, 0, 0.3)');
							})
						}
						//Se rellenan los datos para el evento click
						accion.tipo = "Movimiento";
						accion.coordenadas = coordenadas;
						accion.cantidad = cantidad;
						accion.personaje = pj;
						accion.posicion = posicion[0];
					} else { //se autocancela la accion si esta inconsciente
						socket.emit('realizarAccion', tipo, cantidad, posicion[0], 'Cancelar');
					}
				}
				
				break;
			}
			$('#opcionesCombate').append("<button id='cancelarAccion' class='w3-btn w3-red'>Cancelar Acción</button>");
			$('#cancelarAccion').unbind('click').bind('click', function() {
				//posicion[0] porque solo hay uno (la suya)
				socket.emit('realizarAccion', tipo, cantidad, posicion[0], 'Cancelar'); //al ser acción de un jugador, el vector solo tendrá un elemento
				$('#opcionesCombate').empty();
				ctx.putImageData(capturaPixeles, 0, 0);
				dibujarPersonajes();
		    });
		
		}
		
	});
	//Evento que se captura cuando en una accion no simultanea se espera al siguiente jugador
	//el parametro tipo solo puede ser 4 o 5
	socket.on('siguienteAccion', function (tipo, inicio, cantidad, turnoOrdenado){
		var usuarioParticipa = false;
		var npcParticipa = false;
		if (turnoOrdenado[inicio].personaje.usuario == undefined && php_tipoUsuario == 'director'){
			npcParticipa = true;
		}else if (turnoOrdenado[inicio].personaje.usuario == php_nUsuario){
			usuarioParticipa = true;
		}
		if (usuarioParticipa || (npcParticipa && php_tipoUsuario == 'director')){
			pestana("combate"); //Cambiamos la pestaña al combate para alertar de que es su turno
			switch(tipo){ 

			case 4:  
				if (turnoOrdenado[inicio].personaje.usuario == undefined){ //es npc
					if (enemigos[buscarEnemigo(turnoOrdenado[inicio].personaje.nombre)].vida > 0) {

						var coordenadas = buscarPersonaje(enemigos[buscarEnemigo(turnoOrdenado[inicio].personaje.nombre)]);
						if(coordenadas != null) {
							
							accion.hexagonos = rangoAtaque(mapa, t,  matrizHex(coordenadas.r, coordenadas.q ), 1);
							accion.hexagonos.forEach(function(hex){
								drawHex(ctx, lay, hex, 'rgba(255, 0, 0, 0.3)');
							})
						}
						//Se rellenan los datos para el evento click
						accion.tipo = "NPC: Ataque C/C";
						accion.ataque = turnoOrdenado[inicio].personaje.ataque;
						accion.tipoAtaque = turnoOrdenado[inicio].personaje.tipoAtaque;
						accion.coordenadas = coordenadas;
						accion.cantidad = cantidad;
						accion.posicion = inicio;
					} else { //se autocancela la accion si esta inconsciente
						socket.emit('realizarAccion', tipo, cantidad, inicio, 'Cancelar');
					}
				}
				else {
					if (pj.vida > 0) {
						var coordenadas = buscarPersonaje(pj);
						if(coordenadas != null) {
							
							accion.hexagonos = rangoAtaque(mapa, t,  matrizHex(coordenadas.r, coordenadas.q ), 1);
							accion.hexagonos.forEach(function(hex){
								drawHex(ctx, lay, hex, 'rgba(255, 0, 0, 0.3)');
							})
						}
						//Se rellenan los datos para el evento click
						accion.tipo = "Ataque C/C";
						accion.coordenadas = coordenadas;
						accion.cantidad = cantidad;
						accion.posicion = inicio;
					} else { //se autocancela la accion si esta inconsciente
						console.log("cancelando accion por falta de vida");
						socket.emit('realizarAccion', tipo, cantidad, inicio, 'Cancelar');
					}			
				}
						
				break;
			case 5:  
				
				if (turnoOrdenado[inicio].personaje.usuario == undefined){ //es npc
					if (enemigos[buscarEnemigo(turnoOrdenado[inicio].personaje.nombre)].vida > 0) {

						var coordenadas = buscarPersonaje(enemigos[buscarEnemigo(turnoOrdenado[inicio].personaje.nombre)]);

						if(coordenadas != null) {
							
							accion.hexagonos = rangoMov(mapa, t,  matrizHex(coordenadas.r, coordenadas.q ), enemigos[buscarEnemigo(turnoOrdenado[inicio].personaje.nombre)].velocidad/3);
							accion.hexagonos.forEach(function(hex){
								drawHex(ctx, lay, hex, 'rgba(0, 255, 0, 0.3)');
							})
						}
						//Se rellenan los datos para el evento click
						accion.tipo = "Movimiento";
						accion.coordenadas = coordenadas;
						accion.cantidad = cantidad;
						accion.personaje = enemigos[buscarEnemigo(turnoOrdenado[inicio].personaje.nombre)];
						accion.posicion = inicio;
					} else { //se autocancela la accion si esta inconsciente
						socket.emit('realizarAccion', tipo, cantidad, inicio, 'Cancelar');
					}
				}
				else {
					if (pj.vida > 0) {
						var coordenadas = buscarPersonaje(pj);
						if(coordenadas != null) {
							
							accion.hexagonos = rangoMov(mapa, t,  matrizHex(coordenadas.r, coordenadas.q ), pj.velocidad/3);
							accion.hexagonos.forEach(function(hex){
								drawHex(ctx, lay, hex, 'rgba(0, 255, 0, 0.3)');
							})
						}
						//Se rellenan los datos para el evento click
						accion.tipo = "Movimiento";
						accion.coordenadas = coordenadas;
						accion.cantidad = cantidad;
						accion.personaje = pj;
						accion.posicion = inicio;
					} else { //se autocancela la accion si esta inconsciente
						socket.emit('realizarAccion', tipo, cantidad, inicio, 'Cancelar');
					}
				}
				
				break;
			}
			$('#opcionesCombate').append("<button id='cancelarAccion' class='w3-btn w3-red'>Cancelar Acción</button>");
			$('#cancelarAccion').unbind('click').bind('click', function() {
				socket.emit('realizarAccion', tipo, cantidad, inicio, 'Cancelar'); //al ser acción de un jugador, el vector solo tendrá un elemento
				$('#opcionesCombate').empty();
				ctx.putImageData(capturaPixeles, 0, 0);
				dibujarPersonajes();
		    });
		}

	});
	socket.on('accionRecibida', function (pos){
		$('#listaAcciones'+pos).removeClass("w3-red");
		$('#listaAcciones'+pos).addClass("w3-green");
	});
	socket.on('resumenAsalto', function (asalto){
		for (i in asalto){
			$('#registroCombate').append("<li><b>"+asalto[i].nom+ "</b>: "+ asalto[i].acc+"</li>");
		}
		
	});
	
	socket.on('finTurno', function (){
		$('#accionesTurno').empty(); 
		$('#estadoTurno').empty();
		if (php_tipoUsuario == 'director'){
			for (i in enemigos){
				if(enemigos[i].vida <= 0 && $(':input[name="autoEliminar"]:checked').val()){ //si el enemigo muere se elimina si esta marcada la casilla de autoeliminar
					eliminarNPC(i);
				}
			}
			
		}
		
		
	});

	socket.on('estadoActualizado', function(e){
		$("#textoEstado").text(e);
		$("#textareaEstado").attr("placeholder", e);
	});
	  
	
	
	//Actualiza los personajes que están en el mapa. De momento solo es necesario cambiar la vida actual
	socket.on('actualizarPersonajesMapa', function(per){
		for (i in per){
			//se actualiza el personaje local
			if(per[i].usuario == pj.usuario) 
				pj.vida = per[i].vida; //solo hay que actualizar vida de momento
			
			var cord = buscarPersonaje(per[i]);
			if (cord != null){
				mapa.posPersonajes[cord.r][cord.q].vida = per[i].vida;
			}
		}
		if (php_tipoUsuario=='director'){
			personajes = per;
			actualizarPuntosVida();
		}
		
	});
	
	//Actualiza los enemigos que están en el mapa. De momento solo es necesario cambiar la vida actual
	socket.on('actualizarEnemigosMapa', function(ene){

		for (i in ene){
			var cord = buscarPersonaje(ene[i]);
			if (cord != null){
				mapa.posPersonajes[cord.r][cord.q].vida = ene[i].vida;
			}
		}
		if (php_tipoUsuario=='director'){
			enemigos = ene;
			actualizarPuntosVida();
		}
	});

	  //////////////////
	// CHAT
	//evento que se recibe solo una vez para cargar el chat
	socket.on('registro', function(e){
		if (!registroEnviado) {
			$('#chattiemporeal').append("<li><b>"+e.nom+"</b>: " + e.mensaje+"</li>");
			$('#chattiemporeal').scrollTop($("#chattiemporeal").prop("scrollHeight"));
		}
	});
	socket.on('registroEnviado', function(e){
		registroEnviado = true; //no volvera a ejecutar el evento 'registro'
	});
	
	socket.on('mensajes', function(e){
		$('#chattiemporeal').append("<li><b>"+e.nom+"</b>: " + e.mensaje+"</li>");
	    $('#chattiemporeal').scrollTop($("#chattiemporeal").prop("scrollHeight"));
	});
	socket.on('mensajesPrivados', function(e){
		if (e.receptor == php_nUsuario){ //el usuario es el receptor mostramos el emisor
			$('#chattiemporeal').append("<li><i>De <b>"+e.emisor+"</b>: " + e.mensaje+"</i></li>");
			$('#chattiemporeal').scrollTop($("#chattiemporeal").prop("scrollHeight"));
		}
		else if(e.emisor == php_nUsuario){ //el usuario es el emisor mostramos el receptor
			$('#chattiemporeal').append("<li><i>A <b>"+e.receptor+"</b>: " + e.mensaje+"</i></li>");
			$('#chattiemporeal').scrollTop($("#chattiemporeal").prop("scrollHeight"));
		}
	    
	});
	
	socket.on('eventoSistema', function(e){
		$('#chattiemporeal').append("<li><i>"+e.mensaje+"</i></li>");
	    $('#chattiemporeal').scrollTop($("#chattiemporeal").prop("scrollHeight"));
	});

	socket.on('conectados', function(e){ 
  		$('#conectados').text(e);
	});

	$('#formchat').submit(function(){
  		if ( $('#m').val() != ''){
  			if ($('#destinatarioChat').val() == 'all'){ //mensaje global
  				socket.emit('mensaje', {nom: nombreChat, mensaje: escapeHtml($('#m').val())});
  			}
			else{
				socket.emit('mensajePrivado', {emisor: php_nUsuario, receptor: $('#destinatarioChat').val(), mensaje: escapeHtml($('#m').val())});
			}
  			
    		$('#m').val(''); //vaciamos el input
  		}
		return false; //evita recarga de web
	});
	
	$('#actTextoEstado').bind('click',  function(){
		socket.emit('actualizarEstado', $("#textareaEstado").val());
	});
	

	
	//se va a ejecutar esta funcion cuando termine de cargarse el pj

	function cargarPj(){
		cargarResumenPj(); //se carga datos generales y habilidades del pj
		cargarMagia(); //se carga todo lo relacionado con la magia
		cargarEquipo(); //se carga el equipo del pj
		resumenEquipo(); //se cargan los valores del resumen del equipo
		
		//si el nivel real es mayor que el que tiene el personaje, se muestra la posiblidad de subir de nivel
		if (pj.nivel != pj.nivelReal && php_tipoUsuario != 'director'){

			$('#linkModalSubirNivel').show();
			
		}
	}
	
	function cargarResumenPj(){
		$('#modalNombre').text(pj.nombre); 
		$('#modalRaza').text(pj.raza); 
		$('#modalProfesion').text(pj.profesion); 
		$('#modalApariencia').text(pj.stats.apariencia); 
		$('#imgprof').html("<img src='graficos/"+ pj.profesion +".jpg' style='width:83px;height:130px;border:0;'>");
		$('#modalNivel').text(pj.nivel); 
		$('#modalExperiencia').text(pj.experiencia); 
		$('#modalVidaActual').text(pj.vida); 
		$('#modalVidaMaxima').text(pj.vidaMaxima); 
		$('#fuerza').text(pj.stats.fuerza); 
		$('#agilidad').text(pj.stats.agilidad); 
		$('#constitucion').text(pj.stats.constitucion); 
		$('#inteligencia').text(pj.stats.inteligencia); 
		$('#intuicion').text(pj.stats.intuicion); 
		$('#presencia').text(pj.stats.presencia); 
		
		
		//a todos los dados a tirar se le desvincula el click antes de vincularselo por si esta función es llamada mas de una vez (caso del director)
		$('#nFuerza').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaCerrada', {personaje: pj.nombre, hab: 'Fuerza', mod: pj.bonoTotal.fuerza });
	    });
		$('#nAgilidad').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaCerrada', {personaje: pj.nombre, hab: 'Agilidad', mod: pj.bonoTotal.agilidad });
	    });
		$('#nConstitucion').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaCerrada', {personaje: pj.nombre, hab: 'Constitución', mod: pj.bonoTotal.constitucion });
	    });
		$('#nInteligencia').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaCerrada', {personaje: pj.nombre, hab: 'Inteligencia', mod: pj.bonoTotal.inteligencia });
	    });
		$('#nIntuicion').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaCerrada', {personaje: pj.nombre, hab: 'Intuición', mod: pj.bonoTotal.intuicion });
	    }); 
		$('#nPresencia').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaCerrada', {personaje: pj.nombre, hab: 'Presencia', mod: pj.bonoTotal.presencia });
	    }); 
		 
		$('#razaFuerza').text(pj.bonoRacial.fuerza); 
		$('#razaAgilidad').text(pj.bonoRacial.agilidad); 
		$('#razaConstitucion').text(pj.bonoRacial.constitucion); 
		$('#razaInteligencia').text(pj.bonoRacial.inteligencia); 
		$('#razaIntuicion').text(pj.bonoRacial.intuicion); 
		$('#razaPresencia').text(pj.bonoRacial.presencia); 

		$('#pbonFuerza').text(pj.bonoTotal.fuerza - parseInt(pj.bonoRacial.fuerza)); 
		$('#pbonAgilidad').text(pj.bonoTotal.agilidad - parseInt(pj.bonoRacial.agilidad)); 
		$('#pbonConstitucion').text(pj.bonoTotal.constitucion - parseInt(pj.bonoRacial.constitucion)); 
		$('#pbonInteligencia').text(pj.bonoTotal.inteligencia - parseInt(pj.bonoRacial.inteligencia)); 
		$('#pbonIntuicion').text(pj.bonoTotal.intuicion - parseInt(pj.bonoRacial.intuicion)); 
		$('#pbonPresencia').text(pj.bonoTotal.presencia - parseInt(pj.bonoRacial.presencia)); 

		//tooltip para mostrar que bono es
		$('.bonFue').text(pj.bonoTotal.fuerza).attr("title", "Fuerza"); 
		$('.bonAgi').text(pj.bonoTotal.agilidad).attr("title", "Agilidad"); 
		$('.bonCon').text(pj.bonoTotal.constitucion).attr("title", "Constitución"); 
		$('.bonInt').text(pj.bonoTotal.inteligencia).attr("title", "Inteligencia"); 
		$('.bonI').text(pj.bonoTotal.intuicion).attr("title", "Intuición"); ; 
		$('.bonPre').text(pj.bonoTotal.presencia).attr("title", "Presencia"); 

		//HABILIDADES
						  
		//movimiento
		$('#nSinArmadura').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'Sin Armadura', mod: pj.bHabilidad.sinArmadura });
	    });
		$('#nCuero').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'Cuero', mod: pj.bHabilidad.cuero });
	    });
		$('#nCueroEndurecido').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'Cuero Endurecido', mod: pj.bHabilidad.cueroEndurecido });
	    });
		$('#nMalla').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'Cota de Mallas', mod: pj.bHabilidad.cotaMalla });
	    });
		$('#nCoraza').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'Coraza', mod: pj.bHabilidad.coraza });
	    }); 
		
		$('#gradoSinArmadura').text(pj.habilidades.sinArmadura); 
		$('#gradoCuero').text(pj.habilidades.cuero); 
		$('#gradoCueroEndurecido').text(pj.habilidades.cueroEndurecido); 
		$('#gradoMalla').text(pj.habilidades.cotaMalla); 
		$('#gradoCoraza').text(pj.habilidades.coraza); 

		$('#pbonSinArmadura').text(bonoHabilidad(pj.habilidades.sinArmadura)); 
		$('#pbonCuero').text(bonoHabilidad(pj.habilidades.cuero)); 
		$('#pbonCueroEndurecido').text(bonoHabilidad(pj.habilidades.cueroEndurecido)); 
		$('#pbonMalla').text(bonoHabilidad(pj.habilidades.cotaMalla)); 
		$('#pbonCoraza').text(bonoHabilidad(pj.habilidades.coraza)); 

		$('#bonSinArmadura').text(pj.bHabilidad.sinArmadura); 
		$('#bonCuero').text(pj.bHabilidad.cuero); 
		$('#bonCueroEndurecido').text(pj.bHabilidad.cueroEndurecido); 
		$('#bonMalla').text(pj.bHabilidad.cotaMalla); 
		$('#bonCoraza').text(pj.bHabilidad.coraza); 

		//armas
		$('#nFilo').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'Filo', mod: pj.bHabilidad.filo });
	    });
		$('#nContundentes').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'Contundentes', mod: pj.bHabilidad.contundente });
	    });
		$('#nDosManos').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'A 2 Manos', mod: pj.bHabilidad.dosManos });
	    });
		$('#nArrojadizas').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'Arrojadizas', mod: pj.bHabilidad.arrojadizas });
	    });
		$('#nProyectiles').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'Proyectiles', mod: pj.bHabilidad.proyectiles });
	    }); 
		$('#nAsta').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'Asta', mod: pj.bHabilidad.asta });
	    }); 
		
		$('#gradoFilo').text(pj.habilidades.filo); 
		$('#gradoContundentes').text(pj.habilidades.contundente); 
		$('#gradoDosManos').text(pj.habilidades.dosManos); 
		$('#gradoArrojadizas').text(pj.habilidades.arrojadizas); 
		$('#gradoProyectiles').text(pj.habilidades.proyectiles); 
		$('#gradoAsta').text(pj.habilidades.asta); 
		
		$('#pbonFilo').text(bonoHabilidad(pj.habilidades.filo)); 
		$('#pbonContundentes').text(bonoHabilidad(pj.habilidades.contundente)); 
		$('#pbonDosManos').text(bonoHabilidad(pj.habilidades.dosManos)); 
		$('#pbonArrojadizas').text(bonoHabilidad(pj.habilidades.arrojadizas)); 
		$('#pbonProyectiles').text(bonoHabilidad(pj.habilidades.proyectiles)); 
		$('#pbonAsta').text(bonoHabilidad(pj.habilidades.asta)); 

		$('.bonProfArmas').text(pj.bonificacionesProfesion.armas); 

		$('#bonFilo').text(pj.bHabilidad.filo); 
		$('#bonContundentes').text(pj.bHabilidad.contundente); 
		$('#bonDosManos').text(pj.bHabilidad.dosManos); 
		$('#bonArrojadizas').text(pj.bHabilidad.arrojadizas); 
		$('#bonProyectiles').text(pj.bHabilidad.proyectiles); 
		$('#bonAsta').text(pj.bHabilidad.asta); 

		//subterfugio

		$('#nEmboscar').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'Emboscar', mod: pj.bHabilidad.emboscar });
	    });
		$('#nAcechar').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'Acechar', mod: pj.bHabilidad.acecharEsconderse });
	    });
		$('#nAbrirCerraduras').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'Abrir Cerraduras', mod: pj.bHabilidad.abrirCerraduras });
	    });
		$('#nDesactivarTrampas').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'Desactivar Trampas', mod: pj.bHabilidad.desactivarTrampas });
	    });

		$('#gradoEmboscar').text(pj.habilidades.emboscar); 
		$('#gradoAcechar').text(pj.habilidades.acecharEsconderse); 
		$('#gradoAbrirCerraduras').text(pj.habilidades.abrirCerraduras); 
		$('#gradoDesactivarTrampas').text(pj.habilidades.desactivarTrampas); 

		$('#pbonEmboscar').text(bonoHabilidad(pj.habilidades.emboscar)); 
		$('#pbonAcechar').text(bonoHabilidad(pj.habilidades.acecharEsconderse)); 
		$('#pbonAbrirCerraduras').text(bonoHabilidad(pj.habilidades.abrirCerraduras)); 
		$('#pbonDesactivarTrampas').text(bonoHabilidad(pj.habilidades.desactivarTrampas)); 

		$('.bonProfSubterfugio').text(pj.bonificacionesProfesion.subterfugio); 
		$('.bonProfAcechar').text(parseInt(pj.bonificacionesProfesion.subterfugio) + parseInt(pj.bonificacionesProfesion.acecharEsconderse)); 

		$('#bonEmboscar').text(pj.bHabilidad.emboscar); 
		$('#bonAcechar').text(pj.bHabilidad.acecharEsconderse); 
		$('#bonAbrirCerraduras').text(pj.bHabilidad.abrirCerraduras); 
		$('#bonDesactivarTrampas').text(pj.bHabilidad.desactivarTrampas); 

		//generales
		
		$('#nTrepar').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'Trepar', mod: pj.bHabilidad.trepar });
	    });
		$('#nMontar').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'Montar', mod: pj.bHabilidad.montar });
	    });
		$('#nNadar').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'Nadar', mod: pj.bHabilidad.nadar });
	    });
		$('#nRastrear').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'Rastrear', mod: pj.bHabilidad.rastrear });
	    });


		$('#gradoTrepar').text(pj.habilidades.trepar); 
		$('#gradoMontar').text(pj.habilidades.montar); 
		$('#gradoNadar').text(pj.habilidades.nadar); 
		$('#gradoRastrear').text(pj.habilidades.rastrear); 

		$('#pbonTrepar').text(bonoHabilidad(pj.habilidades.trepar)); 
		$('#pbonMontar').text(bonoHabilidad(pj.habilidades.montar)); 
		$('#pbonNadar').text(bonoHabilidad(pj.habilidades.nadar)); 
		$('#pbonRastrear').text(bonoHabilidad(pj.habilidades.rastrear)); 

		$('.bonProfGenerales').text(pj.bonificacionesProfesion.generales); 

		$('#pbonTrepar').text(bonoHabilidad(pj.habilidades.trepar)); 
		$('#pbonMontar').text(bonoHabilidad(pj.habilidades.montar)); 
		$('#pbonNadar').text(bonoHabilidad(pj.habilidades.nadar)); 
		$('#pbonRastrear').text(bonoHabilidad(pj.habilidades.rastrear)); 

		$('#bonTrepar').text(pj.bHabilidad.trepar); 
		$('#bonMontar').text(pj.bHabilidad.montar); 
		$('#bonNadar').text(pj.bHabilidad.nadar); 
		$('#bonRastrear').text(pj.bHabilidad.rastrear); 

		//mágicas
		
		$('#nLeerRunas').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'Leer Runas', mod: pj.bHabilidad.leerRunas });
	    });
		$('#nObjetosMagicos').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'Objetos Mágicos', mod: pj.bHabilidad.objetosMagicos });
	    });
		$('#nSortilegiosDirigidos').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'Sortilegios Dirigidos', mod: pj.bHabilidad.sortilegiosDirigidos });
	    });

		$('#gradoLeerRunas').text(pj.habilidades.leerRunas); 
		$('#gradoObjetosMagicos').text(pj.habilidades.objetosMagicos); 
		$('#gradoSortilegiosDirigidos').text(pj.habilidades.sortilegiosDirigidos); 

		$('#pbonLeerRunas').text(bonoHabilidad(pj.habilidades.leerRunas)); 
		$('#pbonObjetosMagicos').text(bonoHabilidad(pj.habilidades.objetosMagicos)); 
		$('#pbonSortilegiosDirigidos').text(bonoHabilidad(pj.habilidades.sortilegiosDirigidos)); 

		$('#bonProfMagicas').text(pj.bonificacionesProfesion.magicas); 
		$('#bonProfLeerRunas').text(parseInt(pj.bonificacionesProfesion.magicas) + parseInt(pj.bonificacionesProfesion.leerRunas)); 
		$('#bonProfObjetosMagicos').text(parseInt(pj.bonificacionesProfesion.magicas) + parseInt(pj.bonificacionesProfesion.objetosMagicos)); 

		$('#bonLeerRunas').text(pj.bHabilidad.leerRunas); 
		$('#bonObjetosMagicos').text(pj.bHabilidad.objetosMagicos); 
		$('#bonSortilegiosDirigidos').text(pj.bHabilidad.sortilegiosDirigidos); 

		//tiradas de resistencia
		
		$('#nEsencia').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'TR Esencia', mod: pj.bHabilidad.esencia });
	    });
		$('#nCanalizacion').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'TR Canalización', mod: pj.bHabilidad.canalizacion });
	    });
		$('#nVeneno').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'TR Veneno', mod: pj.bHabilidad.veneno });
	    });
		$('#nEnfermedad').addClass("link").unbind('click').bind('click', function() {
			 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'TR Enfermedad', mod: pj.bHabilidad.enfermedad });
	    });
		$('#bonRazaEsencia').text(pj.tr.ese);
		$('#bonRazaCanalizacion').text(pj.tr.can);
		$('#bonRazaVeneno').text(pj.tr.ve);
		$('#bonRazaEnfermedad').text(pj.tr.enf);

		$('#bonEsencia').text(pj.bHabilidad.esencia);
		$('#bonCanalizacion').text(pj.bHabilidad.canalizacion);
		$('#bonVeneno').text(pj.bHabilidad.veneno);
		$('#bonEnfermedad').text(pj.bHabilidad.enfermedad);

		//otros
		$('#nPercepcion').addClass("link").unbind('click').bind('click', function() {
				 socket.emit('tiradaAbierta', {personaje: pj.nombre, hab: 'Percepción', mod: pj.bHabilidad.percepcion });
		    });
	    
		$('#gradoPercepcion').text(pj.percepcion);
		$('#pbonPercepcion').text(bonoHabilidad(pj.percepcion));
		$('#bonProfPercepcion').text(pj.bonificacionesProfesion.percepcion);

		$('#bonPercepcion').text(pj.bHabilidad.percepcion);
		
		$('.dinero').text(pj.dinero);
		

		
	}
	//función que carga y gestiona el contenido de la pestaña magia del jugador. Se llama dentro de cargarPJ
	//también es la funcíón que emite los eventos de lanzamiento de sortilegios dentro y fuera del combate
	function cargarMagia(){
		$('#modalPuntosPoder').text(pj.puntosPoder);
		$('#modalPuntosPoderMaximos').text(pj.poderMaximo);
		
		//if (!listasCargadas){ //si no se han cargado las listas, se cargan
			$('#modalSortilegiosBase').text(pj.sortilegiosBase);
			var dominio = "Ninguno"; //valor por defecto 
			if (pj.dominio == "ESE")
				dominio = "Esencia";
			else if (pj.dominio == "CAN")
				dominio = "Canalizacion"

			
			$('#modalDominio').text(dominio);
			$("#dominioAprendidas tr").remove();
			$("#dominioAprendidas th").remove();
			$("#profesionAprendidas tr").remove();
			$("#profesionAprendidas th").remove();
			$("#dominioAprendiendoTabla td").remove();
			$("#profesionAprendiendoTabla td").remove();
			
			//listas de sortilegios
			
			$.getJSON("estatico/magia.json", function(magiaJSON) {
				//sortilegios de dominio
				for (var lista in magiaJSON[dominio]){
					if (magiaJSON[dominio][lista].imp >= 0){ //la lista está disponible para ser usada por la web
						if (pj.listas[lista] == 5){ //la lista está aprendida
							$('#dominioAprendidas').append("<table id='tabla"+ lista +"' class='w3-table w3-striped w3-bordered w3-border w3-card-4'>");
							$('#tabla'+ lista).append("<th class='w3-theme-d2 w3-center' colspan='2'>"+ magiaJSON[dominio][lista].nombre +"</th>");
							var celdas = "";

							for (var i = 1; i <= pj.nivel; i++){ //añadimos todos los conjuros que el personaje conoce (uno por nivel)
								var nomNivel = "nivel" + i;
								var nomSortilegio = magiaJSON[dominio][lista][nomNivel].nombre;
								var descripcionSortilegio = magiaJSON[dominio][lista][nomNivel].descripcion;
								
								$('#tabla'+ lista).append("<tr ><td>" + i + "</td><td id='"+ lista + nomNivel +"' title='"+ descripcionSortilegio + "'>"+ nomSortilegio +"</td></tr>");
								//celdas += "<tr ><td>" + i + "</td><td id='"+ lista + nomNivel +"' title='"+ descripcionSortilegio + "'>"+ nomSortilegio +"</td></tr>";
								$('#'+lista+nomNivel).addClass("link").unbind('click').bind('click', {nivel : i, nom: nomSortilegio, desc : descripcionSortilegio},  function(event){
									
									
									if (pj.puntosPoder >= event.data.nivel) { //tiene suficientes puntos de poder
										if (tableroMostrado == true){
											//Se esta esperando que pulse el sortilegio a preparar
											if (accion.tipo == "Preparar Sortilegio"){
												socket.emit('realizarAccion', 1, accion.cantidad, accion.posicion, 'Preparar Sortilegio', event.data.nom); 
												accion.tipo = 'Ninguna';
												
											} else if (accion.tipo == "Realizar Sortilegio"){
												socket.emit('realizarAccion', 2, accion.cantidad, accion.posicion, 'Realizar Sortilegio', {nivel: event.data.nivel, nom: event.data.nom, desc: event.data.desc}); 
												accion.tipo = 'Ninguna';
											}
											
											else { //no es su turno
												alert("Debes esperar a tu turno para preparar o realizar un sortilegio");
											}
											
										} 
										else{ //conjuro "en calma" (sin combate) y con suficientes puntos de poder
											socket.emit('sortilegioTranquilo', pj, event.data.nivel, event.data.nom, event.data.desc);
										}
									} else {
										alert("No tienes suficientes puntos de poder para lanzar este sortilegio. Necesitas " +event.data.nivel+ " puntos de poder");
									}
											
								});
							}

							$('#tabla'+ lista).append("</table>");

							
						} else if (pj.listas[lista] > 0){ //la lista se está aprendiendo
							$('#dominioAprendiendo').show();
							$('#dominioAprendiendoTabla').append("<tr><td>" + magiaJSON[dominio][lista].nombre + "</td><td>"+ pj.listas[lista] +"</td></tr>");
							
						}
							
					}
				}
			//sortilegios de profesion
				for (var lista in magiaJSON[pj.profesion]){
					if (magiaJSON[pj.profesion][lista].imp >= 0){ //la lista está disponible para ser usada por la web
						if (pj.listas[lista] == 5){ //la lista está aprendida
							$('#profesionAprendidas').append("<table id='tabla"+ lista +"' class='w3-table w3-striped w3-bordered w3-border w3-card-4'>");
							$('#tabla'+ lista).append("<th class='w3-theme-d2 w3-center' colspan='2'>"+ magiaJSON[pj.profesion][lista].nombre +"</th>");
							var celdas = "";

							for (var i = 1; i <= pj.nivel; i++){ //añadimos todos los conjuros que el personaje conoce (uno por nivel)
								var nomNivel = "nivel" + i;
								var nomSortilegio = magiaJSON[pj.profesion][lista][nomNivel].nombre;
								var descripcionSortilegio = magiaJSON[pj.profesion][lista][nomNivel].descripcion;
								
								$('#tabla'+ lista).append("<tr ><td>" + i + "</td><td id='"+ lista + nomNivel +"' title='"+ descripcionSortilegio + "'>"+ nomSortilegio +"</td></tr>");
								//celdas += "<tr ><td>" + i + "</td><td id='"+ lista + nomNivel +"' title='"+ descripcionSortilegio + "'>"+ nomSortilegio +"</td></tr>";
								$('#'+lista+nomNivel).addClass("link").unbind('click').bind('click', {nivel : i, nom: nomSortilegio, desc : descripcionSortilegio},  function(event){

									
									if (pj.puntosPoder >= event.data.nivel) { //tiene suficientes puntos de poder
										if (tableroMostrado == true){
											//Se esta esperando que pulse el sortilegio a preparar
											if (accion.tipo == "Preparar Sortilegio"){
												socket.emit('realizarAccion', 1, accion.cantidad, accion.posicion, 'Preparar Sortilegio', event.data.nom); 
												accion.tipo = 'Ninguna';
												
											} else if (accion.tipo == "Realizar Sortilegio"){
												socket.emit('realizarAccion', 2, accion.cantidad, accion.posicion, 'Realizar Sortilegio', {nivel: event.data.nivel, nom: event.data.nom, desc: event.data.desc}); 
												accion.tipo = 'Ninguna';
											}
											
											else { //no es su turno
												alert("Debes esperar a tu turno para preparar o realizar un sortilegio");
											}
											
										} 
										else{ //conjuro "en calma" (sin combate) y con suficientes puntos de poder
											socket.emit('sortilegioTranquilo', pj, event.data.nivel, event.data.nom, event.data.desc);
										}
									} else {
										alert("No tienes suficientes puntos de poder para lanzar este sortilegio. Necesitas " +event.data.nivel+ " puntos de poder");
									}
											
								});
							}


							$('#tabla'+ lista).append("</table>");
						} else if (pj.listas[lista] > 0){ //la lista se está aprendiendo
							$('#profesionAprendiendo').show();
							$('#profesionAprendiendoTabla').append("<tr><td>" + magiaJSON[pj.profesion][lista].nombre + "</td><td>"+ pj.listas[lista] +"</td></tr>");
							
							
						}
							
					}
				}
			//listasCargadas = true; //las listas se han cargado y no deben volver a hacerlo
	//}
			});
				
		

			
		
		
	}
	//función que carga el contenido del inventario del jugador. Se llama dentro de cargarPJ y cada vez que se compra un item.
	function cargarEquipo(){
		$('#equipoArmas').empty();
		$('#equipoArmaduras').empty();
		$('#equipoOtros').empty();
		//titulo de tabla
		$('#equipoArmas').append("<tr class='w3-theme-d2'><th title='Nombre del arma'>Nombre</th><th title='Tipo de arma'>Tipo</th><th title='Rango de pifia'>Pifia</th>"
				+ "<th title='Tipo de Crítico'>Crit</th><th title='Alcance del arma'>Rango</th><th title='Peso del arma'>Peso</th><th title='Equipar'>Equipar</th></tr>");
		$('#equipoArmaduras').append("<tr class='w3-theme-d2'><th title='Nombre de la armadura'>Nombre</th><th title='Peso de la armadura'>Peso</th>"
				+"<th title='Equipar'>Equipar</th></tr>");
		$('#equipoOtros').append("<tr class='w3-theme-d2'><th title='Nombre'>Nombre</th><th title='Descripción'>Descripción</th>"
				+ "<th title='Peso'>Peso</th><th title='Equipar'>Equipar</th></tr>");
		for (i in pj.equipo) {
			if (pj.equipo[i].tipo == "Armadura") {
				var fila = "<tr>";
				fila += "<td>"+ pj.equipo[i].nombre +"</td>";
				fila += "<td>"+ pj.equipo[i].peso +"</td>";
				fila += "<td><a id='armadura"+i+"' class='w3-btn w3-small w3-round-xxlarge w3-green'>+</a></td>";
				fila += "</tr>";
				
				$('#equipoArmaduras').append(fila);
				
				$('#armadura'+i).bind('click', {item : i},  function(event){
					equiparArmadura(pj.equipo[event.data.item]);
				});
	
			} else if (pj.equipo[i].tipo == "Consumible") {
				var fila = "<tr>";
				fila += "<td>"+ pj.equipo[i].nombre +"</td>";
				fila += "<td>"+ pj.equipo[i].descripcion +"</td>";
				fila += "<td>"+ pj.equipo[i].peso +"</td>";
				fila += "<td><a id='consumible"+i+"' class='w3-btn w3-small w3-round-xxlarge w3-green'>+</a></td>";
				fila += "</tr>";
				
				$('#equipoOtros').append(fila);
				
				$('#consumible'+i).bind('click', {item : i},  function(event){
					usarConsumible(pj.equipo[event.data.item]);
				});
			} else { //arma
				var fila = "<tr>";
				fila += "<td>"+ pj.equipo[i].nombre +"</td>";
				fila += "<td>"+ pj.equipo[i].tipo +"</td>";
				fila += "<td>"+ pj.equipo[i].pifia +"</td>";
				fila += "<td>"+ pj.equipo[i].critico +"</td>";
				fila += "<td>"+ pj.equipo[i].alcance +"</td>";
				fila += "<td>"+ pj.equipo[i].peso +"</td>";
				fila += "<td><a id='arma"+i+"' class='w3-btn w3-small w3-round-xxlarge w3-green'>+</a></td>";
				fila += "</tr>";
				
				$('#equipoArmas').append(fila);
				
				$('#arma'+i).bind('click', {item : i},  function(event){
					equiparArma(pj.equipo[event.data.item]);
				});
	
			}
		}
		//fila para quitarte la armadura
		var fila = "<tr>";
		fila += "<td>Quitar armadura</td>";
		fila += "<td>-</td>";
		fila += "<td><a id='quitarArmadura' class='w3-btn w3-small w3-round-xxlarge w3-red'>x</a></td>";
		fila += "</tr>";
		
		$('#equipoArmaduras').append(fila);
		
		$('#quitarArmadura').bind('click',  function(){
			pj.equipado.armadura = null; 
			$('#armaduraEquipada').text("No equipada");
			actualizarMovimiento();
			//se actualiza el personaje en el servidor
			socket.emit('actualizarPJ', pj);
			
		});
		
	}
	//carga los valores del resumen del equipo 
	function resumenEquipo(){
		if (pj.equipado.arma == null)
			$('#armaEquipada').text("No equipada");
		else
			$('#armaEquipada').text(pj.equipado.arma.nombre);
		
		if (pj.equipado.armadura == null)
			$('#armaduraEquipada').text("No equipada");
		else
			$('#armaduraEquipada').text(pj.equipado.armadura.nombre);
		
		if (pj.equipado.escudo)
			$('#escudoEquipado').text("Equipado");
		else
			$('#escudoEquipado').text("No equipado");
		
		//movimiento
		actualizarMovimiento();

	}
	

	
	

	
	
	/* Añade al <select> para elegir personaje desde el director de juego la <option> de un personaje.
	 * @nombre es el nombre del personaje a insertar y @lugar el lugar que ocupa en el vector de personajes del director
	 */
	function addPjSelect(nombre, lugar){
		$('.tagSel').append("<option value='"+ lugar +"'>"+ nombre +"</option>");
	}
	
	//Equipa un arma al personaje. Si el arma es a dos manos, desequipa el escudo.
	function equiparArma(item){
		//primero actualizamos el personaje
		pj.equipado.arma = item;
		//actualizamos el resumen del personaje con el nombre del arma que tiene equipada
		$('#armaEquipada').text(pj.equipado.arma.nombre);
		//si llevamos escudo y estamos equipando un arma a dos manos se desequipa
		if (pj.equipado.arma.escudo == false){
			pj.equipado.escudo = false;
			$('#escudoEquipado').text("No equipado");
		}
		//se actualiza el personaje en el servidor
		socket.emit('actualizarPJ', pj);
	}
	
	//Equipa una armadura al personaje o un escudo si lleva un arma a una mano
	function equiparArmadura(item){
		if (item.nombre == "Escudo"){
			if (pj.equipado.arma != null && pj.equipado.arma.escudo == true) {
				pj.equipado.escudo = true;
				$('#escudoEquipado').text("Equipado");
			}else
				alert("Solo puedes equiparte escudo si llevas un arma a una mano");
		}
		else {
			pj.equipado.armadura = item;
			$('#armaduraEquipada').text(pj.equipado.armadura.nombre);
			actualizarMovimiento();
		}
		//se actualiza el personaje en el servidor
		socket.emit('actualizarPJ', pj);
	}
	
	
	//Función para actualizar el valor de movimiento. Se llama cada vez que se cambia de armadura.
	function actualizarMovimiento(){
	
		if(pj.equipado.armadura == null)
			$('#movimiento').text(15 + pj.bHabilidad.sinArmadura);
		else if (pj.equipado.armadura.id == 1) //armadura de cuero
			$('#movimiento').text(15 + pj.bHabilidad.cuero);
		else if (pj.equipado.armadura.id == 2) //armadura de cuero
			$('#movimiento').text(15 + pj.bHabilidad.cueroEndurecido);
		else if (pj.equipado.armadura.id == 3) //armadura de cuero
			$('#movimiento').text(15 + pj.bHabilidad.cotaMalla);
		else if (pj.equipado.armadura.id == 4) //armadura de cuero
			$('#movimiento').text(15 + pj.bHabilidad.coraza);

		pj.velocidad = parseInt($('#movimiento').text());
	}
	

	//tienda
	function cargarTienda(){
		$.getJSON("estatico/objetos.json", function(objetos) {
			for(i in objetos){
				if (objetos[i].tipo == "Armadura"){
					var fila = "<tr>";
					fila += "<td>"+ objetos[i].nombre +"</td>";
					fila += "<td>"+ objetos[i].peso +"</td>";
					fila += "<td>"+ objetos[i].precio +"</td>";
					fila += "<td><a id='item"+i+"' class='w3-btn w3-small w3-round-xxlarge w3-green'>+</a></td>";
					fila += "</tr>";
					
					$('#tiendaArmaduras').append(fila);
					
				} else if (objetos[i].tipo == "Consumible") {
					var fila = "<tr>";
					fila += "<td>"+ objetos[i].nombre +"</td>";
					fila += "<td>"+ objetos[i].descripcion +"</td>";
					fila += "<td>"+ objetos[i].peso +"</td>";
					fila += "<td>"+ objetos[i].precio +"</td>";
					fila += "<td><a id='item"+i+"' class='w3-btn w3-small w3-round-xxlarge w3-green'>+</a></td>";
					fila += "</tr>";
					
					$('#tiendaOtros').append(fila);
				}
				else { //arma
					var fila = "<tr>";
					fila += "<td>"+ objetos[i].nombre +"</td>";
					fila += "<td>"+ objetos[i].tipo +"</td>";
					fila += "<td>"+ objetos[i].pifia +"</td>";
					fila += "<td>"+ objetos[i].critico +"</td>";
					fila += "<td>"+ objetos[i].alcance +"</td>";
					fila += "<td>"+ objetos[i].peso +"</td>";
					fila += "<td>"+ objetos[i].precio +"</td>";
					fila += "<td><a id='item"+i+"' class='w3-btn w3-small w3-round-xxlarge w3-green'>+</a></td>";
					fila += "</tr>";
					
					$('#tiendaArmas').append(fila);
				}
				//se vincula la funcion de añadir al carrito a cada enlace de item
				$('#item'+i).bind('click', {item : i},  function(event){
					carrito.addItem(objetos[event.data.item]);
				});
				
			}
					
			
		}).fail(function(jqxhr, textStatus, error){
			var err = textStatus + ", " + error;
		    console.log( "Error: " + err );
		});
		$('#carritoComprar').bind('click', function(){
			carrito.comprar();
		});
		$('#carritoCancelar').bind('click', function(){
			carrito.resetCarrito();
		});
		
	}
	
	//función de subida de nivel
	$('#linkModalSubirNivel').unbind('click').bind('click', function(){
		var nivelesSubir = pj.nivel - pj.nivelReal; //niveles que hay que subir
	
		var puntos = {
				movimiento : 0,
				armas : 0,
				generales : 0,
				subterfugio : 0,
				magicas : 0,
				lista : 0,
				desarrollo : 0
		};

		//calcular los puntos que se dispondran para cada categoria
		$.getJSON("estatico/profesiones.json", function(profesiones) {
			$.getJSON("estatico/magia.json", function(magia) {
				var max = {
					movimiento : puntos.movimiento = profesiones[pj.profesion].desarrollo.movimiento * nivelesSubir,
					maxArmas : puntos.armas = profesiones[pj.profesion].desarrollo.armas * nivelesSubir,
					generales : puntos.generales =profesiones[pj.profesion].desarrollo.generales * nivelesSubir,
					subterfugio : puntos.subterfugio =profesiones[pj.profesion].desarrollo.subterfugio * nivelesSubir,
					magicas : puntos.magicas = profesiones[pj.profesion].desarrollo.magicas * nivelesSubir,
					lista : puntos.lista = profesiones[pj.profesion].desarrollo.listaSortilegio * nivelesSubir
				}
	
				
				puntos.desarrollo = profesiones[pj.profesion].bonificaciones.desarrolloFisico * nivelesSubir;
	
				$('#puntosmovimiento').text(puntos.movimiento);
				$('#puntosarmas').text(puntos.armas);
				$('#puntosgenerales').text(puntos.generales);
				$('#puntossubterfugio').text(puntos.subterfugio);
				$('#puntosmagicas').text(puntos.magicas);
				$('#puntosLista').text(puntos.lista);
							
	
				for (var i in pj.habilidades){
					$('#subir' + i).text(pj.habilidades[i]); //se rellena la tabla
					
					$('#accSubir' + i).off('click').on('click', {hab : i}, function(event){
						//hay que distinguir entre las habilidades de movimiento y las demas, tienen distintas restricciones
						var tipo = tipoHabilidad(event.data.hab); //funcion de utilidades
									
						var maximo = { 
								sinArmadura : 2,
								cuero: 3,
								cueroEndurecido: 5,
								cotaMalla : 7,
								coraza : 9
								};
						
						if (tipo == "movimiento"){
							if (puntos.movimiento > 0 && ($('#subir' + event.data.hab).text() < maximo[event.data.hab])){
								puntos.movimiento--;
								//actualizamos visualmente
								$('#subir' + event.data.hab).text(parseInt($('#subir' + event.data.hab).text()) + 1);
								$('#puntosmovimiento').text(puntos.movimiento);
							}
						}
						else { //habilidad que no es de movimiento
							/*	La primera vez que se sube una habilidad durante un nivel cuesta 1 punto, la segunda vez (y ultima), 2.
							 * Esto significa que si sube 3 niveles seguidos, los 3 primeros puntos solo costarían 1 punto (subiría 1 punto por nivel),
							 * a partir de ese momento, cada punto (hasta un maximo de 3), cuesta el doble
							 */
							if (puntos[tipo] > 0){
								var subidaActual = parseInt($('#subir' + event.data.hab).text()) - pj.habilidades[event.data.hab];
								if (subidaActual < nivelesSubir * 2) {
									if (subidaActual < nivelesSubir){ //todavia puede seguir subiendo a coste 1
										puntos[tipo]--;
										//actualizamos visualmente
										$('#subir' + event.data.hab).text(parseInt($('#subir' + event.data.hab).text()) + 1);
										$('#puntos' + tipo).text(puntos[tipo]);
									}
									else{ //le cuesta 2 subir un punto
										if (puntos[tipo] > 1){
											puntos[tipo] -= 2;
											//actualizamos visualmente
											$('#subir' + event.data.hab).text(parseInt($('#subir' + event.data.hab).text()) + 1);
											$('#puntos' + tipo).text(puntos[tipo]);
										}
									}
								}
							}
						}
					});
					
					//funcion del boton derecho
					$('#accSubir' + i).off('contextmenu').on('contextmenu', {hab : i}, function(event){
						var tipo = tipoHabilidad(event.data.hab);
		
						
						if (tipo == "movimiento"){
							if (max.movimiento > puntos.movimiento && ($('#subir' + event.data.hab).text() > 0)){
								puntos.movimiento++;
								//actualizamos visualmente
								$('#subir' + event.data.hab).text(parseInt($('#subir' + event.data.hab).text()) - 1);
								$('#puntosmovimiento').text(puntos.movimiento);
							}
						}
						else { //habilidad que no es de movimiento
							/*	La primera vez que se sube una habilidad durante un nivel cuesta 1 punto, la segunda vez (y ultima), 2.
							 * Esto significa que si sube 3 niveles seguidos, los 3 primeros puntos solo costarían 1 punto (subiría 1 punto por nivel),
							 * a partir de ese momento, cada punto (hasta un maximo de 3), cuesta el doble
							 */
							if (puntos[tipo] < max[tipo]){
								var subidaActual = parseInt($('#subir' + event.data.hab).text()) - pj.habilidades[event.data.hab];
								if (subidaActual > 0) {
									if (subidaActual <= nivelesSubir){ //ha estado subiendo a coste 1
										puntos[tipo]++;
										//actualizamos visualmente
										$('#subir' + event.data.hab).text(parseInt($('#subir' + event.data.hab).text()) - 1);
										$('#puntos' + tipo).text(puntos[tipo]);
									}
									else{ //ha subido a coste 2
										puntos[tipo] += 2;
										//actualizamos visualmente
										$('#subir' + event.data.hab).text(parseInt($('#subir' + event.data.hab).text()) - 1);
										$('#puntos' + tipo).text(puntos[tipo]);
								
									}
								}
							}
						}
						
						return false;
					});
				}
				
				
				//magia 
				
				function aumentarLista(event){
					if (puntos.lista > 0 && parseInt($('#n'+event.data.item).text()) < 5){
						puntos.lista--;
						$('#puntosLista').text(puntos.lista);
						$('#n'+event.data.item).text(parseInt($('#n'+event.data.item).text()) + 1);
					}
				}
				
				function decrementarLista(event){
					if (puntos.lista < max.lista && parseInt($('#n'+event.data.item).text()) > pj.listas[event.data.item]){
						puntos.lista++;
						$('#puntosLista').text(puntos.lista);
						$('#n'+event.data.item).text(parseInt($('#n'+event.data.item).text()) - 1);
					}
					return false;
				}
				
				
				if (pj.profesion !== "Guerrero" && pj.profesion !== "Explorador"){
					$(".magiaON").show(); //se muestra la tabla de listas de sortilegios
					if (pj.dominio == "ESE"){
						
						//Se añaden las listas de esencia
						for (var lista in magia.Esencia){
							if (magia.Esencia[lista].imp != -1 && pj.listas[lista] != 5){ //si imp = -1 la lista aun no está implementada y no se muestra

									$('#tablaMagia').append("<tr><td class='w3-center' id='"+ lista +"'>"+ magia.Esencia[lista].nombre +"</td><td id='n"+ lista +"' class='w3-center'>"+ pj.listas[lista]+"</td></tr>");
									var nombreLista = lista;
									
									$('#'+lista).off('click').on('click', {item : nombreLista}, aumentarLista);
									$('#'+lista).off('contextmenu').on('contextmenu', {item : nombreLista}, decrementarLista);
								}
							
								
						}
						
					} else if (pj.dominio == "CAN"){
						//Se añaden las listas de canalizacion
						for (var lista in magia.Canalizacion){
							if (magia.Canalizacion[lista].imp != -1 && pj.listas[lista] != 5){ //si imp = -1 la lista aun no está implementada y no se muestra
								$('#tablaMagia').append("<tr><td class='w3-center' id='"+ lista +"'>"+ magia.Canalizacion[lista].nombre +"</td><td id='n"+ lista +"' class='w3-center'>"+ pj.listas[lista]+"</td></tr>");
								var nombreLista = lista;
								$('#'+lista).off('click').on('click', {item : nombreLista}, aumentarLista);
								$('#'+lista).off('contextmenu').on('contextmenu', {item : nombreLista}, decrementarLista);
							}
						}
					}
					//Se añaden las listas claseas
					
					for (var lista in magia[pj.profesion]){
						if (magia[pj.profesion][lista].imp != -1 && pj.listas[lista] != 5){ //si imp = -1 la lista aun no está implementada y no se muestra
							$('#tablaMagia').append("<tr><td class='w3-center' id='"+ lista +"'>"+ magia[pj.profesion][lista].nombre +"</td><td id='n"+ lista +"' class='w3-center'>"+ pj.listas[lista]+"</td></tr>");
							var nombreLista = lista;
							$('#'+lista).off('click').on('click', {item : nombreLista}, aumentarLista);
							$('#'+lista).off('contextmenu').on('contextmenu', {item : nombreLista}, decrementarLista);
						}
					}
					
				}
				//Aunque podría considerarse que por cada nivel subido habría que volver a calcular si se obtienen las listas (en caso de empezar un personaje a nivel alto por ejemplo), 
				//las reglas especifican que se calcula cada vez que se alcanza un nuevo nivel (en lugar de "por" cada nivel), compensando así el beneficio de poder planear de manera mas eficiente
				//las listas de sortilegios teniendo mas puntuacion


				$('#modalSubirNivel').show();
				
				$('#nivelAplicar').off('click').on('click', function(){
		
					if (puntos.movimiento != 0 || puntos.armas != 0 || puntos.generales != 0 || puntos.subterfugio!= 0 || puntos.magicas != 0){
						alert("Deben usarse todos los puntos de habilidad");
					} else {
						//bonos de profesion
						$.getJSON("estatico/profesiones.json", function(profesiones) {
							pj.bonificacionesProfesion.armas = profesiones[pj.profesion].bonificaciones.armas * pj.nivel;
							pj.bonificacionesProfesion.generales = profesiones[pj.profesion].bonificaciones.generales * pj.nivel;
							pj.bonificacionesProfesion.subterfugio = profesiones[pj.profesion].bonificaciones.subterfugio * pj.nivel;
							pj.bonificacionesProfesion.magicas = profesiones[pj.profesion].bonificaciones.magicas * pj.nivel;
							pj.bonificacionesProfesion.acecharEsconderse = profesiones[pj.profesion].bonificaciones.acecharEsconderse * pj.nivel;
							pj.bonificacionesProfesion.leerRunas = profesiones[pj.profesion].bonificaciones.leerRunas * pj.nivel;
							pj.bonificacionesProfesion.objetosMagicos = profesiones[pj.profesion].bonificaciones.objetosMagicos * pj.nivel;
							pj.bonificacionesProfesion.desarrolloFisico = profesiones[pj.profesion].bonificaciones.desarrolloFisico * pj.nivel;
							pj.bonificacionesProfesion.percepcion = profesiones[pj.profesion].bonificaciones.percepcion * pj.nivel;
							pj.bonificacionesProfesion.sortilegiosDirigidos = profesiones[pj.profesion].bonificaciones.sortilegiosDirigidos * pj.nivel;
							pj.sortilegiosBase =  profesiones[pj.profesion].bonificaciones.sortilegiosBasicos * pj.nivel;
							for (var i in pj.habilidades){
								//grados en la habilidad
								pj.habilidades[i] = parseInt($('#subir' + i).text());
								//bono total
								switch(i){
									
								case 'filo':
								case 'contundente': 
								case 'dosManos':
								case 'asta':
									pj.bHabilidad[i] = bonoHabilidad(pj.habilidades[i], pj.bonoTotal.fuerza, pj.bonificacionesProfesion.armas);
									break;
								case 'arrojadizas':
								case 'proyectiles':
									pj.bHabilidad[i] = bonoHabilidad(pj.habilidades[i], pj.bonoTotal.agilidad, pj.bonificacionesProfesion.armas);
									break;
								case 'trepar':
								case 'nadar': 
									pj.bHabilidad[i] = bonoHabilidad(pj.habilidades[i], pj.bonoTotal.agilidad, pj.bonificacionesProfesion.generales);
									break;
								case 'montar':
									pj.bHabilidad[i] = bonoHabilidad(pj.habilidades[i], pj.bonoTotal.intuicion, pj.bonificacionesProfesion.generales);
									break;
								case 'rastrear':
									pj.bHabilidad[i] = bonoHabilidad(pj.habilidades[i], pj.bonoTotal.inteligencia, pj.bonificacionesProfesion.generales);
									break;
								case 'emboscar':
									pj.bHabilidad[i] = bonoHabilidad(pj.habilidades[i]);
									break;
								case 'acecharEsconderse': 
									bonoHabilidad(pj.habilidades[i], pj.bonoTotal.presencia, pj.bonificacionesProfesion.subterfugio+pj.bonificacionesProfesion.acecharEsconderse);
									break;
								case 'abrirCerraduras':
									pj.bHabilidad[i] = bonoHabilidad(pj.habilidades[i], pj.bonoTotal.inteligencia, pj.bonificacionesProfesion.subterfugio);
									break;
								case 'desactivarTrampas':
									pj.bHabilidad[i] = bonoHabilidad(pj.habilidades[i], pj.bonoTotal.intuicion, pj.bonificacionesProfesion.subterfugio);
									break;
								case 'leerRunas':
									pj.bHabilidad[i] = bonoHabilidad(pj.habilidades[i], pj.bonoTotal.inteligencia, pj.bonificacionesProfesion.magicas+pj.bonificacionesProfesion.leerRunas);
									break;
								case 'objetosMagicos':
									pj.bHabilidad[i] = bonoHabilidad(pj.habilidades[i], pj.bonoTotal.intuicion, pj.bonificacionesProfesion.magicas+pj.bonificacionesProfesion.objetosMagicos);
									break;
								case 'sortilegiosDirigidos':
									pj.bHabilidad[i] = bonoHabilidad(pj.habilidades[i], pj.bonoTotal.agilidad, pj.bonificacionesProfesion.magicas+pj.bonificacionesProfesion.sortilegiosDirigidos);
									break;
								case 'sinArmadura':
									pj.bHabilidad[i] = bonoHabilidad(pj.habilidades[i], pj.bonoTotal.agilidad);
									break;
								case 'cuero':
									pj.bHabilidad[i] = bonoHabilidad(pj.habilidades[i], pj.bonoTotal.agilidad, -15); 
									break;
								case 'cueroEndurecido':
									pj.bHabilidad[i] = bonoHabilidad(pj.habilidades[i], pj.bonoTotal.fuerza, -30); 
									break;
								case 'cotaMalla':
									pj.bHabilidad[i] = bonoHabilidad(pj.habilidades[i], pj.bonoTotal.fuerza, -45); 
									break;
								case 'coraza':
									pj.bHabilidad[i] = bonoHabilidad(pj.habilidades[i], pj.bonoTotal.fuerza, -60); 
									break;
							
								}
								pj.habilidades[i] = parseInt($('#subir' + i).text());
							}
							
							//Aprendizaje de Listas de Sortilegios
							for (var posibleLista in pj.listas){
								if (parseInt($('#n'+posibleLista).text()) > 0 ){ //si tiene algun punto y si no esta ya aprendida
									if (parseInt($('#n'+posibleLista).text())*20 > Math.floor((Math.random() * 100) + 1)){ //numero entre 1 y 100
										pj.listas[posibleLista] = 5; //se aprende la lista 
									}
									else { //se conservan los puntos invertidos si no se ha aprendido
										pj.listas[posibleLista] = parseInt($('#n'+posibleLista).text());
									}
											
								}
							}
							
							//Subida de vida y de puntos de poder
							pj.desarrolloFisico += puntos.desarrollo;
							
							var vidaGanada = 0;
							for (var k = 0; k < puntos.desarrollo; k++) {
								vidaGanada += Math.floor((Math.random() * 10) + 1); //1d10 por punto de desarrollo
							}
							pj.vidaMaxima += vidaGanada;
							pj.vida += vidaGanada; //el personaje se "cura" la cantidad de vida aumentada
							pj.poderMaximo = pj.poderMaximo/pj.nivelReal * pj.nivel; //subida proporcional
							//se da por concluida la subida de nivel
							pj.nivelReal = pj.nivel;
							$('#modalSubirNivel').hide();
							$('#linkModalSubirNivel').hide();
							socket.emit('actualizarPJ', pj);
						});
						
					}
				
				});

				//el desarrollo se hace tras pulsar guardar (1d10 por desarrollo)
			});
		});
		
		
		
	});

	
	//cargar npcs
	function cargarNPC(){ 
		$.getJSON("estatico/enemigos.json", function(objetos) {
			for(i in objetos){
				var fila = "<tr>";
				fila += "<td>"+ i; +"</td>"; //nombre
				fila += "<td>"+ objetos[i].nivel; +"</td>";
				fila += "<td>"+ objetos[i].velocidad +"</td>";
				fila += "<td>"+ objetos[i].vidaMaxima +"</td>";
				fila += "<td>"+ nombreArmadura(objetos[i].armadura) +"</td>";
				fila += "<td>"+ objetos[i].bd +"</td>";
				fila += "<td>"+ objetos[i].ataque +"</td>";
				fila += "<td>"+ nombreAtaque(objetos[i].tipoAtaque) +"</td>";
				fila += "<td>"+ objetos[i].critico +"</td>";
				fila += "<td><a id='enemigo"+objetos[i].id+"' class='w3-btn w3-small w3-round-xxlarge w3-green'>+</a></td>";
				fila += "</tr>";
				$('#tablaEnemigos').append(fila);
				
				//se vincula la funcion de añadir al carrito a cada enlace de item
				$('#enemigo'+objetos[i].id).bind('click', {enemigo : i},  function(event){
					$("#modalNPC").hide();
					$("#modalDatosNPC").show();
					pnj = jQuery.extend({}, objetos[event.data.enemigo]) ; //copia por valor
					

				});
				
				
			}
					
			
		}).fail(function(jqxhr, textStatus, error){
			var err = textStatus + ", " + error;
		    console.log( "Error: " + err );
		});
		
		//añadir NPC
		$('#addDatosNPC').bind('click',  function(){ 
		
			if ( buscarEnemigo($("#nNPC").val()) == null ){ //no hay ningun npc con ese nombre
				
				pnj.color = $("#colorNPC").val();
				pnj.nombre = escapeHtml($("#nNPC").val());
				pnj.vida = pnj.vidaMaxima; //creamos el atributo vida para guardar su vida actual
				enemigos.push(pnj);		
				socket.emit('actualizarEnemigos', enemigos);
				actualizarEnemigos();
				actualizarPuntosVida();
				$("#modalDatosNPC").hide();
				$("#modalVerNPC").show();
			}
			else alert("Nombre de NPC en uso");
		});
		
	}
	
	//actualiza (o crea) La tabla de enemigos
	//se llama cada vez que se añade o elimina un enemigo
	function actualizarEnemigos(){
		//reseteamos la tabla
		$("#enemigosVivos tr").remove();
		//cabecera de la tabla
		$('#enemigosVivos').append("<tr class='w3-theme-d2'><th title='Nombre'>Nombre</th><th title='Movimiento'>Mov</th><th title='PV'>PV</th>" +
				"<th title='Armadura equivalente'>Armadura</th>	<th title='Defensa'>Def</th><th title='Ataque'>Ata</th><th title='Tipo Ataque'>Tipo</th>" +
				"<th title='Crítico'>Crítico</th><th title='Colocar'>Colocar</th><th title='Eliminar'>Eliminar</th></tr>");


		for (i in enemigos){
			var fila = "<tr>";
			fila += "<td>"+ enemigos[i].nombre; +"</td>";
			fila += "<td>"+ enemigos[i].velocidad +"</td>";
			fila += "<td>"+ enemigos[i].vidaMaxima +"</td>";
			fila += "<td>"+ nombreArmadura(enemigos[i].armadura) +"</td>";
			fila += "<td>"+ enemigos[i].bd +"</td>";
			fila += "<td>"+ enemigos[i].ataque +"</td>";
			fila += "<td>"+ nombreAtaque(enemigos[i].tipoAtaque) +"</td>";
			fila += "<td>"+ enemigos[i].critico +"</td>";
			fila += "<td bgcolor='"+enemigos[i].color+"'><a id='lEnemigo"+i+"' class='w3-btn w3-small w3-round-xxlarge w3-green'>+</a></td>";
			fila += "<td bgcolor='"+enemigos[i].color+"'><a id='eEnemigo"+i+"' class='w3-btn w3-small w3-round-xxlarge w3-red'>-</a></td>";
			fila += "</tr>";
			$('#enemigosVivos').append(fila);
			
			$('#lEnemigo'+i).bind('click', {enemigo : i},  function(event){
				
				$("#modalVerNPC").hide();
				pnj = jQuery.extend({}, enemigos[event.data.enemigo]) ;
				accion.tipo = "movForzadoPNJ";
				accion.datos = buscarPersonaje(pnj);
				if(accion.datos != null) {
					movimiento = rangoMov(mapa, t,  matrizHex(accion.datos.r, accion.datos.q ), pnj.velocidad/3);
					movimiento.forEach(function(hex){
						drawHex(ctx, lay, hex, 'rgba(255, 255, 0, 0.3)');
					})
				}
			});
			
			//eliminamos el enemigo de la lista y de la matriz
			$('#eEnemigo'+i).bind('click', {enemigo : i},  function(event){ 
				eliminarNPC(event.data.enemigo);
			});
		}
		
	}

	
	//funcion para el modal de puntos de vida
	function actualizarPuntosVida (){
		//reseteamos las tablas
		$("#tablaVidaPersonajes tr").remove();
		$("#tablaVidaEnemigos tr").remove();
		//cabecera de la tabla
		$('#tablaVidaPersonajes').append("<tr class='w3-theme-d2'><th title='Nombre'>Nombre</th><th title='PV'>PV</th>" +
				"<th title='PV Máximos'>Max PV</th></tr>");
		$('#tablaVidaEnemigos').append("<tr class='w3-theme-d2'><th title='Nombre'>Nombre</th><th title='PV'>PV</th>" +
			"<th title='PV Máximos'>Max PV</th></tr>");
		for (i in personajes){
			var fila = "<tr>";
			fila += "<td>"+ personajes[i].nombre; +"</td>";
			fila += "<td style='width:20%' ><input id='pjVida"+i+"' max='999' type='number'value='"+ personajes[i].vida +"'></td>";
			fila += "<td  >"+ personajes[i].vidaMaxima +"</td>";
			fila += "</tr>";
			$('#tablaVidaPersonajes').append(fila);
		}
		for (i in enemigos){
			var fila = "<tr>";
			fila += "<td>"+ enemigos[i].nombre; +"</td>";
			fila += "<td style='width:20%' ><input id='npcVida"+i+"' max='999' type='number'value='"+ enemigos[i].vida +"'></td>";
			fila += "<td>"+ enemigos[i].vidaMaxima +"</td>";
			fila += "</tr>";
			$('#tablaVidaEnemigos').append(fila);
		}
	}
	
	$('#vidaGuardar').bind('click', function(){ 
		for(i in personajes){
			if(Number.isInteger(parseInt($('#pjVida'+i).val()))){ //si es un numero (se toma parte entera)
				personajes[i].vida = parseInt($('#pjVida'+i).val());
			}
		}
		for(i in enemigos){
			if(Number.isInteger(parseInt($('#npcVida'+i).val()))){ //si es un numero (se toma parte entera)
				enemigos[i].vida = parseInt($('#npcVida'+i).val());
				if(enemigos[i].vida <= 0 && $(':input[name="autoEliminar"]:checked').val()){ //si el enemigo muere se elimina si esta marcada la casilla de autoeliminar
					eliminarNPC(i);
				}
			}
		}
		actualizarPuntosVida();
		socket.emit('actualizarEnemigos', enemigos, true); 
		socket.emit('actualizarPersonajes', personajes, true);
		$('#modalVida').hide();
	});
	
	//Al cancelar se rellena de nuevo el "forumlario" con los valores que existen en memoria
	$('.vidaCancelar').bind('click', function(){ 
		$('#modalVida').hide();
		actualizarPuntosVida();
	});
	
	
	

	
	
	/* Código del tablero  (mapa)
	 */
	function cargarTablero(){
		$('#tablero').ready(function() {
			
			socket.on('actualizandoMapa', function(posPer){
				mapa.posPersonajes = posPer;
				
				ctx.putImageData(capturaPixeles, 0, 0);
				dibujarPersonajes();
			});
			
			//tanto base como capa son matrices
			//si no se recibe base, todo cesped
			function dibujarMapa(tiles, base){

				mapa.hexagonos = drawGrid("tablero", "white", false, lay, shapeRectangle(30, 20, permuteQRS));

				var p;

				//dibujar base del mapa
				if (base == undefined){
					//si no se recibe matriz de tiles base, se dibuja todo con hierba
					for (var fil = 0; fil < 20; fil++) {
						for (var col = 0; col < 30; col++) {
							p = hex_to_pixel(lay, matrizHex(fil,col));
							ctx.drawImage(imgs[t.hier], p.x -17, p.y -19);

						}
					}

				}else {
					
					for (var fil = 0; fil < 20; fil++) {
						for (var col = 0; col < 30; col++) {
							//dibujar en el pixel p la imagen correspondiente a t.hier
							p = hex_to_pixel(lay, matrizHex(fil,col));
							ctx.drawImage(imgs[base[fil][col]], p.x -17, p.y -19);

						}
					}
				}
				//dibujar capa superior
				for (var fil = 0; fil < 20; fil++) {
						for (var col = 0; col < 30; col++) {
							//dibujar en el pixel p la imagen correspondiente a t.hier
							p = hex_to_pixel(lay, matrizHex(fil,col));
							if (tiles[fil][col] != t.nada)
								ctx.drawImage(imgs[tiles[fil][col]], p.x -17, p.y -19);

						}
					}
				
			}


			
			
			// Cargando imágenes
		    var imageURLs=[];  
		    
		    imageURLs.push("graficos/hierba.png");
		    imageURLs.push("graficos/agua.png");
		    imageURLs.push("graficos/arena.png");
		    
		    imageURLs.push("graficos/bosque.png");
		    imageURLs.push("graficos/roca2.png");
		    
		    imageURLs.push("graficos/camino1.png");
		    imageURLs.push("graficos/camino2.png");
		    imageURLs.push("graficos/camino3.png");

		    imageURLs.push("graficos/cruce1.png");
		    imageURLs.push("graficos/cruce2.png");

		    imageURLs.push("graficos/curva1.png");
		    imageURLs.push("graficos/curva2.png");
		    imageURLs.push("graficos/curva3.png");
		    imageURLs.push("graficos/curva4.png");



		    // vector que contendrá las imágenes
		    var imgs=[];

		    var imagesOK=0;
		    
		    
	        for (var i=0; i<imageURLs.length; i++) {
	            var img = new Image();
	            imgs.push(img);
	            img.onload = function(){ 
	                imagesOK++; 
	                if (imagesOK>=imageURLs.length ) {
	                    dibujarMapa(mapa.tiles);
	                    capturaPixeles = ctx.getImageData(0, 0, 1014, 590);
	                    dibujarPersonajes();
	                }
	            };
	            img.onerror=function(){alert("Error en carga de imagen");} 
	            //img.crossOrigin="anonymous";
	            img.src = imageURLs[i];
	        }      
		    
		    
		    var Left = canvas.offsetLeft;
		    var Top = canvas.offsetTop;
		  //función de ventana para que no se desincronicen los pixeles del tablero
		    $( window ).resize(function() {
      		
			    Left = canvas.offsetLeft;
			    Top = canvas.offsetTop;
			
		    });


			var primerClick = false;
			var salida;
			var hexClicado;
			var movimiento;
			var movido = false;
			var sq,sr, hq,hr; //coordenadas de los hexagonos salida y hexClicado
			
			/* datos por defecto para la funcion de click:
			 *	accion.tipo = "ninguna";
			 *  accion.datos = null;
			 */
			canvas.addEventListener('click', function(event) {
				
				var x = event.pageX - Left,
        			y = event.pageY - Top;
				
				switch(accion.tipo){
				case "Ataque a Distancia":
					hexClicado = hex_round( pixel_to_hex(lay,Point(x,y))); 
					if (verHex(hexClicado, mapa.hexagonos)){
						hr = hexMatriz(hexClicado).row;
						hq = hexMatriz(hexClicado).col;
						//hay alguien en el sitio clicado y no es aliado
						if (mapa.posPersonajes[hr][hq] != null && mapa.posPersonajes[hr][hq].usuario == undefined){
							//se verifica que se clica dentro del rango
							accion.hexagonos.forEach(function(hex){
								if(hexClicado.toString() ==hex.toString()) {
									//se produce el ataque
									socket.emit('realizarAccion', 3, accion.cantidad, accion.posicion, 'Ataque a Distancia', mapa.posPersonajes[hr][hq].nombre, pj.equipado.arma); //al ser acción de un jugador, el vector solo tendrá un elemento
									ctx.putImageData(capturaPixeles, 0, 0);
									dibujarPersonajes();
									
									//se reestablecen los valores del objeto acción
									accion.tipo = "ninguna";
									
								}
							})
							
						}
						
						
					}
					break;
				case "Ataque C/C": 
					hexClicado = hex_round( pixel_to_hex(lay,Point(x,y))); 
					if (verHex(hexClicado, mapa.hexagonos)){
						hr = hexMatriz(hexClicado).row;
						hq = hexMatriz(hexClicado).col;
						//hay alguien en el sitio clicado y no es aliado
						if (mapa.posPersonajes[hr][hq] != null && mapa.posPersonajes[hr][hq].usuario == undefined){
							//se verifica que se clica dentro del rango
							accion.hexagonos.forEach(function(hex){
								if(hexClicado.toString() ==hex.toString()) {
									//se produce el ataque
									socket.emit('realizarAccion', 4, accion.cantidad, accion.posicion, 'Ataque C/C', mapa.posPersonajes[hr][hq].nombre, pj.equipado.arma); //al ser acción de un jugador, el vector solo tendrá un elemento
									$('#opcionesCombate').empty(); //se quita el botón de cancelar
									ctx.putImageData(capturaPixeles, 0, 0);
									dibujarPersonajes();
									
									//se reestablecen los valores del objeto acción
									accion.tipo = "ninguna";
								}
							})
						}				
					}
					break;
					
				case "NPC: Ataque C/C" : 
					hexClicado = hex_round( pixel_to_hex(lay,Point(x,y))); 
					if (verHex(hexClicado, mapa.hexagonos)){
						hr = hexMatriz(hexClicado).row;
						hq = hexMatriz(hexClicado).col;
						//hay alguien en el sitio clicado y no es enemigo
						if (mapa.posPersonajes[hr][hq] != null && mapa.posPersonajes[hr][hq].usuario != undefined){
							//se verifica que se clica dentro del rango
							accion.hexagonos.forEach(function(hex){
								if(hexClicado.toString() ==hex.toString()) {
									//se produce el ataque
									socket.emit('realizarAccion', 4, accion.cantidad, accion.posicion, 'Ataque C/C', mapa.posPersonajes[hr][hq].nombre, {ataque: accion.ataque, tipo: accion.tipoAtaque}); 
									$('#opcionesCombate').empty(); //se quita el botón de cancelar
									ctx.putImageData(capturaPixeles, 0, 0);
									dibujarPersonajes();
									
									//se reestablecen los valores del objeto acción
									accion.tipo = "ninguna";
								}
							})
						}				
					}
					break;
					
					break;
					
				case "Movimiento":
					hexClicado = hex_round( pixel_to_hex(lay,Point(x,y))); 
					if (verHex(hexClicado, mapa.hexagonos)){
						hr = hexMatriz(hexClicado).row;
						hq = hexMatriz(hexClicado).col;
						//no hay alguien en el sitio clicado
						if (mapa.posPersonajes[hr][hq] == null){
							accion.hexagonos.forEach(function(hex){
								if(hexClicado.toString() ==hex.toString()) {
									mapa.posPersonajes[accion.coordenadas.r][accion.coordenadas.q] = null;
									mapa.posPersonajes[hr][hq] = accion.personaje;
									socket.emit('realizarAccion', 5, accion.cantidad, accion.posicion, 'Movimiento', mapa.posPersonajes); 
									$('#opcionesCombate').empty(); //se quita el botón de cancelar
									ctx.putImageData(capturaPixeles, 0, 0);
									dibujarPersonajes();
									
									//se reestablecen los valores del objeto acción
									accion.tipo = "ninguna";
								}
							})
						}
					}
					
					break;
					
				case "movForzado":

					hexClicado = hex_round( pixel_to_hex(lay,Point(x,y))); 
					if (verHex(hexClicado, mapa.hexagonos)){
						hr = hexMatriz(hexClicado).row;
						hq = hexMatriz(hexClicado).col;
						
						if (mapa.posPersonajes[hr][hq] == null){ //comprobación de que la casilla no está ocupada
							if(accion.datos != null){ //si es null, el personaje no estaba en el tablero
								mapa.posPersonajes[accion.datos.r][accion.datos.q] = null; //posición de partida
							}
							mapa.posPersonajes[hr][hq] = pj;
							socket.emit('actualizarMapa', mapa.posPersonajes);
						} else { //movimiento no valido/cancelado
							ctx.putImageData(capturaPixeles, 0, 0);
							dibujarPersonajes();
						}
					}
					else { //movimiento no valido/cancelado
						ctx.putImageData(capturaPixeles, 0, 0);
						dibujarPersonajes();
					}
					
					//se reestablecen los valores del objeto acción
					accion.tipo = "ninguna";
					accion.datos = null;
					
					break;
				case "movForzadoPNJ":

					hexClicado = hex_round( pixel_to_hex(lay,Point(x,y))); 
					if (verHex(hexClicado, mapa.hexagonos)){
						hr = hexMatriz(hexClicado).row;
						hq = hexMatriz(hexClicado).col;
						
						if (mapa.posPersonajes[hr][hq] == null){ //comprobación de que la casilla no está ocupada
							if(accion.datos != null){ //si es null, el personaje no estaba en el tablero
								mapa.posPersonajes[accion.datos.r][accion.datos.q] = null; //posición de partida
							}
							mapa.posPersonajes[hr][hq] = pnj;
							socket.emit('actualizarMapa', mapa.posPersonajes);
						} else { //movimiento no valido/cancelado
							ctx.putImageData(capturaPixeles, 0, 0);
							dibujarPersonajes();
						}
					}
					else { //movimiento no valido/cancelado
						ctx.putImageData(capturaPixeles, 0, 0);
						dibujarPersonajes();
					}
					
					//se reestablecen los valores del objeto acción
					accion.tipo = "ninguna";
					accion.datos = null;
					
					break;
				default:
					break;				
				}
					
	
		    }, false);
			
			//evento mousemove para que se vean datos de la casilla
			document.getElementById("wrapTablero").addEventListener('mousemove', function(event) {
				var x = event.pageX - Left,
    				y = event.pageY - Top;
				
				var hexOver;
				var coor;
				hexOver = hex_round( pixel_to_hex(lay,Point(x,y)));
				coor = hexMatriz(hexOver);
				
				if (verHex(hexOver, mapa.hexagonos)){
					if(mapa.posPersonajes[coor.row][coor.col] != null){ //casilla ocupada
						var salud =  parseInt(mapa.posPersonajes[coor.row][coor.col].vida / mapa.posPersonajes[coor.row][coor.col].vidaMaxima * 100);
						//al truncar el porcentaje, puede parecer que un personaje/enemigo está muerto (0%) a pesar de seguir teniendo puntos de vida
						//mostramos al menos 1% para que se refleje que sigue vivo
						if (salud == 0 && mapa.posPersonajes[coor.row][coor.col].vida > 0)
							salud = 1; 
						$("#infoCasilla").text("Casilla [" + (coor.row+1) + "][" + (coor.col+1) + "] " + mapa.posPersonajes[coor.row][coor.col].nombre + " ("+salud+"%)");
					}
					else
						$("#infoCasilla").text("Casilla [" + (coor.row+1) + "][" + (coor.col+1) + "]");
					
				}
			});
		}) 
	}
	
	
});
//función que gestiona las pestañas de la página de juego
function pestana(pes){
	var pes1, pes2, pes3;
	if (pes == "ficha" || pes == "magia" || pes=="equipo"){ //modal de la ficha
		pes1 = "ficha";
		pes2= "magia";
		pes3 = "equipo";
	}
	else if (pes =="armas" || pes == "armaduras" || pes == "otros"){ //modal de tienda
		pes1 = "armas";
		pes2= "armaduras";
		pes3 = "otros";
	}
	else if (pes =="chat" || pes == "combate" || pes == "notas"){ //parte izquierda de la pagina de juego
		pes1 = "chat";
		pes2= "combate";
		pes3 = "notas";
	}
	$('#'+pes1).hide();
	$('#'+pes2).hide();
	$('#' +pes3).hide();
	$('#btn'+pes1).removeClass("w3-theme-l1 pestanaSel");
	$('#btn'+pes2).removeClass("w3-theme-l1 pestanaSel");
	$('#btn'+pes3).removeClass("w3-theme-l1 pestanaSel");
	$('#btn'+pes1).addClass("w3-theme-l4 pestana");
	$('#btn'+pes2).addClass("w3-theme-l4 pestana");
	$('#btn'+pes3).addClass("w3-theme-l4 pestana");

	$('#'+pes).show();
	$('#btn'+pes).removeClass("w3-theme-l4 pestana");
	$('#btn'+pes).addClass("w3-theme-l1 pestanaSel");
};
