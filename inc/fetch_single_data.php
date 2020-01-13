<?php 
/*
	@ Fetching the data using MAC address
*/
include('connection.php');

	if(isset($_POST['mac'])){
		$output = array();
		$data = [
			'Mac_Address' => $_POST['mac']
		];
		$stmt = $connection->prepare("SELECT * FROM wifi_details,wifi_users WHERE Mac_Address = :Mac_Address AND wifi_users.Common_id = wifi_details.Common_id LIMIT 1");
		$stmt->execute($data);
		$result = $stmt->fetchAll();

		foreach($result as $row){
			$output['Common_id'] = $row['Common_id'];
			$output['Name'] =$row['Name'];
			$output['NIC_No'] =$row['NIC_No'];
			$output['Contact_No'] =$row['Contact_No'];
			$output['Email'] =$row['Email'];
			$output['Mac_Address'] =$row['Mac_Address'];
			$output['Device'] = $row['Device'];
			$output['ap'] = $row['ap'];
		}
		echo json_encode($output);
	}else{
		header('location:index.php');
	}

?>