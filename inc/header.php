<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="description" content="Wi-Fi Submission for wyb">
	<meta name="keywords" content="HTML, CSS, PHP, JSON, JS">
	<meta name="author" content="Sandun Prasanna Mapa">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<title>Student - Wi-Fi Details</title>

	<link rel="stylesheet" href="css/bootstrap4/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="css/datatable/dataTables.bootstrap4.min.css">
    <link rel="stylesheet" type="text/css" href="css/datatable/buttons.bootstrap4.min.css">
    <link rel="stylesheet" href="css/style.css" type="text/css">
	<link rel="stylesheet" type="text/css" href="css/table.css">
	<!-- <link href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.css" rel="stylesheet" /> -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-sweetalert/1.0.1/sweetalert.css">

	<!-- izitoast Notification  -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/css/iziToast.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/css/iziToast.min.css">

    <script src="js/header/jquery.min.js"></script>
    <script src="js/header/bootstrap3-typeahead.min.js"></script>
</head>
<body>
	<div class="wrapper">

		<!-- Sidebar  -->
		<nav id="sidebar">
			<div class="sidebar-header">
				<h3>Wi-Fi Registration</h3>
			</div>

			<ul class="list-unstyled components">
				<li class="">
					<a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">Student</a>
					<ul class="collapse list-unstyled" id="homeSubmenu">
						<li id="swd">
							<a href="home.php">Student Wi-Fi Details</a>
						</li>
						<li>
							<a href="st_details.php">Student Details</a>
						</li>
					</ul>
				</li>
				<li>
					<a href="#pageSubmenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">Staff</a>
					<ul class="collapse list-unstyled" id="pageSubmenu">
						<li>
							<a href="staff_wifi_details.php">Staff Wi-Fi Details</a>
						</li>
						<li>
							<a href="staff_details.php">Staff Details</a>
						</li>

					</ul>
				</li>
			</ul>

		</nav> <!-- navbar close -->

		<!-- Page Content  -->
		<div id="content">

			<nav class="navbar navbar-expand-lg navbar-light bg-light">
				<div class="container-fluid">

					<button type="button" id="sidebarCollapse" class="btn btn-info">
						<i class="fas fa-align-left"></i>
						<span>Show/ Hide Menu</span>
					</button>
					<button class="btn btn-dark d-inline-block d-lg-none ml-auto" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
						<i class="fas fa-align-justify"></i>
					</button>
					<h2 id='top-title' style="margin-left:100px;"></h2>
					<div class="collapse navbar-collapse" id="navbarSupportedContent">
						<ul class="nav navbar-nav ml-auto">
							<li class="nav-item">
								<div class="btn-group dropleft">
									<button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
										<?php echo $uname; ?>
									</button>
									<div class="dropdown-menu">
										<button class="dropdown-item">Profile</button>
										<button class="dropdown-item" id="logout">Logout</button>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</nav>