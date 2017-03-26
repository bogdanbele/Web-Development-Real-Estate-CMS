<?php
session_start();
$default ="test";
$serverResponse = [];
$message="";


// Divs we will depending on the access rights.


function logginButton(){
  $divsToAppend = "<div id='btnLoggin' class='menuHolder link' data-go-to='wdw-login'><div class='fa-marginMenu fa fa-user fa-fw '></div><p>Login</p></div>";
  $position = "bottom";
  $enabled = true;

  sendValues($divsToAppend, $position, $enabled);

}



if ( $_SESSION["accessrights"] == 3 ){
  // We asign a value to the message we're sending back and putting it into a JSON object
  // We set the message value equal to the divs we want to append
 logginButton();
sendValues("55", "6666", "enables");

  }
else {
  echo '{"divsToAppend":"'.$divsToAppend.'"}';
}

function sendValues($finalDivs, $position, $enabled){

//  array_push($serverResponse, "$message");

$message = array(
  array('divsToAppend'=>$finalDivs ),
  array('position'=>$position),
  array('enabled'=>$enabled)
);




if( !is_array($serverResponse ) ){
	$serverResponse = [];
}

array_push($serverResponse, $message);

echo json_encode($serverResponse);

};


//for($i=0 ; $i<count($serverResponse) ; $i++){



?>
