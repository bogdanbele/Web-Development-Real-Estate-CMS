<?php
session_start();
$serverResponse = [];


// Divs we will depending on the access rights.

$response = 0;



if(session_id() == '') {
  $response = $_SESSION["accessrights"];
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
