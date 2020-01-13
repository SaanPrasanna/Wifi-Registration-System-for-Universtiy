<?php
session_start();

if ((isset($_SESSION['uname'])) || (isset($_COOKIE['uname']))) {
	if (isset($_SESSION['uname'])) {
		$uname = $_SESSION['uname'];
	} else {
		$uname = $_COOKIE['uname'];
	}
} else {
	header('location:index.php?redirect=true');
}
include('inc/header.php');
?>
<div class="container-fluid">
	<button type="button" id="add_button" data-toggle="modal" data-target="#studentModal" class="btn btn-primary btn-fg" style="float:left; margin-top:23px;margin-right: 20px; width: 100px;">Add</button>
	<br />
	<!-- Table Content -->
	<input type="text" class="form-control" id="searchbox" placeholder="Search By Anythings..."> <!-- Search panel -->
	<table id="memListTable" class="table table-striped table-bordered" style="width:100%; font-size:13px;">
		<thead>
			<tr>
				<th>Index No</th>
				<th style="max-width: 130px;min-width: 130px;">Name</th>
				<th>Nic No</th>
				<th>Device</th>
				<th style="max-width: 120px;min-width: 120px;">MAC Adress</th>
				<th>Server</th>
				<th>Activated Date</th>
				<th style="max-width: 55px;min-width: 55px;">Disconnected Date</th>
				<th style="max-width: 63px;min-width: 63px;">Status</th>
				<th style="max-width: 180px;min-width: 180px;">Actions</th>

			</tr>
		</thead>
	</table>

	<!-- Modal Content -->
	<div id="studentModal" class="modal fade">
		<div class="modal-dialog">
			<form method="post" id="student_form" enctype="multipart/form-data">
				<div class="modal-content">
					<div class="modal-header">
						<h4 class="modal-title">Title</h4>
						<button type="button" class="close" data-dismiss="modal">&times;</button>
					</div>
					<div class="modal-body">
						<div class="form-group">
							<label id="type">Common number</label>
							<input type="text" name="cn" id="cn" class="form-control input-lg" autocomplete="off" />
							<div class="valid-feedback">Valid Format</div>
							<div class="invalid-feedback">Invalid Format</div>
						</div>
						<div class="form-group">
							<label>Device</label><br>
							<div class="btn-group btn-group-toggle" data-toggle="buttons">
								<label class="btn btn-outline-secondary phone">
									<input type="radio" name="options" id="Phone" value="Phone" class="options"> Phone
								</label>
								<label class="btn btn-outline-secondary laptop">
									<input type="radio" name="options" id="Laptop" value="Laptop" class="options"> Laptop
								</label>
								<label class="btn btn-outline-secondary tablet">
									<input type="radio" name="options" id="Tablet" value="Tablet" class="options"> Tablet
								</label>
								<label class="btn btn-outline-secondary dongle">
									<input type="radio" name="options" id="Dongle" value="Dongle" class="options"> Dongle
								</label>
							</div>
						</div>
						<div class="form-group">
							<label for="">MAC Address</label><br />
							<input type="text" id="mac" class="form-control mac" minlength="15" style="width: 350px;" />
							<div class="invalid-feedback">Invalid MAC Address</div>
						</div>
						<div class="form-group">
							<label>Sever</label><br>
							<div class="btn-group btn-group-toggle" data-toggle="buttons">
								<label class="btn btn-outline-secondary radious">
									<input type="radio" name="option2" id="RADIOUS" value="RADIOUS"> RADIOUS
								</label>
								<label class="btn btn-outline-secondary wusl">
									<input type="radio" name="option2" id="WUSL" value="WUSL"> WUSL
								</label>
								<label class="btn btn-outline-secondary wyb">
									<input type="radio" name="option2" id="WYB" value="WYB"> WYB
								</label>
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<input type="hidden" name="Common_id" id="Common_id" />
						<input type="hidden" name="operation" id="operation" />
						<input type="submit" name="action" id="action" class="btn btn-success" value="Add" style="width: 100px;" />
					</div>
				</div>
			</form>
		</div>
	</div>

	<!-- View Modal -->
	<div class="modal fade" id="viewmodal" tabindex="-1" role="dialog" aria-labelledby="viewmodallabel" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="modal-label">Student Details</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body view-body">
					<p><span class="view_title" >Index No : </span> <label class="view_in ans"></label></p>
					<p><span class="view_title">Student Name : </span> <label class="view_name ans"></label></p>
					<p><span class="view_title">NIC No : </span> <label class="view_nic ans"></label></p>
					<p><span class="view_title">Mobile No : </span> <label class="view_phone ans"></label></p>
					<p><span class="view_title">Email : </span> <label class="view_email ans"></label></p>
					<p><span class="view_title">Device : </span> <label class="view_device ans"></label></p>
					<p><span class="view_title">MAC Address : </span> <label class="view_mac ans"></label></p>
					<p><span class="view_title">Server : </span> <label class="view_ap ans"></label></p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>


</div>
</div> <!-- Wrapper close -->

<?php include('inc/footer.php'); ?>
<script src="js/home.js"></script>
<script>
	$('#top-title').text("Student WI-FI Details");
</script>