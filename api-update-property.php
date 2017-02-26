<?php
	// UPDATE PROPERTY
$sId = $_GET['id'];
$sAddress = $_GET['address'];
$iPrice = $_GET['price'];

$sFileName = "data-properties.txt";

	// file which one ?
	// properties.txt [{}]
$sajProperties = file_get_contents( $sFileName );
$ajProperties = json_decode( $sajProperties );
if( !is_array($ajProperties ) ){
	$ajProperties = [];
}

	// edit the object
for( $i = 0; $i < count($ajProperties) ; $i++ ){
		// check if the ids match
	if( $sId ==  $ajProperties[$i]->sUniqueId  ){
			// echo $ajProperties[$i]->sUniqueId;
			// update the property based on the position in the array
		$ajProperties[$i]->sAddress = $sAddress;
		$ajProperties[$i]->iPrice = $iPrice;
		break;
	}
}


	// object to text
$sajProperties = json_encode( $ajProperties , JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE );

	// save the data in the file
file_put_contents( $sFileName , $sajProperties );

echo '{"status":"ok"}';
	// echo '{"status":"error","id":"001","message":"file corrupted"}';


?>