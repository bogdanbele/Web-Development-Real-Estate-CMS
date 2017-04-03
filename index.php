<?php
session_start();

$_SESSION['username']="";
?>
<!DOCTYPE html>

<html>
<head>
	<meta charset="utf-8">
	<link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="css-app.css">
	<link rel="stylesheet" type="text/css" href="css-form.css">
	<link rel="stylesheet" type="text/css" href="css-users.css">
	<link rel="stylesheet" type="text/css" href="css-property.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="sweetalert-master/dist/sweetalert.css">
	<title>Material Properties</title>

</head>
<body>

	<div id="menu-bars" class="container" onclick="changeMenuToX(this)">
		<div class="bar1"></div>
		<div class="bar2"></div>
		<div class="bar3"></div>

	</div>

	<div id="menu" class="materialBoxShadow">

		<div id="upperMenu">


		</div>
		<div id="lowerMenu">
			<?php
			if (!isset($_SESSION)){
				echo "";
			}
			else {

			?>
						<div id="welcomeMessage">Welcome
						</div><?php echo $_SESSION["username"];
					}


						?>
						<div id="btnSignup" class="menuHolder link" data-go-to="wdw-sign-up"">
				<div class="fa-marginMenu fa fa-user fa-fw "></div>
				<p>Sign up</p>
			</div>
		</div>
	</div>

	<div id="content-cover"></div>
	<!-- ********************************************************************** -->
	<!-- ********************************************************************** -->
	<!-- ********************************************************************** -->




	<div id="wdw-sign-up" class="wdw">


		<div class="propertiesHeader"><h1 class="headerText">Sign up



		</h1></div>

		<div class="userBodyWindow">
			<div class="card">









				<input id="txt-create-user-id" class="materialInput" placeholder="id" type="text" required="" style="display: none">

				<input id="txt-create-user-username" class="materialInput" placeholder="username" type="text" required="">

				<input id="txt-create-user-password" class="materialInput" placeholder="password" type="password" required="" autocomplete="new-password">



				<div align="center" id="btn-save-user" >
					<div class="contener">
						<div class="txt_button">Sign Up</div>
						<div class="circle">&nbsp;</div>
					</div>
				</div>


			</div>
		</div>

	</div>

	<div id="wdw-login" class="wdw">

		<div class="propertiesHeader"><h1 class="headerText">Log in</h1></div>

		<div class="propertiesBody">
			<div class="card">


				<form id="frm-login" method="post" action="api-login.php" enctype="multipart/form-data">


					<input id="txt-username" class="materialInput" name="username" placeholder="Username" type="text" required="">

					<input id="txt-password" class="materialInput" name="password" placeholder="Password" type="text" required="">



					<div align="center">
						<div class="contener">
							<div id="tryLoggin">Submit</div>
							<div class="circle">&nbsp;</div>
						</div>
					</div>
						</div>
				</form>



			</div>
		</div>

	</div>

	<!-- ********************************************************************** -->
	<!-- ********************************************************************** -->
	<!-- ********************************************************************** -->
	<div id="wdw-properties" class="wdw">
		<div class="propertiesHeader"><h1 class="headerText">Property list</h1></div>
		<div id="propertiesBody">'
		</div>

	</div>

	<div id="wdw-users" class="wdw">
		<div class="propertiesHeader"><h1 class="headerText">Users List</h1></div>
		<div id="userBody">
		</div>
	</div>


	<!-- ********************************************************************** -->
	<!-- ********************************************************************** -->
	<!-- ********************************************************************** -->

	<div id="wdw-create-property" class="wdw">
		<div class="propertiesHeader"><h1 class="headerText">Create Property</h1></div>

		<div class="propertiesBody">
			<div class="card">


				<form id="frm-property" method="post" action="api-create-property.php" enctype="multipart/form-data">
					<input id="txt-create-property-id" class="materialInput" placeholder="Username" type="text" name="id" required="" style="display: none">

					<input id="txt-create-property-address" class="materialInput" name="address" placeholder="Address" type="text" required="">

					<input id="txt-create-property-price" class="materialInput" name="price" placeholder="Price" type="text" required="">

					<div class="image-holder">
					<div class="image-column">
						<img class="img-preview" src=""></img>
						<input class="file" type="file" name="file-0">
					</div>

</div>
					<div align="center" id="btn-save-property" >
						<div class="contener">
							<div id="saveProperty">Submit</div>
							<div class="circle">&nbsp;</div>
						</div>
					</div>
				</form>



			</div>
		</div>
	</div>


	<script src="sweetalert-master/dist/sweetalert.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>

	<script type="text/javascript" src="js-app.js"></script>
	<script>

	</script>


</body>
</html>