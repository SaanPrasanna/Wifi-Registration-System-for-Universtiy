<?php
/*
	@ Updating the Student Details
	@ Inserting the Student Details

*/
	include('connection.php');
	include('function.php');

// Checking the operation was set
if (isset($_POST['operation'])) {

	// @ Inserting the stuedent Details
	if ($_POST['operation'] == "Add"){
		$data = [
			'Name' => $_POST['name'],
			'Type' => 'Student',
			'Designation' => 'none',
			'Department' => 'none',
			'Common_id' => $_POST['Common_id'],
			'NIC_No' => $_POST['nic'],
			'Contact_No' => $_POST['phone'],
			'Email' => $_POST['email']
		];

		$stmt = $connection->prepare("INSERT INTO wifi_users (Name, Type, Designation, Department, Common_id, NIC_No, Contact_No,Email) VALUES (:Name, :Type, :Designation, :Department, :Common_id, :NIC_No, :Contact_No,:Email)");
		if ($stmt->execute($data)) {
			$stmt = Null;
			echo 'add';
		} else {
			echo 'Student Already Registared';
		}

	}

	// @ Updating the Student Details
	if ($_POST['operation'] == 'Edit') {
		$data = [
			'Name' => $_POST['name'],
			'NIC_No' => $_POST['nic'],
			'Contact_No' => $_POST['phone'],
			'Email' => $_POST['email'],
			'Common_id' => $_POST['Common_id']
		];

		$stmt = $connection->prepare("UPDATE wifi_users SET Name = :Name , NIC_No = :NIC_No, Contact_No = :Contact_No,Email = :Email  WHERE Common_id = :Common_id ");
		if ($stmt->execute($data)) {
			$stmt =  Null;
			echo 'edit';
		} else {
			echo 'Record Update Faild !';
		}
	}
} else {
	header('location:index.php');
}

?>
