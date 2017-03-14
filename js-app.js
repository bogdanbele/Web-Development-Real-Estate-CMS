


var sUserView = "defaultWindow";
var bTimerCheck = false;
var iLastPropertyId = 0;

// We will use this to only get nottifications for the new properties
var iPreloadedProperties;

var iLastUserId=0;
var iAccesRights = 0;
var bMenuOpen = false;
var oldTitle = document.title;


/************************************************************************/
/************************************************************************/
/************************************************************************/


// Title flashing which shows only the name ( restricted by space in the tittle bar)

function fnFlashTitle(property){
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



var iElementNumber = 0;

$(document).on('change' , '[type="file"]' , function(){
	var preview = new FileReader();
	preview.readAsDataURL( this.files[0] );
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





$("#saveProperty").click(function(){
	console.log("button clicked");
	$("#frm-property").submit();


});

$("#frm-property").on('submit', function(e){
	e.preventDefault();
	var sPropertyId = 	$("#txt-create-property-id").val();
	var sPropertyAddress = 	$("#txt-create-property-address").val();
	console.log("property id = " +sPropertyId);
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

	// get the property id from the sibling
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


$(".wdw").contextmenu(function(event){
	/*$(".wdw").hide();
	$("#wdw-property-menu").show();*/
	fnCheckLogin();
	fnShowMenu();
	event.preventDefault();
});


/************************************************************************/
/************************************************************************/
/************************************************************************/
$("#btn-login").click(function(){

	jQuery.get('data-users.txt', function(data) {

		var jUsersFromFile = JSON.parse(data);
		console.log(jUsersFromFile);
		var username = $("#username").val();
		var password = $("#password").val();
		console.log(username + " " + password);
   //process text file line by line

   for ( var i = 0; i<jUsersFromFile.length; i++ ){
   	var jUsername = jUsersFromFile[i].sUsername;
   	var jPassword =  jUsersFromFile[i].sPassword;
   	var jAccessRights = jUsersFromFile[i].iAccesRights;


   	if(( username == jUsername )&&( password == jPassword)){
   		console.log("logged in with "+ username + "  "+ password);
   		console.log(jUsername + " password = " + jPassword + " accesRights = " + jAccessRights);
   		iAccesRights  = jAccessRights;



   		swal({
   			title: "You have logged in",
   			type: "success",
   			confirmButtonColor: "#64DD17",
   			confirmButtonText: "Continue",
   			closeOnConfirm: true
   		},
   		function(){
   			$(".wdw").hide();
   			$("#wdw-properties").css( {"display":"flex"} );
   			userView = "wdw-properties";
   			fnStartUserTimeout();

   		});





   		break;

   		
   	}
   	else {
   		console.log("wrong username or password");
   	}

   }

});


});
$("#btn-save-user").click(function(){

	var sId = $("#txt-create-user-id").val();

	var sUsername = $("#txt-create-user-username").val();
	var sPassword = $("#txt-create-user-password").val();

	// if this id something, then update
	if( sId ){
		var sUrl = "api-update-user.php?id="+sId+"&username="+sUsername+"&password="+sPassword;
		iLastUserId = 0;

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

		});






		$("#userBody").empty();


	}else{


		var sUrl = "api-create-user.php?username="+sUsername+"&password="+sPassword;
		swal("User create !", sPassword+" is the current password!", "success")
	}

/*	$.getJSON( sUrl , function( jData ){
		if( jData.status == "ok" ){
			
		}
	});*/

});



/*
$("#btn-save-property").click(function(){

	var sId = $("#txt-create-property-id").val();
	var sAddress = $("#txt-create-property-address").val();
	var sPrice = $("#txt-create-property-price").val();

	// if this id something, then update
	if( sId ){
		var sUrl = "api-update-property.php?id="+sId+"&address="+sAddress+"&price="+sPrice;
		swal("Property updated !", sAddress+" has been updated", "success")
		iLastPropertyId = 0;
		$("#propertiesBody").empty();

	}else{
	
		swal("Property created !", sAddress+" has been created!", "success")

	}

	/*$.getJSON( sUrl , function( jData ){
		if( jData.status == "ok" ){
			
		}
	});*/
	/*$.post( sUrl, data, function(jData){

	}, 'json');
	*/

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

