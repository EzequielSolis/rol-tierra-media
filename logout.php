<?php
session_start(); //recuperamos la sesion
session_unset();
if(session_destroy()) //la destruimos
{
	header("Location: index.php"); // redireccion a inicio
} 
?>
