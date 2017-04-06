<?php
	// UPDATE PROPERTY
$sId = $_POST['id'];
$sAddress = $_POST['address'];
$iPrice = $_POST['price'];


// I need to get the old file data and verify if they are the same, if not, delete the previos images
// I should use a for that checks if for example sImages at position 0 is the same with the one at position 3 after update, if not, delete previous 

$sFileName = "data-properties.txt";

	// file which one ?
	// properties.txt [{}]
$sajProperties = file_get_contents( $sFileName );
$ajProperties = json_decode( $sajProperties );
if( !is_array($ajProperties ) ){
	$ajProperties = [];
}

for( $i = 0; $i < count($ajProperties) ; $i++ ){
	if( $sId ==  $ajProperties[$i]->sUniqueId  ){
		$ajProperties[$i]->sAddress = $sAddress;
		$ajProperties[$i]->iPrice = $iPrice;
		break;
	}
}


$sajProperties = json_encode( $ajProperties , JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE );

file_put_contents( $sFileName , $sajProperties );

echo '{"status":"ok"}';


?>