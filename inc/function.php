<?php 
	function get_total_all_records(){
		include('connection.php');
		$stmt = $connection->prepare("SELECT * FROM wifi_users,wifi_details WHERE wifi_users.Common_id = wifi_details.Common_id AND type = 'student' ");
		$stmt->execute();
		$result = $stmt->fetchAll();

		return $stmt->rowCount();
	}

/*	function validation_request($Common_id,$type){
		include('connection.php');

		//If the user is using the same device without disconnectiong the previous same evice
		$data = [
			'Common_id' => $Common_id,
			'Device' => $type
		];
		$stmt = $connection->prepare("SELECT * FROM wifi_details WHERE Common_id = :Common_id AND Device = :Device and ISNULL(disconnected_date);");
		$stmt->execute($data);
		$rowCount = $stmt->rowCount();

		if($rowCount == 0){
			return "true";
		}else{
			return "Please Disconnect the Previous ". $type ." Connection";
		}
	} */

	function validation_request($Common_id,$type){
		include('connection.php');

		$data = [
			'Common_id' => $Common_id,
		];
		$stmt = $connection->prepare("SELECT disconnected_date,Device FROM wifi_details WHERE Common_id = :Common_id;");
		$stmt->execute($data);
		$rowCount = $stmt->rowCount();
		$status = "";

		if($rowCount == 0){
			// $status = "true";
		}else{

			foreach($stmt as $row){
				
				if(($type == "Phone") || ($type == "Tablet")){
					if((($row['Device']== "Phone") || ($row['Device'] == "Tablet")) && (($row['disconnected_date']) == null)){
						$status = "Please Disconnect the Phone or Tablet Connection";
					}
				}else if($type == "Laptop"){
					if(($row['Device'] == "Laptop") && (($row['disconnected_date']) == null)){
						$status = "Please Disconnect the Laptop Connection";
					}					
				}else{
					if(($row['Device'] == "Dongle") && (($row['disconnected_date']) == null)){
						$status = "Please Disconnect the Dongle Connection";
					}					
				}


			}
		}
		if($status == ""){
			return 	 "true";
		}else{
			return $status;			
		}

	}	

	function check_deactivate($mac){
		include('connection.php');
		$data = [
			'Mac_Address' => $mac
		];
		$stmt = $connection->prepare("SELECT * FROM wifi_details WHERE Mac_Address = :Mac_Address AND ISNULL(disconnected_date); ");
		$stmt->execute($data);
		$rowcount = $stmt->rowCount();

		if($rowcount == 0){
			return 'deactivate';
		}else{
			return 'activate';
		}

	}
?>