<?php
session_start();

$sUsername = $_POST['username'];
$sPassword = $_POST['password'];

$sFileName = "data-users.txt";
$_SESSION["username"] = $sUsername;
$_SESSION["password"] = $sPassword;





$sajUsers = file_get_contents( $sFileName );
$ajUsers = json_decode( $sajUsers );

for( $i = 0; $i < count($ajUsers) ; $i++ ){
	if(( $ajUsers[$i]->sUsername ==  $sUsername )&&( $ajUsers[$i]->sPassword == $sPassword )){
echo '{"status":"ok"}';
$_SESSION["accessrights"] = $ajUsers[$i]->iAccesRights;
break;
  }
  else{

if( $i == count($ajUsers)-1){
echo '{"status":"error"}';
break;
}

  }


}


?>
