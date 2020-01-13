<?php session_start(); ?>
<?php 
	include('connection.php');
	$uname = $_POST['uname'];
	$pw = $_POST['pw'];
	$msg = "";

	if(!empty($uname) && !empty($pw)){

		$hash = sha1($pw);
		$data = array(
			'uname' => $uname,
			'pw' => $hash
		);

		try {
			
			$stmt = $connection->prepare("SELECT * FROM users WHERE uname = :uname AND pw = :pw LIMIT 1;");
			$stmt->execute($data);
			if($stmt->rowCount()){

				//Checkbox is selected or not
				if(isset($_POST['remember'])){
					if($_POST['remember'] == 'remember_me'){
						//Checkbox is selected, when create the COOKIE[]
						setcookie('uname',$uname,time()+(60*60*72),"/");
					}else{
						$_SESSION['uname'] = $uname;
					}			
				}
				echo 'true';
			}else{
					//User not valid
				$msg = 'Wrong Username or Password, Try Again !';
			}

		} catch (PDOException $e) {
			echo $e->getMessage();
		}

	}else{
		$msg = 'Username or Password Empty !';
	}

			echo $msg;

?>