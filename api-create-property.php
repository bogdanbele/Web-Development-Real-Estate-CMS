<?php
$sAddress = $_POST['address'];
$iPrice = $_POST['price'];
$sFileName = "data-properties.txt";
$sPreviewImage = "";
$aImagesArray= array();

//
for($i=0 ; $i<count($_FILES) ; $i++){
	move_uploaded_file( $_FILES['file-'.$i]['tmp_name'], "images/".$_FILES['file-'.$i]['name'] );
	$sPreviewImage = basename($_FILES['file-0']['name']);
	$sImage = basename($_FILES['file-'.$i]['name']);

	if ( $sImage !== ""){
	array_push($aImagesArray, $sImage);
}
}




//



$sajProperties = file_get_contents( $sFileName );
$ajProperties = json_decode( $sajProperties );
if( !is_array($ajProperties ) ){
	$ajProperties = [];
}
	$jProperty = json_decode('{}'); // json object
	$jProperty->sUniqueId = count($ajProperties)+100000;
	$jProperty->sAddress = $sAddress; // ->   ->   ->    ->   ->
	$jProperty->iPrice = $iPrice; // ->   ->   ->    ->   ->
	$jProperty->sPreviewImage = $sPreviewImage;
	$jProperty->saImages = $aImagesArray;
	array_push( $ajProperties , $jProperty );
	$sajProperties = json_encode( $ajProperties , JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE );
	file_put_contents( $sFileName , $sajProperties );
	$sCheckServerUpdate = "data-server-update-status.txt";
	file_put_contents( $sCheckServerUpdate , 1 );


	echo '{"status":"ok"}';


	?>