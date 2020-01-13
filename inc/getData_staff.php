<?php
/*
    @ Getting all wifi details from wifi_users table and wifi_details table 
    @ Json Encoding the fetch data
*/

// Database connection info
$dbDetails = array(
    'host' => 'localhost',
    'user' => 'root',
    'pass' => '',
    'db'   => 'wyb_wifi'
);

// DB table to use
$table = 'wifi_users';
// DB where clause
$whereResult = "Type = 'Staff'";
// Table's primary key
$primaryKey = 'Common_id';

// Array of database columns which should be read and sent back to DataTables.
// The `db` parameter represents the column name in the database. 
// The `dt` parameter represents the DataTables column identifier.

$columns = array(
    array( 'db' => 'Name',  'dt' => 0 ),
    array('db' => 'Designation', 'dt' => 1),
    array('db' => 'Department', 'dt' => 2),
    array( 'db' => 'NIC_No', 'dt' => 3 ),
    array( 'db' => 'Contact_No', 'dt' => 4 ),
    array( 'db' => 'Email', 'dt' => 5 )
);


// Include SQL query processing class
require( 'ssp/ssp.class.staff.php' );

// Output data as json format
echo json_encode(
    SSP::complex( $_GET, $dbDetails, $table, $primaryKey, $columns,$whereResult,$whereAll=null) //Complex ssp.class method to use where clause
);