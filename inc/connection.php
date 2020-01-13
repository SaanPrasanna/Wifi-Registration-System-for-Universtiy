<?php 

	$username = 'root';
	$password = '';

	try {
		$connection = new PDO( 'mysql:host=localhost;dbname=wyb_wifi', $username, $password );
	} catch (PDOException $e) {
		echo "Database Connection Failed.".$e->getMessage()."";
	}

?>