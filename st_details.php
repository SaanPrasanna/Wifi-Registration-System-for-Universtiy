<?php
/*
	@ Student Details Manipulation 
*/
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
                    <th>Name</th>
                    <th>NIC No</th>
                    <th>Contact No</th>
                    <th>E-mail</th>
					<th>Actions</th>
			</tr>
		</thead>
	</table>

	<!-- Modal Content -->
	<div id="studentModal" class="modal fade" style='font-size:12px;'>
		<div class="modal-dialog">
			<form method="post" id="student_form" enctype="multipart/form-data">
				<div class="modal-content">
					<div class="modal-header">
						<h4 class="modal-title">Title</h4>
						<button type="button" class="close" data-dismiss="modal">&times;</button>
					</div>
					<div class="modal-body">
						<div class="form-group">
							<label id="type">Index No</label>
							<input type="text" name="cn" id="cn" class="form-control cn"   />
							<div class="valid-feedback">Valid Format</div>
							<div class="invalid-feedback">Invalid Format</div>
						</div>
						<div class="form-group">
							<label for="">Name</label><br />
							<input type="text" id="name" class="form-control name" />
							<div class="invalid-feedback">Invalid MAC Address</div>
                        </div>
                        <div class="form-group">
							<label for="">NIC No</label><br />
							<input type="text" id="nic" class="form-control nic" minlength="10" maxlength="12" />
							<div class="invalid-feedback">Invalid MAC Address</div>
                        </div>
                        <div class="form-group">
							<label for="">Contact No</label><br />
							<input type="text" id="phone" class="form-control phone" maxlength="10" />
							<div class="invalid-feedback">Invalid MAC Address</div>
                        </div>
                        <div class="form-group">
							<label for="">E-Mail</label><br />
							<input type="text" id="email" class="form-control email" />
							<div class="invalid-feedback">Invalid MAC Address</div>
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


</div>
</div> <!-- Wrapper close -->

<?php include('inc/footer.php'); ?>
<script src="js/st_details.js"></script>
<script>
	$('#top-title').text("Student Details");
	$('title').text("Students Details");
</script>