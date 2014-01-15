<?php
header('Content-type: application/json');
/***********
$tabla
101=restaurantes
102=eventos
103=servicios_profesionales
104=noticias

$filtro
10=restaurantes
20=eventos
30=servicios_profesionales
40=noticias
***********/
$server = "localhost";
$username = "globalisimov3";
$password = "globalisimo";
$database = "globalisimov3_3";

$con = mysql_connect($server, $username, $password) or die ("Could not connect: " . mysql_error());
mysql_select_db($database, $con);

$from_filtro= $_GET["filtro"];
$lista= $_GET["lista"];
$star_list = $lista*15;
$end_list = (($lista+1)*15)+1;
switch ($from_filtro) {
	case 100:
		$categoria= $_GET["c"]; //Var Categoria
		$sql = "SELECT id, nombre, descripcion,calificacion,logo 
				FROM restaurantes WHERE tipo_comida = $categoria
				ORDER BY id LIMIT $star_list,$end_list";
		break;
	case 200:
		$sql = "SELECT id, titulo, descripcion, imagen FROM eventos ORDER BY id DESC LIMIT 0,15";
		break;
	case 300:
		$sql = "SELECT id, nombre, descripcion,calificacion FROM servicios_profesionales ORDER BY id DESC LIMIT 0,15";
		break;	
	case 400:
		$sql = "SELECT id, titulo, descripcion FROM noticias ORDER BY id DESC LIMIT 0,15";
		break;
	case 500: //Filtro para el scroll de eventos
		$sql = "SELECT id, nombre, mapa FROM restaurantes ORDER BY id DESC LIMIT 5,10";
		break;
	case 900:
		$from_tabla = $_GET["tabla"];
		$item = $_GET["item"];
		switch ($from_tabla) {
			case 10:
				$sql = "SELECT restaurantes.*, categorias_restaurantes.categoria 
				FROM restaurantes, categorias_restaurantes 
				WHERE restaurantes.id = $item AND restaurantes.tipo_comida=categorias_restaurantes.id";
				break;
			case 20:
				$sql = "SELECT * FROM eventos WHERE id = $item";
				break;
			case 30:
				$sql = "SELECT servicios_profesionales.*, categorias_servicios.categoria 
				FROM servicios_profesionales, categorias_servicios 
				WHERE servicios_profesionales.id = $item AND servicios_profesionales.tipo_servicio = categorias_servicios.id";
				break;
			case 40:
				$sql = "SELECT * FROM noticias WHERE id = $item";
				break;
			default:
				$sql = "SELECT * FROM restaurantes WHERE id = $item";
				break;
		}
		break;		
	default:
		$sql = "SELECT id, nombre, descripcion,calificacion FROM restaurantes ORDER BY id DESC LIMIT 0,15";
		break;
}
$result = mysql_query($sql) or die ("Query error: " . mysql_error());

$records = array();

while($row = mysql_fetch_assoc($result)) {
	$array = array_map("utf8_encode", $row); 
	$records[] = $array;
}

mysql_close($con);

echo $_GET['jsoncallback'] . '({"data":' . json_encode($records) . '});';
?>