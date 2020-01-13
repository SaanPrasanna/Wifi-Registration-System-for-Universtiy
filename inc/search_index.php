<?php
	
	include('connection.php');

	$query = "SELECT * FROM wifi_users WHERE Common_id LIKE '%" . $_POST['query'] . "%' AND type = 'student';";
	$statement = $connection->prepare($query);
	$statement->execute();
	$result = $statement->fetchAll();
	$data = array();

	if ($result > 0) {
		foreach($result as $row){
			$data[] = $row["Common_id"];
		}
	    echo json_encode($data);
	}

?>