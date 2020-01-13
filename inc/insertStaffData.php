<?php
/*
	@ Updating the Staff Details
	@ Inserting the Staff Details

*/
	include('connection.php');
	include('function.php');

// Checking the operation was set
if (isset($_POST['operation'])) {

	// @ Inserting the stuedent Details
	if ($_POST['operation'] == "Add"){
		$data = [
			'Name' => $_POST['name'],
			'Type' => 'Staff',
			'Designation' => $_POST['designation'],
			'Department' => $_POST['department'],
			'Common_id' => $_POST['Common_id'],
			'NIC_No' => $_POST['Common_id'],
			'Contact_No' => $_POST['phone'],
			'Email' => $_POST['email']
		];

		$stmt = $connection->prepare("INSERT INTO wifi_users (Name, Type, Designation, Department, Common_id, NIC_No, Contact_No,Email) VALUES (:Name, :Type, :Designation, :Department, :Common_id, :NIC_No, :Contact_No,:Email)");
		if ($stmt->execute($data)) {
			$stmt = Null;
			echo 'add';
		} else {
			echo 'Already Registared';
		}

	}

	// @ Updating the Staff Details
	if ($_POST['operation'] == 'Edit') {
		$data = [
			'Name' => $_POST['name'],
			'Designation' => $_POST['designation'],
			'Department' => $_POST['department'],
			'Contact_No' => $_POST['phone'],
			'Email' => $_POST['email'],
			'Common_id' => $_POST['Common_id']		
		];

		$stmt = $connection->prepare("UPDATE wifi_users SET Name = :Name, Designation = :Designation, Department = :Department, Contact_No = :Contact_No,Email = :Email  WHERE Common_id = :Common_id ");
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
