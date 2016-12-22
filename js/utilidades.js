/** Pequeña libreria de utilidades para Rol Tierra Media Online
 *  
 */ 

/*	Función para subir experiencia a un personaje. Determina la experiencia total, si el personaje sube de nivel y a qué nivel.
 * Recibe expActual (entero con la exp que tiene el personaje antes de la subida) y expSubir (cantidad a añadir)
 * Devuelve objeto con 3 atributos: expTotal (cantidad total de exp), haSubido (booleano true si ha subido de nivel), nivel (nivel final del personaje)
 */
function subirExp(expActual, expSubir){
	var nivelAntiguo = determinarNivel(expActual);
	var nuevaExp = expActual + expSubir;
	var nivelNuevo = determinarNivel(nuevaExp);
	var haSubido = false;
	
	if (nivelAntiguo != nivelNuevo)
		haSubido = true;
	
	return {expTotal: nuevaExp, haSubido: haSubido, nivel: nivelNuevo};
}

/*	Dada una experiencia, determina a que nivel corresponde y devuelve ese valor
 * 
 */
function determinarNivel(exp){
	var nivel;
	if (exp < 20000)
		nivel = 1;
	else if(exp <30000)
		nivel = 2;
	else if(exp <40000)
		nivel = 3;
	else if (exp < 50000)
		nivel = 4;
	else if (exp < 70000)
		nivel = 5;
	else if (exp < 90000)
		nivel = 6;
	else if (exp < 110000)
		nivel = 7;
	else if (exp < 130000)
		nivel = 8;
	else if (exp < 150000)
		nivel = 9;
	else 
		nivel = 10;
	return nivel;
}

/* Dado el nombre de una habilidad tal y como se declara en una ficha de personaje
 * Devuelve el nombre de la categoria de la habilidad en minusculas.
 */
function tipoHabilidad(habilidad){
	var tipo;
	switch(habilidad){
	case "sinArmadura":
	case "cuero":
	case "cueroEndurecido":
	case "cotaMalla":
	case "coraza":
		tipo = "movimiento";
		break;
	case "filo":
	case "contundente":
	case "dosManos":
	case "proyectiles":
	case "arrojadizas":
	case "asta":
		tipo = "armas";
		break;
	case "trepar":
	case "montar":
	case "nadar":
	case "rastrear":
		tipo = "generales"; 
		break;
	case "emboscar":
	case "acecharEsconderse":
	case "abrirCerraduras":
	case "desactivarTrampas":
		tipo = "subterfugio";
		break;
	case "leerRunas" :
	case "objetosMagicos" :
	case "sortilegiosDirigidos" :
		tipo = "magicas";
		break;
	}	
	return tipo;
}

//recibe el numero correspondiente a su estadistica y el bono de su raza
function bonoCaracteristicaTotal (atributo, raza) {
	
	var car;
	var stat = parseInt(atributo);
	var vraza = parseInt(raza);
	if (stat < 2)
		car = -25;
	else if (stat == 2)
		car = -20;
	else if (stat <= 4)
		car = -15;
	else if (stat <= 9)
		car = -10;
	else if (stat <= 24)
		car = -5;
	else if (stat <= 74)
		car = 0;
	else if (stat <= 89)
		car = 5;
	else if (stat <= 94)
		car = 10;
	else if (stat <= 97)	
		car = 15;
	else if (stat <= 99)
		car = 20;
	else if (stat <= 100)
		car = 25;
	else if (stat == 101)
		car = 30;
	else //mayor o igual a 102
		car = 35;
	
	return car + vraza;
	
}

/* devuelve el bono completo de una habilidad
 * recibe:
 * grados - el numero de grados en la habilidad
 * atr (opcional) - el bono del atributo correspondiente 
 * prof (opcional) - el bono de profesion si hay, o penalizador de movimiento si es habilidad de movimiento
 */
function bonoHabilidad(grados, atr, prof){
	var bonoGrados;
	
	//valores por defecto
	if (atr === undefined) {
        atr = 0;
    }
	if (prof === undefined) {
        prof = 0;
    }
	//traduccion de grados de habilidad a bonificador
	if (grados == 0)
		bonoGrados = -25;
	else if (grados > 0 && grados <= 10) 
		bonoGrados = grados * 5;
	else if (grados > 10 && grados <= 20) 
		bonoGrados = 50 + (grados-10)*2;
	else //grados > 20
		bonoGrados = 70 + (grados-20);
	
	return bonoGrados + parseInt(atr) + parseInt(prof);
}
//devuelve el numero de puntos de poder que tiene un personaje dado un atributo primario y el nivel de personaje (Tabla BT-1)
function puntosPoder (stat, nivel){
	if (stat < 75)
		return 0;
	else if (stat >= 75 && stat < 95)
		return nivel;
	else if(stat >= 95 && stat < 100)
		return nivel * 2;
	else if(stat >= 100 && stat < 102)
		return nivel * 3;
	else //mayor de 34
		return nivel * 4;
}
//reemplaza caracteres conflictivos con HTML
function escapeHtml(texto) {
	var map = {
		'&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#039;'
	    };

	return texto.replace(/[&<>"']/g, function(m) { return map[m]; });
}
//función que devuelve cadena del nombre de una acción dado su tipo en número
function nombreAccion(tipo){
	var accionTexto;
	switch(tipo){
		case 1: accionTexto = "Preparar Sortilegio";
			break;
		case 2: accionTexto = "Realizar Sortilegio";
			break;
		case 3: accionTexto = "Atacar a distancia";
			break;
		case 4: accionTexto = "Atacar cuerpo a cuerpo";
			break;
		case 5: accionTexto = "Movimiento";
			break;
		default: accionTexto = "No realiza ninguna acción";
			break;
	}
	return accionTexto;
}

/*función que devuelve el nombre de una armadura dado su codigo en los ficheros json*/
function nombreArmadura(tipoArmadura){
	var nombre;
	switch(tipoArmadura){
		case "sinArmadura": nombre = "Sin Armadura";
			break;
		case "cuero": nombre = "Cuero";
			break;
		case "cueroEndurecido": nombre = "Cuero Endurecido";
			break;
		case "cotaMalla": nombre = "Cota de Mallas";
			break;
		case "coraza": nombre = "Coraza";
			break;
		default: nombre = "Sin Armadura"
			break;
	}
	return nombre;
}

/* función que devuelve el nombre de un tipo de ataque de npc dado su codigo en los ficheros json */
function nombreAtaque(ataque){
	var nombre;
	switch(ataque){
		case "picoPinzas": nombre = "Pico/Pinzas";
			break;
		case "mordisco": nombre = "Mordisco";
			break;
		case "topetazo": nombre = "Topetazo";
			break;
		case "garra": nombre = "Garra";
			break;
		default: nombre = "Arma filo"
			break;
	}
	return nombre;
}















