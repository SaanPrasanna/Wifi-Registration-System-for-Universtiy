<?php
    include('connection.php');
    include('function.php');

    if(isset($_POST['mac'])){
        $mac = $_POST['mac'];
        if(check_deactivate($mac) == 'activate'){
            date_default_timezone_set("Asia/Colombo");
            $data = [
                'disconnected_date' => date('Y-m-d'),
                'Mac_Address' => $mac
            ];
            $stmt = $connection->prepare("UPDATE wifi_details SET disconnected_date = :disconnected_date WHERE Mac_Address = :Mac_Address ;");
            if($stmt->execute($data)){
                echo 'Deactivated !';
            }           
        }else{
            echo 'Already Deactivated !';
        }

    }else{
        header('location:../index.php');
    }
?>