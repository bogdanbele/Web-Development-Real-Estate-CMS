<?php
session_start();
$serverResponse = [];


// Divs we will depending on the access rights.
$response = $_SESSION["accessrights"];



if (!isset($_SESSION["accessrights"])) {
$_SESSION["accessrights"] = 0;
}else{


}




sendValues($response);
echoFinal();


function sendValues($session){
$message = json_decode('{}');
$message->rights = $session;
global $serverResponse;
array_push($serverResponse, ($message));
};

function echoFinal(){
  global $serverResponse;
  echo json_encode($serverResponse);
}




?>
