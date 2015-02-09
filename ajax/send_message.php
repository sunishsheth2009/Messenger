<? 
include ("defines.php");
$from = $_REQUEST["from"];
$to = $_REQUEST["to"];
$txt = $_REQUEST["txt"];


echo $from.$to.$txt;

$txt = utf8_decode ($txt);
$txt= str_replace (array ("&", "<", ">"), " ", $txt);

$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

if ($from && $to)
{
  $query = "insert into messages set from_id=$from, to_id=$to, txt='$txt'";
  $result = $mysqli->query($query) or die($mysqli->error.__LINE__);
}

mysqli_close($mysqli);

?>
