<?php 
include ("defines.php");
$to = $_REQUEST["to"];
header('Content-type: application/json');
$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$date = date ("Y-m-j H:i:s");
$query = "update members set scan_at='$date' where id=$to";
$result = $mysqli->query($query) or die($mysqli->error.__LINE__);

$query = "select * from messages where to_id=$to and read_at is null";
$result = $mysqli->query($query) or die($mysqli->error.__LINE__);

$messages = array();
  
while($row = $result->fetch_assoc())
{
  $from = $row["from_id"];
  $query2 = "select login from members where id=$from";
  $result2 = $mysqli->query($query2) or die($mysqli->error.__LINE__);
  $row2 = $result2->fetch_assoc();

  $login = $row2["login"];
  $login = utf8_encode($login);

  $row["from"] = $login;
  array_push($messages, $row);
}

$json = '{"messages":'.json_encode($messages).'}';
echo $_GET['callback'] . '('.$json.')';

$date = date ("Y-m-j H:i:s");
$query = "update messages set read_at='$date'";
$query .= " where to_id=$to and read_at is null";
$result = $mysqli->query($query) or die($mysqli->error.__LINE__);

mysqli_close($mysqli);

?>
