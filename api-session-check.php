<?php
session_start();
$default ="test";
$serverResponse = [];
$message="";

$accessrights = (isset($_SESSION['accessrights']) ? $_SESSION['accessrights'] : 0);

if( $accessrights == null) {
  $_SESSION["accessrights"] = 0;
}

if (!isset($_SESSION["accessrights"])) {
$_SESSION["accessrights"] = 0;
}else{


}

// Divs we will be appending depending on the access rights.


function loginButton(){
  $divsToAppend = "<div id='btnLoggin' class='menuHolder link' data-go-to='wdw-login'><div class='fa-marginMenu fa fa-user fa-fw '></div><p>Login</p></div>";
  $position = "top";


  sendValues($divsToAppend, $position);

}

function signUp(){
  $divsToAppend = "<div id='signUp' class='menuHolder link' data-go-to='wdw-sign-up'><div class='fa-marginMenu fa fa-user fa-fw '></div><p>Sign up</p></div>";
  $position = "top";


  sendValues($divsToAppend, $position);

}

function createProperty(){
  $divsToAppend ="<div id='lbl-userAndProperties' class='menuHolder link'  data-go-to='wdw-properties'><div class='fa-marginMenu fa fa-list fa-fw'></div>  <p>Property List</p>  </div>  <div class='menuHolder link' data-go-to='wdw-users'><div class='fa-marginMenu fa fa-user fa-fw'></div> <p>User List</p></div>";
  $position = "top";

  sendValues($divsToAppend, $position);
}



function logoutButton(){
  $divsToAppend = "<div id='btnLogout' onclick='logOut()' class='menuHolder link' data-go-to='wdw-login'><div class='fa-marginMenu fa fa-home fa-fw '></div><p>Logout</p>";
  $position = "bottom";


  sendValues($divsToAppend, $position);

}

function addProperty(){
  $divsToAppend = "<div id='btnCreateProperty' class='menuHolder link' data-go-to='wdw-create-property'><div class='fa-marginMenu fa fa-home fa-fw '></div><p>Create Property</p>";
  $position = "bottom";


  sendValues($divsToAppend, $position);

}


if ( $_SESSION["accessrights"] == 3 ){
  // We asign a value to the message we're sending back and putting it into a JSON object
  // We set the message value equal to the divs we want to append
  addProperty();
  createProperty();
  logoutButton();
  signUp();
  echoFinal();
  }

else if( $_SESSION["accessrights"] == 2 ){
  createProperty();
  logoutButton();
  addProperty();
  echoFinal();
  }

  else if( $_SESSION["accessrights"] == 1 ){
  createProperty();
  logoutButton();
  echoFinal();
  }



else {
  signUp();
loginButton();
echoFinal();
}







function sendValues($finalDivs, $position){


$message = json_decode('{}');
$message->divsToAppend = $finalDivs;
$message->position = $position;

global $serverResponse;
array_push($serverResponse, ($message));

};

function echoFinal(){

  //We're adding the access rights to the array, in order to validate using the previously used Javascript frontened validation
  //I'm doing this because I have already showed in this page that I have at least a baisc idea on how the sessions work, or
  //at least I believe I do. The examples which I used for assignement 2 will still remain validated on the frontend because of
  // lack of time sadly. I do know how to use them in php to make it secure, but sadly I do not have the time :(.
  $message2 = json_decode('{}');

  (isset($_SESSION['accessrights']) ? $_SESSION['accessrights'] : 0);
  $message2->rights= $_SESSION["accessrights"];
  
  global $serverResponse;
  array_push($serverResponse, ($message2));
  echo json_encode($serverResponse);
}


//for($i=0 ; $i<count($serverResponse) ; $i++){



?>
