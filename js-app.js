


var sUserView = "defaultWindow";
var bTimerCheck = false;
var iLastPropertyId = 0;
var iLastUserId=0;
var iAccesRights = 2;
var bMenuOpen = false;


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
	$(".wdw").hide();
	$("#wdw-property-menu").show();
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
	}

	$.getJSON( sUrl , function( jData ){
		if( jData.status == "ok" ){
			
		}
	});

});




$("#btn-save-property").click(function(){

	var sId = $("#txt-create-property-id").val();
	var sAddress = $("#txt-create-property-address").val();
	var sPrice = $("#txt-create-property-price").val();

	// if this id something, then update
	if( sId ){
		var sUrl = "api-update-property.php?id="+sId+"&address="+sAddress+"&price="+sPrice;

		iLastPropertyId = 0;
		$("#propertiesBody").empty();

	}else{
		var sUrl = "api-create-property.php?address="+sAddress+"&price="+sPrice;
	}

	$.getJSON( sUrl , function( jData ){
		if( jData.status == "ok" ){
			
		}
	});

});


$('[data-go-to="wdw-properties"]').click(function(){
	/*	fnGetProperties();*/
// I have removed this function because I impleted the userView which reads if the user
// looks at the wdw-properties, so we no longer need to check the click
});


$(document).on("click" ,".btn-delete-property" , function(){



	var sIdToDelete = $(this).siblings(".lbl-property-id").text();
	var oTheParent = $(this).parent();
	var sUrl = "api-delete-property.php?id="+sIdToDelete;

	$.getJSON( sUrl, function( jData){
		if( jData.status == "ok" ){
			oTheParent.remove();
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

		var sUser = '	<div class="lbl-property materialButton">\
		<div class="lbl-user-id">{{id}}</div>\
		<div class="lbl-user-username">{{username}}</div>\
		<div class="lbl-user-password">{{password}}</div>\
		<div data-go-to="wdw-sign-up" class="fa fa-edit fa-fw link fa-icon-center"></div>\
		<div class="fa fa-trash fa-fw btn-delete-property fa-icon-center"></div>\
		</div>';

		

		console.log(jData);
		for( var i = 0 ; i < jData.length ; i++ ){
			console.log("div");
			var sUserTemplate = sUser;
			sUserTemplate = sUserTemplate.replace( "{{id}}" , jData[i].sUniqueId );
			sUserTemplate = sUserTemplate.replace( "{{username}}" , jData[i].sUsername );
			sUserTemplate = sUserTemplate.replace( "{{password}}" , jData[i].sPassword );
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
			$("#menu").animate( { "left": "0px" } , 800 );
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
			$("#menu").animate( { "left": "-250px" } , 800 );	
			// show the content cover
			$("#content-cover").hide();		
			$('#menu-bars').fadeIn(800);
			window.setTimeout(fnMenuOpenToggle(), 800);
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
		bTimerCheck = false;

	}



}

