

// We wll use sUserView to keep track of the user's position
var sUserView = "defaultWindow";

// bTimerCheck is a boolean that either permits updating properties
var bTimerCheck = false;

// We increase iLastPropertyId by the amount of properties we have in the array
var iLastPropertyId = 0;

// We will use this to only get nottifications for the new properties
var iPreloadedProperties;

// We increase iLastUserId when we go through the Users array, using this
// to GET the maximum amount of elements. Unlike properties, we don't
// need a iPreloadedUsers because we do not send notiffications
// each time a new user signs ups
var iLastUserId=0;

// Reminder of past clientside authentication
// *DELETE*
var iAccesRights = 0;

// Boolean that checks if the menu is open or not
var bMenuOpen = false;

// In order to enable title flashing we need to old the default title in a var
var oldTitle = document.title;


/************************************************************************/
/************************************************************************/
/************************************************************************/


// Title flashing which shows only the name ( restricted by space in the tittle bar)
function fnFlashTitle(property){

	// the interval will change the title every 1 second for as long
	// as you're not focusing the window
	var flashTimer = setInterval(function(){
		var title = document.title;
		var propertyMessage =  "New Property : "+ property ;
		document.title = (title == propertyMessage ? oldTitle : propertyMessage);
	}, 1000);
	window.onfocus=function() {
		document.title = oldTitle;
		clearInterval(flashTimer);
	}
}

/************************************************************************/
/************************************************************************/
/************************************************************************/

Notification.requestPermission().then(function(result) {
	console.log(result);
});

// Template for the Notification, which we will only have to fill with
// parameters
function spawnNotification(theBody,theIcon,theTitle) {
	var options = {
		body: theBody,
		icon: "images/"+theIcon
	}
	var n = new Notification(theTitle,options);
}

/************************************************************************/
/************************************************************************/
/************************************************************************/

// We will track the amount of images we can upload through this var
// tags : image upload, images, images-upload
var iElementNumber = 0;

$(document).on('change' , '[type="file"]' , function(){
	var preview = new FileReader();

	// We use readAsDataURL as a base64 encoded string
	preview.readAsDataURL( this.files[0] );

	// We asign self = this because we will want to use the "this" of this
	// scope inside a funciton nested inside, so we will not be able to refference
	// it via "this"
	var self = this;
	preview.onload = function(event){
		$(self).siblings(".img-preview").attr("src", event.target.result);
	}
	if( $(self).siblings(".img-preview").attr("src") == ""  ){
		fnCreateImageInput();
	}
	else {}
});

// The max amount you can upload is 6 images0
function fnCreateImageInput(){
	iElementNumber++;
	if (iElementNumber <= 5) {
		var sDiv = '<div class="image-column">\
		<img class="img-preview" src=""></img>\
		<input class="file" type="file" name="file-'+iElementNumber+'">\
		</div>';
		$(".image-holder").append(sDiv);
	}
}

//The two submitting functions for the forms
$("#saveProperty").click(function(){
	console.log("button clicked");
	$("#frm-property").submit();
});

$("#tryLoggin").click(function(){
	console.log("button clicked");
	$("#frm-login").submit();
});

$("#frm-property").on('submit', function(e){
	e.preventDefault();
	var sPropertyId = $("#txt-create-property-id").val();
	var sPropertyAddress = 	$("#txt-create-property-address").val();
	console.log("property id = " +sPropertyId);
	// We check if the sPropertyId is empty or not.
	// if var sPropertyId = $("#txt-create-property-id").val(); equal to an empty string
	// it means we will go to the CREATE property ajax call otherwise to the EDIT
	if (sPropertyId !== "" ) {
		$.ajax({
			"url":"api-update-property.php",
			"method":"post",
			"data": new FormData(this),
			"contentType":false,
			"processData":false,
			"cache":false
		});
	}
	else {
		swal("Property created !", sPropertyAddress+" has been created!", "success");
		$.ajax({
			"url":"api-create-property.php",
			"method":"post",
			"data": new FormData(this),
			"contentType":false,
			"processData":false,
			"cache":false
		});
	}
	// select the create property div for the id
	console.log("property id = "+sPropertyId + " address = " + sPropertyAddress);
});


/************************************************************************/
/************************************************************************/
/************************************************************************/
$(document).on("click",".link", function(){
	$(".wdw").hide();
	var sWindowToShow = $(this).attr("data-go-to");
	$("#"+sWindowToShow).css( {"display":"flex"} );
	// getting values from the sibling
	var sPropertyIdToEdit = $(this).siblings(".lbl-property-id").text();
	var sPropertyAddressToEdit = $(this).siblings(".lbl-property-address").text();
	var sPropertyPriceToEdit = $(this).siblings(".lbl-property-price").text();
	// select the create property div for the id
	$("#txt-create-property-id").val( sPropertyIdToEdit );
	$("#txt-create-property-address").val( sPropertyAddressToEdit );
	$("#txt-create-property-price").val( sPropertyPriceToEdit );
	var sUserIdToEdit = $(this).siblings(".lbl-user-id").text();
	var sUsernameToEdit = $(this).siblings(".lbl-user-username").text();
	var sPasswordToEdit = $(this).siblings(".lbl-user-password").text();
	$("#txt-create-user-id").val( sUserIdToEdit );
	$("#txt-create-user-username").val( sUsernameToEdit );
	$("#txt-create-user-password").val( sPasswordToEdit );
	userView = sWindowToShow;
	fnStartUserTimeout();
});

// Right click mouse function
// Taggs so you can find while searching :
// rightClick right-click
$(".wdw").contextmenu(function(event){
	fnCheckLogin();
	fnShowMenu();
	event.preventDefault();
});


/************************************************************************/
/************************************************************************/
/************************************************************************/

//succesfull and unsucessfull function are put here and not inside the
// the main loggin function, if we simply call them in the loggin main function
// we will have a more readable syntax
function successfulLoggin(){
	swal({
		title: "You have logged in",
		type: "success",
		confirmButtonColor: "#64DD17",
		confirmButtonText: "Continue",
		closeOnConfirm: true
	},
	function(){
		// Because we do not want to hide the divs containing the wdw class
		// we only call this function on success. There is no need to hide the
		// wdw and display wdw-properties if the attempt is unsucessfull
		$(".wdw").hide();
		$("#wdw-properties").css( {"display":"flex"} );
		userView = "wdw-properties";
		fnStartUserTimeout();

	});
}

function unsucessfulLoggin(){
	swal({
		title: "Incorrect loggin",
		type: "error",
		confirmButtonColor: "#64DD17",
		confirmButtonText: "Try again",
		closeOnConfirm: true,
		showCancelButton: false
	})
};

// Ajax call when we want to log in. The POST method will send the data
// we have entered in the form ( username + password ) to the api-login.php
// page. On .done ( when the post method has been finished ), we can check
// the actual response we're getting from PHP with function(data).
// The data inside this functions are actually the -echo-s from php
// which change depending if we inserted a correct username or not.
$("#frm-login").on('submit', function(e){
	e.preventDefault();
		$.ajax({
			"url":"api-login.php",
			"method":"post",
			"data": new FormData(this),
			"contentType":false,
			"processData":false,
			"cache":false
		}).done(function(data){

			// We decode the (data) in order to transform it into a JSON object.
			var statusType = JSON.parse(data);
			if (statusType.status == "ok"){
				successfulLoggin();
			}
			else {
				unsucessfulLoggin();
			}

		});
});

$("#btn-save-user").click(function(){

	var sId = $("#txt-create-user-id").val();
	var sUsername = $("#txt-create-user-username").val();
	var sPassword = $("#txt-create-user-password").val();
console.log("intialization");
	// if this id something, then update
	if( sId ){
		var sUrl = "api-update-user.php?id="+sId+"&username="+sUsername+"&password="+sPassword;
		iLastUserId = 0;
console.log("intialization");
		swal({
			title:  sUsername + " has been updated",
			text: "Password = " + sPassword,
			type: "success",
			showCancelButton: true,
			confirmButtonColor: "#64DD17",
			confirmButtonText: "Go back to the user list",
			cancelButtonText: "Continue editting",
			closeOnConfirm: true
		},
		function(){
			$(".wdw").hide();
			$("#wdw-users").css( {"display":"flex"} );
			userView = "wdw-users";
			fnStartUserTimeout();
console.log("going to update");
		});






		$("#userBody").empty();


	}else{


		var sUrl = "api-create-user.php?username="+sUsername+"&password="+sPassword;
		swal("User create !", sPassword+" is the current password!", "success");
			$.getJSON( sUrl, function( jData){
				if( jData.status == "ok" ){
				}
	});
}
});


	/************************************************************************/
	/************************************************************************/
	/************************************************************************/

	$('[data-go-to="wdw-properties"]').click(function(){
		/*	fnGetProperties();*/
// I have removed this function because I impleted the userView which reads if the user
// looks at the wdw-properties, so we no longer need to check the click
});


	$(document).on("click" ,".btn-delete-property" , function(){



		var sIdToDelete = $(this).siblings(".lbl-property-id").text();
		var oTheParent = $(this).parent();
		var sUrl = "api-delete-property.php?id="+sIdToDelete;





		swal({
			title: "Are you sure you want to delete this property?",
			type: "warning",
			confirmButtonColor: "#64DD17",
			confirmButtonText: "Continue",
			closeOnConfirm: true,
			showCancelButton: true
		},
		function(){
			$.getJSON( sUrl, function( jData){
				if( jData.status == "ok" ){
					oTheParent.remove();
				}
			});

		});



	});


	$(document).on("click" ,".btn-delete-user" , function(){


		var sIdToDelete = $(this).siblings(".lbl-user-id").text();
		var oTheParent = $(this).parent();
		var sUrl = "api-delete-user.php?id="+sIdToDelete;

		swal({
			title: "Are you sure you want to delete this user?",
			type: "warning",
			confirmButtonColor: "#64DD17",
			confirmButtonText: "Continue",
			closeOnConfirm: true,
			showCancelButton: true
		},
		function(){
			$.getJSON( sUrl, function( jData){
				if( jData.status == "ok" ){
					oTheParent.remove();
				}
			});


		});



	});

	/************************************/

	$(document).on("click" ,".btn-promote-admin" , function(){



		var sIdToDelete = $(this).siblings(".lbl-user-id").text();
		var oTheParent = $(this).parent();
		var localThis = $(this);
		var sUrl = "api-promote-user.php?id="+sIdToDelete;

		$.getJSON( sUrl, function( jData){
			if( jData.status == "ok" ){

				localThis.css( {"opacity":"0"} );
				oTheParent.addClass("admin-user");
			}
		});
	});


	/************************************************************************/
	/************************************************************************/
	/************************************************************************/


	function fnCheckLogin(){




		$.ajax({
			"url":"api-session-check.php",
			"method":"get",
			"contentType":false,
			"processData":false,
			"cache":false
		}).done(function(data){
	console.log("PARSING");
			// We decode the (data) in order to transform it into a JSON object.
			console.log(data);
			var messageBackData = JSON.parse(data);
			console.log(messageBackData);
			for(var i = 0; i < messageBackData.length; i++) {
    		var obj = messageBackData[i];
    		console.log(obj.position);
				console.log("x");
}



			$("#upperMenu").prepend(messageBackData.divsToAppend);
		});

















/*
		if ( iAccesRights == 0 ){
			var btnLoggin = 	'<div id="btnLoggin" class="menuHolder link" data-go-to="wdw-login">\
			<div class="fa-marginMenu fa fa-user fa-fw "></div>\
			<p>Log in</p>\
			</div>'

			if( $('#btnLoggin').length == 0 ){
				$("#upperMenu").prepend(btnLoggin);
			}

		}
		if ( iAccesRights == 1 ){
			$("#btnLoggin").remove();

		}
		if (iAccesRights >= 1 ){

			$("#btnLoggin").remove();
			$("#btnSignup").remove();

			if( $('#lbl-userAndProperties').length == 0){
				var userAndPropertyLists =	'<div id="lbl-userAndProperties" class="menuHolder link"  data-go-to="wdw-properties">\
				<div class="fa-marginMenu fa fa-list fa-fw "></div>\
				<p>Property List</p>\
				</div>\
				<div class="menuHolder link" data-go-to="wdw-users"">\
				<div class="fa-marginMenu fa fa-user fa-fw "></div>\
				<p>User List</p>\
				</div>';
				$("#upperMenu").prepend(userAndPropertyLists);
			}
		}

		if ( iAccesRights >= 2){



			var btnCreateProperty = '	<div id="btnCreateProperty" class="menuHolder link" data-go-to="wdw-create-property">\
			<div class="fa-marginMenu fa fa-home fa-fw "></div>\
			<p>Create Property</p>\
			</div>';

			if( $('#btnCreateProperty').length == 0){
				$("#lowerMenu").prepend(btnCreateProperty);
			}

		}
		*/
	}

	function fnAdminCheck(){

	}
	/************************************************************************/
	/************************************************************************/
	/************************************************************************/
	function fnGetUsers(){
		var sUrl = "api-get-users.php?maxId="+iLastUserId;
		console.log("get users");
		$.getJSON( sUrl , function( jData ){




			function fnUserLabelAdminCheck(){
				if( iAccesRights == 2 ){

					return '	<div class="lbl-user-password">{{password}}</div>\
					<div data-go-to="wdw-sign-up" class="fa fa-edit fa-fw link fa-icon-center"></div>\
					<div class="fa fa-trash fa-fw btn-delete-user fa-icon-center"></div>';
				}

				if ( iAccesRights == 3) {

					return '	<div class="lbl-user-password">{{password}}</div>\
					<div data-go-to="wdw-sign-up" class="fa fa-edit fa-fw link fa-icon-center"></div>\
					<div class="fa fa-trash fa-fw btn-delete-user fa-icon-center"></div>';
				}
				else{
					return "";
				}
			}

			function fnCheckPromote(index){

				if( jData[index].iAccesRights == 1   ){
					return '<div class="fa fa-plus-circle fa-fw btn-promote-admin"></div>';
				}
				else{
					return '<div class="fa-fw style="display:none" "></div>' ;
				}


			}

			function fnCheckAdmin(index){

				if( jData[index].iAccesRights > 1   ){
					return "admin-user";
				}
				else {
					return "";
				}
			}


			var sUser = '	<div class="lbl-property materialButton {{span1}}">\
			<div class="lbl-user-id">{{id}}</div>\
			<div class="lbl-user-username">{{username}}</div>\
			'+fnUserLabelAdminCheck()+'\
			{{promote}}</div>';

			console.log(jData);
			for( var i = 0 ; i < jData.length ; i++ ){
				console.log("div");
				var sUserTemplate = sUser;
				sUserTemplate = sUserTemplate.replace( "{{id}}" , jData[i].sUniqueId );
				sUserTemplate = sUserTemplate.replace( "{{username}}" , jData[i].sUsername );
				sUserTemplate = sUserTemplate.replace( "{{span1}}" ,  fnCheckAdmin(i) );
				sUserTemplate = sUserTemplate.replace( "{{password}}" , jData[i].sPassword );
				sUserTemplate = sUserTemplate.replace( "{{promote}}" ,  fnCheckPromote(i) );

				$("#userBody").append( sUserTemplate );
				iLastUserId++;
			}


		});
	}


	/************************************************************************/
	/************************************************************************/
	/************************************************************************/


	function fnGetProperties(){




		console.log("gettingProperties");
	// display properties
	var sUrl = "api-get-properties.php?maxId="+iLastPropertyId;
	$.getJSON( sUrl , function( jData ){

		// Set a global variable equal to the initial amount of properties
		// We do this in order to only get notiffications from the ones that have a key bigger than iPreloadedProperties
		if( iPreloadedProperties == null){
			iPreloadedProperties = jData.length;

		}

		var sProperty = '	<div class="lbl-property materialButton">\
		<div class="lbl-property-id">{{id}}</div>\
		<div class="lbl-property-address">{{address}}</div>\
		<div class="lbl-property-price">{{price}}</div>\
		'+fnPropertyLabelAdminCheck()+'\
		</div>';

		function fnPropertyLabelAdminCheck(){
			if( iAccesRights > 1 ){
				return '	<div data-go-to="wdw-create-property" class="fa fa-edit fa-fw link fa-icon-center"></div>\
				<div class="fa fa-trash fa-fw btn-delete-property fa-icon-center"></div>';
			}
			else{
				return "";
			}
		}

		console.log(jData);
		for( var i = 0 ; i < jData.length ; i++ ){
			var sPropertyTemplate = sProperty;
			sPropertyTemplate = sPropertyTemplate.replace( "{{id}}" , jData[i].sUniqueId );
			sPropertyTemplate = sPropertyTemplate.replace( "{{address}}" , jData[i].sAddress );
			sPropertyTemplate = sPropertyTemplate.replace( "{{price}}" , jData[i].iPrice );
			$("#propertiesBody").append( sPropertyTemplate );


			iLastPropertyId++;
			if( iLastPropertyId > iPreloadedProperties) {
				// We check if the position in the array is bigger than the initial amount of properties
				spawnNotification("Asking price is "+jData[i].iPrice, jData[i].sPreviewImage, "A new propertry has been added on "+jData[i].sAddress);
				// IF we have a new property, the title will flash with it's name
				fnFlashTitle(jData[i].sAddress);
			}





		}


	});

}



/************************************************************************/
/************************************************************************/
/************************************************************************/

function changeMenuToX(x) {
	x.classList.toggle("change");

}

$("#menu-bars").click( function(){

	if (bMenuOpen == false) {
		fnCheckLogin();
		fnShowMenu();
		bMenuOpen= true;
	}


});

function fnShowMenu(){
			//	 animate the menu
			$("#menu").animate( { "left": "0px" } , 400 );
			$("#menu").animate( { "left": "-10px" } , 200 );

			// show the content cover
			$("#content-cover").css( {"display":"flex"} );
			$('.fadeMenuBar').fadeOut();



		}

		function fnMenuOpenToggle(){
			bMenuOpen=false;
		}
		$("#content-cover").click(function(){
			fnHideMenu();
		});

		$(document).on('click', '.link', function(){
			fnHideMenu();
		});

		function fnHideMenu(){
			//	 animate the menu
			$("#menu").animate( { "left": "-250px" } , 400 );
			// show the content cover
			$("#content-cover").hide();
			$('#menu-bars').fadeIn(400);
			window.setTimeout(fnMenuOpenToggle(), 400);
			document.getElementById("menu-bars").classList.toggle("change")
		}




		/************************************************************************/
		/************************************************************************/
		/************************************************************************/
// Create timer that updates properties
// Only runs if the user is looking at the list
// Stops when user clicks on something else
function fnCreatePropertyTimer(){
	fnGetProperties();
	console.log(iLastPropertyId);
	window.timerProperties = setInterval(fnGetProperties, 1500);
}

function fnCreateUserTimer(){
	fnGetUsers();
	window.timerUsers = setInterval(fnGetUsers, 1500);
}


function fnStartUserTimeout(){


	if (userView == "wdw-properties"){
		console.log("called");
		if(bTimerCheck == false ){
			fnCreatePropertyTimer();
			bTimerCheck = true;
			clearInterval(window.timerUsers);
		}
		else {
			bTimerCheck = false;
		}
	}

	else if( userView =="wdw-users"){
		fnCreateUserTimer();
		clearInterval(window.timerProperties);
	}

	else {
		clearInterval(window.timerProperties);
		clearInterval(window.timerUsers);
		bTimerCheck = false;

	}



}
