<?php
	// CREATE PROPERTY
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
	$jProperty = json_decode('{}'); // json object
	$jProperty->sUniqueId = count($ajProperties)+100000;
	$jProperty->sAddress = $sAddress; // ->   ->   ->    ->   ->
	$jProperty->iPrice = $iPrice; // ->   ->   ->    ->   ->

	// push it to the array
	array_push( $ajProperties , $jProperty );
	// var_dump( $ajProperties );
	// object to text
	$sajProperties = json_encode( $ajProperties , JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE );
	// echo $sajProperties;
	// save the data in the file
	file_put_contents( $sFileName , $sajProperties );
	$sCheckServerUpdate = "data-server-update-status.txt";
file_put_contents( $sCheckServerUpdate , 1 );


	echo '{"status":"ok"}';
	// echo '{"status":"error","id":"001","message":"file corrupted"}';


?>