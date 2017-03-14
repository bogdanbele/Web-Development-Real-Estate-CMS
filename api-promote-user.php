<?php

$sId = $_GET['id'];
$sFileName = "data-users.txt";


$sajUsers = file_get_contents( $sFileName );
$ajUsers = json_decode( $sajUsers );
if( !is_array($ajUsers ) ){
	$ajUsers = [];
}

for( $i = 0; $i < count($ajUsers) ; $i++ ){
	if( $sId ==  $ajUsers[$i]->sUniqueId  ){
		$ajUsers[$i]->iAccesRights = 2;
		break;
	}
}


$sajUsers = json_encode( $ajUsers , JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE );

file_put_contents( $sFileName , $sajUsers );

echo '{"status":"ok"}';


?>