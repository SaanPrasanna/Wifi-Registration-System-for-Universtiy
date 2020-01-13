<?php
	include('connection.php');
	include('function.php');

	// Checking the operation was set
	if(isset($_POST['operation'])){

		// Inserting the stuedent wifi details
		if($_POST['operation'] == "Add"){
			date_default_timezone_set("Asia/Colombo");
			$data = [
				'Common_id' => $_POST['student_id'],
				'Device' => $_POST['device'],
				'Mac_Address' => $_POST['mac'],
				'ap' => $_POST['server'],
				'activated_date' => date('Y-m-d'),
				'activated_time' => date('H:i:s'),
				'disconnected_date' => Null,
			];
			if(validation_request($_POST['student_id'],$_POST['device']) == 'true'){ 
				$stmt = $connection->prepare("INSERT INTO wifi_details (Common_id, Device, Mac_Address, ap, activated_date, activated_time, disconnected_date) VALUES (:Common_id, :Device, :Mac_Address, :ap, :activated_date, :activated_time, :disconnected_date)");
				if($stmt->execute($data)){
					$stmt = Null;
					echo 'add';
				}else{
					echo 'MAC Address Already Used or User Not Found';
				}
			}else{
				echo validation_request($_POST['student_id'],$_POST['device']); //Validation Error send to the font
			}	
		}

		// Updating the wifi details
		if($_POST['operation'] == 'Edit'){
			$data = [
				'Device' => $_POST['device'],
				'ap' => $_POST['server'],			
				'Mac_Address' => $_POST['mac']
			];
			// if (validation_request($_POST['student_id'], $_POST['device']) == 'true') {
				$stmt = $connection->prepare("UPDATE wifi_details SET Device = :Device, ap = :ap WHERE Mac_Address = :Mac_Address ");
				if ($stmt->execute($data)) {
					$stmt =  Null;
					echo 'edit';
				} else {
					echo 'Record Update Faild !';
				}
			// }else{
			// 	echo validation_request($_POST['student_id'],$_POST['device']); //Validation Error send to the font
			// }

		}
	}else{
		header('location:index.php');
	}

?>
