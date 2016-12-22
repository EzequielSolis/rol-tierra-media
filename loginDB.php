<?php
//conexion base de datos
$servername = "localhost";
$username = "root";
$password = "";
$db = "dbusuarios";
$link = mysqli_connect($servername, $username, $password, $db);
// comprobar conexion
if (!$link) {
	die("Error en conexi&oacuten con base de datos " . mysqli_connect_error());
}
?>