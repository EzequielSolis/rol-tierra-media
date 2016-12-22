# rol-tierra-media
Juego Online de Rol Tierra Media basado en el sistema MERP de Iron Crown Enterprises.

Plataforma que permite jugar partidas online mediante un navegador web con varios jugadores simultáneamente al juego de rol “El Señor de los Anillos” (Middle Earth Role Playing). Para ello se dispone de una base de datos conteniendo usuarios y partidas, herramientas de creación y búsqueda de partidas para usuarios registrados y una zona de juego en la que tras crear cada jugador su personaje con los atributos seleccionados, los usuarios podrán utilizar un chat, un mapa con casillas hexagonales dónde se representan a los personajes del juego y una serie de opciones según el usuario sea jugador o creador de la partida. El chat, la actualización del mapa según las acciones de los jugadores y el flujo de juego mediante turnos se realizan mediante paso de mensajes que se gestionan desde un servidor que captura y envía eventos ejecutando las operaciones adecuadas para cada partida y jugador ejecutándose concurrentemente.

Para instalarlo en un servidor web es necesario:

1) Crear la base de datos contenida en /db

2) Introducir los datos de acceso de dicha base de datos en loginDB.php

3) Instalar Node.js con todas las dependencias necesarias (express, socket.io y chance.js)

4) Abrir el puerto 8080 del router que de acceso al servidor web (puede usarse otro puerto modificando el parametro de server.listen() en server.js)

5) Modificar el dns objetivo dentro de jugar.js y crearPJ.js en las primeras líneas:

```
var socket = io.connect('http://roltierramedia.ddns.net:8080')
```
6) Ejecutar el fichero server.js en el entorno de Node.js.
```
node js/server.js
```
