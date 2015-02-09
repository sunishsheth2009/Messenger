<?php

include ("defines.php");
//header('Content-type: application/json');
$id = null;
if(isset($_GET["id"])) $login = $_GET["id"];
else die('id do!');

$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$timestamp = strtotime (date ("Y-m-j H:i:s")) - 20;   // in seconds
$date= date ("Y-m-j H:i:s", $timestamp);
$query =  "select * from members where scan_at >= '$date'";
if ($id) $query .=  " and id != $id";
$result = $mysqli->query($query) or die($mysqli->error.__LINE__);

$users = array();
while($row = $result->fetch_assoc())
    $users[] = $row; 	   
$prejson = json_encode($users);

$json = '{"members":';
  $json .= $prejson;
$json .= "}";

echo $_GET['callback'] . '('.$json.')';


mysqli_close($mysqli);
?>
