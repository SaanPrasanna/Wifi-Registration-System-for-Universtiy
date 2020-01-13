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
$table = 'wifi_staff';

// Table's primary key
$primaryKey = 'Common_id';

// Array of database columns which should be read and sent back to DataTables.
// The `db` parameter represents the column name in the database. 
// The `dt` parameter represents the DataTables column identifier.

$columns = array(
    array( 'db' => 'Common_id', 'dt' => 0 ),
    array( 'db' => 'Name',  'dt' => 1 ),
    array( 'db' => 'Device', 'dt' => 2 ),
    array( 'db' => 'Mac_Address', 'dt' => 3 ),
    array( 'db' => 'ap', 'dt' => 4 ),
    array( 'db' => 'activated_date', 'dt' => 5 ),
    array( 'db' => 'disconnected_date', 'dt' => 6 )
);


// Include SQL query processing class
require( 'ssp/ssp.class.staff.wifi.php' );

// Output data as json format
echo json_encode(
      SSP::simple( $_GET, $dbDetails, $table, $primaryKey, $columns )
);