<? 
include ("defines.php");
header('Content-type: application/json');
$login = null;
if(isset($_GET["login"])) $login = $_GET["login"];
else die("Dead! no login!");


$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$query = "select id from members WHERE login LIKE '$login'"; //already user
$result = $mysqli->query($query) or die($mysqli->error.__LINE__);
$row = $result->fetch_assoc();
if($row)
	$id = $row["id"];

else
{
$date = date ("Y-m-j H:i:s");
$query = "insert into members set register_at='$date', login='$login'";
$result = $mysqli->query($query) or die($mysqli->error.__LINE__);
$query = "select id from members order by id desc limit 1";
$result = $mysqli->query($query) or die($mysqli->error.__LINE__);
$row = $result->fetch_assoc();
$id = $row["id"];
}
$json = '{"id":'. json_encode($id) .'}';
echo $_GET['callback'] . '('.$json.')';

mysqli_close($mysqli);

?>

