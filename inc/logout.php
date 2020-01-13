<?php 
	session_start();

	if(isset($_SESSION['uname'])){
		session_destroy();
		header('location: ../index.php?logout=successfuly&destroy_session');
	}else{
		$x = true;
	}
	if(isset($_COOKIE['uname'])){
		setcookie('uname', '', time() - 3600, '/');
		header('location: ../index.php?logout=successfuly&destroy_cookie');
	}else{
		$y = true;
	}

	if(($x == true) && ($y == true)){
		header('location: ../index.php?non');
	}

?>