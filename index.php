<?php session_start(); ?>
<?php 
	include('inc/connection.php');
	if((isset($_SESSION['uname'])) || (isset($_COOKIE['uname']))){
		header('location:home.php');
	}

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>User Login || Wi - Fi Registration</title>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/css/iziToast.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/css/iziToast.min.css">
	<link rel="stylesheet" href="css/bootstrap4/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
	<style>
		body{
			background-image: url("img/AEToken-Background-Gradient.jpg");
			font-family:Source Sans Pro Regular;
			margin: 0;
			padding:0;
		}

		fieldset{

			margin:0 auto;
			width:410px;
			height:auto;
			background: #ffffff;
			border: 1px;
			box-shadow:2px 10px 15px #323434;
			border-radius:30px;
			margin-top: 40px;
			padding:50px;
		}
		h1,h5{
			text-align: center;
			/*font-family: Proxima Nova Alt Bl;*/
		}

		button{
			width:100%;
		}
		
		label{
			font-size:19px;
		}
	</style>


</head>
<body>

		<fieldset>
			<h1>Login to Continue</h1>
			<h5>Wifi - Registration</h5><br/>
			<form>
				<div class="form-group">
					<label for="exampleInputEmail1">Username</label>
					<input type="text" class="form-control" id="uname" aria-describedby="emailHelp" placeholder="Enter Username" name="uname" style="border-radius: 15px;" required>
					<div class="valid-feedback">Username is Valid Format</div>
					<div class="invalid-feedback">Username is Invalid Format</div>
				</div>
				<div class="form-group">
					<label for="exampleInputPassword1">Password</label>
					<input type="password" class="form-control" id="pw" placeholder="Enter Password" name="pw" style="border-radius: 15px;" required>
					<div class="valid-feedback">Password is Valid Format</div>
					<div class="invalid-feedback">Password is Invalid Format</div>
				</div>
				<div class="custom-control custom-checkbox mb-3">
					<input type="checkbox" class="custom-control-input" id="remember">
					<label class="custom-control-label" for="remember">remember me</label>
				</div>
				<button name="login" class="btn btn-primary" style="border-radius: 15px;">Log In</button>
			</form>
		</div> <!-- right Division -->

	</fieldset>		


<script src="js/jquery.min.js"></script>
<script>
	$('button').click(function(){
		var uname = $('#uname').val().trim();
		var pw = $('#pw').val().trim();
		var remember = '';

		if($('#remember').prop('checked')==true){
			remember = 'remember_me';
		}

		$('form').addClass('was-validated');
		// $('input').css('border','1px solid #ddd');

		if(uname < 1){
			// $('#uname').css('border','2px solid orangered');
		}else if(pw < 1){
			// $('#pw').css('border','2px solid orangered');
		}else{

			$.ajax({
				method: "POST",
				data: {uname:uname,pw:pw,remember:remember},
				url: "inc/login.php",
				success: function(data) {
					if($.trim(data)== 'true'){
						window.location='home.php';
					}else{	
						iziToast.warning({
							title: 'Warning',
							message: data,
							position: 'topRight',
						});
					}		
				}
			});

		}
		return false;
	});
</script>

<?php require_once('inc/footer.php'); ?>