/**
 * 
 */


	var socket = io.connect( 'http://localhost:8080', { query : "id_partida="+php_idPartida+"&nusuario="+php_nUsuario } );
	// ip externa var socket = io.connect( 'http://83.33.245.56:8080', { query : "id_partida="+php_idPartida+"&nusuario="+php_nUsuario } ); 
	// dns var socket = io.connect( 'http://roltierramedia.ddns.net:8080', { query : "id_partida="+php_idPartida+"&nusuario="+php_nUsuario } ); 
	// heroku var socket = io.connect( 'http://server-tierra-media.herokuapp.com', { query : "id_partida="+php_idPartida+"&nusuario="+php_nUsuario } ); 
	
	var pj = {
			nombre : null,
			usuario : php_nUsuario,
			raza : null,
			profesion : null,
			color : null,
			nivel : php_nivel,
			nivelReal : 1,
			experiencia : 10000,
			vida : 0, 
			vidaMaxima: 0,
			dominio: null,
			puntosPoder: 0,
			poderMaximo: 0,
			sortilegiosBase: 0,
			velocidad : 0,
			dinero : 50, //dinero inicial
			equipo: [], //equipo inicial, vacio
			equipado : { //lo que lleva equipado actualmente
				arma: null,
				escudo : false,
				armadura : null
			},
			bd : 0,
			stats : {
				fuerza : 0,
				agilidad: 0,
				constitucion : 0,
				inteligencia : 0,
				intuicion : 0,
				presencia : 0,
				aparienciaBase: 0, 
				apariencia : 0 //apariencia no tiene bonos, pero se le suma el bono de presencia
			},
			bonoRacial : {
				fuerza : 0,
				agilidad: 0,
				constitucion : 0,
				inteligencia : 0,
				intuicion : 0,
				presencia : 0
			},
			
			bonoTotal : {
				fuerza : 0,
				agilidad: 0,
				constitucion : 0,
				inteligencia : 0,
				intuicion : 0,
				presencia : 0

			}, 

			habilidades : {
				//movimiento y maniobra
				sinArmadura : 0,
				cuero : 0,
				cueroEndurecido : 0, 
				cotaMalla : 0,
				coraza : 0,
				//armas
				filo : 0,
				contundente : 0,
				dosManos : 0,
				arrojadizas : 0,
				proyectiles : 0 ,
				asta : 0,
				//generales
				trepar: 0,
				montar: 0,
				nadar: 0,
				rastrear: 0,
				//subterfugio
				emboscar : 0,
				acecharEsconderse : 0,
				abrirCerraduras : 0,
				desactivarTrampas :0,
				//magicas
				leerRunas: 0,
				objetosMagicos: 0,
				sortilegiosDirigidos: 0
			},
			bonificacionesProfesion : {
					armas : 0,
					generales: 0,
					subterfugio : 0,
					magicas : 0,
					acecharEsconderse: 0,
					leerRunas : 0,
					objetosMagicos: 0,
					desarrolloFisico: 0,
					percepcion: 0
			},
			bHabilidad : {
				//movimiento y maniobra
				sinArmadura : 0,
				cuero : 0,
				cueroEndurecido : 0, 
				cotaMalla : 0,
				coraza : 0,
				//armas
				filo : 0,
				contundente : 0,
				dosManos : 0,
				arrojadizas : 0,
				proyectiles : 0 ,
				asta : 0,
				//generales
				trepar: 0,
				montar: 0,
				nadar: 0,
				rastrear: 0,
				//subterfugio
				emboscar : 0,
				acecharEsconderse : 0,
				abrirCerraduras : 0,
				desactivarTrampas :0,
				//magicas
				leerRunas: 0,
				objetosMagicos: 0,
				sortilegiosDirigidos: 0,
				//otros
				esencia: 0,
				canalizacion : 0,
				veneno : 0,
				enfermedad : 0,
				percepcion: 0
			},
			desarrolloFisico : 0,
			percepcion : 0,
			probListaSortilegios: 0,
			gradosAdicionalesIdiomas: 0,
			puntosHistorial : 0,
			tr : {
				ese : 0,
				can : 0,
				ve : 0,
				enf : 0
			},
			listas : {
				DominioEspiritual : 0,
				DefensaContraSortilegios : 0,
				LeyDelFuego : 0,
				CanalizacionDirecta : 0,
				ManerasDeLaNaturaleza : 0,
				CancionesDeControl : 0
			}

	};
	//este objeto es para guardar la minima puntuacion que debe tener un personaje en una caracteristica
	var minHabilidad = {
			//movimiento y maniobra
			sinArmadura : 0,
			cuero : 0,
			cueroEndurecido : 0, 
			cotaMalla : 0,
			coraza : 0,
			//armas
			filo : 0,
			contundente : 0,
			dosManos : 0,
			arrojadizas : 0,
			proyectiles : 0 ,
			asta : 0,
			//generales
			trepar: 0,
			montar: 0,
			nadar: 0,
			rastrear: 0,
			//subterfugio
			emboscar : 0,
			acecharEsconderse : 0,
			abrirCerraduras : 0,
			desactivarTrampas :0,
			//magicas
			leerRunas: 0,
			objetosMagicos: 0,
			sortilegiosDirigidos: 0
	};
	
	var puntosAsignar = {
			movimiento : 0,
			armas : 0,
			generales : 0,
			subterfugio : 0,
			magicas : 0,
			lista : 0
	};
	var tiradas = { a : Math.floor((Math.random() * 80) + 20), 
			b : Math.floor((Math.random() * 80) + 20), 
			c : Math.floor((Math.random() * 80) + 20), 
			d : Math.floor((Math.random() * 80) + 20), 
			e : Math.floor((Math.random() * 80) + 20), 
			f : Math.floor((Math.random() * 80) + 20), 
			g : Math.floor((Math.random() * 80) + 20) 
			};
	var statPrimario;
	
	$(document).ready(function(){
		//ocultamos todo excepto el primer "formulario"
		$("#sec_tiradas").hide();
		$("#sec_adol").hide();

   		$("#tir1").text(tiradas.a);
   		$("#tir2").text(tiradas.b);
   		$("#tir3").text(tiradas.c);
   		$("#tir4").text(tiradas.d);
   		$("#tir5").text(tiradas.e);
   		$("#tir6").text(tiradas.f);
   		pj.stats.aparienciaBase = tiradas.g; //apariencia se asigna directamente

   		$.getJSON("estatico/profesiones.json", function( profesiones) {
   	   		$(':input[name="profesion"]').change(function (){
   	   			$("#infoProfesion").show();
   	   			var profTemporal = $(':input[name="profesion"]:checked').val();
   	   			$("#repMovimiento").text(profesiones[profTemporal].desarrollo.movimiento);
   	   			$("#repCombate").text(profesiones[profTemporal].desarrollo.armas);
   	   			$("#repGenerales").text(profesiones[profTemporal].desarrollo.generales);
   	   			$("#repSubterfugio").text(profesiones[profTemporal].desarrollo.armas);
   	   			$("#repMagicas").text(profesiones[profTemporal].desarrollo.magicas);
   	   			
   	   			$("#bonMovimiento").text(profesiones[profTemporal].bonificaciones.movimiento);
	   			$("#bonCombate").text(profesiones[profTemporal].bonificaciones.armas);
	   			$("#bonGenerales").text(profesiones[profTemporal].bonificaciones.generales);
	   			$("#bonSubterfugio").text(profesiones[profTemporal].bonificaciones.armas);
	   			$("#bonMagicas").text(profesiones[profTemporal].bonificaciones.magicas);
   	   		});
   		});
		$.getJSON("estatico/razas.json", function (razas) {
   	   		$(':input[name="raza"]').change(function (){
   	   			$("#infoRaza").show();
   	   			console.log("we")
   	   			var razaTemporal = $(':input[name="raza"]:checked').val();
   	   			$("#repFuerza").text(razas[razaTemporal].bonoAtributos.fuerza); 
   	   			$("#repAgilidad").text(razas[razaTemporal].bonoAtributos.agilidad);
   	   			$("#repConstitucion").text(razas[razaTemporal].bonoAtributos.constitucion);
   	   			$("#repInteligencia").text(razas[razaTemporal].bonoAtributos.inteligencia);
   	   			$("#repIntuicion").text(razas[razaTemporal].bonoAtributos.intuicion);
   	   			$("#repPresencia").text(razas[razaTemporal].bonoAtributos.presencia);
   	   		});
		});
   		

		//botones para pasar de formulario
		$("#btn_raza_prof").click(function(){
			if ($(':input[name="profesion"]:checked').val() && $(':input[name="raza"]:checked').val()) {
				pj.raza = $(':input[name="raza"]:checked').val();
				pj.profesion = $(':input[name="profesion"]:checked').val();
				pj.color = $("#color").val();
				console.log(pj.color);
				//leemos el stat primario de la profesion y de paso rellenamos los puntos para asignar habilidades
				$.getJSON("estatico/profesiones.json", function( profesiones) {
					statPrimario = profesiones[pj.profesion].primario;
					$("#car_prof_pri").text(statPrimario);
					puntosAsignar.movimiento = profesiones[pj.profesion].desarrollo.movimiento;
					puntosAsignar.armas = profesiones[pj.profesion].desarrollo.armas;
					puntosAsignar.generales =profesiones[pj.profesion].desarrollo.generales;
					puntosAsignar.subterfugio =profesiones[pj.profesion].desarrollo.subterfugio;
					puntosAsignar.magicas = profesiones[pj.profesion].desarrollo.magicas;
					puntosAsignar.lista = profesiones[pj.profesion].desarrollo.listaSortilegio;
					pj.bonificacionesProfesion.armas = profesiones[pj.profesion].bonificaciones.armas;
					pj.bonificacionesProfesion.generales = profesiones[pj.profesion].bonificaciones.generales;
					pj.bonificacionesProfesion.subterfugio = profesiones[pj.profesion].bonificaciones.subterfugio;
					pj.bonificacionesProfesion.magicas = profesiones[pj.profesion].bonificaciones.magicas;
					pj.bonificacionesProfesion.acecharEsconderse = profesiones[pj.profesion].bonificaciones.acecharEsconderse;
					pj.bonificacionesProfesion.leerRunas = profesiones[pj.profesion].bonificaciones.leerRunas;
					pj.bonificacionesProfesion.objetosMagicos = profesiones[pj.profesion].bonificaciones.objetosMagicos;
					pj.bonificacionesProfesion.desarrolloFisico = profesiones[pj.profesion].bonificaciones.desarrolloFisico;
					pj.bonificacionesProfesion.percepcion = profesiones[pj.profesion].bonificaciones.percepcion;
					pj.bonificacionesProfesion.sortilegiosDirigidos = profesiones[pj.profesion].bonificaciones.sortilegiosDirigidos;
					pj.sortilegiosBase =  profesiones[pj.profesion].bonificaciones.sortilegiosBasicos;

					
				});
				$("#car_prof").text(pj.profesion);
				$("#adol_raza").text(pj.raza);

				//pasar "pagina"


				$("#sec_tiradas").toggle();
	    		$("#raza_prof").toggle();

			}
			else
				alert("Debes elegir una raza y una profesión");


		});

		$("#btn_car").click(function(){
			//se guardan las caracteristicas
			pj.stats.fuerza = parseInt($("#tir1").text());
			pj.stats.agilidad = parseInt($("#tir2").text());
			pj.stats.constitucion = parseInt($("#tir3").text());
			pj.stats.inteligencia = parseInt($("#tir4").text());
			pj.stats.intuicion = parseInt($("#tir5").text());
			pj.stats.presencia = parseInt($("#tir6").text());
			pj.stats.apariencia = parseInt($("#tir7").text());
			if ($("#checkprimario").is(":checked"))
				pj.stats[statPrimario] = 90;
			
			//puntos de poder
			if (pj.profesion == "Mago" || pj.profesion == "Bardo") {
				pj.dominio = "ESE";
				pj.puntosPoder = puntosPoder(pj.stats.inteligencia, 1);
			}
			else if (pj.profesion == "Animista" || pj.profesion == "Montaraz" ) {
				pj.dominio = "CAN";
				pj.puntosPoder = puntosPoder(pj.stats.intuicion, 1);
			}
			pj.poderMaximo = pj.puntosPoder;
			console.log(pj.poderMaximo);
			console.log(pj.puntosPoder);
			//pasar "pagina"
			$("#sec_tiradas").toggle();
			$("#sec_adol").toggle();
			
			
			
			
			$.getJSON("estatico/razas.json", function (razas) {
				//bonos raciales a atributos
				pj.bonoRacial.fuerza = razas[pj.raza].bonoAtributos.fuerza; 
				pj.bonoRacial.agilidad = razas[pj.raza].bonoAtributos.agilidad;
				pj.bonoRacial.constitucion = razas[pj.raza].bonoAtributos.constitucion;
				pj.bonoRacial.inteligencia = razas[pj.raza].bonoAtributos.inteligencia;
				pj.bonoRacial.intuicion = razas[pj.raza].bonoAtributos.intuicion;
				pj.bonoRacial.presencia = razas[pj.raza].bonoAtributos.presencia;
				//habilidades (bono racial + bono claseo)
				pj.habilidades.sinArmadura = minHabilidad.sinArmadura = razas[pj.raza].habAdol.sinArmadura;
				pj.habilidades.cuero = minHabilidad.cuero = razas[pj.raza].habAdol.cuero;
				pj.habilidades.cueroEndurecido = minHabilidad.cueroEndurecido = razas[pj.raza].habAdol.cueroEndurecido;
				pj.habilidades.cotaMalla = minHabilidad.cotaMalla = razas[pj.raza].habAdol.cotaMalla;
				pj.habilidades.filo = minHabilidad.filo = razas[pj.raza].habAdol.filo;
				pj.habilidades.contundente = minHabilidad.contundente = parseInt(razas[pj.raza].habAdol.contundente);
				pj.habilidades.dosManos = minHabilidad.dosManos = parseInt(razas[pj.raza].habAdol.dosManos) ;
				pj.habilidades.arrojadizas = minHabilidad.arrojadizas = parseInt(razas[pj.raza].habAdol.arrojadizas);
				pj.habilidades.proyectiles = minHabilidad.proyectiles = parseInt(razas[pj.raza].habAdol.proyectiles) ;
				pj.habilidades.asta = minHabilidad.asta = parseInt(razas[pj.raza].habAdol.asta);
				pj.habilidades.trepar = minHabilidad.trepar = parseInt(razas[pj.raza].habAdol.trepar);
				pj.habilidades.montar = minHabilidad.montar = parseInt(razas[pj.raza].habAdol.montar);
				pj.habilidades.nadar = minHabilidad.nadar = parseInt(razas[pj.raza].habAdol.nadar);
				pj.habilidades.emboscar = minHabilidad.emboscar = parseInt(razas[pj.raza].habAdol.emboscar);
				pj.habilidades.acecharEsconderse = minHabilidad.acecharEsconderse = parseInt(razas[pj.raza].habAdol.acecharEsconderse);
				pj.habilidades.abrirCerraduras = minHabilidad.abrirCerraduras = parseInt(razas[pj.raza].habAdol.abrirCerraduras);
				pj.habilidades.desactivarTrampas = minHabilidad.desactivarTrampas = parseInt(razas[pj.raza].habAdol.desactivarTrampas);
				pj.habilidades.leerRunas = minHabilidad.leerRunas = parseInt(razas[pj.raza].habAdol.leerRunas);
				pj.habilidades.objetosMagicos = minHabilidad.objetosMagicos = parseInt(razas[pj.raza].habAdol.objetosMagicos);
				pj.desarrolloFisico = parseInt(razas[pj.raza].habAdol.desarrolloFisico) + parseInt(pj.bonificacionesProfesion.desarrolloFisico);
				pj.percepcion = parseInt(razas[pj.raza].habAdol.percepcion);
				pj.probListaSortilegios = razas[pj.raza].habAdol.probListaSortilegios;
				pj.gradosAdicionalesIdiomas = razas[pj.raza].habAdol.gradosAdicionalesIdiomas;
				pj.puntosHistorial = razas[pj.raza].habAdol.puntosHistorial;
				pj.tr.ese = razas[pj.raza].bonoTR.ese;
				pj.tr.can = razas[pj.raza].bonoTR.can;
				pj.tr.ve = razas[pj.raza].bonoTR.ve;
				pj.tr.enf = razas[pj.raza].bonoTR.enf;

				$("#sinArmadura").text(pj.habilidades.sinArmadura);
				$("#cuero").text(pj.habilidades.cuero);
				$("#cueroEndurecido").text(pj.habilidades.cueroEndurecido);
				$("#cotaMalla").text(pj.habilidades.cotaMalla);
				$("#coraza").text(pj.habilidades.coraza);
				$("#filo").text(pj.habilidades.filo);
				$("#contundente").text(pj.habilidades.contundente);
				$("#dosManos").text(pj.habilidades.dosManos);
				$("#arrojadizas").text(pj.habilidades.arrojadizas);
				$("#proyectiles").text(pj.habilidades.proyectiles);
				$("#asta").text(pj.habilidades.asta);
				$("#trepar").text(pj.habilidades.trepar);
				$("#montar").text(pj.habilidades.montar);
				$("#nadar").text(pj.habilidades.nadar);
				$("#rastrear").text(pj.habilidades.rastrear);
				$("#emboscar").text(pj.habilidades.emboscar);
				$("#acecharEsconderse").text(pj.habilidades.acecharEsconderse);
				$("#abrirCerraduras").text(pj.habilidades.abrirCerraduras);
				$("#desactivarTrampas").text(pj.habilidades.desactivarTrampas);
				$("#leerRunas").text(pj.habilidades.leerRunas);
				$("#objetosMagicos").text(pj.habilidades.objetosMagicos);
				$("#sortilegiosDirigidos").text(pj.habilidades.sortilegiosDirigidos);
				$("#desarrolloFisico").text(pj.desarrolloFisico);
				$("#percepcion").text(pj.percepcion);
				
				$("#puntosPoder").text(pj.puntosPoder);
				$("#gradosAdicionalesIdiomas").text(pj.gradosAdicionalesIdiomas);
				$("#puntosHistorial").text(pj.puntosHistorial);
				$("#sortilegiosBase").text(pj.sortilegiosBase);
				//puntos para asignar
				$("#movimiento").text(puntosAsignar.movimiento);
				$("#armas").text(puntosAsignar.armas);
				$("#generales").text(puntosAsignar.generales);
				$("#subterfugio").text(puntosAsignar.subterfugio);
				$("#magicas").text(puntosAsignar.magicas);
				$("#puntosLista").text(puntosAsignar.lista);
				
				//bonos totales de las caracteristicas
				
				pj.bonoTotal.fuerza =  bonoCaracteristicaTotal (pj.stats.fuerza, pj.bonoRacial.fuerza); 
				pj.bonoTotal.agilidad =  bonoCaracteristicaTotal (pj.stats.agilidad, pj.bonoRacial.agilidad); 
				pj.bonoTotal.constitucion =  bonoCaracteristicaTotal (pj.stats.constitucion, pj.bonoRacial.constitucion); 
				pj.bonoTotal.inteligencia =  bonoCaracteristicaTotal (pj.stats.inteligencia, pj.bonoRacial.inteligencia); 
				pj.bonoTotal.intuicion =  bonoCaracteristicaTotal (pj.stats.intuicion, pj.bonoRacial.intuicion); 
				pj.bonoTotal.presencia =  bonoCaracteristicaTotal (pj.stats.presencia, pj.bonoRacial.presencia); 
				//a la apariencia final se suma el bono de presencia
				pj.stats.apariencia = pj.stats.aparienciaBase + pj.bonoTotal.presencia; 
				//lo mostramos en el resumen
				
				$("#rraza").text(pj.raza);
				$("#rprof").text(pj.profesion);
				$("#rfue").text(pj.stats.fuerza	);
				$("#ragi").text(pj.stats.agilidad	);
				$("#rcon").text(pj.stats.constitucion	);
				$("#rint").text(pj.stats.inteligencia	);
				$("#ri").text(pj.stats.intuicion	);
				$("#rpre").text(pj.stats.presencia	);
				$("#bnfue").text(parseInt(pj.bonoTotal.fuerza) - parseInt(pj.bonoRacial.fuerza));
				$("#bnagi").text(parseInt(pj.bonoTotal.agilidad) - parseInt(pj.bonoRacial.agilidad));
				$("#bncon").text(pj.bonoTotal.constitucion - pj.bonoRacial.constitucion);
				$("#bnint").text(pj.bonoTotal.inteligencia - pj.bonoRacial.inteligencia);
				$("#bni").text(pj.bonoTotal.intuicion - pj.bonoRacial.intuicion);
				$("#bnpre").text(pj.bonoTotal.presencia - pj.bonoRacial.presencia);
				$("#brfue").text(pj.bonoRacial.fuerza);
				$("#bragi").text(pj.bonoRacial.agilidad);
				$("#brcon").text(pj.bonoRacial.constitucion);
				$("#brint").text(pj.bonoRacial.inteligencia);
				$("#bri").text(pj.bonoRacial.intuicion);
				$("#brpre").text(pj.bonoRacial.presencia);
				$("#btfue").text(pj.bonoTotal.fuerza);
				$("#btagi").text(pj.bonoTotal.agilidad);
				$("#btcon").text(pj.bonoTotal.constitucion);
				$("#btint").text(pj.bonoTotal.inteligencia);
				$("#bti").text(pj.bonoTotal.intuicion);
				$("#btpre").text(pj.bonoTotal.presencia);

				$("#rapa").text(pj.stats.aparienciaBase);
				$("#bapa").text(pj.bonoTotal.presencia);

				$("#ese").text(pj.tr.ese);
				$("#can").text(pj.tr.can);
				$("#ve").text(pj.tr.ve);
				$("#enf").text(pj.tr.enf);
				
				
			});
			
			$.getJSON("estatico/magia.json", function(magia) {
				
				if (pj.profesion !== "Guerrero" && pj.profesion !=="Explorador"){

					if (pj.dominio == "ESE"){
						$(".magiaON").show(); //se muestra la tabla de listas de sortilegios
						//Se añaden las listas de esencia
						for (var lista in magia.Esencia){
							if (magia.Esencia[lista].imp != -1){ //si imp = -1 la lista aun no está implementada y no se muestra
								$('#tablaMagia').append("<tr><td class='w3-center' id='"+ lista +"'>"+ magia.Esencia[lista].nombre +"</td><td id='n"+ lista +"' class='w3-center'>"+ pj.listas[lista]+"</td></tr>");
								var nombreLista = lista;
								
								//$('#'+lista).bind('click', {item : magia.Esencia[lista].nombre},  function(event){
								$('#'+lista).bind('click', {item : nombreLista},  function(event){
									incrementarHabilidad(event.data.item);
																		
								});
								$('#'+lista).bind('contextmenu', {item : nombreLista},  function(event){
									decrementarHabilidad(event.data.item);
									return false;
									
								});
								
							}
						}
						
					} else if (pj.dominio == "CAN"){
						$(".magiaON").show(); //se muestra la tabla de listas de sortilegios
						//Se añaden las listas de canalizacion
						for (var lista in magia.Canalizacion){
							if (magia.Canalizacion[lista].imp != -1){ //si imp = -1 la lista aun no está implementada y no se muestra
								$('#tablaMagia').append("<tr><td class='w3-center' id='"+ lista +"'>"+ magia.Canalizacion[lista].nombre +"</td><td id='n"+ lista +"' class='w3-center'>"+ pj.listas[lista]+"</td></tr>");
								var nombreLista = lista;
								$('#'+lista).bind('click', {item : nombreLista},  function(event){
									incrementarHabilidad(event.data.item);
									
								});
								$('#'+lista).bind('contextmenu', {item : nombreLista},  function(event){
									decrementarHabilidad(event.data.item);
									return false;
									
								});
							}
						}
					}
					//Se añaden las listas claseas
					
					for (var lista in magia[pj.profesion]){
						if (magia[pj.profesion][lista].imp != -1){ //si imp = -1 la lista aun no está implementada y no se muestra
							$('#tablaMagia').append("<tr><td class='w3-center' id='"+ lista +"'>"+ magia[pj.profesion][lista].nombre +"</td><td id='n"+ lista +"' class='w3-center'>"+ pj.listas[lista]+"</td></tr>");
							var nombreLista = lista;
							$('#'+lista).bind('click', {item : nombreLista},  function(event){
								incrementarHabilidad(event.data.item);
							});
							$('#'+lista).bind('contextmenu', {item : nombreLista},  function(event){
								decrementarHabilidad(event.data.item);
								return false;
								
							});
						}
					}
					
				}

			});
			
			
		});
		
		$("#btn_nombre").click(function(){

			
			if(puntosAsignar.movimiento == 0 && puntosAsignar.armas == 0 &&	puntosAsignar.generales == 0 &&	puntosAsignar.subterfugio == 0 && 
					puntosAsignar.magicas == 0 && $("#nombre").val().length > 1) {
				pj.nombre = escapeHtml($("#nombre").val());
				pj.vida = 5;
				for (var k = 0; k < pj.desarrolloFisico; k++) {
					pj.vida += Math.floor((Math.random() * 10) + 1); //1d10 por punto de desarrollo
				}
				//ultimos datos
				//vida
				pj.vida += pj.bonoTotal.constitucion; //se le suma el bono de constitucion
				pj.vidaMaxima = pj.vida;
				//bonos habilidades
				pj.bHabilidad.sinArmadura = bonoHabilidad(pj.habilidades.sinArmadura, pj.bonoTotal.agilidad);
				pj.bHabilidad.cuero = bonoHabilidad(pj.habilidades.cuero, pj.bonoTotal.agilidad, -15); 
				pj.bHabilidad.cueroEndurecido = bonoHabilidad(pj.habilidades.cueroEndurecido, pj.bonoTotal.fuerza, -30); 
				pj.bHabilidad.cotaMalla = bonoHabilidad(pj.habilidades.cotaMalla, pj.bonoTotal.fuerza, -45); 
				pj.bHabilidad.coraza = bonoHabilidad(pj.habilidades.coraza, pj.bonoTotal.fuerza, -60); 
				pj.bHabilidad.filo = bonoHabilidad(pj.habilidades.filo, pj.bonoTotal.fuerza, pj.bonificacionesProfesion.armas);
				pj.bHabilidad.contundente = bonoHabilidad(pj.habilidades.contundente, pj.bonoTotal.fuerza, pj.bonificacionesProfesion.armas);
				pj.bHabilidad.dosManos = bonoHabilidad(pj.habilidades.dosManos, pj.bonoTotal.fuerza, pj.bonificacionesProfesion.armas);
				pj.bHabilidad.arrojadizas = bonoHabilidad(pj.habilidades.arrojadizas, pj.bonoTotal.agilidad, pj.bonificacionesProfesion.armas);
				pj.bHabilidad.proyectiles = bonoHabilidad(pj.habilidades.proyectiles, pj.bonoTotal.agilidad, pj.bonificacionesProfesion.armas);
				pj.bHabilidad.asta = bonoHabilidad(pj.habilidades.asta, pj.bonoTotal.fuerza, pj.bonificacionesProfesion.armas);
				pj.bHabilidad.emboscar = bonoHabilidad(pj.habilidades.emboscar);
				pj.bHabilidad.acecharEsconderse = bonoHabilidad(pj.habilidades.acecharEsconderse, pj.bonoTotal.presencia, parseInt(pj.bonificacionesProfesion.subterfugio) + parseInt(pj.bonificacionesProfesion.acecharEsconderse));
				pj.bHabilidad.abrirCerraduras = bonoHabilidad(pj.habilidades.abrirCerraduras, pj.bonoTotal.inteligencia, pj.bonificacionesProfesion.subterfugio);
				pj.bHabilidad.desactivarTrampas = bonoHabilidad(pj.habilidades.desactivarTrampas, pj.bonoTotal.intuicion, pj.bonificacionesProfesion.subterfugio);
				pj.bHabilidad.trepar = bonoHabilidad(pj.habilidades.trepar, pj.bonoTotal.agilidad, pj.bonificacionesProfesion.generales);
				pj.bHabilidad.montar = bonoHabilidad(pj.habilidades.montar, pj.bonoTotal.intuicion, pj.bonificacionesProfesion.generales);
				pj.bHabilidad.nadar = bonoHabilidad(pj.habilidades.nadar, pj.bonoTotal.agilidad, pj.bonificacionesProfesion.generales);
				pj.bHabilidad.rastrear = bonoHabilidad(pj.habilidades.rastrear, pj.bonoTotal.inteligencia, pj.bonificacionesProfesion.generales);
				
				pj.bHabilidad.leerRunas = bonoHabilidad(pj.habilidades.leerRunas, pj.bonoTotal.inteligencia, parseInt(pj.bonificacionesProfesion.magicas) + parseInt(pj.bonificacionesProfesion.leerRunas));
				pj.bHabilidad.objetosMagicos = bonoHabilidad(pj.habilidades.objetosMagicos, pj.bonoTotal.intuicion, parseInt(pj.bonificacionesProfesion.magicas) + parseInt(pj.bonificacionesProfesion.objetosMagicos));
				pj.bHabilidad.sortilegiosDirigidos = bonoHabilidad(pj.habilidades.sortilegiosDirigidos, pj.bonoTotal.agilidad, pj.bonificacionesProfesion.magicas);
				
				pj.bHabilidad.esencia = parseInt(pj.tr.ese) + parseInt(pj.bonoTotal.inteligencia);
				pj.bHabilidad.canalizacion = parseInt(pj.tr.can) + parseInt(pj.bonoTotal.intuicion);
				pj.bHabilidad.veneno = parseInt(pj.tr.ve) + parseInt(pj.bonoTotal.constitucion);
				pj.bHabilidad.enfermedad = parseInt(pj.tr.enf) + parseInt(pj.bonoTotal.constitucion);
				pj.bHabilidad.percepcion = bonoHabilidad(pj.percepcion, pj.bonoTotal.intuicion, pj.bonificacionesProfesion.percepcion);
				//Cálculo de aprendizaje de listas de sortilegios
				for (var posibleLista in pj.listas){
					if (pj.listas[posibleLista] != 0 && pj.listas[posibleLista] != 5){ //si tiene algun punto y si no esta ya aprendida
						if (pj.listas[posibleLista]*20 > Math.floor((Math.random() * 100) + 1)){ //numero entre 1 y 100
							pj.listas[posibleLista] = 5; //se aprende la lista 
						}
								
					}
				}

				//se crea la cadena JSON
				var cadenajson = JSON.stringify(pj, null, 4);
				//ver si caen conjuros
				//emitimos evento para guardar el pj
				socket.emit('crearPJ', {personaje: cadenajson, nusuario : php_nUsuario, id: php_idPartida}, function() {
				
					location.href = 'jugar.php?id='+php_idPartida;
				
				});
			}
			else 
				alert("Distribuye todos los puntos restantes y rellena el nombre del personaje");

			
			
		});
		
	});
	//fin de onready
	
	//drag and drop de los atributos
	
   	function allowDrop(ev) {
   	    ev.preventDefault();
   	}
   	function drag(ev) {

   		ev.dataTransfer.setData('text/html', ev.target.id);
   	}

   	function drop(ev) {
   	    ev.preventDefault();
   		var data = ev.dataTransfer.getData('text/html');
   		var datacop = document.getElementById(data).innerHTML;
		
		document.getElementById(data).innerHTML = $(ev.target).text();
		$(ev.target).text(datacop);

   	}
	//el parametro habilidad es la cadena que contiene el nombre de la habilidad
   	function incrementarHabilidad(habilidad) {
   	   	
   		
   	   	switch (habilidad){
   	   	/* Las habilidades de movimiento tienen un valor máximo
   	   		Sin armadura: 2
   	   		Cuero: 3
   	   		Cuero endurecido: 5
   	   		Malla: 7
   	   		Coraza: 9   	   	
   	   	*/
   	   	
   	   	case 'sinArmadura' :
	   	   	if (puntosAsignar.movimiento > 0 && pj.habilidades[habilidad] < 2) {
		   	   	pj.habilidades[habilidad]++;
			    $("#"+habilidad).text(pj.habilidades[habilidad]);
			    puntosAsignar.movimiento--;
			    $("#movimiento").text(puntosAsignar.movimiento);
		   	   	}
		   	   	break;
   	   	case 'cuero' :
	   	   	if (puntosAsignar.movimiento > 0 && pj.habilidades[habilidad] < 3) {
		   	   	pj.habilidades[habilidad]++;
			    $("#"+habilidad).text(pj.habilidades[habilidad]);
			    puntosAsignar.movimiento--;
			    $("#movimiento").text(puntosAsignar.movimiento);
		   	   	}
		   	   	break;
   	   	case 'cueroEndurecido' : 
	   	   	if (puntosAsignar.movimiento > 0 && pj.habilidades[habilidad] < 5) {
		   	   	pj.habilidades[habilidad]++;
			    $("#"+habilidad).text(pj.habilidades[habilidad]);
			    puntosAsignar.movimiento--;
			    $("#movimiento").text(puntosAsignar.movimiento);
		   	   	}
		   	   	break;
   	   	case 'cotaMalla' :
	   	   	if (puntosAsignar.movimiento > 0 && pj.habilidades[habilidad] < 7) {
		   	   	pj.habilidades[habilidad]++;
			    $("#"+habilidad).text(pj.habilidades[habilidad]);
			    puntosAsignar.movimiento--;
			    $("#movimiento").text(puntosAsignar.movimiento);
		   	   	}
		   	   	break;
   	   	case 'coraza' :
   	   	   	if (puntosAsignar.movimiento > 0 && pj.habilidades[habilidad] < 9) {
		   	   	pj.habilidades[habilidad]++;
			    $("#"+habilidad).text(pj.habilidades[habilidad]);
			    puntosAsignar.movimiento--;
			    $("#movimiento").text(puntosAsignar.movimiento);
   	   	   	}
   	   	   	break;
   	   	case 'filo' :
   	   	case 'contundente' :
   	   	case 'dosManos' : 
   	   	case 'arrojadizas' :
   	   	case 'proyectiles' :
   	   	case 'asta' :
	   	   	if (puntosAsignar.armas > 0 && pj.habilidades[habilidad] == minHabilidad[habilidad]){ //primera vez que sube
		   	   	pj.habilidades[habilidad]++;
			    $("#"+habilidad).text(pj.habilidades[habilidad]);
			    puntosAsignar.armas--;
			    $("#armas").text(puntosAsignar.armas);
		   	}
		   	else if (puntosAsignar.armas > 1 && pj.habilidades[habilidad] == minHabilidad[habilidad] + 1) { //ya ha subido una vez
		   	   	pj.habilidades[habilidad]++;
			    $("#"+habilidad).text(pj.habilidades[habilidad]);
			    puntosAsignar.armas-=2;
			    $("#armas").text(puntosAsignar.armas);
		   	}
		   	//si ya ha subido dos veces no puede mas
	   	   	
		   	break;
   	   	case 'trepar' :
   	   	case 'montar' :
   	   	case 'nadar' : 
   	   	case 'rastrear' :
	   	   	if (puntosAsignar.generales > 0 && pj.habilidades[habilidad] == minHabilidad[habilidad]){ //primera vez que sube
		   	   	pj.habilidades[habilidad]++;
			    $("#"+habilidad).text(pj.habilidades[habilidad]);
			    puntosAsignar.generales--;
			    $("#generales").text(puntosAsignar.generales);
		   	}
		   	else if (puntosAsignar.generales > 1 && pj.habilidades[habilidad] == minHabilidad[habilidad] + 1) { //ya ha subido una vez
		   	   	pj.habilidades[habilidad]++;
			    $("#"+habilidad).text(pj.habilidades[habilidad]);
			    puntosAsignar.generales-=2;
			    $("#generales").text(puntosAsignar.generales);
		   	}
		   	   	break;
   	   	case 'emboscar' :
   	   	case 'acecharEsconderse' :
   	   	case 'abrirCerraduras' : 
   	   	case 'desactivarTrampas' :
	   	   	if (puntosAsignar.subterfugio > 0 && pj.habilidades[habilidad] == minHabilidad[habilidad]){ //primera vez que sube
		   	   	pj.habilidades[habilidad]++;
			    $("#"+habilidad).text(pj.habilidades[habilidad]);
			    puntosAsignar.subterfugio--;
			    $("#subterfugio").text(puntosAsignar.subterfugio);
		   	}
		   	else if (puntosAsignar.subterfugio > 1 && pj.habilidades[habilidad] == minHabilidad[habilidad] + 1) { //ya ha subido una vez
		   	   	pj.habilidades[habilidad]++;
			    $("#"+habilidad).text(pj.habilidades[habilidad]);
			    puntosAsignar.subterfugio-=2;
			    $("#subterfugio").text(puntosAsignar.subterfugio);
		   	}
		   	   	break;
   	   	case 'leerRunas' :
   	   	case 'objetosMagicos' :
   	   	case 'sortilegiosDirigidos' : 
	   	   	if (puntosAsignar.magicas > 0 && pj.habilidades[habilidad] == minHabilidad[habilidad]){ //primera vez que sube
		   	   	pj.habilidades[habilidad]++;
			    $("#"+habilidad).text(pj.habilidades[habilidad]);
			    puntosAsignar.magicas--;
			    $("#magicas").text(puntosAsignar.magicas);
		   	}
		   	else if (puntosAsignar.magicas > 1 && pj.habilidades[habilidad] == minHabilidad[habilidad] + 1) { //ya ha subido una vez
		   	   	pj.habilidades[habilidad]++;
			    $("#"+habilidad).text(pj.habilidades[habilidad]);
			    puntosAsignar.magicas-=2;
			    $("#magicas").text(puntosAsignar.magicas);
		   	}
		   	   	break;
		//Listas de sortilegios
   	   	case 'DominioEspiritual' : 	
   	   	case 'DefensaContraSortilegios' : 
   	   	case 'LeyDelFuego' : 
   	   	case 'CanalizacionDirecta' : 
   	   	case 'ManerasDeLaNaturaleza' : 
   	   	case 'CancionesDeControl' : 
   	   		
		   	if (puntosAsignar.lista > 0 && pj.listas[habilidad] < 5) {
		   	   	pj.listas[habilidad]++;
			    $("#n" + habilidad).text(pj.listas[habilidad]);
			    puntosAsignar.lista--;
			    $("#puntosLista").text(puntosAsignar.lista);
		   	}
		   	break;
		   	
		   	
   	   	}
	
   	}
	function decrementarHabilidad(habilidad) {
   	   	
   		
   	   	switch (habilidad){
   	   	case 'sinArmadura' :
   	   	case 'cuero' :
   	   	case 'cueroEndurecido' : 
   	   	case 'cotaMalla' :
   	   	case 'coraza' :
   	   	   	if (pj.habilidades[habilidad] != minHabilidad[habilidad]) {
		   	   	pj.habilidades[habilidad]--;
			    $("#"+habilidad).text(pj.habilidades[habilidad]);
			    puntosAsignar.movimiento++;
			    $("#movimiento").text(puntosAsignar.movimiento);
   	   	   	}
   	   	   	break;
   	   	case 'filo' :
   	   	case 'contundente' :
   	   	case 'dosManos' : 
   	   	case 'arrojadizas' :
   	   	case 'proyectiles' :
   	   	case 'asta' :
   	   		if (pj.habilidades[habilidad] == minHabilidad[habilidad] +1) {
		   	   	pj.habilidades[habilidad]--;
			    $("#"+habilidad).text(pj.habilidades[habilidad]);
			    puntosAsignar.armas++;
			    $("#armas").text(puntosAsignar.armas);
	   	   	} else if (pj.habilidades[habilidad] == minHabilidad[habilidad] +2) {
		   	   	pj.habilidades[habilidad]--;
			    $("#"+habilidad).text(pj.habilidades[habilidad]);
			    puntosAsignar.armas+= 2;
			    $("#armas").text(puntosAsignar.armas);
	   	   	}
		   	   	break;
   	   	case 'trepar' :
   	   	case 'montar' :
   	   	case 'nadar' : 
   	   	case 'rastrear' :
   	   		if (pj.habilidades[habilidad] == minHabilidad[habilidad] +1) {
		   	   	pj.habilidades[habilidad]--;
			    $("#"+habilidad).text(pj.habilidades[habilidad]);
			    puntosAsignar.generales++;
			    $("#generales").text(puntosAsignar.generales);
	   	   	} else if (pj.habilidades[habilidad] == minHabilidad[habilidad] +2) {
		   	   	pj.habilidades[habilidad]--;
			    $("#"+habilidad).text(pj.habilidades[habilidad]);
			    puntosAsignar.generales+= 2;
			    $("#generales").text(puntosAsignar.generales);
	   	   	}
		   	   	break;
   	   	case 'emboscar' :
   	   	case 'acecharEsconderse' :
   	   	case 'abrirCerraduras' : 
   	   	case 'desactivarTrampas' :
   	   		if (pj.habilidades[habilidad] == minHabilidad[habilidad] +1) {
		   	   	pj.habilidades[habilidad]--;
			    $("#"+habilidad).text(pj.habilidades[habilidad]);
			    puntosAsignar.subterfugio++;
			    $("#subterfugio").text(puntosAsignar.subterfugio);
	   	   	} else if (pj.habilidades[habilidad] == minHabilidad[habilidad] +2) {
		   	   	pj.habilidades[habilidad]--;
			    $("#"+habilidad).text(pj.habilidades[habilidad]);
			    puntosAsignar.subterfugio+= 2;
			    $("#subterfugio").text(puntosAsignar.subterfugio);
	   	   	}
		   	   	break;
   	   	case 'leerRunas' :
   	   	case 'objetosMagicos' :
   	   	case 'sortilegiosDirigidos' : 
   	   		if (pj.habilidades[habilidad] == minHabilidad[habilidad] +1) {
		   	   	pj.habilidades[habilidad]--;
			    $("#"+habilidad).text(pj.habilidades[habilidad]);
			    puntosAsignar.magicas++;
			    $("#magicas").text(puntosAsignar.magicas);
	   	   	} else if (pj.habilidades[habilidad] == minHabilidad[habilidad] +2) {
		   	   	pj.habilidades[habilidad]--;
			    $("#"+habilidad).text(pj.habilidades[habilidad]);
			    puntosAsignar.magicas+= 2;
			    $("#magicas").text(puntosAsignar.magicas);
	   	   	}
	   	   	break;
	   	   	
	   	//Listas de sortilegios
  	   	case 'DominioEspiritual' : 	
   	   	case 'DefensaContraSortilegios' : 
   	   	case 'LeyDelFuego' : 
   	   	case 'CanalizacionDirecta' : 
   	   	case 'ManerasDeLaNaturaleza' : 
   	   	case 'CancionesDeControl' : 
   	   		
		   	if (pj.listas[habilidad] != 0) {
		   	   	pj.listas[habilidad]--;
			    $("#n" + habilidad).text(pj.listas[habilidad]);
			    puntosAsignar.lista++;
			    $("#puntosLista").text(puntosAsignar.lista);
		   	}
		   	break;
		   	
		   	default: console.log("Error en habilidades");
   	   	   	 
   	   	}
   	   	
	
   	}