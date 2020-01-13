<?php 
/*
	@Fetching the data using Index no or Common ID
*/
include('connection.php');

	if(isset($_POST['Common_id'])){
		$output = array();
		$data = [
			'Common_id' => $_POST['Common_id']
		];
		$stmt = $connection->prepare("SELECT * FROM wifi_users WHERE Common_id = :Common_id LIMIT 1");
		$stmt->execute($data);
		$result = $stmt->fetchAll();

		foreach($result as $row){
			$output['Common_id'] = $row['Common_id'];
			$output['Name'] =$row['Name'];
			$output['NIC_No'] =$row['NIC_No'];
			$output['Contact_No'] =$row['Contact_No'];
			$output['Email'] =$row['Email'];
			$output['Designation'] =$row['Designation'];
			$output['Department'] =$row['Department'];
		}
		echo json_encode($output);
	}else{
        header('location:index.php');
    }

?>